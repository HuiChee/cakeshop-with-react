import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Contact from './components/Contact';
import ProductFilter from './components/ProductFilter';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [filter, setFilter] = useState('');

  const match = useMatch('/ProductDetail/:productId');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  return (
    <>
      <Navbar />
      {!match && <Banner />}
      <ProductFilter onFilterChange={handleFilterChange} />
      <Routes>
        <Route path='/' element={<ProductList filter={filter} onResetFilter={handleResetFilter} />} />
        <Route path='/ProductDetail/:productId' element={<ProductDetail />} /> 
      </Routes>
      <Contact />
    </>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default Root;
