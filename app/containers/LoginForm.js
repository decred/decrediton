import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions/LoginActions'

let LoginForm = ({ dispatch }) => {
  let address, port, passphrase

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!address.value.trim() || !port.value.trim() || !passphrase.value.trim()) {
          return
        }
        dispatch(login(address.value, port.value, passphrase.value))
        address.value = ''
        port.value = ''
        passphrase.value = ''
      }}>
        <label>Address</label>
        <br/>
        <input ref={node => {
          address = node
        }} />
        <br/>
        <label>Port</label>
        <br/>
        <input ref={node => {
          port = node
        }} />     
        <br/>
        <label>Passphrase</label>
        <br/>
        <input ref={node => {
          passphrase = node
        }} />
        <br/>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
LoginForm = connect()(LoginForm)

export default LoginForm
