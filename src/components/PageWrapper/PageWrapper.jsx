import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageTransitionVariant } from '../../animations/variants';

const PageWrapper = ({ children }) => {
    const shouldReduceMotion = useReducedMotion();

    // If user prefers reduced motion, disable the animation values.
    const variants = shouldReduceMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        }
        : pageTransitionVariant;

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: '100%', minHeight: '100vh', position: 'relative' }} // ensure absolute elements don't collapse layout if layout animations used (we don't)
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
