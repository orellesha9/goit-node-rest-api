import Contact from "../models/Contact.js";



export const listContacts = () => Contact.find({});

export const getContactById = async (contactId) => {
  // const data = await Contact.findOne({ _id: contactId });
  const data = await Contact.findById(contactId);
  return data;
};


export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);


export const updateStatusContact =  (contactId, body) => Contact.findByIdAndUpdate(contactId, body)