import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DiaryViewer.module.css';
import { diaries } from '../../config/diaries';
import useEscapeBack from '../../hooks/useEscapeBack';

const DiaryViewer = () => {
    useEscapeBack();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const diary = diaries.find(d => d.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!diary) {
        return (
            <div className={styles.error}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Diary Not Found</h2>
                    <button className={styles.backButton} onClick={() => navigate(-1)} style={{ position: 'static', marginTop: '20px' }}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.viewerContainer}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                ← Back
            </button>

            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.glowPulse} />
                    <p className={styles.loadingText}>Opening diary...</p>
                </div>
            )}

            <iframe
                className={styles.iframe}
                src={diary.path}
                title={diary.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default DiaryViewer;
