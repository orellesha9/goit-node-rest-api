import express from "express";
import authControllers from "../controllers/authControllers.js";
import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";
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

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.singout);

export default authRouter;
