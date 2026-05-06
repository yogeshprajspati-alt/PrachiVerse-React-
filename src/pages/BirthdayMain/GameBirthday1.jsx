import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GameBirthday1.module.css';

const GameBirthday1 = () => {
    const navigate = useNavigate();
    const [gameStarted, setGameStarted] = useState(false);
    const [hearts, setHearts] = useState([]);
    const [foundCount, setFoundCount] = useState(0);
    const [showFinal, setShowFinal] = useState(false);
    const [messages, setMessages] = useState([]); // visible popup messages
    const [particles, setParticles] = useState([]);
    const [rainEmojis, setRainEmojis] = useState([]);

    const textMessages = [
        "You light up every room! ✨",
        "Your smile is contagious! 😊",
        "You make everything better! 🌟",
        "You're incredibly special! 💫",
        "Your kindness is beautiful! 🌸",
        "You inspire me every day! 🌈",
        "You're one of a kind! 🦋",
        "You deserve the world! 🌍",
        "Your laugh is the best sound! 🎵",
        "You make life brighter! ☀️"
    ];

    useEffect(() => {
        let rainInterval;
        if (gameStarted) {
            // Spawn hearts
            const newHearts = [];
            const heartEmojis = ['❤️', '💖', '💝', '💗', '💓', '💕', '💞', '💘'];

            for (let i = 0; i < 10; i++) {
                const padding = 50;
                // Simple random position, could overlap but okay for this game
                const left = Math.random() * (window.innerWidth - padding * 2) + padding;
                const top = Math.random() * (window.innerHeight - padding * 2 - 100) + padding + 50; // offset for header

                newHearts.push({
                    id: i,
                    emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                    left: left,
                    top: top,
                    delay: Math.random() * 2,
                    isFound: false
                });
            }
            setHearts(newHearts);

            // Start rain
            rainInterval = setInterval(() => {
                const id = Date.now();
                const emojis = ['🎂', '🎁', '🎈', '🎉', '🎊', '✨', '🌟', '💫'];
                setRainEmojis(prev => [...prev, {
                    id,
                    char: emojis[Math.floor(Math.random() * emojis.length)],
                    left: Math.random() * 95 + '%',
                }]);

                setTimeout(() => {
                    setRainEmojis(prev => prev.filter(e => e.id !== id));
                }, 4000);
            }, 800);
        }

        return () => clearInterval(rainInterval);
    }, [gameStarted]);

    const handleHeartClick = (e, heart) => {
        if (heart.isFound) return;
        e.stopPropagation();

        // Update heart state
        setHearts(prev => prev.map(h => h.id === heart.id ? { ...h, isFound: true } : h));
        setFoundCount(prev => {
            const newCount = prev + 1;
            if (newCount === 10) {
                setTimeout(() => setShowFinal(true), 1000);
            }
            return newCount;
        });

        // Spawn particles
        createParticles(heart.left, heart.top);

        // Show message
        // eslint-disable-next-line react-hooks/purity
        const msgId = Date.now();
        // Calculate safe position for message
        const msgLeft = Math.max(10, Math.min(window.innerWidth - 200, heart.left - 50));
        const msgTop = Math.max(60, Math.min(window.innerHeight - 100, heart.top - 50));

        setMessages(prev => [...prev, {
            id: msgId,
            text: textMessages[heart.id],
            left: msgLeft,
            top: msgTop,
            exiting: false
        }]);

        // Remove message after delay
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, exiting: true } : m));
            setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== msgId));
            }, 500); // Wait for popOut animation
        }, 2000);
    };

    const createParticles = (x, y) => {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff'];
        const shapes = ['●', '★', '♥', '✦'];
        const newParticles = [];

        for (let i = 0; i < 15; i++) {
            // eslint-disable-next-line react-hooks/purity
            const tx = (Math.random() - 0.5) * 200;
            // eslint-disable-next-line react-hooks/purity
            const ty = (Math.random() - 0.5) * 200;
            newParticles.push({
                // eslint-disable-next-line react-hooks/purity
                id: Math.random(),
                // eslint-disable-next-line react-hooks/purity
                char: shapes[Math.floor(Math.random() * shapes.length)],
                left: x,
                top: y,
                // eslint-disable-next-line react-hooks/purity
                color: colors[Math.floor(Math.random() * colors.length)],
                // eslint-disable-next-line react-hooks/purity
                size: Math.random() * 20 + 10,
                tx,
                ty
            });
        }

        setParticles(prev => [...prev, ...newParticles]);

        // Cleanup these particles
        setTimeout(() => {
            // In a real app we'd track IDs better, but batched cleanup is okay-ish or just let them fade (they are removed from DOM by key if parent rerenders... actually no, we need to remove them from state to avoid memory leak)
            // Simpler: use a timeout to filter them out based on creation time? 
            // Effect cleanup is expensive for many particles. 
            // Let's just remove specific ones after 1s.
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1000);
    };

    return (
        <div className={styles.gameContainer}>
            {/* Back Button */}
            <div className={styles.backBtn} onClick={() => navigate('/')}>←</div>

            {/* Score HUD */}
            <div className={styles.counter}>💝 {foundCount}/10</div>

            {/* Start Screen */}
            {!gameStarted && (
                <div className={styles.startScreen}>
                    <h1>✨ A Special Surprise ✨</h1>
                    <p style={{ marginBottom: '10px' }}>Click the hearts to reveal messages</p>
                    <p style={{ fontSize: '18px', opacity: 0.8 }}>Find all 10 hearts! 💝</p>
                    <button className={styles.startBtn} onClick={() => setGameStarted(true)}>Start</button>
                </div>
            )}

            {/* Background Rain */}
            {rainEmojis.map(e => (
                <div key={e.id} className={styles.emojiRain} style={{ left: e.left }}>{e.char}</div>
            ))}

            {/* Particles */}
            {particles.map(p => (
                <div key={p.id} className={styles.particle} style={{
                    left: p.left,
                    top: p.top,
                    color: p.color,
                    fontSize: p.size,
                    '--tx': `${p.tx}px`,
                    '--ty': `${p.ty}px`
                }}>
                    {p.char}
                </div>
            ))}

            {/* Hearts - only render if game started */}
            {gameStarted && hearts.map(heart => (
                <div
                    key={heart.id}
                    className={`${styles.heart} ${heart.isFound ? styles.found : ''}`}
                    style={{
                        left: heart.left,
                        top: heart.top,
                        animationDelay: `${heart.delay}s`
                    }}
                    onClick={(e) => handleHeartClick(e, heart)}
                >
                    {heart.emoji}
                </div>
            ))}

            {/* Popup Messages */}
            {messages.map(msg => (
                <div
                    key={msg.id}
                    className={`${styles.message} ${msg.exiting ? styles.popOut : ''}`}
                    style={{ left: msg.left, top: msg.top }}
                >
                    {msg.text}
                </div>
            ))}

            {/* Final Message */}
            {showFinal && (
                <div className={`${styles.finalMessage} ${styles.show}`}>
                    <h1 className={styles.finalTitle}>🎉 Happy Birthday! 🎂</h1>
                    <p>You found all the hearts!</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b', margin: '15px 0' }}>
                        You're amazing and special to me! 💖
                    </p>
                    <p>I hope your birthday is as wonderful as you are!</p>
                    <p style={{ fontSize: '20px', marginTop: '30px' }}>🎈 Wishing you endless joy and happiness! 🎈</p>
                </div>
            )}
        </div>
    );
};

export default GameBirthday1;
