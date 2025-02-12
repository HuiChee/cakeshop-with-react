import React from "react";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user) {
                setUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if(userDoc.exists()) {
                    setCartItems(userDoc.data().cart || []);
                }
            } else {
                setUser(null);
                alert("请先登录！");
            }
        });
        return() => unsubscribe();
    }, []);
};

export default Cart;