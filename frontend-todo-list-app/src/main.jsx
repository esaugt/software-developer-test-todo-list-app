import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import ColorModeProvider from './theme/ColorModeProvider.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ColorModeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </ColorModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
