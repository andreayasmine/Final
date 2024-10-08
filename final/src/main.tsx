import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextWrapper from './context/ContextWrapper';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Type assertion for TypeScript
);

root.render(
  <React.StrictMode>
    <ContextWrapper>
      <App />
    </ContextWrapper>
  </React.StrictMode>
);


reportWebVitals();
