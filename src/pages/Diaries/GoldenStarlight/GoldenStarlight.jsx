import React, { useState, useEffect, useRef } from 'react';
import styles from './GoldenStarlight.module.css';
import BackButton from '../../../components/BackButton/BackButton';

const GoldenStarlight = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [particles, setParticles] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Total pages: Cover + 5 Content Pages + Back Cover = 7?
    // Let's count from HTML content:
    // Cover, Page 1 to 5, Back Cover. Total 7 pages (0-6)
    const totalPages = 7;

    useEffect(() => {
        const p = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            isSparkle: Math.random() > 0.7,
            size: Math.random() * 6 + 2,
            left: Math.random() * 100,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5
        }));
        setParticles(p);
    }, []);

    const startDiary = () => {
        setIsIntroVisible(false);
        setTimeout(() => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            }
        }, 800);
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const flipNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    const flipPrev = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const getZIndex = (index) => index < currentPage ? 50 + index : totalPages - index;
    const isFlipped = (index) => index < currentPage;

    return (
        <div className={styles.diaryWrapper}>
            <BackButton />
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
                    ></div>
                ))}
            </div>

            {/* Intro */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.fade : ''}`}>
                <h1 className={styles.introText}>Lavender Dream</h1>
                <button className={styles.introBtn} onClick={startDiary}>Open Diary</button>
            </div>

            {/* Notebook */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.spiral}>
                    {[...Array(12)].map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>
                    {/* Cover (Page 0) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(0) }} onClick={() => currentPage === 0 && flipNext()}>
                        <div className={styles.coverFrame}>
                            <div className={styles.coverTitle}>Prachiii</div>
                            <div style={{ fontFamily: 'Montserrat', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '10px', color: '#F0E68C' }}>
                                SATURDAY, 18 JAN
                            </div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(1) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Dearest Prachiii</div>
                            <p>Hey, there billu bilote. Do you know how hard it is, not to text you 🦥. Yeah... snapchat bohot accha tha, me aaram se text kar leta tha. But on Telegram... When I want to text you, I stop typing and think.. ki shyd wo padhne aayegi or mere text ko dekh ke distract ho jayegi yr🙂</p>
                            <p>Sometimes I send message and delete it the next minute after sending it... 😅</p>
                            <p>Kyki mujhe aisa lagta h ki shyd usne mere chakkar me delete kara ho/ ki shyd me bhool jaun... dheeme dheeme, wo feeling weak ho jaaye or mujhe jyda takleef na ho..!!</p>
                            <p>Fir mene pooch hi liya tha lastly, ki kya baat h..?? we talked and you said ki pahle se decided tha ki birthday pe karungiii.. are batana to tha pgl 🦥🦥</p>
                            <div className={styles.highlightBox}>"Pata nhi mujhe aisa kyun lagta h, tum mere baare me chanchal se baat karti ho to meri WHATT.. lag jaati h..!!"</div>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(2) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Just For You</div>
                            <p>Ummmmmmmmmmmmmm...... shyd mene sachme jyada kar diya yrrrr 🙃. Wo wishes, wo dairy, wo game, or last me wo mock test.</p>
                            <p>Shyd tumhe firse wo feeling aai ho.. or tum dar gai ho../ ajeeb lagne laga ho.. or tumne achanak se delete maar diya ho.. (jaise last time dar ke remove kar diya tha mujhe🙃🙂) kyuki shyd agar tummm... mere se bolti to me manta nhii... or me fir convince kar leta hamesha ki tarah ya aur kuch karta.. </p>
                            <div className={styles.highlightBox}>"Lekin radhika ko mene wo ferry wali design se wish kara, wo to khush ho gai..!!"</div>
                            <p>Tumhe pata h mene next day text kara tha poochne ke liye ki radhika ko konsi bheju.. wait kiya.. lekin tumne delete kar diya tha snapchat, lekin tumne wo dairy or mock test save kar liya tha.. me wait kar rha tha aur....</p>
                            <p>Therefore I thought, maybe it was because of me...</p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(3) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>My Message</div>
                            <p>I'm not sure what to say exactly today, but I know that I want you to feel appreciated. Every single day.</p>
                            <div className={styles.highlightBox}>Remember to smile. It suits you perfectly.</div>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div className={`${styles.page} ${isFlipped(4) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(4) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>My Message</div>
                            <p>Today I am ready to accept that it was not just liking. <em> It was something more than that...</em> And the only reason why I was not ready to accept it is because I was not ready to loose you..</p>
                            <p>But for people like me<em> it is hard to move on (Because I never faked anything, My intentions were Damn pure, and only I know what are those things that I've burnt for you.)</em> It is not because I never tried, it is whenever I see any girl in spectacles, mujhe lagta h ye prachi hi h..!! for some seconds. Or ye tabki baat h jab wo prachi shrama wala scene hua tha.</p>
                            <p>I know that I can't keep this up forever... Lekin jitna ho sake keech rha tha me. One More moment, actually good moment, or shyd me zabardasti keech rha tha.</p>
                            <p>I never gave privalages to someone like this, but I did to you. </p>
                            <p><em>I am still thinking ki shyd firse mood-swings ho. Lekin shraddha or anukriti ke bhi hote h, wo log nhi karte aise.</em> Ab ye mera ghatiya dimag suggest kar rha h ki "Har insaan same nhi hota, kisi kisi ko jyada chid-chid hoti h. You cannot understand because you're a boy..!!"</p>
                        </div>
                    </div>

                    {/* Page 5 */}
                    <div className={`${styles.page} ${isFlipped(5) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(5) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Conclusion</div>
                            <p>If you are mad because I unfollowed you on insta. WO isiliye kyuki mene tumse samne se bola tha or shyd me tumhari privacy invade kar rha tha, to mene unfollow kar diya tha. Or tumne bhi follow back nhi kiya to highlighted lag rha tha.</p>
                            <div className={styles.highlightBox}>The CURSE of knowing the answer but not ready to accept it..!!</div>
                            <div className={styles.highlightBox}>I wish tumko kabhi aisa kuch feel hi na ho, aur agar ho to ladka genuinely accha ho..!! Becaue It offers you a physical pain that cannot be controlled..!!</div>
                            <p>I think this time i'm going to end this chapter..!! The Old me was much better who dosen't cared about anything, and anyone.</p>
                            <p><em>Maybe You'll never read this... ya padhogi jab to kaafi time baad</em></p>
                        </div>
                    </div>

                    {/* Back Cover (Page 6) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(6) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(6) }}>
                        <div className={styles.coverFrame}>
                            <div className={styles.coverTitle} style={{ fontSize: '2.5rem' }}>Sweet Dreams</div>
                            <div style={{ fontFamily: 'Montserrat', letterSpacing: '1px', fontSize: '0.7rem', color: '#F0E68C', marginTop: '20px' }}>
                                UNTIL IDK WHEN
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.helperText}>Tap Sides to Flip</div>
            </div>

            {/* Controls */}
            {!isIntroVisible && (
                <>
                    <div className={`${styles.touchZone} ${styles.zoneLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.touchZone} ${styles.zoneRight}`} onClick={flipNext}></div>
                    <div className={styles.musicToggle} onClick={toggleMusic}>
                        <span style={{ fontSize: '1.5rem' }}>{isPlaying ? '⏸' : '🎵'}</span>
                    </div>
                </>
            )}
            <audio ref={audioRef} loop src="/assets/diaries/golden-starlight/background.mp3" />
        </div>
    );
};

export default GoldenStarlight;
