import React from "react";
import { useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from '../styles/addressPage.module.css'

const AddressPage = () => {
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    setAddresses(userDoc.data().addresses || []);
                }
            } else {
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAddAddress = async() => {
        if(newAddress.trim() === '') return;

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddress)
        });

        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
        setNewAddress('');
    };

    const handleDeleteAddress = async(address) => {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
            addresses: arrayRemove(address)
        });

        setAddresses((prevAddresses) => prevAddresses.filter(addr => addr !== address));
    };

    if(!userData){
        return <div>加载中...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>地址管理</h1>
            <div className={styles.addresses}>
                {addresses.length === 0 ? (
                    <p>尚未填写过地址哦~</p>
                ) : (
                    addresses.map((address, index) => (
                        <div key={index} className={styles.address}>
                            <p>{address}</p>
                            <button onClick={() => handleDeleteAddress(address)}>删除</button>
                        </div>
                    ))
                )}
            </div>

            {addresses.length >= 0 && (
                <button className={styles.addButton} onClick={() => setIsEditing(true)}>
                    添加地址
                </button>
            )}

            {isEditing && (
                <div className={styles.addAddressForm}>
                    <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="填写新的地址"
                    />
                    <button onClick={handleAddAddress}>保存</button>
                    <button onClick={() => setIsEditing(false)}>取消</button>
                </div> 
            )}
        </div>
    );
};

export default AddressPage;