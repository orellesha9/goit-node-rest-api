import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const { JWT_SECRET } = process.env;
  if (!authorization) {
    // console.log(authorization);
    return next(HttpError(401, "Authorization header not found"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log(id);
    const user = await findUser({ _id: id });
    console.log(user);
    if (!user) {
      return next(HttpError(401, "User not found"));
    }
    if (!user.token) {
      return next(HttpError(401, "Token invalid"));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(HttpError(401, error.message));
  }
};

export default authenticate;
