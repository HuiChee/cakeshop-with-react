import React, { useState } from 'react';
import Auth from './Auth'
import '../styles/navbar.css'

const Navbar = ({ user, onSignOut }) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return(
        <nav>
            <ul className="top">
                <li className="title">HC Cakeshop</li>
                <div className="right">
                    <div className="shopping_cart" />
                    <div>
                        {user ? (
                            <div className="user1" onClick={onSignOut}></div>
                        ) : (
                            <div className="user" onClick={toggleModal}></div>
                        )}
                    </div>
                </div>
            </ul>

            <Auth isOpen={showModal} onClose={toggleModal} />
        </nav>
    );
};

export default Navbar;