import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getContacts as getContactsAPI,
  saveContact as saveContactAPI,
  deleteContact as deleteContactAPI
} from './api';

export type ContactContent = {
  name: string,
  phone: string,
  email: string,
  address: string,
};
export type Contact = ContactContent & {
  id: string,
};
export type ContactState = {
  contacts: {
    [id: string]: Contact,
  };
};

const initialState: ContactState = {
  contacts: {},
};

export const getContacts = createAsyncThunk(
  'contact/get',
  async ({ secret }: { secret: string }) => {
    const contacts = await getContactsAPI(secret);
    return contacts;
  }
);
export const saveContact = createAsyncThunk(
  'contact/save',
  async ({ contact, secret } : { contact: Contact | ContactContent, secret: string }) => {
    const newContact = await saveContactAPI(contact, secret);
    return newContact;
  }
);
export const deleteContact = createAsyncThunk(
  'contact/delete',
  async ({ contact, secret } : { contact: Contact, secret: string }) => {
    await deleteContactAPI(contact, secret);
    return contact;
  }
);

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(getContacts.fulfilled, (state, action) => {
      const contacts = action.payload;
      state.contacts = contacts.reduce((map, contact) => ({ ...map, [contact.id]: contact }), {});
    })
    .addCase(saveContact.fulfilled, (state, action) => {
      const contact = action.payload;
      state.contacts[contact.id] = contact;
    })
    .addCase(deleteContact.fulfilled, (state, action) => {
      const contact = action.payload;
      delete state.contacts[contact.id];
    }),
});

export default contactSlice.reducer;
