import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Jan23Diary.module.css';

// Asset Paths
const ASSET_BASE = "/assets/Jan23";
const AUDIO_SRC = `${ASSET_BASE}/background.mp3`;
const IMG_BEG = `${ASSET_BASE}/beg-dont-leave.gif`;
const IMG_CAT = `${ASSET_BASE}/cat-holding-flowers.jpg`;
const IMG_MAIN = `${ASSET_BASE}/image.png`;

const Jan23Diary = () => {
    const navigate = useNavigate();

    // State
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [isNotebookClosed, setIsNotebookClosed] = useState(true);
    const [flippedPages, setFlippedPages] = useState([]); // Array of page indices that are flipped
    const [isPlaying, setIsPlaying] = useState(false);
    const [particles, setParticles] = useState([]);

    // Apology Overlay State
    const [showApology, setShowApology] = useState(false);
    const [apologyScreen, setApologyScreen] = useState(1); // 1, 2, 3, or 'thankyou'
    const [noBtnStyle, setNoBtnStyle] = useState({});

    // Refs
    const audioRef = useRef(new Audio(AUDIO_SRC));
    const notebookRef = useRef(null);

    // Particle Effect
    useEffect(() => {
        const particleCount = 20;
        const newParticles = [];
        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                isSparkle: Math.random() > 0.7,
                size: Math.random() * 6 + 2,
                left: Math.random() * 100,
                duration: Math.random() * 5 + 5,
                delay: Math.random() * 5
            });
        }
        setParticles(newParticles);
    }, []);

    // Audio Control
    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    // Open Diary Sequence
    const handleOpenDiary = () => {
        setIsIntroVisible(false); // Start fade out

        setTimeout(() => {
            setIsNotebookClosed(false); // Open notebook animation

            // Try autoplay
            audioRef.current.volume = 0.5;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }, 800);
    };

    // Page Flipping Logic
    const totalPages = 3; // 0 (Cover), 1 (Page 1), 2 (Page 2), 3 (Page 3)
    // Wait, indices: Cover is 0. 
    // HTML structure has: Cover, Page 1, Page 2, Page 3. Total 4 "page" divs.
    // Indices: 0, 1, 2, 3.

    const flipNext = () => {
        // Find first page that is NOT flipped
        // Pages are stacked z-index. 0 is top (Cover).
        // Actually, logic in HTML was: find first not flipped, flip it.
        const nextToFlip = [0, 1, 2, 3].find(idx => !flippedPages.includes(idx));

        if (nextToFlip !== undefined) {
            setFlippedPages([...flippedPages, nextToFlip]);
        }
    };

    const flipPrev = () => {
        // Find last flipped page, unflip it.
        // Array is [0, 1] -> remove 1.
        if (flippedPages.length > 0) {
            const newFlipped = [...flippedPages];
            newFlipped.pop();
            setFlippedPages(newFlipped);
        }
    };

    // Apology Logic
    const handleNoHover = (e) => {
        // Move button randomly
        const container = e.target.closest(`.${styles.apologyOverlayContent}`);
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const maxX = rect.width - 100;
        const maxY = rect.height - 50;

        const randomX = Math.random() * (maxX - 20) + 10;
        const randomY = Math.random() * (maxY - 20) + 10;

        setNoBtnStyle({
            position: 'absolute',
            left: `${randomX}px`,
            top: `${randomY}px`,
            transition: 'all 0.3s ease',
            zIndex: 10001
        });
    };

    const resetApology = () => {
        setShowApology(false);
        setApologyScreen(1);
        setNoBtnStyle({});
    };

    return (
        <div className={styles.wrapper}>
            {/* Atmosphere */}
            <div className={styles.globalTexture}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>

            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`${styles.particle} ${p.isSparkle ? styles.sparkle : ''}`}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* Back Button */}
            <button className={styles.backButton} onClick={() => navigate('/')}>
                ← Home
            </button>

            {/* Music Toggle */}
            <div className={styles.musicToggle} onClick={toggleAudio}>
                {isPlaying ? '⏸' : '🎵'}
            </div>

            {/* Intro Screen */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.fade : ''}`}>
                <h1 className={styles.introText}>Ocean Moonlight</h1>
                <button className={styles.introBtn} onClick={handleOpenDiary}>Open Diary</button>
            </div>

            {/* Notebook */}
            <div
                className={`${styles.notebookContainer} ${isNotebookClosed ? styles.closed : ''}`}
                onClick={(e) => {
                    // Simple logic: tap right half -> next, tap left half -> prev
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    if (x > rect.width / 2) flipNext();
                    else flipPrev();
                }}
            >
                {/* Spiral */}
                <div className={styles.spiral}>
                    {Array.from({ length: 12 }).map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>
                    {/* Pages - Rendered in reverse order for z-index stacking if we weren't doing dynamic z-index.
                        But React render order = DOM order.
                        We need strict z-indices.
                        Total 4 pages.
                        Cover (Index 0): zIndex 4. Flipped zIndex 100.
                        Page 1 (Index 1): zIndex 3.
                        Page 2 (Index 2): zIndex 2.
                        Page 3 (Index 3): zIndex 1.
                    */}

                    {/* Cover - Index 0 */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flippedPages.includes(0) ? styles.flipped : ''}`}
                        style={{ zIndex: flippedPages.includes(0) ? 100 : 4 }}
                    >
                        <div className={styles.coverFrame}>
                            <div className={styles.coverTitle}>Midnight Waves</div>
                            <div style={{ fontFamily: 'Raleway', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '10px', color: '#d5e8f7' }}>
                                Under the moonlit ocean...
                            </div>
                        </div>
                    </div>

                    {/* Page 1 - Index 1 */}
                    <div
                        className={`${styles.page} ${flippedPages.includes(1) ? styles.flipped : ''}`}
                        style={{ zIndex: flippedPages.includes(1) ? 101 : 3 }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Prachiii Badmoshh....</div>
                            <p>Hey there, Prachiii. You know what's funny? Periods wale time pe hi meri band bajti hai..,
                                isiliye yaad rakhta hu taaki faltoo pange na lu 🙂‍↔️💀 Mene notice kiya hai har baar tabhi mere se kuch
                                kaand ho jata h." 🙂</p>
                            <p>Aise me fir ek joke yaad ata h, periods ladki-log ke hote h, lecture humlog ke lag jaate h... 😅</p>
                            <p>Hope tumne wo shraddha wali birthday wish dekhli hogi, tumse pahle ki h <em>DEVI JI</em> areeee ye
                                mujhe har saal alag tareeke se wish karti thi, last year ek program ke form me kiya tha to fir
                                me kaise haar maan lu 💀🗿 Don bhi matrix se bahar jaake kuch karega 💀.</p>
                            <p>Ruko yr aaj sab clear cut present ho hi jaane do ab🦥🦥</p>
                            <div className={styles.highlightBox}>"It is True that I Love You 🫵🦥 <br /> Aaaaaahhhhh.... nhi waise nhi jaise
                                tum sochti ho, not in romantic way.... , not in a tharak wali way.... trun the pages to know how
                                different it is."</div>
                            <p></p>
                        </div>
                    </div>

                    {/* Page 2 - Index 2 */}
                    <div
                        className={`${styles.page} ${flippedPages.includes(2) ? styles.flipped : ''}`}
                        style={{ zIndex: flippedPages.includes(2) ? 102 : 2 }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Just For You</div>
                            <p>Ummmmmmmmmmmmmm...... mera intention khud ki saaf image kharab karne ka nhi h.</p>
                            <p>Me bs itna bata rha hu ki, if I say I love you, it doesn't mean I want you in my life in a way
                                you think, it just means I love you for who you are, and I want you to be happy, even if it's
                                not with me.</p>
                            <div className={styles.highlightBox}>"Your mother loves you, your Father Loves you, and even your brother
                                does...!!"</div>
                            <p>Do they have any second thoughts for you? The answer is No..!!</p>
                            <p>The same goes for me..!!</p>
                            <p>I too love my family..!! and you the same double-battery 🦥🦥</p>
                            <div className={styles.highlightBox}>All I ever think about you, then it is simply taking care of you,
                                annoying you, also listening to you all the time (like a small kid), that's it and nothing
                                more...!!</div>
                            <div className={styles.highlightBox}>Kharab baat ye h, "My intentions are really pure for you" tum nhi samajh
                                paogi... ye bhi janta hu me😂 this is disgusting, mene socha bhi nhi tha me ye sab bolunga
                                kabhi, i never had any interest in such things, lekin ab ho gaya na...</div>
                        </div>
                    </div>

                    {/* Page 3 - Index 3 */}
                    <div
                        className={`${styles.page} ${flippedPages.includes(3) ? styles.flipped : ''}`}
                        style={{ zIndex: flippedPages.includes(3) ? 103 : 1 }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>My Message</div>
                            <p>Baaki fir kabhi, abhi ke liye bs itna hi... 🦥🦥</p>
                            <p>Sorry bolne ke liye mene ek special tareeka banaya hai... click button below 👇</p>

                            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                <button className={styles.introBtn} style={{ opacity: 1, animation: 'none' }} onClick={(e) => {
                                    e.stopPropagation(); // Prevent page flip
                                    setShowApology(true);
                                }}>
                                    Open Apology
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Helper Text */}
            <div className={styles.helperText}>Tap right/left to flip pages</div>

            {/* Apology Overlay */}
            {showApology && (
                <div className={styles.apologyOverlay} style={{ opacity: 1 }} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.apologyOverlayContent}>
                        <button className={styles.closeOverlayBtn} onClick={resetApology}>&times;</button>

                        {apologyScreen === 1 && (
                            <div className={styles.apologyCard}>
                                <div className={styles.apologyGifContainer}>
                                    <img src={IMG_BEG} alt="Please" />
                                </div>
                                <div className={styles.apologyMessage}>Are aise kaise, socho to 🥹</div>
                                <div className={styles.apologySubMessage}>One more chance please...</div>
                                <div className={styles.apologyButtonContainer}>
                                    <button className={`${styles.apologyBtn} ${styles.apologyBtnYes}`} onClick={() => setApologyScreen('thankyou')}>Yes ❤️</button>
                                    <button
                                        className={`${styles.apologyBtn} ${styles.apologyBtnNo}`}
                                        style={noBtnStyle}
                                        onMouseEnter={handleNoHover}
                                        onClick={(e) => { e.preventDefault(); handleNoHover(e); }} // Touch support
                                    >
                                        No 💔
                                    </button>
                                </div>
                            </div>
                        )}

                        {apologyScreen === 'thankyou' && (
                            <div className={`${styles.apologyCard}`}>
                                <div className={styles.apologyGifContainer} style={{ width: '180px', height: '180px' }}>
                                    <img src={IMG_CAT} alt="Thank you" />
                                </div>
                                <div className={styles.apologyThankyouMessage}>Thank You! 💕</div>
                                <div className={styles.apologyThankyouText}>
                                    I knew you'd understand! 😁😎<br />
                                    You're the best! 😎<br />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jan23Diary;
