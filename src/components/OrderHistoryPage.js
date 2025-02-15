import React from "react";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "../styles/orderHistoryPage.module.css"

const OrderHistory = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return() => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchOrders = async() => {
            try{
                const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(ordersQuery);
                const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(ordersData);
            } catch(error){
                console.error("获取历史订单失败：", error);
            }
        };

        if(user){
            fetchOrders();
        }
    }, [user]);

    return(
        <div className={styles.orderHistoryPage}>
            <h2>订单历史</h2>
            {orders.length === 0 ? (
                <p>您还没有订单哦。</p>
            ) : (
                orders.map((order) => (
                    <div key={orders.id} className={styles.orderItem}>
                        <h3>订单号： {order.id}</h3>
                        <p>订单时间：{order.orderDate ? order.orderDate.toDate().toLocaleString() : '未知'}</p>
                        <p>总金额: NT${order.totalAmount}</p>
                        <h4>商品列表：</h4>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} x {item.quantity} - NT${item.total}
                                </li>
                            ))}
                        </ul>
                        <p className={styles.orderStatus}>订单状态：{order.status}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;