import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import * as emailValidator from 'email-validator';

import { Contact, ContactContent } from '../features/contact/slice';

export type ContactViewProps = {
  contact: Contact | null | undefined,
  edit: Boolean,
  onSave: (contact: Contact | ContactContent) => void,
  onClose: () => void,
};

const ContactView = (props: ContactViewProps) => {
  const { contact, edit, onSave, onClose } = props;
  const [isEditing, setIsEditing] = useState<Boolean>(edit);
  const [name, setName] = useState<string>(contact?.name ?? "");
  const [phone, setPhone] = useState<string>(contact?.phone ?? "");
  const [email, setEmail] = useState<string>(contact?.email ?? "");
  const [address, setAddress] = useState<string>(contact?.address ?? "");
  const [isEmailValid, setIsEmailValid] = useState<Boolean>(true);

  // reset state whenever given contact changed
  useEffect(() => {
    setIsEditing(false);
    setName(contact?.name ?? "");
    setPhone(contact?.phone ?? "");
    setEmail(contact?.email ?? "");
    setAddress(contact?.address ?? "");
  }, [contact]);

  // if "edit" is provided with true, open contact view with editing mode
  useEffect(() => setIsEditing(edit), [edit]);

  // validate email format
  useEffect(() => setIsEmailValid(!email || emailValidator.validate(email)), [email]);

  const onEditBtnClick = useCallback(() => setIsEditing(true), []);
  const onCloseBtnClick = useCallback(() => onClose(), [onClose]);
  const onSaveBtnClick = useCallback(() => {
    if (name && phone && email && address && isEmailValid) {
      onSave({ id: contact?.id, name, phone, email, address });
      setIsEditing(false);
    }
  }, [contact, name, phone, email, address, isEmailValid, onSave]);
  const onCancelBtnClick = useCallback(() => edit ? onClose() : setIsEditing(false), [edit, onClose]);
  const onNameChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setName(ev.target.value), []);
  const onPhoneChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setPhone(ev.target.value), []);
  const onEmailChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value), []);
  const onAddressChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setAddress(ev.target.value), []);

  // if no contacts provided, and it's not open in edit mode, render nth
  if (!contact && !edit) {
    return null;
  }

  return (
    <>
      <nav className="d-flex justify-content-end border-bottom">
        {!isEditing && (
          <Button variant="light" title="Edit this Contact" aria-label="Edit this Contact" onClick={onEditBtnClick}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        )}
        <Button variant="light" title="Close this Contact" aria-label="Close this Contact" onClick={onCloseBtnClick}>
          <i className="bi bi-x-lg"></i>
        </Button>
      </nav>
      {isEditing ? (
        <div className="d-flex flex-column p-5">
          <h1 className="align-self-center display-1"><i className="bi bi-person-circle"></i></h1>
          <Form className="m-3">
            <FormGroup as={Row} className="mt-1">
              <FormLabel column xs={3} className="text-nowrap"><i className="bi bi-person me-2"></i>Name</FormLabel>
              <Col xs={9}>
                <FormControl type="text" placeholder="Name" value={name} onChange={onNameChange} />
              </Col>
            </FormGroup>
            <FormGroup as={Row} className="mt-1">
              <FormLabel column xs={3} className="text-nowrap"><i className="bi bi-telephone me-2"></i>Phone</FormLabel>
              <Col xs={9}>
                <FormControl type="tel" placeholder="Phone" value={phone} onChange={onPhoneChange} />
              </Col>
            </FormGroup>
            <FormGroup as={Row} className="mt-1">
              <FormLabel column xs={3} className="text-nowrap"><i className="bi bi-envelope me-2"></i>Email</FormLabel>
              <Col xs={9}>
                <FormControl type="email" placeholder="Email" value={email} isInvalid={!isEmailValid} onChange={onEmailChange} />
                <FormControl.Feedback type="invalid">Not a valid email.</FormControl.Feedback>
              </Col>
            </FormGroup>
            <FormGroup as={Row} className="mt-1">
              <FormLabel column xs={3} className="text-nowrap"><i className="bi bi-house me-2"></i>Address</FormLabel>
              <Col xs={9}>
                <FormControl as="textarea" rows={5} placeholder="Address" value={address} onChange={onAddressChange} />
              </Col>
            </FormGroup>
            <FormGroup className="d-flex justify-content-end mt-1">
              <Button
                variant="primary"
                className="m-1"
                title="Save this Contact"
                disabled={!(name && phone && email && address && isEmailValid)}
                aria-label="Save this Contact"
                onClick={onSaveBtnClick}>
                Save
              </Button>
              <Button variant="light" className="m-1" title="Back to View" aria-label="Back to View" onClick={onCancelBtnClick}>Cancel</Button>
            </FormGroup>
          </Form>
        </div>
      ) : (
        <div className="d-flex flex-column p-5">
          <h1 className="align-self-center display-1"><i className="bi bi-person-circle"></i></h1>
          <h1 className="align-self-center">{name}</h1>
          <address className="m-3">
            <div title="Phone">
              <i className="bi bi-telephone me-2"></i>
              <span>{phone}</span>
            </div>
            <div title="Email">
              <i className="bi bi-envelope me-2"></i>
              <span>{email}</span>
            </div>
            <div className="d-flex" title="Address">
              <i className="bi bi-house me-2"></i>
              <span>{address.split("\n").map((line, i) => <div key={`line-${line}-${i}`}>{line}</div>)}</span>
            </div>
          </address>
        </div>
      )}
    </>
  );
};

ContactView.defaultProps = {
  contact: null,
  edit: false,
  onSave: () => undefined,
  onClose: () => undefined,
};

export default ContactView;