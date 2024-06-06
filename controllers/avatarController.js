import * as fs from "fs/promises";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import { User } from "../schemas/userSchema.js";

const changeAvatar = async (req, res, next) => {
	try {
		if (!req.file) {
			return next(HttpError(400, "Avatar file was not found"));
		}

		const { path: tmpUploadPath, filename } = req.file;
		const newPath = path.resolve("public", "avatars", filename);

		const img = await Jimp.read(tmpUploadPath);
		await img.resize(250, 250).writeAsync(tmpUploadPath);

		await fs.rename(tmpUploadPath, newPath);
		const avatarURL = path.join("avatars", filename);

		const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: avatarURL }, { new: true });

		res.status(200).send({ avatarURL: user.avatarURL });
	} catch (error) {
		next(error);
	}
};

export { changeAvatar };
