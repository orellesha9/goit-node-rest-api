import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, setting = {}) =>
  Contact.find(filter, "", setting).populate("owner", "username email");

export const countContacts = (filter) => Contact.countDocuments(filter);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const removeContactByFilter = (filter) => Contact.findAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactByFilter = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const updateStatusContact = (contactId, body) =>
  Contact.findByIdAndUpdate(contactId, body);
