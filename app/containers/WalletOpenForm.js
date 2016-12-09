import React from 'react'
import { connect } from 'react-redux'
import { openWalletAction, openWalletRequest } from '../actions/WalletLoaderActions'
import { Button, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap'

let LoaderForm = ({ dispatch }) => {
  let pubpass, privpass

  return (
    <div>
      <Form horizontal onSubmit={e => {
        e.preventDefault()
        if (!pubpass.value.trim() || !pubpass.value.trim()) {
          return
        }
        dispatch(openWalletRequest(pubpass.value, privpass.value))
        pubpass.value = ''
        privpass.value = ''
      }}>
        <FormGroup controlId={pubpass}>
          <Col componentClass={ControlLabel} sm={2}>
            Public Password
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {pubpass = node}} placeholder="Public Password" />
          </Col>
        </FormGroup>
        <FormGroup controlId={privpass}>
          <Col componentClass={ControlLabel} sm={2}>
            Private Password
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {privpass = node}} placeholder="Private Password" />
          </Col>
        </FormGroup>
        <Button type="submit">
          Open Wallet
        </Button>
      </Form>
    </div>
  )
}
LoaderForm = connect()(LoaderForm)

export default LoaderForm
