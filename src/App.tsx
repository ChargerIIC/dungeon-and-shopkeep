import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import './App.css';
import HomePage from './pages/HomePage';
import ShopkeeperApp from './pages/ShopkeeperApp';
import Navbar from './components/Navbar';
import AuthProvider from './services/AuthProvider';
import { ThemeProvider } from './services/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PrimeReactProvider>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shopkeeper" element={<ShopkeeperApp />} />
              </Routes>
            </div>
          </PrimeReactProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
