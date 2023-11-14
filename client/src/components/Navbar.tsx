import { useState, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { LoadingContext, ModalContext } from '../context';

interface NavbarProps {
  username: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export default function Navbar({ username, login, logout }: NavbarProps) {
  const {
    login: { loading: loginLoading },
  } = useContext(LoadingContext);

  const { setRegisterModalOpen } = useContext(ModalContext);
  const [fields, setFields] = useState({ username: '', password: '' });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(fields.username, fields.password);
    setFields({ username: '', password: '' });
  }

  const loginAndRegister = (
    <div className="collapsible">
      <input id="collapsible" type="checkbox" name="collapsible" />
      <label htmlFor="collapsible">
        <div className="bar1" />
        <div className="bar2" />
        <div className="bar3" />
      </label>
      <div className="collapsible-body">
        <ul className="inline" style={{ margin: 0 }}>
          <li>
            <input
              form="login-form"
              type="text"
              name="username"
              placeholder="Username"
              value={fields.username}
              onChange={onChange}
              style={{ width: '5em' }}
            />
          </li>
          <li>
            <input
              form="login-form"
              type="password"
              name="password"
              placeholder="Password"
              value={fields.password}
              onChange={onChange}
              style={{ width: '5em' }}
            />
          </li>
          <li>
            {loginLoading ? (
              <ClipLoader loading size="1em" />
            ) : (
              <>
                <button
                  className="btn-small margin-none"
                  style={{ margin: 'none', marginRight: 10 }}
                  type="submit"
                  form="login-form"
                  popover-bottom="Login"
                >
                  <div className="flip-horizontal margin-none">
                    <i className="flaticon-exit-hand-drawn-interface-symbol-variant" />
                  </div>
                </button>
                <button
                  type="button"
                  className="btn-small margin-none"
                  popover-bottom="Register"
                  onClick={() => setRegisterModalOpen(true)}
                >
                  <i className="flaticon-add-user-hand-drawn-outline" />
                </button>
              </>
            )}
          </li>
          <form id="login-form" onSubmit={onSubmit} />
        </ul>
      </div>
    </div>
  );

  const usernameAndLogout = (
    <div style={{ display: 'inline-block', position: 'absolute', right: 0 }}>
      <ul className="inline" style={{ margin: 0 }}>
        <li style={{ display: 'inline-block', margin: '0 0.5rem' }}>
          <p className="margin-none">{username}</p>
        </li>
        <li style={{ display: 'inline-block', margin: '0 0.5rem' }}>
          {loginLoading ? (
            <ClipLoader loading size="1em" />
          ) : (
            <button
              type="button"
              className="btn-small margin-none"
              popover-bottom="Logout"
              onClick={logout}
            >
              <i className="flaticon-exit-hand-drawn-interface-symbol" />
            </button>
          )}
        </li>
      </ul>
    </div>
  );

  return (
    <nav className="border split-nav">
      <h3 className="margin-none" style={{ display: 'inline-block' }}>
        <i className="flaticon-gallery-hand-drawn-interface-symbol-of-irregular-squares-outlines padding-small" />
        RuruFlashcards
      </h3>
      {username ? usernameAndLogout : loginAndRegister}
    </nav>
  );
}
