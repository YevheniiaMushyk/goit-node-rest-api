import HttpError from "../helpers/HttpError.js";
import { Contact } from "../schemas/contactsSchemas.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllContacts = async (req, res, next) => {
	try {
		const resp = await Contact.find();
		res.json(resp);
	} catch (error) {
		next(error);
	}
};

const getOneContact = async (req, res, next) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return next(HttpError(400, "Invalid ID"));
	}

	try {
		const resp = await Contact.findOne({ _id: id, owner: req.user.id });
		if (!resp) {
			throw HttpError(404, "Not Found");
		}
		res.json(resp);
	} catch (error) {
		next(error);
	}
};

const deleteContact = async (req, res, next) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return next(HttpError(400, "Invalid ID"));
	}

	try {
		const resp = await Contact.findOneAndDelete({
			_id: id,
			owner: req.user.id,
		});
		if (!resp) {
			throw HttpError(404, "Not Found");
		}
		res.json(resp);
	} catch (error) {
		next(error);
	}
};

const createContact = async (req, res, next) => {
	const owner = req.user.id;

	try {
		const resp = await Contact.create({ ...req.body, owner });
		res.status(201).json(resp);
	} catch (error) {
		next(error);
	}
};

const updateContact = async (req, res, next) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return next(HttpError(400, "Invalid ID"));
	}

	const contact = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		favorite: req.body.favorite,
	};

	try {
		const resp = await Contact.findOneAndUpdate({ _id: id, owner: req.user.id }, contact, { new: true });
		if (!resp) {
			throw HttpError(404, "Not Found");
		}

		if (!req.body || Object.keys(req.body).length === 0) {
			throw HttpError(400, "Body must have at least one field");
		}

		res.json(resp);
	} catch (error) {
		next(error);
	}
};

const updateStatusContact = async (req, res, next) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return next(HttpError(400, "Invalid ID"));
	}

	try {
		const { favorite } = req.body;
		const resp = await Contact.findOneAndUpdate({ _id: id }, { favorite }, { new: true });
		if (!resp) {
			throw HttpError(404, "Not Found");
		}

		res.json(resp);
	} catch (error) {
		next(error);
	}
};

export { getAllContacts, getOneContact, deleteContact, createContact, updateContact, updateStatusContact };
