import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './LegacyViewer.module.css';
import BackButton from '../../components/BackButton/BackButton';

const LegacyViewer = () => {
    const [searchParams] = useSearchParams();
    const src = searchParams.get('src');
    const navigate = useNavigate();

    if (!src) {
        return <div className={styles.error}>No content source specified.</div>;
    }

    return (
        <div className={styles.viewerContainer}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                ← Back to Dashboard
            </button>
            <iframe
                className={styles.iframe}
                src={src}
                title="Legacy Content"
                frameBorder="0"
                allow="autoplay; encrypted-media"
            />
        </div>
    );
};

export default LegacyViewer;
