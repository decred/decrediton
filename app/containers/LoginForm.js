import React from 'react'
import { connect } from 'react-redux'
import { login, loginRequest } from '../actions/LoginActions'
import { Button, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap'

let LoginForm = ({ dispatch }) => {
  let address, port, passphrase

  return (
    <div>
      <Form horizontal onSubmit={e => {
        e.preventDefault()
        if (!address.value.trim() || !port.value.trim() || !passphrase.value.trim()) {
          return
        }
        dispatch(loginRequest(address.value, port.value, passphrase.value))
        address.value = ''
        port.value = ''
        passphrase.value = ''
      }}>
        <FormGroup controlId={address}>
          <Col componentClass={ControlLabel} sm={2}>
            Address
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {address = node}} placeholder="127.0.0.1" />
          </Col>
        </FormGroup>
        <FormGroup controlId={port}>
          <Col componentClass={ControlLabel} sm={2}>
            Port
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {port = node}}  placeholder="19112" />
          </Col>
        </FormGroup>
        <FormGroup controlId={passphrase}>
          <Col componentClass={ControlLabel} sm={2}>
            Passphrase
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {passphrase = node}}  placeholder="password1" />
          </Col>
        </FormGroup>
        <Button type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}
LoginForm = connect()(LoginForm)

export default LoginForm
