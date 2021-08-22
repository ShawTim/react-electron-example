This project is to demostrate the work of React+Electron in typescript by implementing a **Simple Secure Contact Manager**.

The application can let you:
- access to application data controlled by password
- decrypt and load contact file from disk, or create new file if none existing
- be able to detect if the correct password was used without displaying corrupted or garbage data
- add new contacts
- edit existing contacts
- search contacts by any field
- write encrypted modified contacts datafile to disk

The application will be able to be built as an executable Electron app without installation. For convenience, it will be also built as a web application.
- Electron app: encrypted data store in disk, with configurable path during build time
- [Web application](https://shawtim.github.io/react-electron-example/): for demo purpose, encrypted data store in sessionStorage. When user close the session the data will be gone

## Overview
### Tech Stack
#### React+Redux (Web application framework)
Electron is developed by web technology which basically a web application (with node.js access) bundled as a desktop application. It can be started with [plenty of boilerplate](https://www.electronjs.org/docs/tutorial/boilerplates-and-clis), [Electron CLI](https://www.electronjs.org/docs/tutorial/boilerplates-and-clis), or build from a web application with Electron.

In this project I pick the latter one, which start with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
```
 $ npx create-react-app react-demo-app --template redux-typescript
```

The template will come with redux [slice pattern](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go).

#### electron-forge (Electron CLI)
Based on the web application, I follow the [tutorial here](https://dev.to/mandiwise/electron-apps-made-easy-with-create-react-app-and-electron-forge-560e) to add Electron functionality and then convert the project to use [electron-forge](https://www.electronforge.io/) to run the web application as an Electron app.

#### electron-builder (Electron CLI)
While electron-forge is good, it can build the electron installation package as well, but are you sure you want to access the app through installation?

When I want to build executables without installation, I am quite frustrated on electron-forge. Instead, [electron-builder](https://github.com/electron-userland/electron-builder) works like a charm without annoying configuration and with docker environment provided. For example I can simply build the Electron app as an [AppImage](https://appimage.org/) app. Maybe I should use it in the first place for development.

#### react-router (React modules for handling navigation)
React applications are commonly built as a SPA (Single Page Application) with URL dynamically rewriting. [react-router](https://reactrouter.com/) is essential and also [connected-react-router](https://github.com/supasate/connected-react-router) for Redux binding with react-router.

After deployed on Github page, without server-side support, the web application will get a 404 fail if user do a browser refresh on some path (non-root path). To solve this, either use `HashRouter` with `HashHistory` in [react-router](https://reactrouter.com/web/api/HashRouter), or [do a trick with 404 handling](https://github.com/rafgraph/spa-github-pages). This project uses the latter one.

#### react-bootstrap (UI framework)
Handy, simple and light UI framework for supporting responsive web and a11y. [react-bootstrap](https://react-bootstrap.github.io/) comes with pre-defined classes and you dont need to write too much CSS for the text alignment or div position. For me it's more "raw" comparing with other frameworks. It focus more on UI instead of React logic component (like [Material-UI](https://material-ui.com/)) which is quite suitable for building prototype.

[bootstrap-icons](https://icons.getbootstrap.com/) is also used.

Dont get me wrong - not a fan though. I use Material-UI quite heavily on other projects. It just depends on the scenario.

#### jest (testing)
[jest](https://jestjs.io/) comes with CRA (Create React App) for unit testing. It also provides test converage report.

#### testing-library/react (testing for React UI component)
[testing-library](https://testing-library.com/docs/react-testing-library/intro/) comes with CRA (Create React App) for React UI component testing.

#### webpack (bunlder)
[webpack](https://webpack.js.org/) comes with CRA (Create React App) for bunlding. Also [babel](https://babeljs.io/) and other webpack plugins. You may refer to `package.json` for detail.

#### bcryptjs (password salted hashing) (not in use)
I thought I need to store the salted hashed password to somewhere but later on I found that I dont actually need it (see the encryption part). But still want to share.

[bcrypt](https://www.npmjs.com/package/bcrypt) is good and promising, but it requires nodejs to run (and maybe some other dependency as well). [bcryptjs](https://www.npmjs.com/package/bcryptjs) should be a good alternative because it runs on browser as well since it's pure JS, although it's slower.

#### crypto-js (encryption)
The application requires an encryption library to encrypt/decrypt the data. The data will only be used by this application and wont be passed around to another consumer. User is required to provide a password, which is actually the secrey key. So AES should be a good choice, which is a symmetric encryption with 1 single secret key to encrypt and decrypt.

I pick [crypto-js](https://www.npmjs.com/package/crypto-js), which runs on both nodejs and browser (at least for AES). Some other encryption implementation requires nodejs or C++ which are not available on browser.

The data, which originally are JSON array and object, will be stringify as a plain string and then AES encrypted. Which also said when the application read the encrypted data, it will AES decrypt it as a plain string, and then parse it as JSON. If the JSON parsing fails, it probably means either the password (secrey key) provided is wrong, or the data file is corrupted.

#### fs/promises (storage for Electron)
[fs/promises](https://nodejs.org/api/fs.html#fs_promises_api) is for Electron app to store/read the data file. **DO NOT USE the Synchronous API**, I repeat, **DO NOT USE the Synchronous API** because it blocks the event loop until the operation finishes. The JS engine just halt there until your operation finishes.

The `fs/promises` package is available since Node.js v14. So this application is requiring Node.js v14 as dependency.

#### sessionStorage (storage for web)
For the web build, since the aplication cannot access file system and thus cannot store the data file on disk, I pick [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) as an alternative.

For sure it's fine to use [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). But as a web application for demo, the data in sessionStorage will be cleared once you close the browser tab such that it won't "pollute" your browser. You can still test the web application by refreshing or navigating using the same browser tab, the data can be presisted within the same tab until it's closed.

#### is-electron (npm to determine whether the application is Electron)
[is-electron](https://www.npmjs.com/package/is-electron) is used to determine whether it's a web application or electron application. It's used to determine where does the application want to store/read the data file.

#### RxDB (database) (not in use)
I's doing homework to find a database implementation which support both web and file without extra installation. [RxDB](https://rxdb.info/) sounds like a good choice. You can install it through npm (i.e. as a dependency in package.json) and use the provided [adapters](https://rxdb.info/adapters.html) to store the data in memory/file/browser. And it comes with [schema encryption](https://rxdb.info/rx-schema.html#encryption).

At the end I havent't picked it. But still worth to share.

---
### Avalable scripts
dev run:
```
npm run dev
```
Or, open 2 sessions to run them separately:
```
npm start
```
```
npm run electron
```
test run:
```
npm test
```
test run with test coverage report:
```
npm test -- --coverage
```
build for web application (on Github page, [here](https://shawtim.github.io/react-electron-example/))
```
npm run build:github
```
For linux/windows build, there are 2 scripts available to get use of docker such that we dont need to care much about the build dependency:
```
./docker-build-linux.sh
```
```
./docker-build-window.sh
```
---
### Windows build
For Windows build, the default data file will be stored at somewhere like `C:\\Users\\{USER}\\AppData\\Local\\Temp\\{APP_NAME}\\contacts.data` but not next to the executable. The path will be different when you open the application next time and thus the application will looks like "data loss" but it's not decause for Windows it's 2 different application running in 2 different context. To avoid this on Windows, specify `datastorePath` in `datastore.config.ts` to an absolute path like `C:\\Users\\{USER}\\Downloads\\contacts.data`. See Configuration for details.

---
### Configuration
The confiugration file is `src/datastore.config.ts`. You can have 2 configuration options:
- `datastorePath`: the file path for the encrypted data file to be stored, default is `./contacts.data`. On Linux that will be next to the application, on Windows it will be located at somewhere like `C:\Users\{USER}\AppData\Local\Temp\{APP_NAME}\contacts.data`
- `defaultContacts`: this is an array of contact data that will be pumped into the data file when the application initialized such that the user can play around with some data instead of nth. The data is generated, not real-life data.

---
### UI flow
It firstly comes with an initialization page. It requires you to provide a password for the secure contacts. You need to provide a password match to enable the "Setup" button.

<img src="https://user-images.githubusercontent.com/85455/130353586-5271b585-cb0f-4492-bb0c-532d32b8c590.png" height="300">

Once initialized you will be redirected to the contact view. You will see some default contacts being injected. You can configure `defaultContacts` for the default contacts.

<img src="https://user-images.githubusercontent.com/85455/130353852-b8389bc6-e056-47fa-b025-9742765a7131.png" height="300">

Once it's setup, when you relaunch the application, you are required to input the password you just provided.

<img src="https://user-images.githubusercontent.com/85455/130353794-b2fd5072-342b-4e06-8bdf-39481860aea8.png" height="300">

You can search/filter the contacts through the search field. If there is no matches, it will say no matches.

<img src="https://user-images.githubusercontent.com/85455/130353930-df834fca-9abf-4ac2-acf6-9b90ddb509bf.png" height="300">
<img src="https://user-images.githubusercontent.com/85455/130353964-4220082b-455a-4137-86dc-a549db6e52a0.png" height="300">

Select a contact will open the contact detail for you.

<img src="https://user-images.githubusercontent.com/85455/130353994-fa83fcec-96ba-451b-b594-30987b2532a7.png" height="300">

You can close the contact detail by clicking "Close" button, or edit the contact by clicking "Edit" button.

<img src="https://user-images.githubusercontent.com/85455/130354034-6f8c2000-eb95-43d2-a213-ce2712914aac.png" height="300">

Edit the contact and then save, the changes will be applied immediately, encrypt and then save to the data file.

<img src="https://user-images.githubusercontent.com/85455/130354102-0796c490-2ced-4acd-b509-9ebb19b26f17.png" height="300">
<img src="https://user-images.githubusercontent.com/85455/130354121-944871aa-07a8-4d1d-94ca-9493558b2992.png" height="300">

You can click the "Create" button on the top of the contact list to open a create form to create a new contact.

<img src="https://user-images.githubusercontent.com/85455/130354204-bf5a78c6-3899-4a97-9adc-08bc52d06c1b.png" height="300">

Once save it will be encrypted and store to data file immediately. And you can open the newly created contact to verify.

<img src="https://user-images.githubusercontent.com/85455/130354236-61bbb7a5-9439-4fda-98b4-400bdc63f02e.png" height="300">

---
### Error handling and validation
Password should be matched when initializing

<img src="https://user-images.githubusercontent.com/85455/130353755-3e373afb-7856-4293-9096-ce50641c3d05.png" height="300">

Login with a wrong password

<img src="https://user-images.githubusercontent.com/85455/130353828-28b53876-c93c-47a4-a80a-0934eea4eb80.png" height="300">

Invalid email

<img src="https://user-images.githubusercontent.com/85455/130354052-37d42681-046a-4ee3-b6b3-8494cc4785d4.png" height="300">

Some fields are empty, unable to click the "Save" button to continue

<img src="https://user-images.githubusercontent.com/85455/130354268-46ea5668-3c38-4bc7-8d31-07abdbefc30c.png" height="300">

Data corrupted. This happens when you login the application already, and then manually edit the data file with some content that are not able to be decrypted with the given password

<img src="https://user-images.githubusercontent.com/85455/130354314-000ed636-dfc2-4e6f-b5a9-3d6439755736.png" height="300">

Failed to initialize. This happen when you fail to create the data file, mostly because you don't have permission to create file on the provided path

<img src="https://user-images.githubusercontent.com/85455/130354433-cab5183a-3332-4efa-837a-02d8bb640443.png" height="300">

---
### Roadmap
If the project needs to be continued, what can I add:
- Responsive UI: It can be done more on responsive like, when in mobile on contact view page, the contact list on the left should be hidden, and be able to access the contact list through a hamburger icon
- form dirty check: When the form is dirty (be changed), leaving the form should prompt you a warning
- ~100% unit test converage: High degree of test coverage is important such that every (or most) line of code are being tested. 100% test coverage doesnt mean 100% bug free, though. It's just referring how much lines of code are covered when running test
- e2e test: [Cypress](https://www.cypress.io/) is great
- i18n: Most production-ready application requires i18n support. [react-i18next](https://react.i18next.com/) can be a choice
- a11y: The current a11y support are provided mostly by bootstrap but it can be done better. For example the color color contrast of the highlighted text when search contacts is not obvious and may not be able to be accessed by user with color weakness.
