import React, { useState } from 'react'
import { connect } from 'react-redux'
import { register, setRegisterModalOpen, setErrorMessage } from '../redux/actions'

function RegisterModal({ isOpen, setOpen, register, setErrorMessage }) {
  const [fields, setFields] = useState({ username: '', password1: '', password2: '' })

  const onChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (fields.password1 === fields.password2) {
      register(fields.username, fields.password1)
    } else {
      setErrorMessage('Passwords do not match')
    }
    setFields({ username: '', password1: '', password2: '' })
    setOpen(false)
  }

  return (
    <>
      <input
        className='modal-state'
        id='register-modal'
        checked={isOpen}
        onChange={(e) => setOpen(e.target.checked)}
        type='checkbox'
      />
      <div className='modal'>
        <label className='modal-bg' htmlFor='register-modal'></label>
        <div className='modal-body'>
          <h4 className='modal-title'>Register</h4>
          <label className='btn-close' htmlFor='register-modal'>
            X
          </label>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='text'
                name='username'
                placeholder='Username'
                value={fields.username}
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                name='password1'
                placeholder='Password'
                value={fields.password1}
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                name='password2'
                placeholder='Confirm Password'
                value={fields.password2}
                onChange={onChange}
              />
            </div>
            <div className='row flex-right margin-none'>
              <button className='btn-small' type='submit'>
                <i className='flaticon-checkmark-hand-drawn-outline'></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

const stateToProps = (state) => ({
  isOpen: state.registerModalOpen
})

export default connect(stateToProps, { register, setOpen: setRegisterModalOpen, setErrorMessage })(
  RegisterModal
)
