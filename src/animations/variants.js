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

// Micro-interactions - Subliminal and weighty
export const hoverScaleVariant = {
    rest: {
        scale: 1,
        boxShadow: "0px 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        y: 0,
        filter: "brightness(1)",
    },
    hover: {
        scale: 1.02, // Just a breath of expansion
        y: -4,       // A gentle, weighty lift
        filter: "brightness(1.1)", // Slight illumination
        boxShadow: "0px 20px 50px rgba(167, 139, 250, 0.15), 0px 0px 40px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
        transition: {
            duration: 0.6, // Slow, intentional hover state
            ease: customEasing
        }
    },
    tap: {
        scale: 0.98,
        y: 0,
        filter: "brightness(0.9)",
        boxShadow: "0px 5px 15px rgba(167, 139, 250, 0.1)",
        transition: {
            duration: 0.2, // Quick, tactile press
            ease: "easeOut"
        }
    }
};
