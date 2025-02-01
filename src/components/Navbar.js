import React from "react";
import '../styles/navbar.css'

const Navbar = () => {
    return(
        <nav>
            <ul className="top">
                <li className="title">HC Cakeshop</li>
                <div className="right">
                    <a className="shopping_cart" />
                    <a className="user" />
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;