import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CaseProvider } from './context/CaseContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaseProvider>
      <App />
    </CaseProvider>
  </React.StrictMode>
);
