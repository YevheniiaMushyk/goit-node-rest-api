import Joi from "joi";
import mongoose from "mongoose";

export const createContactSchema = Joi.object({
	name: Joi.string().required().min(3),
	email: Joi.string().email().required(),
	phone: Joi.string().required().min(8),
	favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
	name: Joi.string().min(3),
	email: Joi.string().email(),
	phone: Joi.string().min(8),
	favorite: Joi.boolean(),
});

export const updateFavorite = Joi.object({
	favorite: Joi.boolean().required(),
});

const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
			required: [true, "Set email for contact"],
		},
		phone: {
			type: String,
			required: [true, "Set phone for contact"],
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const Contact = mongoose.model("Contact", contactSchema);
