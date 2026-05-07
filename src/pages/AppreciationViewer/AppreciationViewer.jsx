import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appreciationList } from '../../config/appreciation';
import styles from './AppreciationViewer.module.css';

const AppreciationViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const entry = appreciationList.find(item => item.id === id);

  useEffect(() => {
    if (entry) {
      sessionStorage.setItem('lastVisited', JSON.stringify({
        title: entry.title,
        icon: entry.emoji,
        link: `/appreciation/${entry.id}`
      }));
    }
  }, [entry]);

  if (!entry) {
    return (
      <div className={styles.notFound}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        <p>Appreciation not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
      
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading appreciation...</p>
        </div>
      )}

      <iframe
        className={styles.iframe}
        src={entry.path}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setIsLoading(false)}
        title={entry.title}
      />
    </div>
  );
};

export default AppreciationViewer;
