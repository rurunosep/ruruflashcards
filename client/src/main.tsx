import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'papercss/dist/paper.min.css';
import './style.css';
import { ModalContextProvider, LoadingContextProvider } from './context';

ReactDOM.render(
  <React.StrictMode>
    <ModalContextProvider>
      <LoadingContextProvider>
        <App />
      </LoadingContextProvider>
    </ModalContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
