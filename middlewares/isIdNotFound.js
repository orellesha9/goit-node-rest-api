import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isNotFoundId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(HttpError(404, `Not Found`));
    }
    next();
  };

  export default isNotFoundId