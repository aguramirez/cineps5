// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles
import './styles/globals.css';

// Ensure the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure you have a div with id="root" in your HTML file.'
  );
}

// Create and render the app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Report web vitals for performance monitoring
// You can use this to send to an analytics endpoint
// Learn more: https://bit.ly/CRA-vitals
// if (import.meta.env.DEV) {
//   import('./reportWebVitals').then(({ reportWebVitals }) => {
//     reportWebVitals(console.log);
//   }).catch(() => {
//     // Web vitals not available, continue without them
//   });
// }