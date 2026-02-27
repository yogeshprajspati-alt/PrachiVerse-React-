import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ApologyDairy.module.css';

// Import Assets
import bgMusicFile from '../../../assets/ApologyDiary/background.mp3';
import catFlowerImg from '../../../assets/ApologyDiary/cat-and-flower.gif';
import angryImg from '../../../assets/ApologyDiary/image.png';
import thankYouImg from '../../../assets/ApologyDiary/thankyou.png';

const Fireflies = () => {
    const fireflies = Array.from({ length: 30 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--tx': `${(Math.random() - 0.5) * 200}px`,
            '--ty': `${(Math.random() - 0.5) * 100}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
        };
        return <div key={i} className={styles.firefly} style={style} />;
    });
    return <div className={styles.fireflyContainer}>{fireflies}</div>;
};

const Stars = () => {
    const stars = Array.from({ length: 50 }).map((_, i) => {
        const size = Math.random() * 2 + 1 + 'px';
        const style = {
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--duration': `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 2}s`
        };
        return <div key={i} className={styles.star} style={style} />;
    });
    return <div className={styles.starsContainer}>{stars}</div>;
};

const ApologyDairy = () => {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Page Flip State: We have 6 "pages" that can be flipped
    // Index 0: Cover
    // Index 1: Page 1
    // Index 2: Page 2
    // Index 3: Page 3 (Interaction)
    // Index 4: Page 4 (Conclusion)
    // Index 5: Back Cover
    const totalPages = 6;
    const [flippedIndices, setFlippedIndices] = useState([]);

    // Apology Interaction State
    const [apologyState, setApologyState] = useState('start'); // 'start', 'rejected', 'accepted'

    const audioRef = useRef(new Audio(bgMusicFile));

    useEffect(() => {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        return () => {
            audioRef.current.pause();
        };
    }, []);

    const startApp = () => {
        setStarted(true);
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(e => console.log("Audio play failed:", e));
    };

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const flipNext = () => {
        // Find the first non-flipped page index
        for (let i = 0; i < totalPages; i++) {
            if (!flippedIndices.includes(i)) {
                setFlippedIndices([...flippedIndices, i]);
                return;
            }
        }
    };

    const flipPrev = () => {
        // Find the last flipped page index
        if (flippedIndices.length > 0) {
            const newIndices = [...flippedIndices];
            newIndices.pop(); // Remove the last added index
            setFlippedIndices(newIndices);
        }
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') flipNext();
            if (e.key === 'ArrowLeft') flipPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flippedIndices]); // Re-bind with updated state

    // Interaction Handlers
    const handleAccept = () => setApologyState('accepted');
    const handleReject = () => setApologyState('rejected');
    const handleReset = () => setApologyState('start');

    // Helper to calculate Z-Index
    // Pages stack: 0 (Top) -> 5 (Bottom)
    // When flipped: 100 + index
    const getZIndex = (index) => {
        if (flippedIndices.includes(index)) {
            return 100 + index;
        }
        return totalPages - index;
    };

    return (
        <div className={styles.container}>
            <Stars />
            <Fireflies />

            {/* Entrance Screen */}
            <div className={`${styles.introScreen} ${started ? styles.fade : ''}`}>
                <h1 className={styles.introTitle}>I'm Sorry</h1>
                <p className={styles.introSub}>PRACHIII</p>
                <button className={styles.btnOpen} onClick={startApp}>Listen...</button>
            </div>

            {/* Notebook */}
            <div className={`${styles.notebookContainer} ${!started ? styles.closed : ''}`}>
                <div className={styles.helperText}>Tap Right ➔ | Tap Left ⬅</div>

                <div className={styles.notebook}>
                    <div className={styles.spiral}>
                        {[...Array(12)].map((_, i) => <div key={i} className={styles.ring} />)}
                    </div>

                    {/* Pages */}

                    {/* Back Cover (Index 5) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flippedIndices.includes(5) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(5) }}
                        onClick={() => !flippedIndices.includes(5) && flipNext()}
                    >
                        <div className={styles.coverBorder}>
                            <div className={styles.coverTitle} style={{ fontSize: '2.5rem' }}>Thank You</div>
                            <div className={styles.coverSubtitle}>For Listening Till End.</div>
                            <button className={styles.actionBtn} style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)' }} onClick={() => navigate('/')}>Exit</button>
                        </div>
                    </div>

                    {/* Page 4: Conclusion (Index 4) */}
                    <div
                        className={`${styles.page} ${flippedIndices.includes(4) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(4) }}
                        onClick={() => !flippedIndices.includes(4) && flipNext()}
                    >
                        <div className={styles.cornerDeco} style={{ top: 15, right: 15 }}>✦</div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>Chalo theek h..!</div>
                            <p>Maaf kiya maaf kiya... Ange se aise mat karna theeek h naaa🐼🦥</p>
                            <p><em>Tummmm...🫵 ha tum 🫵 aise hi soch rhi ho to badhiya fir 😂🦥</em></p>
                            <div className={styles.highlight}>Waise mujhe mere dost ki bohot yaad ati h, shyd isiliye mene pepper bana li. Me uska naam tk nhi le pata. Form bs tumhari poorani personality ki h. Vibe to mere dost wali hi h!</div>
                            <p>Agar tumne mujhe maaf kar diya ho to fir, tum is wali dairy ki rating dedo,kyuki wo flower tumne accept kara ya reject mujhe pata nhi chalega, naa hi me ye dekh sakta hu ki tum kitni baar ye dekh rhi ho (I can't). Agar abhi bhi naraz ho to mat do rating. Tumhara bhi to kuch mn hota hoga na.... I can understand :) </p>
                            <p>Or haa Background music pe mat bhadak jana 🦥 wo bs dimag me aya nhi konsa daalu konsa daalu to ye most frequently aya to daal diya... btw iska naam <em>"For a thousand years h"</em></p>
                        </div>
                    </div>

                    {/* Page 3: Interaction (Index 3) */}
                    <div
                        className={`${styles.page} ${flippedIndices.includes(3) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(3) }}
                    >
                        <div className={styles.cornerDeco} style={{ top: 15, right: 15 }}>✦</div>
                        <div className={styles.pageContent}>
                            <div className={styles.contentWrapper}>
                                {apologyState === 'start' && (
                                    <>
                                        <img src={catFlowerImg} alt="Cute apology cat" />
                                        <div className={styles.apologyText}>please accept my flower of apology</div>
                                        <div className={styles.btnGroup}>
                                            <button className={`${styles.actionBtn} ${styles.btnAccept}`} onClick={handleAccept}>Accept</button>
                                            <button className={`${styles.actionBtn} ${styles.btnReject}`} onClick={handleReject}>Reject</button>
                                        </div>
                                    </>
                                )}
                                {apologyState === 'rejected' && (
                                    <>
                                        <img src={angryImg} alt="How dare you" />
                                        <div className={styles.angryText}>How dare you !!</div>
                                        <button className={`${styles.actionBtn} ${styles.btnBack}`} onClick={handleReset}>Back</button>
                                    </>
                                )}
                                {apologyState === 'accepted' && (
                                    <>
                                        <img src={thankYouImg} alt="Thank You" />
                                        <div className={styles.apologyText}>Thank Youuu..! Pirachiii❤️</div>
                                        <button className={`${styles.actionBtn} ${styles.btnBack}`} onClick={handleReset}>Back</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Page 2: My Mistake (Index 2) */}
                    <div
                        className={`${styles.page} ${flippedIndices.includes(2) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(2) }}
                        onClick={() => !flippedIndices.includes(2) && flipNext()}
                    >
                        <div className={styles.cornerDeco} style={{ top: 15, right: 15 }}>✦</div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>My Mistake</div>
                            <p>I know I messed up. Or mujhe bohot bohot ajeeb lag rha tabhi se. The moment I tried to stop you, and I can't. or bs fir tumne bol to diya ki <em>"Koi baat nhi overflow ho jaati h kabhi kabhi"</em></p>
                            <p><em>Lekin me janta hu you are Deeply HURT and i can feel it, somehow.</em></p>
                            <div className={styles.highlight}>Wo dairy bhi mene tab hi likhi thi taaki me tumhe relaxed feel kara saku, lekin mene ye socha hi nhi tha ki usme mene aise words likh diye mene ki tumhe ajeeb lagne lagega.</div>
                            <p>I rarely engage with people, haan bolne ke liye mere pass truck bhar ke dost h. Female friends h. Reality is I just don't want to deal with people. Or jinke saath accha bond hota h dar to lagta h tootne se.</p>
                            <div className={styles.highlight}>Ha ye sach h me kisi se itni maafi nhi mangta. Kyuki mujhe nhi padta farak kon ruk raha kon nhiii, lekin in your case it is important. Because i don't wanna ruin what we've built. And that's why I'm always scared.</div>
                            <p>Flirt to me karunga ab bhiii... shyd kabhi kabhi soch samajh ke..</p>
                        </div>
                    </div>

                    {/* Page 1: Please Till End (Index 1) */}
                    <div
                        className={`${styles.page} ${flippedIndices.includes(1) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(1) }}
                        onClick={() => !flippedIndices.includes(1) && flipNext()}
                    >
                        <div className={styles.cornerDeco} style={{ top: 15, right: 15 }}>✦</div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>Please Till End</div>
                            <p>Sometimes, silence speaks louder than words, and I don't know mujhe bohot uneasy feel ho rha tha jabse tumne wo dairy dekhi or fir tumne wo sentence bola ki "koi itna pyaar me kasie gir sakta h, us moment mujhe itna bhayankar dar laga ki me kya batau.", Dekho me janta hu tum ye expect nhi kar rhi hogi, bohot bura laga hoga. Jab mene wo likha tha tab me adha to neend me koi nashedi jaise jhool rha tha😂🦥</p>
                            <div className={styles.highlight}>"Pilizzzz Pilizzzz Pirachiii"</div>
                            <p>I value our bond more than anything else. I want to clear the air, not because I want to win an argument, but because I don't want to lose you too....</p>
                            <p>Please take your time to read these pages. They contain my honest thoughts.</p>
                        </div>
                    </div>

                    {/* Cover Page (Index 0) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flippedIndices.includes(0) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(0) }}
                        onClick={() => !flippedIndices.includes(0) && flipNext()}
                    >
                        <div className={styles.coverBorder}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px', color: '#aaa' }}>☾</div>
                            <div className={styles.coverTitle}>Sincere<br />Apologies</div>
                            <div className={styles.coverSubtitle}>Straight from the Heart</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Touch Zones */}
            <div className={`${styles.touchZone} ${styles.touchLeft}`} onClick={flipPrev} />
            <div className={`${styles.touchZone} ${styles.touchRight}`} onClick={flipNext} />

            {/* Music Player */}
            <div className={styles.musicPlayer} onClick={toggleMusic}>
                <button className={styles.musicBtn}>{isPlaying ? '⏸' : '▶'}</button>
            </div>
        </div>
    );
};

export default ApologyDairy;
