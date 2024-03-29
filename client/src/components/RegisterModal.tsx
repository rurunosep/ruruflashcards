import { useState, useContext } from 'react';
import { ModalContext } from '../context';

interface RegisterModalProps {
  register: (username: string, password: string) => void;
  setErrorMessage: (message: string | null) => void;
}

export default function RegisterModal({ register, setErrorMessage }: RegisterModalProps) {
  const { registerModalOpen: isOpen, setRegisterModalOpen: setOpen } = useContext(ModalContext);
  const [fields, setFields] = useState({ username: '', password1: '', password2: '' });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fields.password1 === fields.password2) {
      register(fields.username, fields.password1);
    } else {
      setErrorMessage('Passwords do not match');
    }
    setFields({ username: '', password1: '', password2: '' });
    setOpen(false);
  }

  return (
    <>
      <input
        className="modal-state"
        id="register-modal"
        checked={isOpen}
        onChange={(e) => setOpen(e.target.checked)}
        type="checkbox"
      />
      <div className="modal">
        <label className="modal-bg" htmlFor="register-modal" />
        <div className="modal-body">
          <h4 className="modal-title">Register</h4>
          <label className="btn-close" htmlFor="register-modal">
            X
          </label>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={fields.username}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password1"
                placeholder="Password"
                value={fields.password1}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={fields.password2}
                onChange={onChange}
              />
            </div>
            <div className="row flex-right margin-none">
              <button className="btn-small" type="submit">
                <i className="flaticon-checkmark-hand-drawn-outline" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
