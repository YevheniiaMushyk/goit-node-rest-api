import path from "path";
import crypto from "crypto";
import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve("tmp"));
	},
	filename: function (req, file, cb) {
		const extName = path.extname(file.originalname);
		const baseName = path.basename(file.originalname, extName);
		const suf = crypto.randomUUID();
		const fileName = `${baseName}${suf}${extName}`;

		cb(null, fileName);
	},
});

export const upload = multer({ storage });
