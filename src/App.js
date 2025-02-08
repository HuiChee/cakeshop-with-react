import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Contact from './components/Contact';
import ProductFilter from './components/ProductFilter';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail'
import MemberPage from './components/MemberPage';
import AddressPage from './components/AddressPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async() => {
    try{
      await signOut(auth);
      alert("登出成功");
      setUser(null);
    } catch(error) {
      console.error("登出失败:", error);
    }
  };

  const [filter, setFilter] = useState('');

  const match = useMatch('/ProductDetail/:productId');
  const isMemberPage = useMatch('/MemberPage');
  const isAddressPage = useMatch('/AddressPage');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  return (
    <>
      <Navbar user={user} onSignOut={handleSignOut} />
      {!isMemberPage && !isAddressPage && !match && <Banner />}
      <ProductFilter onFilterChange={handleFilterChange} />
      <Routes>
        <Route path='/MemberPage' element={<MemberPage />} />
        <Route path='/AddressPage' element={<AddressPage />} />
        <Route path='/' element={<ProductList filter={filter} onResetFilter={handleResetFilter} />} />
        <Route path='/ProductDetail/:productId' element={<ProductDetail />} /> 
      </Routes>
      {!isMemberPage && !isAddressPage && <Contact />}
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
