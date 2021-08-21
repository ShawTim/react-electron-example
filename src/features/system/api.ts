import { v4 as uuidv4 } from 'uuid';
import { checkDatabaseExist, loadContacts, storeContacts } from '../../datastore';
import { defaultContacts } from '../../datastore.config';

export const checkDatabase = async (): Promise<Boolean> => await checkDatabaseExist();

export const initDatabase = async (password: string): Promise<void> =>
  storeContacts(defaultContacts.map((contact) => ({ ...contact, id: uuidv4() })), password);

export const login = async (password: string): Promise<Boolean> => {
  try {
    loadContacts(password);
    return true;  
  } catch (e) {
    // wrong password for decrypt, or fail to parse the decrypted JSON
    return false;
  }
};