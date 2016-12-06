import React from 'react'
import { connect } from 'react-redux'
import { checkWalletExist, walletExistRequest } from '../actions/WalletLoaderActions'
import { Button, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap'

let LoaderForm = ({ dispatch }) => {
  let address, port

  return (
    <div>
      <Form horizontal onSubmit={e => {
        e.preventDefault()
        dispatch(walletExistRequest())
        dispatch(checkWalletExist())
      }}>
        <Button type="submit">
          Check wallet exists
        </Button>
      </Form>
    </div>
  )
}
LoaderForm = connect()(LoaderForm)

export default LoaderForm
