import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app/App';
import '@styles/globals.css';

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found. Check your index.html.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
