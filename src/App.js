import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Contact from './components/Contact';
import ProductFilter from './components/ProductFilter';
import ProductList from './components/ProductList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  return (
    <>
      <Navbar />
      <Banner />
      <ProductFilter onFilterChange={handleFilterChange} />
      <ProductList filter={filter} onResetFilter={handleResetFilter} />
      <Contact />
    </>
  );
}

export default App;
