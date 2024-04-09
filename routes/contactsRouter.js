import express from "express";
import upload from "../middlewares/upload.js";
import {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateContactFavorite,
} from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import isNotFoundId from "../middlewares/isIdNotFound.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);


//upload.fields([{name: "poster", maxCount: 1}])
// upload.array("poster", 8)
contactsRouter.post("/",upload.single("poster"), createContact);

contactsRouter.patch("/:id/favorite", isNotFoundId, updateContactFavorite);

contactsRouter.put("/:id", isValidId, updateContact);

export default contactsRouter;
