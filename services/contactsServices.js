import Contact from "../models/Contact.js";

// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";

// //   Розкоментуй і запиши значення
// const contactsPath = path.resolve("db", "contacts.json");

// export const updateContacts = (contacts) =>
//   fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = () => Contact.find({});
// const data = await fs.readFile(contactsPath);
// return JSON.parse(data);

export const getContactById = async (contactId) => {
  // const data = await Contact.findOne({ _id: contactId });
  const data = await Contact.findById(contactId);
  return data;

  // const contacts = await listContacts();
  // const result = contacts.find((item) => item.id === contactId);
  // return result || null;
};


export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = (data) => Contact.create(data);
//  {
//   const contacts = await listContacts();
//   const newContact = {
//     id: nanoid(),
//     ...data,
//   };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

//   return newContact;
// }

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

// const contacts = await listContacts();

// const index = contacts.findIndex((item) => item.id === id);
// if (index === -1) {
//   return null;
// }
// contacts[index] = { ...contacts[index], ...data };
// await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// return contacts[index];


export const updateStatusContact =  (contactId, body) => Contact.findByIdAndUpdate(contactId, body)