import React, { useEffect } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';

import { history } from './app/store';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import InitPage from './pages/InitPage';

import './App.scss';
import { useAppDispatch } from './app/hooks';
import { checkDatabase } from './features/system/slice';

const App = () => {
  const dispatch = useAppDispatch();

  // when app load, check the database status and see whether it needs to initialize
  useEffect(() => {
    dispatch(checkDatabase());
  }, [dispatch]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path={["/contacts/view/:id", "/contacts/create", "/contacts"]} render={() => <ContactPage />} />
        <Route path="/login" render={() => <LoginPage />} />
        <Route path="/" render={() => <InitPage />} />
      </Switch>
    </ConnectedRouter>
  );
}

export default App;