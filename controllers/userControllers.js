import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import HttpError from "../helpers/HttpError.js";
import { User } from "../schemas/userSchema.js";
import createTransport from "../helpers/sendMail.js";

const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user !== null) {
			return next(HttpError(409, "Email in use!"));
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = nanoid();

		const transport = createTransport();

		const message = {
			to: email,
			from: "YevheniiaMushyk@gmail.com",
			subject: "Welcome",
			html: `To confirm you email please click on <a href="http://localhost:8080/api/users/verify/${verificationToken}">link</a>`,
			text: `To confirm you email please open the link http://localhost:8080/api/users/verify/${verificationToken}`,
		};

		transport.sendMail(message).then(console.log).catch(console.error);

		const avatarURL = gravatar.url(email);
		const newUser = await User.create({ email, password: hashedPassword, avatarURL: avatarURL, verificationToken });

		res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL, verificationToken } });
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user === null) {
			return next(HttpError(401, "Email or password is wrong"));
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return next(HttpError(401, "Email or password is wrong"));
		}

		if (user.verify === false) {
			return res.status(401).send({ message: "Please verify your email" });
		}

		const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

		await User.findByIdAndUpdate(user._id, { token }, { new: true });

		res.status(200).json({ token: token, user: { email: user.email, subscription: user.subscription, avatarURL: user.avatarURL } });
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	try {
		await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
		res.status(204).send({ massage: "No Content" }).end();
	} catch (error) {
		next(error);
	}
};

const getCurrentUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		res.json({ email: user.email, subscription: user.subscription, avatarURL: user.avatarURL });
	} catch (error) {
		next(error);
	}
};

const updateSub = async (req, res, next) => {
	try {
		if (Object.keys(req.body).length !== 1 || Object.keys(req.body)[0] !== "subscription") {
			return next(HttpError(400, "Body must have one field: subscription"));
		}

		const { subscription: updateSub } = req.body;
		const data = await User.findByIdAndUpdate(req.user.id, { subscription: updateSub }, { new: true });

		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

const verifyEmail = async (req, res, next) => {
	try {
		const { verificationToken } = req.params;

		const user = await User.findOne({ verificationToken: verificationToken });

		if (user === null) {
			return res.status(404).send({ message: "User not found" });
		}

		await User.findByIdAndUpdate(user._id, {
			verify: true,
			verificationToken: null,
		});

		res.send({ message: "Verification successful" });
	} catch (error) {
		next(error);
	}
};

const resendEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.verify) {
			return res.status(400).json({ message: "Verification has already been passed" });
		}

		const transport = createTransport();

		const message = {
			to: email,
			from: "YevheniiaMushyk@gmail.com",
			subject: "Welcome",
			html: `To confirm you email please click on <a href="http://localhost:8080/api/users/verify/${user.verificationToken}">link</a>`,
			text: `To confirm you email please open the link http://localhost:8080/api/users/verify/${user.verificationToken}`,
		};

		transport.sendMail(message).then(console.log).catch(console.error);

		res.json({ message: "Verification email sent" });
	} catch (error) {
		next(error);
	}
};

export { register, login, logout, getCurrentUser, updateSub, verifyEmail, resendEmail };
