import React from "react";
import { useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from '../styles/addressPage.module.css'
import { Timestamp } from "firebase/firestore";

const AddressPage = () => {
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
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
        if(newAddress.trim() === '' || recipientName.trim() === '' || phoneNumber.trim() === '') return;

        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        const newAddressData = {
            address: newAddress,
            recipientName: recipientName,
            phoneNumber: phoneNumber,
            timestamp: Timestamp.fromDate(new Date())
        };
        
        await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddressData)
        });

        setAddresses((prevAddresses) => [...prevAddresses, newAddressData]);
        setNewAddress('');
        setRecipientName('');
        setPhoneNumber('');
        setIsEditing(false);
    };

    const handleDeleteAddress = async(addressToDelete) => {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
            addresses: arrayRemove(addressToDelete)
        });

        setAddresses((prevAddresses) => prevAddresses.filter(addr => addr !== addressToDelete));
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
                            <p>地址：{address.address}</p>
                            <p>收件人： {address.recipientName}</p>
                            <p>手机号: {address.phoneNumber}</p>
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
                    <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="收件人姓名"
                    />
                    <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="手机号"
                    />
                    <button onClick={handleAddAddress}>保存</button>
                    <button onClick={() => setIsEditing(false)}>取消</button>
                </div> 
            )}
        </div>
    );
};

export default AddressPage;