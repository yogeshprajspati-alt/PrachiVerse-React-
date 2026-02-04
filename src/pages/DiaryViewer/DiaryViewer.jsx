import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DiaryViewer.module.css';
import { diaries } from '../../config/diaries';

const DiaryViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the diary entry
    const diary = diaries.find(d => d.id === id);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!diary) {
        return (
            <div className={styles.error}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Diary Not Found</h2>
                    <button className={styles.backButton} onClick={() => navigate('/')} style={{ position: 'static', marginTop: '20px' }}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.viewerContainer}>
            <div style={{ position: 'absolute', top: 60, left: 10, color: 'lime', zIndex: 2000, background: 'rgba(0,0,0,0.8)', padding: '5px', fontSize: '10px' }}>
                DEBUG: ID={id}<br />
                Found Title: {diary?.title}<br />
                Path: {diary?.path}
            </div>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                ← Back to Home
            </button>
            <iframe
                className={styles.iframe}
                src={diary.path}
                title={diary.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
            />
        </div>
    );
};

export default DiaryViewer;
