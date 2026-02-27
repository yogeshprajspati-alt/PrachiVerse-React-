import React, { useEffect, useRef, useState } from 'react';
import styles from './CrystalChronicles.module.css';
import BackButton from '../../../components/BackButton/BackButton';

import begGif from './beg-dont-leave.gif';
import catGif from './cat-holding-flowers.gif';
import bgAudio from './background.mp3';

const CrystalChronicles = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [wisps, setWisps] = useState([]);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [overlayStep, setOverlayStep] = useState(1);
    const [audioPlaying, setAudioPlaying] = useState(false);

    const audioRef = useRef(null);
    const fleeBtnRef = useRef(null);

    const totalPages = 5; // cover + 3 pages + back cover

    useEffect(() => {
        const w = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 6 + 3,
            left: Math.random() * 100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 10
        }));
        setWisps(w);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const openDiary = () => {
        setIsIntroVisible(false);
        setTimeout(() => {
            audioRef.current?.play().then(() => setAudioPlaying(true)).catch(() => { });
        }, 600);
    };

    const flipNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(p => p + 1);
        }
    };

    const flipPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(p => p - 1);
        }
    };

    const getZIndex = (index) => {
        if (index < currentPage) return 50 + index;
        return totalPages - index;
    };

    const isFlipped = (index) => index < currentPage;

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (audioPlaying) {
            audioRef.current.pause();
            setAudioPlaying(false);
        } else {
            audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => { });
        }
    };

    const dodgeBtn = () => {
        if (!fleeBtnRef.current) return;
        const x = Math.random() * (window.innerWidth - 120);
        const y = Math.random() * (window.innerHeight - 60);
        fleeBtnRef.current.style.left = `${x}px`;
        fleeBtnRef.current.style.top = `${y}px`;
        fleeBtnRef.current.style.position = 'fixed';
    };

    return (
        <div className={styles.diaryWrapper}>
            <BackButton />

            <div className={styles.globalTexture}></div>
            <div className={`${styles.crystalGlow} ${styles.glow1}`}></div>
            <div className={`${styles.crystalGlow} ${styles.glow2}`}></div>

            <div className={styles.particlesContainer}>
                {wisps.map(w => (
                    <div
                        key={w.id}
                        className={styles.wisp}
                        style={{
                            width: `${w.size}px`,
                            height: `${w.size}px`,
                            left: `${w.left}%`,
                            animationDuration: `${w.duration}s`,
                            animationDelay: `${w.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* Intro */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.hidden : ''}`}>
                <h1 className={styles.introTitle}>
                    The Crystal<br />Chronicles
                </h1>
                <button className={styles.introBtn} onClick={openDiary}>
                    Enter The Forest
                </button>
            </div>

            {/* Notebook */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.bindingCoil}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={styles.coilRing}></div>
                    ))}
                </div>

                <div className={styles.notebook}>
                    {/* Cover */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(0) }}
                        onClick={() => currentPage === 0 && flipNext()}
                    >
                        <div className={styles.coverFrame}>
                            <div className={styles.coverInner}>
                                <div className={styles.coverTitle}>MYSTIC<br />JOURNAL</div>
                                <div className={styles.coverSubtitle}>Confidential Chronicles</div>
                            </div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(1) }}
                    >
                        <div className={styles.pageTexture}></div>
                        <div className={`${styles.cornerRune} ${styles.tr}`}>🐼</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Ab Maaf Kardo Na 👉👈</div>
                            <p>Are Deviiiiiiiiiiiiiiiiii maafffffffffffffffff kardooooooooooooooooooooooooooo mujheeeeeeeeeeeeeeeeee 🌿</p>
                            <div className={styles.highlightBox}>
                                "Aisa Doobara nhi karungaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa................. 😭😭😭😭😭😭😭😭😭😭."
                            </div>
                            <p>Mujhe agar pahle se pata hota ki chanchal meri side leti h 😭😭 to me kabhi aisa nhi sochta .</p>
                            <p>My "Algorithms" failed to predict the stormy weather of emotions. 🌧️</p>
                            <p>And I... I may have trampled on the flowers instead of watering them.</p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(2) }}
                    >
                        <div className={styles.pageTexture}></div>
                        <div className={`${styles.cornerRune} ${styles.tr}`}>⚔️</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Pleaseeeeeeeeeee.........!!</div>
                            <p>Tumhe pareshan nhi karunga, kuch nhi kahunga, bbs tum mujhe maaf kardo</p>
                            <div className={styles.highlightBox}>
                                "please, maafi.approve(&quot;all&quot;); please don&apos;t book.close(&quot;my chapter&quot;);"
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    className={`${styles.magicBtn} ${styles.btnAccept}`}
                                    onClick={() => {
                                        setOverlayOpen(true);
                                        setOverlayStep(1);
                                    }}
                                >
                                    Reveal The Truth
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(3) }}
                    >
                        <div className={styles.pageTexture}></div>
                        <div className={`${styles.cornerRune} ${styles.tr}`}>✨</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Your Heart Melted 😭</div>
                            <div className={styles.highlightBox}>
                                Ab bs jaldi se maaf kardooooooooooooooooooooooooooo.
                            </div>
                            <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Or me Haar Maan chuka hu 😭</p>
                        </div>
                    </div>

                    {/* Back Cover */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(4) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(4) }}
                    >
                        <div className={styles.coverFrame}>
                            <div className={styles.coverInner}>
                                <div className={styles.coverTitle} style={{ fontSize: '2rem' }}>
                                    Ab maafi dedo na<br />👉👈
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isIntroVisible && (
                <>
                    <div className={styles.helperText}>Tap Left / Right to Turn Pages</div>
                    <div className={`${styles.touchZone} ${styles.zoneLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.touchZone} ${styles.zoneRight}`} onClick={flipNext}></div>
                </>
            )}

            {/* Audio */}
            <div className={styles.audioToggle} onClick={toggleAudio}>
                ♪
            </div>
            <audio ref={audioRef} src={bgAudio} loop />

            {/* Overlay */}
            {overlayOpen && (
                <div className={styles.overlay}>
                    {overlayStep === 1 && (
                        <div className={styles.crystalCard}>
                            <img src={begGif} alt="plea" />
                            <h2>Peace Offering</h2>
                            <p>Can we bury the hatchet and plant a tree instead?</p>
                            <div className={styles.btnGroup}>
                                <button
                                    className={`${styles.magicBtn} ${styles.btnAccept}`}
                                    onClick={() => setOverlayStep(2)}
                                >
                                    Yes, Let's Glow!
                                </button>
                                <div style={{ position: 'relative' }}>
                                    {/* Placeholder to hold space */}
                                    <button
                                        className={`${styles.magicBtn} ${styles.btnDeny}`}
                                        style={{ visibility: 'hidden' }}
                                    >
                                        Start War
                                    </button>
                                    {/* The real runner button */}
                                    <button
                                        ref={fleeBtnRef}
                                        className={`${styles.magicBtn} ${styles.btnDeny}`}
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                        onMouseEnter={dodgeBtn}
                                        onClick={dodgeBtn}
                                    >
                                        Start War
                                    </button>
                                </div>
                            </div>
                            <div
                                className={styles.overlayClose}
                                onClick={() => setOverlayOpen(false)}
                            >
                                Close this vision
                            </div>
                        </div>
                    )}

                    {overlayStep === 2 && (
                        <div className={styles.crystalCard}>
                            <img src={catGif} alt="happy" />
                            <h2>Victory!</h2>
                            <p>maaf kar diya? 🌲✨</p>
                            <button
                                className={`${styles.magicBtn} ${styles.btnAccept}`}
                                onClick={() => setOverlayOpen(false)}
                            >
                                Return to Reality
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CrystalChronicles;
