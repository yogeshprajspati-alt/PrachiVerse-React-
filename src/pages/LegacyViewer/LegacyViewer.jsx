import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './LegacyViewer.module.css';
import useEscapeBack from '../../hooks/useEscapeBack';

const LegacyViewer = () => {
    useEscapeBack();
    const [searchParams] = useSearchParams();
    const src = searchParams.get('src');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    if (!src) {
        return <div className={styles.error}>No content source specified.</div>;
    }

    return (
        <div className={styles.viewerContainer}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                ← Back to Dashboard
            </button>

            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.glowPulse} />
                    <p className={styles.loadingText}>Opening diary...</p>
                </div>
            )}

            <iframe
                className={styles.iframe}
                src={src}
                title="Legacy Content"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default LegacyViewer;
