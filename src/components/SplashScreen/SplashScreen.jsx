import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Rich, deep background gradient matching the theme
const splashStyles = {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(circle at center, #1e1b4b 0%, #0a0e27 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    flexDirection: 'column',
    overflow: 'hidden'
};

const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.3
        }
    }
};

const letterVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.5, rotateX: -90, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 150,
            mass: 0.8
        }
    }
};

const particleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 }
    }
};

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [particles] = useState(() =>
        Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 3,
            size: 2 + Math.random() * 5,
            x: Math.random() * 100 - 50,
            scale: Math.random() + 0.8
        }))
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                setTimeout(onComplete, 1200);
            }
        }, 3400);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Flatten text into array so we can perfectly span one unified gradient across all letters
    const fullString = "✨ Prachiii Verse ✨";
    const charsArray = Array.from(fullString);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={splashStyles}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{
                        opacity: 0,
                        clipPath: 'circle(0% at 50% 50%)', // Original cinematic iris exit
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    {/* Floating Background Particles */}
                    <motion.div
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                        variants={particleContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {particles.map(p => (
                            <motion.div
                                key={p.id}
                                style={{
                                    position: 'absolute',
                                    left: p.left,
                                    bottom: '-10%',
                                    width: p.size,
                                    height: p.size,
                                    borderRadius: '50%',
                                    background: 'rgba(236, 72, 153, 0.8)',
                                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.9), 0 0 30px rgba(167, 139, 250, 0.8)',
                                    filter: 'blur(1px)' // Softer particles
                                }}
                                animate={{
                                    y: [0, -window.innerHeight * 1.2],
                                    x: [0, p.x],
                                    opacity: [0, 1, 0],
                                    scale: [0, p.scale, 0]
                                }}
                                transition={{
                                    duration: p.duration,
                                    delay: p.delay,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Highly Responsive Logo/Text Container */}
                    <motion.div
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                            display: 'flex',
                            flexWrap: 'nowrap', // FORCE SINGLE LINE
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0',
                            perspective: '1200px',
                            zIndex: 10,
                            width: '100%',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {charsArray.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                style={{
                                    display: 'inline-block',
                                    fontSize: 'clamp(1.5rem, 5vw, 5.5rem)',
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 900,
                                    letterSpacing: char === '✨' ? '1.5vw' : '2px', // Add space around emojis

                                    // Massive virtual gradient spanning the whole word perfectly
                                    background: 'linear-gradient(135deg, #ec4899 0%, #a78bfa 50%, #fbbf24 100%)',
                                    backgroundSize: `${charsArray.length * 100}% 100%`,
                                    backgroundPosition: `${(index / (charsArray.length - 1)) * 100}% 0%`,

                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    textShadow: char.trim() ? '0 15px 25px rgba(0,0,0,0.6)' : 'none',
                                    filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.4))',
                                    paddingBottom: '10px'
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Dynamic Loader Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                        style={{
                            width: "min(350px, 80vw)", // Clamped width for mobile
                            height: '3px',
                            marginTop: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            zIndex: 10,
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Glow trailing bar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: "40%",
                                background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.9), rgba(167, 139, 250, 1), transparent)',
                                filter: 'blur(3px)'
                            }}
                        />
                        {/* Solid bright center bar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                width: "15%",
                                left: "12.5%",
                                background: '#fde68a',
                                boxShadow: '0 0 10px #fde68a, 0 0 20px #fde68a'
                            }}
                        />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.8 }}
                        style={{
                            marginTop: '1.5rem',
                            color: 'rgba(216, 180, 254, 0.9)', // Softer lavender
                            fontSize: 'clamp(0.8rem, 3vw, 1rem)', // Scales on mobile
                            fontWeight: 400,
                            letterSpacing: '5px',
                            textTransform: 'uppercase',
                            zIndex: 10,
                            textAlign: 'center'
                        }}
                    >
                        Loading Memories
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
