import React from 'react';

describe("render index", () => {
  beforeEach(jest.clearAllMocks);
  afterEach(jest.restoreAllMocks);

  it("basic", () => {
    const mockReactDOM = { render: jest.fn() };
    const mockServiceWorker = { unregister: jest.fn() }
    jest.mock("react-dom", () => mockReactDOM);
    jest.mock("./serviceWorker", () => mockServiceWorker);

    const App = require(".").default;

    expect(mockReactDOM.render).toHaveBeenCalledTimes(1);
    expect(mockServiceWorker.unregister).toHaveBeenCalledTimes(1);
  });
});