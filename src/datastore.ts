import CryptoJS from 'crypto-js';
import isElectron from 'is-electron';

import CONFIG from './datastore.config';
import { Contact } from './features/contact/slice';

export const encrypt = (message: string, secret: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(message, secret).toString();
  return ciphertext;
};

export const decrypt = (ciphertext: string, secret: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  const message = bytes.toString(CryptoJS.enc.Utf8);
  return message;
};

export const checkDatabaseExist = async (): Promise<Boolean> => {
  if (isElectron()) {
    try {
      const fs = window.require("fs/promises");
      await fs.open(CONFIG.datastorePath, "r+");
    } catch (e) {
      if (e.code !== "ENOENT") {
        console.error(e);
      }
      return false;
    }
    return true;
  } else {
    return !!sessionStorage.getItem("contacts");
  }
};

export const loadContacts = async (secret: string): Promise<Contact[]> => {
  try {
    if (isElectron()) {
      const fs = window.require("fs/promises");
      const bytes = await fs.readFile(CONFIG.datastorePath);
      const ciphertext = bytes.toString("utf8");
      const str = decrypt(ciphertext, secret);
      return (JSON.parse(str) as Contact[]);
    } else {
      const ciphertext = sessionStorage.getItem("contacts") || "";
      const str = decrypt(ciphertext, secret);
      return (JSON.parse(str) as Contact[]);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const storeContacts = async (contacts: Contact[], secret: string): Promise<void> => {
  try {
    if (isElectron()) {
      const fs = window.require("fs/promises");
      const ciphertext = encrypt(JSON.stringify(contacts), secret);
      await fs.writeFile(CONFIG.datastorePath, ciphertext);
    } else {
      sessionStorage.setItem("contacts", encrypt(JSON.stringify(contacts), secret));
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};