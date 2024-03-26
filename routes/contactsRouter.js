import express from "express";
import {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateContactFavorite
} from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import isNotFoundId from "../middlewares/isIdNotFound.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id",isValidId, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.patch("/:id/favorite",isNotFoundId, updateContactFavorite);

contactsRouter.put("/:id",isValidId, updateContact);

export default contactsRouter;
