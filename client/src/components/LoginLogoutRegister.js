import React, { useState } from 'react'
import { connect } from 'react-redux'
import { login, logout, register } from '../redux/actions'

function LoginLogoutRegister({ username, login, logout, register }) {
  const [fields, setFields] = useState({ username: '', password: '' })

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const loginAndRegisterButtons = (
    <div>
      <input
        type='text'
        name='username'
        value={fields.username}
        placeholder='Username'
        onChange={onChange}
      />
      <input
        type='password'
        name='password'
        value={fields.password}
        placeholder='Password'
        onChange={onChange}
      />
      <button
        onClick={() => {
          login(fields.username, fields.password)
          setFields({ username: '', password: '' })
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          register(fields.username, fields.password)
          setFields({ username: '', password: '' })
        }}
      >
        Register
      </button>
    </div>
  )

  const logoutButton = (
    <div>
      {username || ''}
      <button onClick={logout}>Logout</button>
    </div>
  )

  return username ? logoutButton : loginAndRegisterButtons
}

const stateToProps = (state) => ({
  username: state.username
})

export default connect(stateToProps, { login, logout, register })(LoginLogoutRegister)
