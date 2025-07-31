import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import HomePage from './pages/HomePage';
import ShopkeeperApp from './pages/ShopkeeperApp';
import Navbar from './components/Navbar';
import AuthProvider from './services/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <PrimeReactProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shopkeeper" element={<ShopkeeperApp />} />
            </Routes>
          </div>
        </Router>
      </PrimeReactProvider>
    </AuthProvider>
  );
}

export default App;
