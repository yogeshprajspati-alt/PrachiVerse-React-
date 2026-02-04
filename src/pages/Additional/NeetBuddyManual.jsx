import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NeetBuddyManual.module.css';

// Import Assets
import homescreen from '../../assets/NeetBuddy/Homescreen.png';
import chanchal from '../../assets/NeetBuddy/chanchal.png';
import prachidashboard from '../../assets/NeetBuddy/prachidashboard.png';
import prachi2 from '../../assets/NeetBuddy/prachi2.png';
import prachi3 from '../../assets/NeetBuddy/prachi3.png';
import prachi4 from '../../assets/NeetBuddy/prachi4.png';
import prachiBillu1 from '../../assets/NeetBuddy/prachiBillu1.png';
import prachiBillu2 from '../../assets/NeetBuddy/prachiBillu2.png';
import topicTest from '../../assets/NeetBuddy/topic vise test1.png';
import recordingVideo from '../../assets/NeetBuddy/Recording 2026-02-04 181842.mp4';
import conversationVideo from '../../assets/NeetBuddy/prachi conversation.mp4';

const NeetBuddyManual = () => {
    const navigate = useNavigate();

    const sections = [
        {
            type: 'image',
            src: homescreen,
            title: 'Welcome Screen',
            tag: 'UI'
        },
        {
            type: 'image',
            src: prachidashboard,
            title: 'Prachi Dashboard',
            tag: 'Dashboard'
        },
        {
            type: 'image',
            src: chanchal,
            title: 'Chanchal View',
            tag: 'User Profile'
        },
        {
            type: 'image',
            src: prachi2,
            title: 'Conversation Flow',
            tag: 'Chat'
        },
        {
            type: 'image',
            src: prachi3,
            title: 'Detailed Interactions',
            tag: 'Chat'
        },
        {
            type: 'image',
            src: prachi4,
            title: 'Advanced Responses',
            tag: 'AI'
        },
        {
            type: 'image',
            src: prachiBillu1,
            title: 'Billu Helper Integration - 1',
            tag: 'Feature'
        },
        {
            type: 'image',
            src: prachiBillu2,
            title: 'Billu Helper Integration - 2',
            tag: 'Feature'
        },
        {
            type: 'image',
            src: topicTest,
            title: 'Topic-wise Testing',
            tag: 'Exam'
        },
        {
            type: 'video',
            src: conversationVideo,
            title: 'Live Conversation Demo',
            tag: 'Demo'
        },
        {
            type: 'video',
            src: recordingVideo,
            title: 'Full Feature Walkthrough',
            tag: 'Walkthrough'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <h1>🤖 NeetBuddy Manual</h1>
                    <p>Visual Guide & Features</p>
                </header>

                <div className={styles.gallery}>
                    {sections.map((item, index) => (
                        <div key={index} className={styles.mediaCard}>
                            {item.type === 'image' ? (
                                <img src={item.src} alt={item.title} loading="lazy" />
                            ) : (
                                <video controls muted playsInline>
                                    <source src={item.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
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

export default NeetBuddyManual;
