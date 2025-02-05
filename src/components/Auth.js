import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import styles from '../styles/auth.module.css'

const Auth = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async(e) => {
        e.preventDefault();
        try {
            if(isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("注册成功");
                onClose();
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("登录成功");
                onClose();
            }
        } catch(error) {
            setError(error.message);
        }
    };

    if(!isOpen) return null;

    return (
        <div className={styles['model-overlay']} onClick={onClose}>
            <div className={styles['model-content']} onClick={(e) => e.stopPropagation()}>
                <h2>{isSignUp ? "注册" : "登录"}</h2>
                <form onSubmit={handleAuth}>
                    <div>
                        <label>Email:</label>
                        <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    {error && <p style={{color: "red"}}>{error}</p>}
                    <button type='submit'>{isSignUp ? "注册" : "登录"}</button>
                </form>

                <div>
                    <button onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "已有账号？ 点击登录" : "没有账号？ 点击注册"}
                    </button>
                </div>
                <button onClick={onClose}>关闭</button>
            </div>
        </div>
    );
};

export default Auth;