import React, { useState, useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import Auth from './Auth'
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/navbar.css'
import styles from '../styles/UserDropdownMenu.module.css'

const Navbar = ({ user, onSignOut }) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if(userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        console.log("Menu toggles, current showMenu value: ", showMenu);
        setShowMenu(!showMenu);
    };
    
    const handleMenuClick = () => {
        if(isMemberPage){
            navigate('/');
        } else{
            toggleMenu();
        }
    };

    const navigate = useNavigate();
    const isMemberPage = useMatch('/MemberPage');
    const isAddressPage = useMatch('/AddressPage');

    return(
        <nav>
            <ul className="top">
                <li className="title">HC Cakeshop</li>
                <div className="right">
                    <div className="shopping_cart" />
                    <div>
                        {user ? (
                            !isMemberPage && userData ? (
                                <div className="userAvatar" onClick={handleMenuClick} style={{backgroundImage: `url(${userData.avatarURL || '/src/images/user.png'})`}} />
                            ) : (
                                <div className="mainPage" onClick={handleMenuClick}></div>
                            )
                        ) : (
                            <div className="user" onClick={toggleModal}></div>
                        )}
                    </div>
                </div>
            </ul>

            {showMenu && !isMemberPage && (
                <div className={styles.dropdownMenu}>
                    {!isAddressPage ? (
                        <>
                            <button onClick={() => {console.log("navigate to memberpage"); navigate('/MemberPage'); toggleMenu();}}>会员界面</button>
                            <button onClick={() => {onSignOut(); toggleMenu();}}>登出</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => {navigate('/'); toggleMenu();}}>主页面</button>
                            <button onClick={() => {console.log("navigate to memberpage"); navigate('/MemberPage'); toggleMenu();}}>会员界面</button>
                            <button onClick={() => {navigate('/'); onSignOut(); toggleMenu();}}>登出</button>
                        </>
                    )}
                </div>
            )}

            <Auth isOpen={showModal} onClose={toggleModal} />
        </nav>
    );
};

export default Navbar;