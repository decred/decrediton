import React from 'react'
import { connect } from 'react-redux'
import { createNewWallet, createWalletRequest } from '../actions/ClientActions'
import { Button, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap'

let CreateWalletForm = ({ dispatch }) => {
  let pubPass, privPass, seed

  return (
    <div>
      <Form horizontal onSubmit={e => {
        e.preventDefault()
        if (!pubPass.value.trim() || !privPass.value.trim() || !seed.value.trim()) {
          return
        }
        dispatch(createWalletRequest(pubPass.value, privPass.value, seed.value))
        dispatch(createNewWallet())
        pubPass.value = ''
        privPass.value = ''
        seed.value = ''
      }}>
        <FormGroup controlId={pubPass}>
          <Col componentClass={ControlLabel} sm={2}>
            Public Password
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {pubPass = node}} placeholder="pub pass" />
          </Col>
        </FormGroup>
        <FormGroup controlId={privPass}>
          <Col componentClass={ControlLabel} sm={2}>
            Private Password
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {privPass = node}}  placeholder="priv pass" />
          </Col>
        </FormGroup>
        <FormGroup controlId={seed}>
          <Col componentClass={ControlLabel} sm={2}>
            Seed
          </Col>
          <Col sm={10}>
            <FormControl type="text" inputRef={node => {seed = node}}  placeholder="seed" />
          </Col>
        </FormGroup>
        <Button type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}
CreateWalletForm = connect()(CreateWalletForm)

export default CreateWalletForm
