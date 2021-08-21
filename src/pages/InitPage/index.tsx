import React, { useState, useCallback, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { InputGroup, FormControl, Button, Col, Container, Row } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { initDatabase } from '../../features/system/slice';

declare const window: any;

const InitPage = () => {
  const dispatch = useAppDispatch();
  const { hasInit, hasLogin } = useAppSelector((state) => state.system);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onPasswordChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value), []);
  const onConfirmPasswordChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(ev.target.value), []);
  const onSetupBtnClick = useCallback(() => {
    if (!!password && password === confirmPassword) {
      dispatch(initDatabase(password));
    }
  }, [password, confirmPassword, dispatch]);
  const onCloseBtnClick = useCallback(() => window.close(), []);
  
  // user already login, go to contact page
  if (hasLogin) {
    return <Redirect to="/contacts" />;
  }

  // app already init, go to login page
  if (hasInit) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      <Row>
        <Col className="text-center m-2">
          <h3>Initialization Wizard</h3>
        </Col>
      </Row>
      <Row>
        <Col className="text-center m-3">
          <h5>Please setup a password for the Simple Secure Contact Manager.</h5>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6}>
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
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="confirm-password-desc">
                <i className="bi bi-key-fill"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="confirm-password"
              type="password"
              value={confirmPassword}
              isInvalid={!!confirmPassword && password !== confirmPassword}
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              aria-describedby="confirm-password-desc"
              onChange={onConfirmPasswordChange} />
            <FormControl.Feedback type="invalid">Password not match.</FormControl.Feedback>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Button className="m-2" variant="primary" onClick={onSetupBtnClick} disabled={!password || password !== confirmPassword}>Setup</Button>
          <Button className="m-2" variant="light" onClick={onCloseBtnClick}>Close</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default InitPage;