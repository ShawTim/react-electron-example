import React from 'react';
import { render } from '@testing-library/react';

import ContactList from './ContactList';

describe("render ContactList", () => {

  it("empty contact list", () => {
    const result = render(<ContactList />);
  
    const listNode = result.getByText(/no contacts\./i);
    expect(listNode).toBeDefined();
    expect(listNode).toBeVisible();
    expect(listNode).toHaveTextContent(/no contacts\./i);
    expect(listNode.tagName).toMatch(/div/i);
    expect(listNode.childNodes.length).toBe(1);

    const navNode = listNode.previousSibling as HTMLElement;
    expect(navNode.tagName).toMatch(/nav/i);
    expect(navNode.childNodes.length).toBe(2);
  
    const searchNode = navNode.childNodes.item(0) as HTMLElement;
    expect(searchNode).toBeDefined();
    expect(searchNode).toBeVisible();
    expect(searchNode.childNodes.length).toBe(2);

    const searchIconNode = searchNode.childNodes.item(0) as HTMLElement;
    expect(searchIconNode).toBeDefined();
    expect(searchIconNode).toBeVisible();
    expect(searchIconNode).toHaveClass("bi", "bi-search");
    expect(searchIconNode).not.toHaveTextContent(/./);

    const searchInputNode = searchNode.childNodes.item(1) as HTMLElement;
    expect(searchInputNode).toBeDefined();
    expect(searchInputNode).toBeVisible();
    expect(searchInputNode.tagName).toMatch(/input/i);
    expect(searchInputNode.title).toMatch(/search contacts/i);

    const createNode = navNode.childNodes.item(1) as HTMLElement;
    expect(createNode).toBeDefined();
    expect(createNode).toBeVisible();
    expect(createNode.tagName).toMatch(/button/i);
    expect(createNode.title).toMatch(/add new contact/i);

    const createIconNode = createNode.childNodes.item(0) as HTMLElement;
    expect(createIconNode).toBeDefined();
    expect(createIconNode).toBeVisible();
    expect(createIconNode).toHaveClass("bi", "bi-plus-lg");
    expect(createIconNode).not.toHaveTextContent(/./);
  
  });
});