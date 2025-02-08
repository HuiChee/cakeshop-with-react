import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import styles from '../styles/memberPage.module.css';

const MemberPage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    
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

    if(!userData) {
        return <div>加载中...</div>;
    }

    const handleAddressClick = () => {
        navigate('/AddressPage');
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatarContainer}>
                <img
                src={userData.avatarURL || '/src/images/user.png'}
                alt='头像'
                className={styles.avatar}
                />
            </div>
            <div className={styles.username}>{userData.username}</div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleAddressClick}>地址</button>
                <button className={styles.button}>订单</button>
            </div>
        </div>
    );
};

export default MemberPage;