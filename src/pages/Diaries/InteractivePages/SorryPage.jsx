import React, { useState, useEffect, useRef } from 'react';
import styles from './SorryPage.module.css';

// Import assets
import begGif from '../../../assets/sorry/beg-dont-leave.gif';
import milkMochaGif from '../../../assets/sorry/milk-and-mocha-bear-sorry-na.gif';
import jerryGif from '../../../assets/sorry/sorry-na-sorry-jerry.gif';
import thankYouImg from '../../../assets/sorry/cat-holding-flowers.jpg';

const SorryPage = () => {
    const [currentScreen, setCurrentScreen] = useState('screen1'); // screen1, screen2, screen3, thankyou
    const [hearts, setHearts] = useState([]);
    const [confetti, setConfetti] = useState([]);
    const noBtnRef = useRef(null);

    // Initialize floating hearts
    useEffect(() => {
        const heartSymbols = ['💜', '💗', '💖', '💕', '💝', '❤️', '🌸'];
        const newHearts = [];
        for (let i = 0; i < 15; i++) {
            newHearts.push({
                id: i,
                symbol: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 10 + 's',
                animationDuration: (Math.random() * 5 + 8) + 's',
            });
        }
        setHearts(newHearts);
    }, []);

    const handleAccept = () => {
        setCurrentScreen('thankyou');
        // Trigger confetti
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#ff69b4'];
        const newConfetti = [];
        for (let i = 0; i < 50; i++) {
            newConfetti.push({
                id: i,
                left: Math.random() * 100 + '%',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 2 + 2) + 's',
            });
        }
        setConfetti(newConfetti);

        // Remove confetti after 5 seconds to clean up DOM (optional but good practice)
        setTimeout(() => {
            setConfetti([]);
        }, 8000);
    };

    const moveButton = (e) => {
        if (currentScreen !== 'screen3') return;

        const btn = noBtnRef.current;
        if (!btn) return;

        // Get viewport dimensions
        const maxX = window.innerWidth - 150; // button width approx
        const maxY = window.innerHeight - 60; // button height approx

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        btn.style.position = 'fixed';
        btn.style.left = randomX + 'px';
        btn.style.top = randomY + 'px';
        btn.style.transition = 'all 0.3s ease';
        btn.style.zIndex = '1000';
    };

    return (
        <div className={styles.container}>
            {/* Floating hearts background */}
            <div className={styles.heartsBg}>
                {hearts.map((heart) => (
                    <div
                        key={heart.id}
                        className={styles.heart}
                        style={{
                            left: heart.left,
                            animationDelay: heart.animationDelay,
                            animationDuration: heart.animationDuration
                        }}
                    >
                        {heart.symbol}
                    </div>
                ))}
            </div>

            {/* Confetti */}
            {confetti.length > 0 && confetti.map((c) => (
                <div
                    key={c.id}
                    className={styles.confetti}
                    style={{
                        left: c.left,
                        top: '-10px',
                        backgroundColor: c.backgroundColor,
                        animationDelay: c.animationDelay,
                        animationDuration: c.animationDuration
                    }}
                />
            ))}

            {/* Screen 1 */}
            {currentScreen === 'screen1' && (
                <div className={styles.card}>
                    <div className={styles.gifContainer}>
                        <img src={begGif} alt="Please" />
                    </div>
                    <div className={styles.message}>Maan jao please 🥺</div>
                    <div className={styles.subMessage}>I'm really sorry...</div>
                    <div className={styles.buttonContainer}>
                        <button className={`${styles.btn} ${styles.btnYes}`} onClick={handleAccept}>Yes ❤️</button>
                        <button className={`${styles.btn} ${styles.btnNo}`} onClick={() => setCurrentScreen('screen2')}>No 😔</button>
                    </div>
                </div>
            )}

            {/* Screen 2 */}
            {currentScreen === 'screen2' && (
                <div className={styles.card}>
                    <div className={styles.gifContainer}>
                        <img src={milkMochaGif} alt="Please reconsider" />
                    </div>
                    <div className={styles.message}>Ek baar aur sochlo 🥺</div>
                    <div className={styles.subMessage}>Please yaar...</div>
                    <div className={styles.buttonContainer}>
                        <button className={`${styles.btn} ${styles.btnYes}`} onClick={handleAccept}>Yes ❤️</button>
                        <button className={`${styles.btn} ${styles.btnNo}`} onClick={() => setCurrentScreen('screen3')}>No 😢</button>
                    </div>
                </div>
            )}

            {/* Screen 3 */}
            {currentScreen === 'screen3' && (
                <div className={styles.card}>
                    <div className={styles.gifContainer}>
                        <img src={jerryGif} alt="Please think again" />
                    </div>
                    <div className={styles.message}>Are aise kaise yrr socho to 🥹</div>
                    <div className={styles.subMessage}>One more chance please...</div>
                    <div className={styles.buttonContainer}>
                        <button className={`${styles.btn} ${styles.btnYes}`} onClick={handleAccept}>Yes ❤️</button>
                        <button
                            ref={noBtnRef}
                            className={`${styles.btn} ${styles.btnNo}`}
                            onMouseOver={moveButton}
                            onClick={moveButton} // In case of touch or click
                        >
                            No 💔
                        </button>
                    </div>
                </div>
            )}

            {/* Thank You Screen */}
            {currentScreen === 'thankyou' && (
                <div className={`${styles.card} ${styles.thankyouScreen}`}>
                    <div className={styles.gifContainer}>
                        <img src={thankYouImg} alt="Thank you" />
                    </div>
                    <div className={styles.thankyouMessage}>Thank You! 💕</div>
                    <div className={styles.thankyouText}>
                        I knew you'd understand! 🥰<br />
                        You're the best! ❤️<br />
                        Love you so much! 💖
                    </div>
                </div>
            )}
        </div>
    );
};

export default SorryPage;
