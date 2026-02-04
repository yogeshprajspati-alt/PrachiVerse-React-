import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(username, password);

        if (success) {
            navigate('/', { replace: true });
        } else {
            setError(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.bgAnimation}></div>

            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle}></div>
                ))}
            </div>

            <div className={`${styles.loginContainer} ${isShaking ? styles.shake : ''}`}>
                <div className={styles.logo}>
                    <h1>Prachiii Verse</h1>
                    <p>✨ Digital Memories ✨</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <p className={`${styles.errorMessage} ${error ? styles.show : ''}`}>
                        Invalid username or password
                    </p>

                    <button type="submit" className={styles.loginBtn}>
                        Enter Prachi Verse
                    </button>
                </form>
            </div>
        </div >
    );
};

export default Login;
