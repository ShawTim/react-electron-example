import React, { useState, useCallback, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Contact, ContactContent, getContacts, saveContact } from '../../features/contact/slice';
import ContactList from '../../components/ContactList';
import ContactView from '../../components/ContactView';

const ContactPage = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { hasInit, hasLogin, secret } = useAppSelector((state) => state.system);
  const isCreate = history.location.pathname.startsWith("/contacts/create");
  const contactMap = useAppSelector((state) => state.contact.contacts);
  const contact = isCreate ? null : (contactMap[id] ?? null);

  // when page load, load the contacts
  useEffect(() => {
    dispatch(getContacts({ secret }));
  }, [secret, dispatch]);

  // sort contacts to be array from the contact map
  useEffect(() => {
    setContacts(Object.values(contactMap).sort((a, b) => a.name.localeCompare(b.name)));
  }, [contactMap]);

  // handler for selecting contact, redirect URL to open contact view
  const onSelectContact = useCallback((id: string) => history.push(`/contacts/view/${id}`), [history]);
  // handler for closing opened contact, redirect URL to close contact view
  const onCloseContact = useCallback(() => history.push("/contacts"), [history]);
  // handler for clicking create button, redirect URL to open create contact view
  const onCreateContact = useCallback(() => history.push("/contacts/create"), [history]);
  // handler for saving contact, and then redirect URL to close contact view
  const onSaveContact = useCallback((contact: Contact | ContactContent) => {
    dispatch(saveContact({ contact, secret }));
    history.push("/contacts");
  }, [secret, history, dispatch]);

  // app not yet init, go to init page
  if (!hasInit) {
    return <Redirect to="/" />;
  }
  
  // user not yet login, go to login page
  if (!hasLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <Container fluid className="h-100 border rounded">
      <Row className="h-100">
        <Col xs={4} className="h-100 p-0 border-end">
          <ContactList contacts={contacts} onSelect={onSelectContact} onCreate={onCreateContact} />
        </Col>
        <Col xs={8} className="h-100 p-0">
          <ContactView contact={contact} edit={isCreate} onClose={onCloseContact} onSave={onSaveContact} />
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;