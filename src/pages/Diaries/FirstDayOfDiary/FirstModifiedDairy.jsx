import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FirstModifiedDairy.module.css';

const FirstModifiedDairy = () => {
    // Pages range from 2 to 5 as per source files
    const [page, setPage] = useState(2);
    const navigate = useNavigate();

    const pagesData = {
        2: {
            title: "Are tum bhago yaha se",
            emoji: "😭",
            signature: "- nooooooo",
            prevText: "Back",
            nextText: "Next"
        },
        3: {
            title: "Kitni hoshiyari dikha rhi ho.",
            emoji: null,
            signature: "- Areeee jao reeeeeeeeeeeeeeeeee.",
            prevText: "Back",
            nextText: "Next"
        },
        4: {
            title: "Maja waja ata h kya sanskari logon ki webpage pe aatyachar karke",
            emoji: null,
            signature: "- Gooooooooooooooooooooooooooooooo, byeeeeeeeeeeeeee",
            prevText: "Back",
            nextText: "Bs last page.."
        },
        5: {
            title: "Under Construction......",
            emoji: null,
            signature: "- --------",
            prevText: "Back",
            nextText: null
        }
    };

    const currentData = pagesData[page];

    useEffect(() => {
        // Animation reset logic
        const signatureEl = document.querySelector(`.${styles.signature}`);

        // Reset opacity
        if (signatureEl) signatureEl.style.opacity = '0';

        // Animate signature after delay (simulating the behavior from original HTML)
        const initialDelay = 1800;
        const typingDelay = 500; // There are no paragraphs, so we just add the fixed delay

        const timer = setTimeout(() => {
            if (signatureEl) signatureEl.style.opacity = '1';
        }, initialDelay + typingDelay);

        return () => clearTimeout(timer);
    }, [page]);

    const handleNext = () => {
        if (page < 5) {
            setPage(page + 1);
        }
    };

    const handleBack = () => {
        if (page > 2) {
            setPage(page - 1);
        } else {
            // If on first page (page 2), go back to dashboard
            navigate('/');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.bgAnimationContainer}>
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={styles.orb}></div>
                ))}
            </div>

            <div className={styles.letterContainer}>
                <div className={styles.titleContainer}>
                    <h1>{currentData.title}</h1>
                    {currentData.emoji && <span className={styles.headerEmoji}>{currentData.emoji}</span>}
                </div>

                <p className={styles.signature}>{currentData.signature}</p>

                <div className={styles.buttonNavContainer} style={{ justifyContent: page === 5 ? 'center' : 'space-between' }}>
                    <button className={styles.navBtn} onClick={handleBack} style={{ width: page === 5 ? '100%' : 'auto', justifyContent: 'center' }}>
                        <span>←</span>
                        <span>{currentData.prevText}</span>
                    </button>

                    {currentData.nextText && (
                        <button className={styles.navBtn} onClick={handleNext}>
                            <span>{currentData.nextText}</span>
                            <span>→</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FirstModifiedDairy;
