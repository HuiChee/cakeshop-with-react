import React from "react";
import { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import styles from '../styles/cartPage.module.css';

const CartPage = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

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
                    }
                });
                return() => unsubscribeCart();
            } else {
                setUser(null);
                setCartItems([]);
            }
        });
        return() => unsubscribe();
    }, [calculateTotal]);

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
                <button className={styles.settlement}>付款</button>
            </div>
        </div>
    );
};

export default CartPage;