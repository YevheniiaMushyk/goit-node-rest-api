import { listContacts, getContactById, removeContact, addContact, updateData } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
	try {
		const contacts = await listContacts();
		res.status(200).json(contacts);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getOneContact = async (req, res) => {
	try {
		const contact = await getContactById(req.params.id);
		if (contact) {
			res.status(200).json(contact);
		} else {
			res.status(404).json({ message: "Not found" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteContact = async (req, res) => {
	try {
		const contact = await removeContact(req.params.id);
		if (contact) {
			res.status(200).json(contact);
		} else {
			res.status(404).json({ message: "Not found" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createContact = async (req, res) => {
	const contact = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
	};

	const { error } = createContactSchema.validate(contact, { abortEarly: false });

	if (error) {
		const errorMessage = error.details.map((err) => err.message).join(", ");
		return res.status(400).json({ message: errorMessage });
	}

	try {
		const newContact = await addContact(req.body);
		res.status(201).json(newContact);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateContact = async (req, res) => {
	const id = req.params.id;
	const updatedData = req.body;

	if (Object.keys(updatedData).length === 0) {
		return res.status(400).json({ message: "Body must have at least one field" });
	}

	const { error } = updateContactSchema.validate(updatedData);
	if (error) {
		return res.status(400).json({ message: error.message });
	}

	try {
		const updatedContact = await updateData(id, updatedData);
		if (updatedContact) {
			res.status(200).json(updatedContact);
		} else {
			res.status(404).json({ message: "Not found" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
