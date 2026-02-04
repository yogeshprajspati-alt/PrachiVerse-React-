import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import styles from './JourneyBreak.module.css';

const JourneyBreak = () => {
    const bearContainer = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Bear Animation
        if (bearContainer.current) {
            const anim = lottie.loadAnimation({
                container: bearContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://assets6.lottiefiles.com/packages/lf20_jbrw3hcz.json' // Using the same remote URL as source
            });

            return () => anim.destroy();
        }
    }, []);

    useEffect(() => {
        // Floating Background Elements
        const emojis = ['✨', '💫', '⭐', '💖', '🌸', '🌟', '🌺'];
        const container = containerRef.current;

        if (!container) return;

        // We can't easily append to body in React without side effects, 
        // so we'll append to our container ref which is full screen.
        const createFloatingElement = () => {
            const el = document.createElement('div');
            const isHeart = Math.random() > 0.6;
            el.className = `${styles.floating} ${isHeart ? styles.heart : (Math.random() > 0.5 ? styles.star : styles.sparkle)}`;

            if (!isHeart) {
                el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            }

            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDuration = 8 + Math.random() * 8 + 's';
            el.style.animationDelay = Math.random() * 6 + 's'; // random delay for initial start

            container.appendChild(el);

            // Cleanup element after animation to prevent DOM clutter if it runs long-term
            // The CSS animation creates the movement, but elements persist. 
            // In a SPA, we should probably remove them. 
            // The original script just added 30 at once and looped them via CSS.
            // Let's match the original logic: Create 30 elements once.
        };

        for (let i = 0; i < 30; i++) {
            createFloatingElement();
        }

        // Cleanup function to remove added elements when component unmounts
        return () => {
            // This is a bit aggressive but ensures we don't leave elements floating if we navigate away
            // However, since we append to `containerRef`, React's unmount handles the parent removal.
            // But for safety, we can just let React handle the container removal.
            if (container) {
                const floatingElements = container.querySelectorAll(`.${styles.floating}`);
                floatingElements.forEach(el => el.remove());
            }
        };
    }, []);

    const messages = [
        "Hey… just checking-in on you 🐼",
        "I know you've been working really hard lately, can clearly see that! 🌟",
        "Even on tired days, you're doing amazing ✨",
        "Please be gentle with yourself 🌸",
        "Take a deep breath and keep studying ⭐",
        "Same consistency and ALL SET... 💖",
        "Remember to take breaks and hydrate 💧",
        "Ever feel low, then text me simply",
        "One Day all those efforts will pay off! 🌟",
        "I'm always cheering for you 🐻",
        "No need to respond, just know you're appreciated 😊",
        "Just react with a 🕊️ if you read this!",
        "Mark my words, you're destined for greatness! 🚀",
        "And remember, You are Amazing!🐼✨"
    ];

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.card}>
                <div className={`${styles.deco} ${styles.decoTopLeft}`}>🌸</div>
                <div className={`${styles.deco} ${styles.decoTopRight}`}>✨</div>
                <div className={`${styles.deco} ${styles.decoBottomLeft}`}>🌺</div>
                <div className={`${styles.deco} ${styles.decoBottomRight}`}>🌟</div>

                <div id="bear" ref={bearContainer} className={styles.bear}></div>

                <div className={styles.messages}>
                    {messages.map((text, i) => (
                        <div
                            key={i}
                            className={`${styles.message} ${i === 0 ? styles.messageFirst : ''}`}
                            style={{ animationDelay: `${0.5 + i * 1.4}s` }}
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JourneyBreak;
