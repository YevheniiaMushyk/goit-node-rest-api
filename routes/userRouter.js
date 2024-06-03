import express from "express";
import auth from "../middleware/auth.js";
import { register, login, logout, getCurrentUser, updateSub } from "../controllers/userControllers.js";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema, subscriptionSchema } from "../schemas/userSchema.js";

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerSchema), register);
userRouter.post("/login", validateBody(loginSchema), login);
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, getCurrentUser);
userRouter.patch("/", auth, validateBody(subscriptionSchema), updateSub);

export default userRouter;
