import React, { useState } from 'react'
import { connect } from 'react-redux'
import { login, logout, setRegisterModalOpen } from '../redux/actions'

function Navbar({ username, login, logout, setRegisterModalOpen }) {
  const [fields, setFields] = useState({ username: '', password: '' })

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    login(fields.username, fields.password)
    setFields({ username: '', password: '' })
  }

  const loginAndRegister = (
    <>
      <form id='login-form' onSubmit={onSubmit}></form>
      <ul className='inline'>
        <li>
          <input
            form='login-form'
            type='text'
            name='username'
            placeholder='Username'
            value={fields.username}
            onChange={onChange}
          />
        </li>
        <li>
          <input
            form='login-form'
            type='password'
            name='password'
            placeholder='Password'
            value={fields.password}
            onChange={onChange}
          />
        </li>
        <li>
          <button
            className='btn-small margin-none'
            type='submit'
            form='login-form'
            popover-bottom='Login'
          >
            <div className='flip-horizontal margin-none'>
              <i className='flaticon-exit-hand-drawn-interface-symbol-variant'></i>
            </div>
          </button>
        </li>
        <li>
          <button
            className='btn-small margin-none'
            popover-bottom='Register'
            onClick={() => setRegisterModalOpen(true)}
          >
            <i className='flaticon-add-user-hand-drawn-outline'></i>
          </button>
        </li>
      </ul>
    </>
  )

  const usernameAndLogout = (
    <ul className='inline'>
      <li>
        <p className='margin-none'>{username}</p>
      </li>
      <li>
        <button className='btn-small margin-none' popover-bottom='Logout' onClick={logout}>
          <i className='flaticon-exit-hand-drawn-interface-symbol'></i>
        </button>
      </li>
    </ul>
  )

  return (
    <nav className='border split-nav'>
      <h3 className='margin-none'>
        <i className='flaticon-gallery-hand-drawn-interface-symbol-of-irregular-squares-outlines padding-small'></i>
        RuruFlashcards
      </h3>
      {username ? usernameAndLogout : loginAndRegister}
    </nav>
  )
}

const stateToProps = (state) => ({
  username: state.username
})

export default connect(stateToProps, { login, logout, setRegisterModalOpen })(Navbar)
