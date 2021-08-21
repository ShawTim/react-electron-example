import { v4 as uuidv4 } from 'uuid';
import { loadContacts, storeContacts } from '../../datastore';
import { Contact, ContactContent } from "./slice";

export const getContacts = async (secret: string): Promise<Array<Contact>> => {
  try {
    return await loadContacts(secret);
  } catch (e) {
    throw e;
  }
};

export const saveContact = async (contact: Contact | ContactContent, secret: string): Promise<Contact> => {
  try {
    const contacts = await loadContacts(secret);
    const trueContact = contact as Contact;
    const index = contacts.findIndex((c) => c.id === (trueContact.id ?? ""));
    if (index >= 0 && trueContact.id) {
      contacts[index] = trueContact;
      await storeContacts(contacts, secret);
      return trueContact;
    } else {
      const newContact = { ...contact, id: uuidv4()};
      const newContacts = contacts.concat(newContact);
      await storeContacts(newContacts, secret);
      return newContact;
    }
  } catch (e) {
    throw e;
  }
};

export const deleteContact = async (contact: Contact, secret: string): Promise<void> => {
  try {
    const contacts = await loadContacts(secret);
    const newContacts = contacts.filter((c) => c.id !== contact.id);
    await storeContacts(newContacts, secret);
  } catch (e) {
    throw e;
  }
};
