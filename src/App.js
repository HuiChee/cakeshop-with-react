import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Contact from './components/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
      <Navbar />
      <Banner />
      <Contact />
    </>
  );
}

export default App;
