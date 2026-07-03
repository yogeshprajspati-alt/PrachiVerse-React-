// Ultra-premium, whisper-smooth easing (Apple/Stripe aesthetic)
export const customEasing = [0.16, 1, 0.3, 1]; // Custom cubic bezier for a slow, settling tail
const fadeEase = [0.25, 0.1, 0.25, 1]; // Smooth linear fade

// Page Transitions — instant feel, no blur
export const pageTransitionVariant = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: customEasing
        }
    },
    exit: {
        opacity: 0,
        y: -6,
        transition: {
            duration: 0.2,
            ease: fadeEase
        }
    }
};

// Scroll Reveals — snappy, responsive
export const scrollRevealVariant = {
    hidden: {
        opacity: 0,
        y: 24,
        scale: 0.98,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: customEasing
        }
    }
};

// Stagger Container - Very slow, deliberate ripple
export const staggerContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Slowed down significantly
            delayChildren: 0.3
        }
    }
};

// Stagger Items — fast settle
export const staggerItemVariant = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: customEasing
        }
    }
};


