import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

const BackButton = ({ className, style }) => {
    const navigate = useNavigate();

    return (
        <button
            className={`${styles.backButton} ${className || ''}`}
            style={style}
            onClick={() => navigate('/')}
            aria-label="Back to Dashboard"
        >
            <span className={styles.icon}>←</span>
            <span>Home</span>
        </button>
    );
};

export default BackButton;
