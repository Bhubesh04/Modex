import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;


