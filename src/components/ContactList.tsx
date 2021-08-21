import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormControl, FormText, ListGroup } from 'react-bootstrap';
import { Contact } from '../features/contact/slice';

export type ContactListProps = {
  contacts: Contact[],
  onSelect: (id: string) => void,
  onCreate: () => void,
};

// highlight the matched string in the provided string
const highlight = (str: string, search: string) => {
  if (str.toLowerCase().includes(search.toLowerCase())) {
    const regexp = new RegExp(search, "ig");
    const tokens = str.split(regexp);
    const matched = str.match(regexp);
    return tokens.map((token, i) => {
      const match = i > 0 ? <mark className="p-0">{matched?.[i-1] ?? ""}</mark> : "";
      return (<React.Fragment key={`token-${token}-${i}`}>{match}{token}</React.Fragment>);
    });
  } else {
    return str;
  }
};

const ContactList = (props: ContactListProps) => {
  const { contacts, onSelect, onCreate } = props;
  const [search, setSearch] = useState<string>("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

  const onSearchChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setSearch(ev.target.value), []);
  const onCreateBtnClick = useCallback(() => onCreate(), [onCreate]);

  // whenever "search"/"contacts" changed, filter the contacts with "search"
  useEffect(() => {
    if (search) {
      setFilteredContacts(contacts.filter((contact) => {
        const lowerValue = search.toLowerCase();
        return (
          contact.name.toLowerCase().includes(lowerValue) ||
          contact.phone.toLowerCase().includes(lowerValue) ||
          contact.email.toLowerCase().includes(lowerValue) ||
          contact.address.toLowerCase().includes(lowerValue)
        );
      }));
    } else {
      setFilteredContacts(contacts);
    }
  }, [search, contacts]);

  return (
    <>
      <nav className="d-flex justify-content-end border-bottom">
        <Form.Group className="w-100 d-flex align-items-center">
          <FormText as="i" className="position-absolute bi bi-search ms-2" />
          <FormControl
            className="border-0 ps-4"
            type="search"
            value={search}
            onChange={onSearchChange}
            title="Search Contacts"
            aria-label="Search Contacts" />
        </Form.Group>
        <Button variant="light" title="Add New Contact" aria-label="Add New Contact" onClick={onCreateBtnClick}>
          <i className="bi bi-plus-lg"></i>
        </Button>
      </nav>
      {!!filteredContacts.length ? (
        <ListGroup className="data-list mb-3">
          {filteredContacts.map((contact) =>
            <ListGroup.Item
              key={contact.id}
              className="d-flex text-truncate border-0 border-bottom"
              action
              onClick={() => onSelect(contact.id)}>
              <FormText as="i" className="bi bi-person-circle me-2" />
              <FormText as="label" className="text-dark me-2">{highlight(contact.name, search)}</FormText>
              <FormText className="ms-auto text-truncate"><small>{highlight(contact.phone, search)}</small></FormText>
            </ListGroup.Item>
          )}
        </ListGroup>
      ) : (
        <div className="h-100 d-flex justify-content-center align-items-center">{!!search ? "No Matched Contacts." : "No Contacts."}</div>
      )}
    </>
  );
};

ContactList.defaultProps = {
  contacts: [],
  onSelect: () => undefined,
  onCreate: () => undefined,
};

export default ContactList;