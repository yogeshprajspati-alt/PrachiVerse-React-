import React, { useEffect, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

const MagneticCursor = () => {
    const shouldReduceMotion = useReducedMotion();
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Use springs for smooth following
    const cursorX = useSpring(0, { damping: 25, stiffness: 120, mass: 0.5 });
    const cursorY = useSpring(0, { damping: 25, stiffness: 120, mass: 0.5 });

    useEffect(() => {
        // Check if on mobile (touch device), if so, disable custom cursor
        if (window.matchMedia("(pointer: coarse)").matches) return;

        setIsVisible(true);

        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16); // Center the 32px cursor
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e) => {
            // Check if we are hovering a clickable element
            const target = e.target;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                target.classList.contains('clickable')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (shouldReduceMotion || !isVisible) return null;

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                x: cursorX,
                y: cursorY,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                mixBlendMode: 'difference',
                pointerEvents: 'none',
                zIndex: 9999,
                // Smooth scaling
                transformOrigin: 'center center'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: isHovering ? 0.8 : 0.4,
                scale: isHovering ? 1.5 : 1,
            }}
            transition={{ type: "tween", ease: "circOut", duration: 0.15 }}
        />
    );
};

export default MagneticCursor;
