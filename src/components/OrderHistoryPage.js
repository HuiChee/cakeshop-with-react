import React from "react";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "../styles/orderHistoryPage.module.css"

const OrderHistory = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                setUser(currentUser);

                const checkAdmin = async() => {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if(userDocSnap.exists() && userDocSnap.data().isAdmin){
                        setIsAdmin(true);
                    }else{
                        setIsAdmin(false);
                    }
                };

                checkAdmin();

            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });
        return() => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchOrders = async() => {
            try{
                let ordersQuery;
                if(isAdmin){
                    ordersQuery = query(collection(db, 'orders'));
                }else if(user){
                    ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
                }

                if(ordersQuery){
                    const querySnapshot = await getDocs(ordersQuery);
                    const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(ordersData);
                }
            } catch(error){
                console.error("获取订单失败：", error);
            }
        };

        if(user){
            fetchOrders();
        }
    }, [user, isAdmin]);

    const updateOrderStatus = async(orderId, newStatus) => {
        try{
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {status: newStatus});
            setOrders(prevOrders =>
                prevOrders.map(order => order.id === orderId ? {...order, status: newStatus} : order)
            );
            alert("订单状态更新成功！");
        }catch(error){
            console.error("订单状态更新失败：", error);
        }
    };

    return(
        <div className={styles.orderHistoryPage}>
            <h2>{isAdmin ? "订单管理" : "订单历史"}</h2>
            {orders.length === 0 ? (
                <p>{isAdmin ? "暂无订单" : "您还没有订单哦。"}</p>
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

                        {isAdmin && order.status === "待发货" && (
                            <button
                            className={styles.updateStatusButton}
                            onClick={() => updateOrderStatus(order.id, "已发货")}>
                                标记为已发货
                            </button>
                        )}

                        {!isAdmin && order.status === "已发货" && (
                            <button
                            className={styles.updateStatusButton}
                            onClick={() => updateOrderStatus(order.id, "已完成")}>
                                已收货
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;