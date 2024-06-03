import express from "express";
import userRouter from "./userRouter.js";
import contactsRouter from "./contactsRouter.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/contacts", auth, contactsRouter);

export default router;
