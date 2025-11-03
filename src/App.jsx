import React from 'react';
import Header from './components/header/Header';
import AppointmentPage from "./pages/appointments/AppointmentPage";
import AppRoutes from './routes/Routes';
import Button from './components/button/Button';
import Footer from "./components/footer/Footer";
import './App.css';


import HomePage from "./pages/HomePage";

function App() {


  return (
     <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;