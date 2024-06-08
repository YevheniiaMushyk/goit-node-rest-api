import mongoose from "mongoose";
import Joi from "joi";

export const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	subscription: Joi.string().valid("starter", "pro", "business"),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});

export const subscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const sendMailSchema = Joi.object({
	email: Joi.string().email().required(),
});

const userSchema = new mongoose.Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
		avatarURL: {
			type: String,
			default: null,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			required: [true, "Verify token is required"],
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
