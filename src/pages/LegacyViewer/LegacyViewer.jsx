import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './LegacyViewer.module.css';
import useEscapeBack from '../../hooks/useEscapeBack';

// Allowlist of paths that the ?src= param is permitted to load.
// Only relative paths starting with '/' are accepted — no external URLs.
const ALLOWED_PATHS = [
    '/Dairies/23-01-2026/index.html',
    '/Dairies/26-01-2026/index.html',
];

const isAllowedSrc = (src) => {
    // Reject anything that looks like an external URL
    if (/^https?:\/\//i.test(src)) return false;
    if (/^\/\//i.test(src)) return false;
    return ALLOWED_PATHS.includes(src);
};

const LegacyViewer = () => {
    useEscapeBack();
    const [searchParams] = useSearchParams();
    const src = searchParams.get('src');
    const [isLoading, setIsLoading] = useState(true);

    if (!src) {
        return <div className={styles.error}>No content source specified.</div>;
    }

    if (!isAllowedSrc(src)) {
        return <div className={styles.error}>Invalid content source.</div>;
    }

    return (
        <div className={styles.viewerContainer}>

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
                style={{ border: 'none' }}
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default LegacyViewer;
