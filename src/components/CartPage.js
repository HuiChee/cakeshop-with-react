import React from "react";
import { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import styles from '../styles/cartPage.module.css';
import { Timestamp } from "firebase/firestore";

const CartPage = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [recipientName, setRecipientName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const calculateTotal = useCallback((items) => {
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalAmount(total);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user) {
                setUser(user);
                const userDocRef = doc(db, 'users', user.uid);
                /*const userDoc = await getDoc(userDocRef);
                if(userDoc.exists()) {
                    const cart = userDoc.data().cart || [];
                    setCartItems(cart);
                    calculateTotal(cart);
                }*/
                const unsubscribeCart = onSnapshot(userDocRef, (docSnapshot) => {
                    if(docSnapshot.exists()){
                        const cart = docSnapshot.data().cart || [];
                        setCartItems(cart);
                        calculateTotal(cart);
                        const userAddresses = docSnapshot.data().addresses || [];
                        setAddresses(userAddresses);
                        if(!selectedAddress && userAddresses.length > 0) {
                            setSelectedAddress(userAddresses[0]);
                        }
                    }
                });
                return() => unsubscribeCart();
            } else {
                setUser(null);
                setCartItems([]);
            }
        });
        return() => unsubscribe();
    }, [calculateTotal, selectedAddress]);

    const updateQuantity = async(product, delta) => {
        if(user) {
            const newQuantity = product.quantity + delta;
            if(newQuantity < 1) return;

            const userDocRef = doc(db, 'users', user.uid);
            const updatedCart = cartItems.map(item =>
                item.id === product.id
                ? {...item, quantity: newQuantity}
                : item
            );

            await updateDoc(userDocRef, { cart: updatedCart });

            setCartItems(updatedCart);
            calculateTotal(updatedCart);
        }
    };

    const removeFromCart = async(product) => {
        if(user){
            const userDocRef = doc(db, 'users', user.uid);
            const updatedCart = cartItems.filter(item => item.id !== product.id);

            await updateDoc(userDocRef, {cart: updatedCart});

            setCartItems(updatedCart);
            calculateTotal(updatedCart);
        }
    };

    const handleSelectAddress = (e) => {
        const selectedValue = e.target.value;
        if(selectedValue === "add_new_address"){
            setIsEditing(true);
        }else{
            const selectedAddr = JSON.parse(selectedValue);
            setSelectedAddress(selectedAddr);
        }
    };

    const handleAddAddress = async() => {
        if(newAddress.trim() === '' || recipientName.trim() === '' || phoneNumber.trim() === '') return;

        const userDocRef = doc(db, 'users', user.uid);

        const newAddressData = {
            address: newAddress,
            recipientName: recipientName,
            phoneNumber: phoneNumber,
            timestamp: Timestamp.fromDate(new Date()),
        };

        await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddressData),
        });

        setAddresses((prevAddresses) => {
            const updatedAddresses = [...prevAddresses, newAddressData];
            setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
            return updatedAddresses;
        });
        setNewAddress('');
        setRecipientName('');
        setPhoneNumber('');
        setIsEditing(false);
    };

    const togglePaymentModal = () => {
        setIsPaymentModalOpen((prevState) => !prevState);
    };

    const handlePayment = () => {
        alert("下单成功！");
        togglePaymentModal();
    };

    return(
        <div className={styles.cartPage}>
            <h2 className={styles.cartTitle}>购物车</h2>
            {cartItems.length === 0 ? (
                <p className={styles.content}>
                购物车还是空的哦~<br />快去逛逛吧~
                </p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.id} className={styles.cartItems}>
                        <img className={styles.itemImage} src={item.image} alt={item.name} />
                        <div className={styles.itemDetails}>
                            <h3>{item.name}</h3>
                            <p>价格: NT${item.price * item.quantity}</p>
                            <div className={styles.quantityControl}>
                                <button onClick={() => updateQuantity(item, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item, 1)}>+</button>
                            </div>
                        </div>
                        <button className={styles.removeButton} onClick={() => removeFromCart(item)}>
                            删除
                        </button>
                    </div>
                ))
            )}
            <div className={styles.bottom}>
                <h6 className={styles.totalAmount}>总金额: NT${totalAmount}</h6>
                <button className={styles.settlement} onClick={togglePaymentModal}>付款</button>
            </div>

            {isPaymentModalOpen && (
                <div className={styles.paymentModal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModal} onClick={togglePaymentModal}>x</button>
                        <h2>下单确认</h2>
                        {addresses.length === 0 || isEditing ? (
                            <div>
                                <p>您还没有地址，请填写新地址:</p>
                                <input
                                type="text"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="填写地址"
                                />
                                <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="收件人"
                                />
                                <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="手机号"
                                />
                                <button onClick={handleAddAddress}>保存</button>
                            </div>
                        ) : (
                            <div>
                                <p>请选择收货地址：</p>
                                <select
                                    value={selectedAddress ? JSON.stringify(selectedAddress) : ''}
                                    onChange={handleSelectAddress}
                                >
                                    {addresses.map((address, index) => (
                                        <option key={index} value={JSON.stringify(address)}>
                                            {address.address} - {address.recipientName}
                                        </option>
                                    ))}
                                    <option value="add_new_address">添加新地址</option>
                                </select>
                                <p>总金额：NT${totalAmount}</p>
                                <div>
                                    <p>付款方式：现金付款</p>
                                    <button className={styles.confirm} onClick={handlePayment}>确认</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;