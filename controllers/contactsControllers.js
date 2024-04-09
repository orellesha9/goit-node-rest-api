import fs from "fs/promises";
import path from "path";

import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const posterPath = path.resolve("public", "avatars");

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const result = await contactsService.listContacts(
      { owner },
      { skip, limit }
    );

    const total = await contactsService.countContacts({ owner });
    res.json({ result, total });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const result = await contactsService.getContactByFilter({ owner, _id: id });
    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeContactByFilter({
      owner,
      _id: id,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Delete success" });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(posterPath, filename);

    await fs.rename(oldPath, newPath);
    const poster = path.join("avatars", filename);

    const result = await contactsService.addContact({
      ...req.body,
      poster,
      owner,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error, value } = updateContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const { id } = req.params;
    const result = await contactsService.updateContactByFilter(
      { owner, _id: id },
      req.body
    );
    if (!result) {
      throw HttpError(404, "Not found");
    }
    if (Object.keys(value).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactFavorite = async (req, res, next) => {
  try {
    const { error, value } = updateContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    if (Object.keys(value).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
