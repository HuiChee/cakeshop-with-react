import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, setDoc, doc, getDoc } from '../firebase';
import {cloudinary} from './Cloudinary';
import styles from '../styles/auth.module.css'

const ADMIN_EMAIL = "mozi011120@gmail.com";

const Auth = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async(e) => {
        e.preventDefault();
        try {
            if(isSignUp) {
                if(avatar) {
                    const avatarURL = await cloudinary(avatar);

                    if(!avatarURL) {
                        alert('头像上传失败');
                        return;
                    }

                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    await setDoc(doc(db, 'users', user.uid), {
                        username,
                        avatarURL,
                        email: user.email,
                        isAdmin: email === ADMIN_EMAIL,
                    });

                    alert("注册成功");
                    onClose();
                } else {
                    alert('请上传头像');
                }
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if(userDoc.exists()){
                    const userData = userDoc.data();
                    if(userData.isAdmin){
                        alert("管理员登录成功");
                    }else{
                        alert("登录成功");
                    }
                }
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
                    {isSignUp && (
                        <>
                            <div>
                                <label>用户名：</label>
                                <input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                />
                            </div>
                            <div>
                                <label>头像：</label>
                                <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => setAvatar(e.target.files[0])}
                                />
                            </div>
                        </>
                    )}
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