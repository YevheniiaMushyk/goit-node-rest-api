import "dotenv/config";
import nodemailer from "nodemailer";

const createTransport = () => {
	return nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_USERNAME,
			pass: process.env.MAILTRAP_PASSWORD,
		},
	});
};

export default createTransport;
