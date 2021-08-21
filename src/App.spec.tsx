import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store, history } from './app/store';
import * as hooks from './app/hooks';
import * as systemSlice from './features/system/slice';

const randomString = () => Math.random().toString(36).substring(2);

describe("render App", () => {
  beforeEach(jest.clearAllMocks);
  afterEach(jest.restoreAllMocks);

  it("test pages", () => {
    const mockInitId = randomString();
    const mockLoginId = randomString();
    const mockContactId = randomString();
    const MockInit = () => <div data-testid={mockInitId}></div>;
    const MockLogin = () => <div data-testid={mockLoginId}></div>;
    const MockContact = () => <div data-testid={mockContactId}></div>;
    jest.mock("./pages/InitPage", () => MockInit);
    jest.mock("./pages/LoginPage", () => MockLogin);
    jest.mock("./pages/ContactPage", () => MockContact);

    const App = require("./App").default;
    const result = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  
    history.push("/");
    const initPage = result.getByTestId(mockInitId);
    expect(initPage).toBeDefined();
    expect(initPage).toBeVisible();

    history.push("/login");
    const loginPage = result.getByTestId(mockLoginId);
    expect(loginPage).toBeDefined();
    expect(loginPage).toBeVisible();

    history.push("/contacts");
    const contactPage1 = result.getByTestId(mockContactId);
    expect(contactPage1).toBeDefined();
    expect(contactPage1).toBeVisible();

    history.push("/contacts/create");
    const contactPage2 = result.getByTestId(mockContactId);
    expect(contactPage2).toBeDefined();
    expect(contactPage2).toBeVisible();

    history.push("/contacts/view/1234");
    const contactPage3 = result.getByTestId(mockContactId);
    expect(contactPage3).toBeDefined();
    expect(contactPage3).toBeVisible();
  });

  it("test check database", () => {
    const mockDispatch = jest.fn();
    jest.spyOn(hooks, "useAppDispatch").mockReturnValue(mockDispatch);
    jest.spyOn(systemSlice, "checkDatabase");

    const App = require("./App").default;
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(systemSlice.checkDatabase).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});