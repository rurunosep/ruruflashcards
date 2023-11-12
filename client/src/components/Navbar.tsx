import { useState, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { LoadingContext, ModalContext } from '../context';

interface NavbarProps {
  username: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export default function Navbar({ username, login, logout }: NavbarProps) {
  const { login: loginLogout } = useContext(LoadingContext);

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
    <>
      <li>
        <input
          form="login-form"
          type="text"
          name="username"
          placeholder="Username"
          value={fields.username}
          onChange={onChange}
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
        />
      </li>
      <li>
        <button
          className="btn-small margin-none"
          type="submit"
          form="login-form"
          popover-bottom="Login"
        >
          <div className="flip-horizontal margin-none">
            <i className="flaticon-exit-hand-drawn-interface-symbol-variant" />
          </div>
        </button>
      </li>
      <li>
        <button
          type="button"
          className="btn-small margin-none"
          popover-bottom="Register"
          onClick={() => setRegisterModalOpen(true)}
        >
          <i className="flaticon-add-user-hand-drawn-outline" />
        </button>
      </li>
      <form id="login-form" onSubmit={onSubmit} />
    </>
  );

  const usernameAndLogout = (
    <>
      <li>
        <p className="margin-none">{username}</p>
      </li>
      <li>
        <button
          type="button"
          className="btn-small margin-none"
          popover-bottom="Logout"
          onClick={logout}
        >
          <i className="flaticon-exit-hand-drawn-interface-symbol" />
        </button>
      </li>
    </>
  );

  return (
    <nav className="border split-nav">
      <h3 className="margin-none">
        <i className="flaticon-gallery-hand-drawn-interface-symbol-of-irregular-squares-outlines padding-small" />
        RuruFlashcards
      </h3>
      <ul className="inline">
        <li>
          <ClipLoader loading={loginLogout.loading} size="1em" />
        </li>
        {username ? usernameAndLogout : loginAndRegister}
      </ul>
    </nav>
  );
}
