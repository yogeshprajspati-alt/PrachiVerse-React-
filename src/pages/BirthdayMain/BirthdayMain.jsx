import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BirthdayMain.module.css';

// Import audio if available in assets, or use a path
// Assuming audio file is in public folder for now or referenced relatively
// Ideally, import it: import bgMusic from '../../../assets/audio/background.mp3';
// For this port, we will assume it's in the public folder or use a placeholder if not found.

const BirthdayMain = () => {
    const navigate = useNavigate();
    const [stage, setStage] = useState('s1');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [particles, setParticles] = useState([]);

    // Typewriter state
    const [typedText, setTypedText] = useState('');
    const [isTypingDone, setIsTypingDone] = useState(false);
    const fullMessage = `Some people come into our lives like a soft breeze... 🌸\n\nAnd suddenly, everything feels a little lighter, a little brighter.\n\nI wanted to make this small space for you.\nIt's just text right now, but imagine it spoken with the warmest voice.\n\nYou are special, valid, and cherished. 💖\nNever forget that your smile is my favorite notification.\n\nYours truly,\nDeepak ✨`;

    // Gift state
    const [giftOpened, setGiftOpened] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        // Initialize particles
        const interval = setInterval(() => {
            const id = Math.random();
            const isStar = Math.random() > 0.5;
            const size = 16 + Math.random() * 14;
            const duration = 8 + Math.random() * 5;

            setParticles(prev => [...prev, {
                id,
                content: isStar ? '✨' : '🪶',
                left: Math.random() * 100 + 'vw',
                duration: duration + 's',
                fontSize: size + 'px',
                color: isStar ? '#fbbf24' : undefined,
                textShadow: isStar ? '0 0 5px #fbbf24' : undefined
            }]);

            // Cleanup particle after animation
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== id));
            }, 13000); // slightly longer than max duration
        }, 800);

        return () => clearInterval(interval);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (stage === 's2' && !typedText) {
            let i = 0;
            const typeLoop = () => {
                if (i < fullMessage.length) {
                    setTypedText(fullMessage.substring(0, i + 1));
                    i++;
                    setTimeout(typeLoop, 50);
                } else {
                    setIsTypingDone(true);
                }
            };
            // Small delay before starting
            setTimeout(typeLoop, 500);

            // Auto play music on stage 2 if not playing
            if (!isPlaying && audioRef.current) {
                toggleMusic();
            }
        }
    }, [stage]);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.volume = 0.5;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => console.log("Audio play failed:", e));
            }
        }
    };

    const changeStage = (nextStage) => {
        // Simple transition: current stage exit -> wait -> next stage active
        // logic handled by CSS classes based on state, but we need a brief 'exit' state
        // For simplicity in React, we'll just switch state and let CSS enter animation play
        // If we want exit animation, we need a transition state.
        // Let's implement a simple direct switch for now as the CSS 'enter' animation handles the fade in.
        // The original had an explicit 'exit' class logic.

        // To mimic the original: 
        // 1. We could use a transition library, or
        // 2. Just switch. The original had exit opacity 0 -> transform up.
        // Let's just switch and rely on the 'active' class animation (scale up / fade in).

        setStage(nextStage);

        if (nextStage === 's3') {
            // Reset gift if revisiting?
            // setGiftOpened(false); // Optional: keep opened if already opened
        }
    };

    const handleGiftClick = () => {
        if (giftOpened) return;
        setGiftOpened(true);
        createConfetti();

        setTimeout(() => {
            setShowCards(true);
        }, 800);
    };

    const createConfetti = () => {
        const colors = ['#f472b6', '#c084fc', '#fcd34d', '#ffffff'];
        const newConfetti = [];
        for (let k = 0; k < 30; k++) {
            const tx = (Math.random() - 0.5) * 400;
            const ty = (Math.random() - 1) * 400;
            newConfetti.push({
                id: k,
                tx: `${tx}px`,
                ty: `${ty}px`,
                bg: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        setConfetti(newConfetti);

        // Cleanup confetti
        setTimeout(() => setConfetti([]), 3000);
    };

    return (
        <div className={styles.pageContainer}>
            <audio ref={audioRef} loop src="/background.mp3" /> {/* Ensure file exists in public/ */}

            <div className={`${styles.musicBtn} ${isPlaying ? styles.playing : ''}`} onClick={toggleMusic}>
                {isPlaying ? '🎵' : '🔇'}
            </div>

            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div key={p.id} className={styles.feather} style={{
                        left: p.left,
                        animationDuration: p.duration,
                        fontSize: p.fontSize,
                        color: p.color,
                        textShadow: p.textShadow
                    }}>
                        {p.content}
                    </div>
                ))}
            </div>

            {/* Stage 1: Entry */}
            <div className={`${styles.stage} ${stage === 's1' ? styles.active : ''}`}>
                <div className={styles.fairyContainer} onClick={() => changeStage('s2')}>
                    <div className={styles.fairy}>🧚‍♀️</div>
                </div>
                <p className={styles.tapHint}>Tap the fairy to begin ✨</p>

                {/* Back to Home for Stage 1 */}
                <div className={styles.backBtn} onClick={() => navigate('/')}>←</div>
            </div>

            {/* Stage 2: Letter */}
            <div className={`${styles.stage} ${stage === 's2' ? styles.active : ''}`}>
                <div className={styles.backBtn} onClick={() => changeStage('s1')}>←</div>
                <div className={styles.glassBox}>
                    <h1 style={{ textAlign: 'center' }}>Ohh Prachiii ✨</h1>
                    <div className={styles.typedContainer}>
                        <div className={styles.typedText}>
                            {typedText}
                            {!isTypingDone && <span className={styles.cursor}>|</span>}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button className={styles.btnPrimary} onClick={() => changeStage('s3')}>Next Surprise 🎀</button>
                    </div>
                </div>
            </div>

            {/* Stage 3: Gift */}
            <div className={`${styles.stage} ${stage === 's3' ? styles.active : ''}`}>
                <div className={styles.backBtn} onClick={() => changeStage('s2')}>←</div>
                <div className={`${styles.glassBox} ${styles.center}`}>
                    <h1>A little gift... 💝</h1>
                    <p style={{ marginBottom: 0 }}>Just for you</p>

                    {!showCards && (
                        <div
                            className={`${styles.giftBox} ${giftOpened ? styles.open : ''}`}
                            onClick={handleGiftClick}
                        >
                            🎁
                        </div>
                    )}

                    {confetti.map(c => (
                        <div key={c.id} className={styles.confetti} style={{
                            '--tx': c.tx,
                            '--ty': c.ty,
                            background: c.bg
                        }}></div>
                    ))}

                    <div className={`${styles.cardsGrid} ${showCards ? styles.visible : ''}`}>
                        <div className={`${styles.rewardCard} ${showCards ? styles.show : ''}`}
                            style={{ transitionDelay: '0ms' }}
                            onClick={() => changeStage('card-friend')}>
                            <span className={styles.icon}>🦦</span>
                            <span className={styles.label}>Membership</span>
                        </div>
                        <a href="/games/birthday-maze" className={`${styles.rewardCard} ${showCards ? styles.show : ''}`}
                            style={{ transitionDelay: '150ms' }}>
                            <span className={styles.icon}>🎮</span>
                            <span className={styles.label}>Play Game</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Stage 4: Friendship Card */}
            <div className={`${styles.stage} ${stage === 'card-friend' ? styles.active : ''}`}>
                <div className={styles.backBtn} onClick={() => changeStage('s3')}>←</div>
                <div className={`${styles.glassBox} ${styles.center}`}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🦥</div>
                    <h1>Premium Bond</h1>
                    <p>
                        <b>Congratulations! 🥳</b><br /><br />
                        You got a premium membership of my annoying side 🦥🥳<br />
                        Includes: unlimited care, silly jokes, random check-ins and zero escape 😌<br />
                        , and zero return policy.<br /><br />
                        <i>No refunds. 😌</i>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default BirthdayMain;
