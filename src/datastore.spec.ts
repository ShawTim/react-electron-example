import CryptoJS from 'crypto-js';
import * as datastore from './datastore';
import CONFIG from './datastore.config';

describe("test datastore API", () => {
  beforeEach(jest.clearAllMocks);
  afterEach(jest.restoreAllMocks);

  it("encrypt", () => {
    jest.spyOn(CryptoJS.AES, "encrypt").mockReturnThis();

    datastore.encrypt("message", "secret");

    expect(CryptoJS.AES.encrypt).toHaveBeenCalledTimes(1);
    expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith("message", "secret");
  });

  it("decrypt", () => {
    jest.spyOn(CryptoJS.AES, "decrypt").mockReturnThis();

    datastore.decrypt("ciphertext", "secret");

    expect(CryptoJS.AES.decrypt).toHaveBeenCalledTimes(1);
    expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith("ciphertext", "secret");
  });

  it("checkDatabaseExist for web, return false", async () => {
    jest.resetModules();
    const mockElectron = jest.fn().mockReturnValue(false);
    jest.mock("is-electron", () => mockElectron);
    global.Storage.prototype.getItem = jest.fn().mockReturnValue("");

    const datastore = require("./datastore");
    const result = await datastore.checkDatabaseExist();

    expect(mockElectron).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith("contacts");
    expect(result).toBe(false);
  });

  it("checkDatabaseExist for web, return true", async () => {
    jest.resetModules();
    const mockElectron = jest.fn().mockReturnValue(false);
    jest.mock("is-electron", () => mockElectron);
    global.Storage.prototype.getItem = jest.fn().mockReturnValue("1111");

    const datastore = require("./datastore");
    const result = await datastore.checkDatabaseExist();

    expect(mockElectron).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith("contacts");
    expect(result).toBe(true);
  });

  it("checkDatabaseExist for electron, return false", async () => {
    jest.resetModules();
    const fs = require("fs/promises");
    const mockElectron = jest.fn().mockReturnValue(true);
    jest.mock("is-electron", () => mockElectron);
    jest.spyOn(fs, "open").mockRejectedValue({ code: "ENOENT" });
    window.require = require;

    const datastore = require("./datastore");
    const result = await datastore.checkDatabaseExist();

    expect(mockElectron).toHaveBeenCalledTimes(1);
    expect(fs.open).toHaveBeenCalledTimes(1);
    expect(fs.open).toHaveBeenCalledWith(CONFIG.datastorePath, "r+");
    expect(result).toBe(false);
  });

  it("checkDatabaseExist for electron, return true", async () => {
    jest.resetModules();
    const fs = require("fs/promises");
    const mockElectron = jest.fn().mockReturnValue(true);
    jest.mock("is-electron", () => mockElectron);
    jest.spyOn(fs, "open").mockReturnValue("");
    window.require = require;

    const datastore = require("./datastore");
    const result = await datastore.checkDatabaseExist();

    expect(mockElectron).toHaveBeenCalledTimes(1);
    expect(fs.open).toHaveBeenCalledTimes(1);
    expect(fs.open).toHaveBeenCalledWith(CONFIG.datastorePath, "r+");
    expect(result).toBe(true);
  });
});