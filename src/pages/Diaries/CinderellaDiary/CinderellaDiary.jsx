import React, { useState, useEffect, useRef } from 'react';
import styles from './CinderellaDiary.module.css';

const rapunzelAngry = '/assets/golbalgifs/rapunzel.gif';
const tie = '/assets/golbalgifs/not-tie.gif';
const rapunzelOuch = '/assets/golbalgifs/frying-pan-ouch.gif';
const rapunzelYay = '/assets/golbalgifs/magic.gif';
const rapunzelSurprised = '/assets/golbalgifs/cinderella.gif';
const cuteFlower = '/assets/golbalgifs/flower.gif';
const magic_cyndrella = '/assets/golbalgifs/magic_cyndrella.gif';
const cuteVideo = '/assets/golbalgifs/cute.mp4';

const CinderellaDiary = () => {
    const [isMobile] = useState(() => {
        try { return typeof window !== 'undefined' && window.innerWidth < 768; }
        catch { return false; }
    });

    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [introReady, setIntroReady] = useState(false);
    const [introFading, setIntroFading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [turning, setTurning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [checklist, setChecklist] = useState({ fighting: false, hiding: true });

    useEffect(() => {
        const t = setTimeout(() => setIntroReady(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
    }, []);

    const TOTAL = 13;

    const openDiary = () => {
        setIntroFading(true);
        setTimeout(() => {
            setIsIntroVisible(false);
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            }
        }, 1000);
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => { });
        setIsPlaying(p => !p);
    };

    const goNext = () => {
        if (currentPage < TOTAL - 1 && !turning) {
            setTurning(true);
            setCurrentPage(p => p + 1);
            setTimeout(() => setTurning(false), 950);
        }
    };
    
    const goPrev = () => {
        if (currentPage > 0 && !turning) {
            setTurning(true);
            setCurrentPage(p => p - 1);
            setTimeout(() => setTurning(false), 950);
        }
    };

    const FlirtyReveal = ({ question, answer, buttonText = "[ TAP TO REVEAL ]" }) => {
        const [isRevealed, setIsRevealed] = useState(false);

        return (
            <div className={styles.secretNote}>
                <div className={styles.secretTape}></div>
                <p className={styles.handWritten} style={{ fontSize: '1.7rem', margin: 0 }}>
                    {question}
                </p>
                {!isRevealed ? (
                    <button 
                        className={styles.tapeRevealBtn} 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsRevealed(true);
                        }}
                    >
                        {buttonText}
                    </button>
                ) : (
                    <p className={`${styles.handWritten} ${styles.revealedText}`}>
                        {answer}
                    </p>
                )}
            </div>
        );
    };

    const zIdx = i => (i < currentPage ? 50 + i : TOTAL - i);
    const flipped = i => i < currentPage;
    const progress = (currentPage / (TOTAL - 1)) * 100;

    const pageLabel =
        currentPage === 0 ? 'Tap the cover to open 🥿' :
            currentPage === TOTAL - 1 ? 'Happily Ever After ✨' :
                `${currentPage} / ${TOTAL - 2}  ·  tap sides to turn`;

    return (
        <div className={styles.wrap}>
            <div className={styles.fairyDustContainer}>
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={styles.fairyDust} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 5}s`
                    }}></div>
                ))}
            </div>
            <div className={styles.bgSpotlight} />
            <div className={styles.bgDecorClip1}>📎</div>
            <div className={styles.bgDecorClip2}>📎</div>

            {isIntroVisible && (
                <div className={`${styles.intro} ${introReady ? styles.introIn : ''} ${introFading ? styles.introOut : ''}`}>
                    <p className={styles.introEye}>BEFORE MIDNIGHT</p>
                    <h1 className={styles.introTitle}>GLASS SLIPPER</h1>
                    <p className={styles.introSub}>Even a miracle takes a little time.</p>
                    <button className={`${styles.clayBtn} ${styles.introBtn}`} onClick={openDiary}>
                        <span>🥿</span> Open The Diary
                    </button>
                </div>
            )}

            <div className={`${styles.book} ${isIntroVisible ? styles.bookHidden : ''}`}>
                <div className={styles.spiral} aria-hidden="true">
                    {Array.from({ length: 14 }).map((_, i) => <div key={i} className={styles.ring} />)}
                </div>
                <div className={styles.progBar}>
                    <div className={styles.progFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.pages}>
                    {/* PAGE 0 */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(0) }}
                        onClick={() => currentPage === 0 && goNext()}
                    >
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '25%' }}>🥿</div>
                        <div className={styles.coverInner}>
                            <h1 className={styles.cTitle}>GLASS<br/>SLIPPER<br/>DIARY</h1>
                            <div className={`${styles.cMatch} ${styles.sticker}`}>🐾</div>
                            <div className={styles.cSub}></div>
                        </div>
                    </div>

                    {/* PAGE 1 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${styles.leftBorder} ${flipped(1) ? styles.flipped : ''}`} style={{ zIndex: zIdx(1) }}>
                        <img src="/assets/glass_slipper_cutout.jpg" alt="Slipper" className={styles.cutoutImage} style={{bottom: '10px', right: '10px', width: '130px', height: '130px', transform: 'rotate(-10deg)'}} />
                        <div className={styles.content}>
                            <h2 className={styles.mainTitle}>CASE 01:<br/>THE PRINCESS</h2>
                            <div className={`${styles.cMatchLeft} ${styles.sticker}`}>🖋️</div>
                            
                            <div className={styles.itemBox}>
                                <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                   Ye tumne tab padhli jab ye incomplete thiii... additions deletions hone the, isiliye me ise hata raha hu ma'am.
                                </p>
                                <p className={styles.handWritten} style={{marginTop: '1rem'}}>
                                    ................................. 
                                </p>
                                <div className={styles.elegantQuote} style={{marginTop: '1.5rem'}}>
                                    .............................................
                                </div>

                                <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelSurprised} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        .............................................
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{marginTop: '3rem', position: 'relative'}}>
                                ..
                            </div>
                        </div>
                    </div>

                    {/* PAGE 2 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(2) ? styles.flipped : ''}`} style={{ zIndex: zIdx(2) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '40%' }}>🏰</div>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 02</div>
                                <div className={styles.content}>
                                    <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>THE DISAPPEARING ACT 🕛</h2>
                                    <FlirtyReveal 
                                        question="Par ek cheez jo sabse zyada match karti hai..." 
                                        answer="Tumhara achanak se gayab ho jana! 🏃‍♀️💨" 
                                        buttonText="[ TAP TO REVEAL ]" 
                                    />
                                    <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                        ... 
                                    </p>
                                </div>
                        </div>
                    </div>

                    {/* PAGE 3 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${styles.leftBorder} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 03</div>
                             <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>LEAVING THE SLIPPER 🥿</h2>
                            <div className={styles.polaroidContainer}>
                                <div className={styles.pin}></div>
                                <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                <div className={styles.mediaWrapper}>
                                    <video src={cuteVideo} controls className={styles.polaroidMedia} />
                                </div>
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeMidnight}`}>
                                🌸
                            </div>
                        </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                ......</p>
                            <div style={{marginTop: '2.5rem', textAlign: 'center'}}>
                                <span className={styles.scrapbookCutout}>BINA BATAYE</span>
                                <span className={styles.scrapbookCutout}>No Reason</span>
                                <span className={styles.scrapbookCutout}>No</span>
                                <span className={styles.scrapbookCutout}>EXPLANATION</span>
                            </div>
                            
                        </div>
                    </div>

                    {/* PAGE 4 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(4) ? styles.flipped : ''}`} style={{ zIndex: zIdx(4) }}>
                        <img src="/assets/pumpkin_carriage_cutout.jpg" alt="Carriage" className={styles.cutoutImage} style={{top: '20px', right: '20px', width: '150px', height: '150px', transform: 'rotate(5deg)'}} />
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 04</div>
                             <div className={styles.chargesSection} style={{marginTop: '3rem'}}>
                                <h3 className={styles.chargesTitle}>THE REAL ISSUE:</h3>
                                <ul className={styles.checklist}>
                                    <li onClick={(e) => { e.stopPropagation(); setChecklist(p => ({...p, fighting: !p.fighting})); }}>
                                        <span className={`${styles.checkbox} ${styles.checkboxInteractive} ${checklist.fighting ? styles.checkedBox : ''}`}>
                                            {checklist.fighting ? '✔' : '✖'}
                                        </span> Fighting
                                    </li>
                                    <li onClick={(e) => { e.stopPropagation(); setChecklist(p => ({...p, hiding: !p.hiding})); }}>
                                        <span className={`${styles.checkbox} ${styles.checkboxInteractive} ${checklist.hiding ? styles.checkedBox : ''}`}>
                                            {checklist.hiding ? '✔' : '✖'}
                                        </span> HIDING YOUR EMOTIONS
                                    </li>
                                </ul>
                            </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                ............
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>..................</p>
                            <p className={styles.handWritten} style={{marginTop: '1rem'}}>...</p>
                        </div>
                    </div>

                    {/* PAGE 5 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${styles.leftBorder} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>Point to be noted 🛫 </h2>
                            <div className={styles.glassyBox}>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '0.2s'}}>
                                    ....... 
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s'}}>
                                    .....
                                </p>
                                <ul className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s', fontWeight: 'bold', margin: '0.5rem 0 0.5rem 2rem'}}>
                                    <li>...</li>
                                    <li>...</li>
                                    <li>.....</li>
                                </ul>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s'}}>
                                    ..........
                                </p>
                                <div className={`${styles.neonText} ${styles.magicalFadeIn}`} style={{animationDelay: '2.2s'}}>
                                    ...........
                                </div>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '3.2s'}}>
                                    .....
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '4.2s'}}>
                                    ......
                                </p>
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '3rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                ,.....
                            </div>
                        </div>
                    </div>

                    {/* PAGE 6 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(6) ? styles.flipped : ''}`} style={{ zIndex: zIdx(6) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '65%' }}>🕰️</div>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 06</div>
                            
                            <div className={styles.glassyBox}>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    ...
                                </p>
                                <ul className={styles.handWritten} style={{fontWeight: '900', fontSize: '1.2rem', paddingLeft: '2rem', textAlign: 'left', width: 'fit-content', margin: '0 auto'}}>
                                    <li>..</li>
                                    <li>...</li>
                                </ul>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem', marginTop: '0.5rem'}}>
                                    ......
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    .
                                </p>
                                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                                    <span className={styles.bouncingEmoji}>🎃</span>
                                    <span className={styles.bouncingEmoji} style={{animationDelay: '1s'}}>✨</span>
                                </div>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    .....
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    .....
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 7 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${styles.leftBorder} ${flipped(7) ? styles.flipped : ''}`} style={{ zIndex: zIdx(7) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 07</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>WHAT ACTUALLY HURTS 🌧️</h2>
                            <p className={styles.handWritten}>
                                ...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                .
                            </p>
                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={magic_cyndrella} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeMidnight}`}>
                                        ......
                                    </div>
                            </div>
                            <div className={styles.doodlesLeft} style={{bottom: '1rem'}}>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 8 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(8) ? styles.flipped : ''}`} style={{ zIndex: zIdx(8) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 08</div>
                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelYay} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        .....
                                    </div>
                                </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem', textAlign: 'center'}}>
                                .  
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', textAlign: 'center'}}>
                                .... 
                            </p>
                        </div>
                    </div>

                    {/* PAGE 9 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${styles.leftBorder} ${flipped(9) ? styles.flipped : ''}`} style={{ zIndex: zIdx(9) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 09</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>.......</h2>
                            
                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={cuteFlower} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Ye lo phool?"
                                    </div>
                                </div>

                            <p className={styles.handWritten}>
                                .... 
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '4rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                ....
                            </div>
                            <div className={styles.glassyBox} style={{marginTop: '3rem', transform: 'rotate(1deg)', padding: '1.2rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', border: '2px dashed #bbaacc'}}>
                                <p className={styles.handWritten} style={{fontSize: '1.05rem', lineHeight: '1.5', margin: 0}}>
                                    ....
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 10 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(10) ? styles.flipped : ''}`} style={{ zIndex: zIdx(10) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '75%' }}>🌟</div>
                        <div className={styles.content}>
                            <h2 className={styles.mainTitle} style={{textAlign: 'center', marginTop: '1rem'}}>BEFORE MIDNIGHT...</h2>
                            <div className={styles.chargesSection}>
                                <ul className={styles.checklist}>
                                    <li><span className={styles.checkbox}>1</span> .</li>
                                    <li><span className={styles.checkbox}>2</span> .</li>
                                    <li><span className={styles.checkbox}>3</span> .</li>
                                </ul>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2rem'}}>
                                <div className={styles.clayPill}>🚫 No Hiding</div>
                                <div className={styles.clayPill}>💛 Stay You</div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 11 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${styles.leftBorder} ${flipped(11) ? styles.flipped : ''}`} style={{ zIndex: zIdx(11) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 11</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>ONE LAST THING 🌸</h2>
                            
                            <div style={{marginTop: '1.5rem', textAlign: 'left', padding: '0 10px'}}>
                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .... 
                                </p>
                                
                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    ....
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                        ..
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    ....
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    ....
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                        .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    !!!
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>
                                
                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    .
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                                    ...
                                </p>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '3rem'}}>
                                ... ✨
                            </div>
                        </div>
                    </div>

                    {/* PAGE 12 */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(12) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(12) }}
                    >
                        <div className={styles.coverInner}>
                            <h1 className={styles.cTitle} style={{fontSize: '2.5rem', letterSpacing: '2px'}}>TAKE CARE</h1>
                            <p className={styles.cSub} style={{marginTop: '2rem', color: '#1e3a8a', textShadow: 'none', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: 'bold'}}>
                                I work with algorithms that can predict almost anything.<br/><br/>
                                Par tum?<br/>
                                Tum meri sabse beautiful,<br/>unpredictable exception ho.
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeMidnight}`} style={{position: 'relative', bottom: '-30px'}}>
                                STAY SAFE.
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', bottom: '-30px'}}>
                                MY FAVORITE ANOMALY ✨
                            </div>
                            <p className={styles.handWritten} style={{fontSize: '1rem', color: '#333', marginTop: '70px', opacity: 0.9, fontWeight: 'bold'}}>
                                ...and maybe now, Deepak should end his feelings for everyone.
                            </p>
                        </div>
                    </div>

                </div>{/* /pages */}
                <div className={styles.hint}>{pageLabel}</div>
            </div>{/* /book */}

            {!isIntroVisible && (
                <>
                    <div className={`${styles.zone} ${styles.zL}`} onClick={goPrev} />
                    <div className={`${styles.zone} ${styles.zR}`} onClick={goNext} />
                    <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arL}`} onClick={goPrev} disabled={currentPage === 0}>‹</button>
                    <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arR}`} onClick={goNext} disabled={currentPage === TOTAL - 1}>›</button>
                    <button className={`${styles.clayBtn} ${styles.musicBtn}`} onClick={toggleMusic}>
                        <span>{isPlaying ? '⏸' : '🎵'}</span>
                    </button>
                </>
            )}
            <audio ref={audioRef} loop src="" />
        </div>
    );
};

export default CinderellaDiary;
