import express from "express";
import upload from "../middlewares/upload.js";
import authControllers from "../controllers/authControllers.js";
import { userSigninSchema, userSignupSchema, userEmailSchema } from "../schemas/usersSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignupSchema),
  authControllers.singnup
);

authRouter.post(
  "/login",
  validateBody(userSigninSchema),
  authControllers.singin
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post("/verify", validateBody(userEmailSchema), authControllers.resendVerify)

authRouter.patch(
  "/avatars",authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);


authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.singout);

export default authRouter;
