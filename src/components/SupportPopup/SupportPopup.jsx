import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SupportPopup.module.css';

const SupportPopup = () => {
    const [visible, setVisible] = useState(true);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setVisible(false)}
                >
                    <motion.div
                        className={styles.popup}
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className={styles.icon}>💫</span>

                        <h2 className={styles.title}>A Little Update</h2>

                        <p className={styles.message}>
                            Prachi Forever, therefore prachiverse forever.
                            <br />
                            PrachiVerse will be supported until Prachi lives.                        </p>

                        <p className={styles.date}>Forever🌻</p>

                        <button
                            className={styles.button}
                            onClick={() => setVisible(false)}
                        >
                            Hn Hn 🤨
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SupportPopup;
