import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrachiNeetApp.module.css';

// Import Assets
import image1 from './image.png';
import image2 from './image copy.png';
import image3 from './image copy 2.png';
import image4 from './image copy 3.png';

const PrachiNeetApp = () => {
    const navigate = useNavigate();

    const sections = [
        {
            type: 'image',
            src: image1,
            title: 'App Screen 1',
            tag: 'UI'
        },
        {
            type: 'image',
            src: image2,
            title: 'App Screen 2',
            tag: 'Feature'
        },
        {
            type: 'image',
            src: image3,
            title: 'App Screen 3',
            tag: 'Detail'
        },
        {
            type: 'image',
            src: image4,
            title: 'App Screen 4',
            tag: 'Overview'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <h1>📱 Prachi Neet App</h1>
                    <p>Visual Guide & Screens</p>
                </header>

                <div className={styles.gallery}>
                    {sections.map((item, index) => (
                        <div key={index} className={styles.mediaCard}>
                            <img src={item.src} alt={item.title} loading="lazy" />
                            <div className={styles.cardFooter}>
                                <span className={styles.badge}>{item.tag}</span>
                                <span>{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.backBtn} onClick={() => navigate('/')}>
                ↩
            </div>
        </div>
    );
};

export default PrachiNeetApp;
