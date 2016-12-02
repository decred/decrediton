import React from 'react'
import { connect } from 'react-redux'
import { getLoader, loaderRequest } from '../actions/WalletLoaderActions'
import { Button, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap'

let LoaderForm = ({ dispatch }) => {
  let address, port

  return (
    <div>
      <Form horizontal onSubmit={e => {
        e.preventDefault()
        if (!address.value.trim() || !port.value.trim()) {
          return
        }
        dispatch(loaderRequest(address.value, port.value))
        dispatch(getLoader())
        address.value = ''
        port.value = ''
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
        <Button type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}
LoaderForm = connect()(LoaderForm)

export default LoaderForm
