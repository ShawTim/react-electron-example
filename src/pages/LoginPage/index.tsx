import React, { useState, useCallback, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { InputGroup, FormControl, Button, Col, Container, Row, Alert } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from '../../features/system/slice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { hasInit, hasLogin, loginFailed } = useAppSelector((state) => state.system);
  const [password, setPassword] = useState<string>("");

  const onPasswordChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value), []);
  const onLoginBtnClick = useCallback(() => dispatch(login(password)), [password, dispatch]);
  const onCloseBtnClick = useCallback(() => window.close(), []);

  // app not yet init, go to init page
  if (!hasInit) {
    return <Redirect to="/" />;
  }
  
  // user already login, go to contact page
  if (hasLogin) {
    return <Redirect to="/contacts" />;
  }

  return (
    <Container>
      <Row>
        <Col className="text-center m-2">
          <h3>Welcome to Simple Secure Contact Manager</h3>
        </Col>
      </Row>
      <Row>
        <Col className="text-center m-3">
          <h5>Please enter the password for your contact data file.</h5>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6}>
          <Alert show={!!loginFailed} variant="danger">Password mismatch. Failed to open the application.</Alert>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="password-desc">
                <i className="bi bi-key-fill"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              aria-label="Password"
              aria-describedby="password-desc"
              onChange={onPasswordChange} />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Button className="m-2" variant="primary" onClick={onLoginBtnClick}>Open the App</Button>
          <Button className="m-2" variant="light" onClick={onCloseBtnClick}>Close</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;