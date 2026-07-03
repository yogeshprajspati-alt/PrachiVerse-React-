import React, { useState, useRef } from 'react';
import styles from './VelvetNight.module.css';

const VelvetNight = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [particles] = useState(() =>
        Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            isSparkle: Math.random() > 0.85,
            width: Math.random() * 4 + 1,
            left: Math.random() * 100,
            duration: Math.random() * 12 + 8,
            delay: Math.random() * 5
        }))
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const totalPages = 5;

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => console.log("Audio play failed interaction needed"));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const enterDiary = () => {
        setIsIntroVisible(false);
        setTimeout(() => {
            toggleAudio();
        }, 500);
    };

    const flipNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const flipPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const getZIndex = (index) => {
        if (index < currentPage) return 50 + index;
        return totalPages - index;
    };

    const isFlipped = (index) => index < currentPage;

    return (
        <div className={styles.diaryWrapper}>
            {/* Background Audio (can replace src later) */}
            <audio ref={audioRef} loop src="/assets/diaries/lavender-mist/background.mp3" />

            {/* Atmosphere Effects */}
            <div className={styles.globalTexture}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>
            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`${styles.particle} ${p.isSparkle ? styles.sparkle : ''}`}
                        style={{
                            width: `${p.width}px`,
                            height: `${p.width}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Intro Screen */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.hidden : ''}`}>
                <h1 className={styles.introTitle}>Velvet Night</h1>
                <p className={styles.introSubtitle}>Some thoughts are best drowned in deep colors...</p>
                <button className={styles.introBtn} onClick={enterDiary}>Unseal Diary</button>
            </div>

            {/* 3D Notebook Component */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.spiral}>
                    {[...Array(12)].map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>

                    {/* Cover (Page 0) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(0) }}
                        onClick={() => currentPage === 0 && flipNext()}
                    >
                        <div className={styles.coverContent}>
                            <div className={styles.coverTitle}>Velvet<br />Night</div>
                            <div style={{ fontSize: '0.85rem', letterSpacing: '3px', color: '#ffcdd2', textTransform: 'uppercase' }}>Chapter: The Unknown</div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(1) }}>
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>🍷</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>A Midnight Thought</div>
                            <p>It is strange how the quietest hours of the night always bring the loudest thoughts. The world sleeps, yet the mind stays awake, wandering through halls of “what ifs” and “maybe thens.”</p>

                            <div className={styles.highlight}>
                                "Silence is not empty. It's full of answers we are too afraid to hear."
                            </div>

                            <p>I find myself staring at the ceiling, trying to untangle something that perhaps was never meant to be straight. But isn't that the beauty of it all? The messiness. The uncalculated chaos.</p>
                            <p>Sometimes I think we try too hard to organize our feelings, like placing books on a shelf by height or color. But emotions don't work like that. They spill over, they mix colors, they burn like wild embers in the dark.</p>
                        </div>
                        <div className={`${styles.cornerDeco} ${styles.bl}`}>🍷</div>
                    </div>

                    {/* Page 2 */}
                    <div className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(2) }}>
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>🌹</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>The Illusion of Control</div>
                            <p>We love the illusion of control. We build routines, set alarms, make promises we internally debate.</p>

                            <p>But the truth is, a single word from the right person at the wrong time can shatter an entire week of careful planning.</p>

                            <div className={styles.polaroid}>
                                {/* Using a placeholder for dramatic effect since I don't have new assets */}
                                <div style={{ width: '100%', height: '140px', background: 'radial-gradient(circle, #ffebee, #ffcdd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ef5350' }}>
                                    <span style={{ color: '#c62828', fontSize: '3rem', filter: 'blur(1px)' }}>♠️</span>
                                </div>
                                <div className={styles.polaroidCaption}>Unpredictable Eventuality</div>
                            </div>

                            <div className={styles.highlight}>
                                Stop trying to steer the river. Just float.
                            </div>
                            <p>Maybe it’s time to stop over-explaining everything. To let things be misunderstood for a moment. Not every puzzle requires solving tonight.</p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(3) }}>
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>🌙</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>Starlight Residue</div>
                            <p>Here's a gentle reminder: Be cheerful & stress free.</p>

                            <p> Tumse rose legacy me bola tha, ki apna ek spearate platform banaunga. Ab kya fayeda aisi cheez bana ke jo already exist karti ho.. isiliye kuch aisa bana rha hu jo unique ho. So here I present "Side kick" - Our Safe and secure place to interact. Ab kaise usage shuru karna h steps are below 👇👇</p>

                            <p>Sabse pahle neeche "sign up " pe dabao apni "email daalo or jo password pasand aaye wo daal do. </p>
                            <p>Fir email aayega "Gmail pe ek confirm karne ke liye uspe click karke confirm kar lo. Verification ho jayegi. </p>
                            <p>Fir log in karo. </p>
                            <p>Ab tum use kar sakti ho. </p>

                            <div className={styles.highlight}>
                                In case of any issue, emergency or trouble. Apni email daalo bs password me "prachi121@" daal ke signin karlo. fake aur dummy cheezen milengi aur kuch bhi reveal nhi hoga.
                            </div>
                            <p>Aur kuch naya feature add karne ka suggestion ho to de dena aur kya.</p>
                            <p>Bye..!!</p>
                        </div>
                        <div className={`${styles.cornerDeco} ${styles.bl}`}>🌙</div>
                    </div>

                    {/* Back Cover (Page 4) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(4) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(4) }}>
                        <div className={styles.coverContent} style={{ border: 'none', background: 'none', boxShadow: 'none' }}>
                            <div style={{ fontFamily: 'Dancing Script', fontSize: '2.5rem', color: '#ffcdd2', filter: 'drop-shadow(0 0 10px rgba(211, 47, 47, 0.8))' }}>End of Chapter</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Click Zones */}
            {!isIntroVisible && (
                <>
                    <div className={styles.helper}>Tap edges to turn pages</div>
                    <div className={`${styles.zone} ${styles.zLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.zone} ${styles.zRight}`} onClick={flipNext}></div>
                    <div className={styles.musicBtn} onClick={toggleAudio}>
                        {isPlaying ? '🔇' : '🎵'}
                    </div>
                </>
            )}
        </div>
    );
};

export default VelvetNight;
