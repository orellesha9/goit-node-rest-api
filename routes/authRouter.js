import express from "express";
import authControllers from "../controllers/authControllers.js";
import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";
import validateBody from "../decorators/validateBody.js";

const authRouter = express.Router();

authRouter.post(
  "/singup",
  validateBody(userSignupSchema),
  authControllers.singnup
);

authRouter.post(
  "/singin",
  validateBody(userSigninSchema),
  authControllers.singin
);

export default authRouter;
