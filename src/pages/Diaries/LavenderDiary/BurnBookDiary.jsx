import React, { useState, useEffect, useRef } from 'react';
import styles from './BurnBookDiary.module.css';

const rapunzelAngry = '/assets/golbalgifs/rapunzel.gif';
const tie = '/assets/golbalgifs/not-tie.gif';
const rapunzelOuch = '/assets/golbalgifs/frying-pan-ouch.gif';
const rapunzelYay = '/assets/golbalgifs/tangled-rapunzel.gif';
const rapunzelSurprised = '/assets/golbalgifs/rapunzel-tangled.gif';
const cuteFlower = '/assets/golbalgifs/flower.gif';
const cuteGif = '/assets/golbalgifs/hm.gif';

const cuteVideo = '/assets/golbalgifs/cute.mp4';

const BurnBookDiary = () => {
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

    useEffect(() => {
        const t = setTimeout(() => setIntroReady(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
    }, []);

    const TOTAL = 12; // Cover (0) + 10 Inner Pages (1-10) + Back Cover (11)

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
            {/* Top Tape Graphic */}
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
                    {answer} 🙈
                </p>
            )}
        </div>
    );
};







    const zIdx = i => (i < currentPage ? 50 + i : TOTAL - i);
    const flipped = i => i < currentPage;
    const progress = (currentPage / (TOTAL - 1)) * 100;

    const pageLabel =
        currentPage === 0 ? 'Tap the cover to open ☠️' :
            currentPage === TOTAL - 1 ? 'End of the Blacklist' :
                `${currentPage} / ${TOTAL - 2}  ·  tap sides to turn`;

    return (
        <div className={styles.wrap}>
            
            <div className={styles.bgSpotlight} />
            <div className={styles.bgDecorClip1}>📎</div>
            <div className={styles.bgDecorClip2}>📎</div>

            {/* INTRO SCREEN */}
            {isIntroVisible && (
                <div className={`${styles.intro} ${introReady ? styles.introIn : ''} ${introFading ? styles.introOut : ''}`}>
                    <p className={styles.introEye}>A LETTER</p>
                    <h1 className={styles.introTitle}>THE BURN BOOK</h1>
                    <p className={styles.introSub}>unfiltered thoughts & genuine care.</p>
                    <button className={`${styles.clayBtn} ${styles.introBtn}`} onClick={openDiary}>
                        <span>🔥</span> Open My Complaints
                    </button>
                </div>
            )}

            {/* BOOK WRAPPER */}
            <div className={`${styles.book} ${isIntroVisible ? styles.bookHidden : ''}`}>

                {/* SPIRAL BINDING */}
                <div className={styles.spiral} aria-hidden="true">
                    {Array.from({ length: 14 }).map((_, i) => <div key={i} className={styles.ring} />)}
                </div>

                {/* PROGRESS BAR */}
                <div className={styles.progBar}>
                    <div className={styles.progFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.pages}>

                    {/* ── PAGE 0: FRONT COVER ── */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(0) }}
                        onClick={() => currentPage === 0 && goNext()}
                    >
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '25%' }}>🖤</div>
                        <div className={styles.coverInner}>
                            <h1 className={styles.cTitle}>THE<br/>BURN<br/>BOOK</h1>
                            <div className={`${styles.cMatch} ${styles.sticker}`}>🖍️</div>
                            <div className={styles.cSub}>FOR YOU: THE BEST GIRL<br/>(Highly Classified)</div>
                        </div>
                    </div>

                    {/* ── PAGE 1: LEFT (The Fear) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(1) ? styles.flipped : ''}`} style={{ zIndex: zIdx(1) }}>
                        <div className={styles.content}>
                            <h2 className={styles.mainTitle}>CASE 01:<br/>HEY THERE</h2>
                            <div className={`${styles.cMatchLeft} ${styles.sticker}`}>✏️</div>
                            
                            <div className={styles.itemBox}>
                                <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                    Heyyyyyyyyy bhagwannnnnnn..... ye kya bana diya aapneee... heinnnnn.... aapki kalakaari ka to me fan ban gaya.... Itni adorable, itni cute, itni sweet itni spicy...  Itni smart or itni stupid...... Itni Gussail or itni caring...... Itni funny or itni serious..... itni nakchadi or itni pyriii... Cashmish hai lekin sab dekh leti hai...— <span className={styles.underline}> Ladki hai ya mixture namkeen</span>
                                </p>
                                <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                    Are kuch to chhor dete 🫣 koi ek ad cheez 🫣, are bolne ko hai kamiyaan.... chhoti chhoti cute cute kamiyaan... lekin itni major thodi hain.
                                </p>

                                <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelAngry} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Mujhe tum for a reason Rupanzel lagti ho.... turn to know more."
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom}`} style={{marginTop: '3rem', position: 'relative'}}>
                                NEEDED CLARITY.
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 2: RIGHT (The Silence) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(2) ? styles.flipped : ''}`} style={{ zIndex: zIdx(2) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '40%' }}>🥀</div>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 02</div>



                            {/* ── PAGE 3: LEFT (Little Things) ke andar ── */}
                            <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                                <div className={styles.content}>
                                    <div className={styles.caseNo}>PG. 03</div>
                                    <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>LITTLE THINGS 🍃</h2>
         
                                {/* YAHAN DAAL DIYA FLIRTY REVEAL */}
                                    <FlirtyReveal 
                                        question="Vese ek baat batao... Mombatti🕯️ ko Englidh me kya kehte hain?" 
                                        answer="Tum Kaise Karti ho itni sundarta Handle..." 
                                        buttonText="[ Candle ]" 
                                    />

                                    <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                        Tummmm Rupanzel se km nhi, Rupanzel Once Said... "Who are you, and how did you find me.", Tumne bhi prachi sharma se yahi style me bola tha... "Tum kaun ho, me tumhe yaha kaise mili? tum mujhe message kyun kar rhi ho, deepak ki dost? Collage Friend??" Same style hai... Or tum Rupanzel jaisi badmash bhi ho, cute bhi or saath hi saath samajhdaar bhi.. 
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* ── PAGE 3: LEFT (Little Things) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 03</div>
                             <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>LITTLE THINGS 🍃</h2>



                             {/* ── KISI BHI PAGE PAR POLAROID KE ANDAR ── */}
                            <div className={styles.polaroidContainer}>
                                <div className={styles.pin}></div>
                                <div className={styles.polaroid}>
                                {/* Image Placeholder ko hata kar ye Video code daalo */}
                                <div className={styles.mediaWrapper}>
                                    <video 
                                    src={cuteVideo} 
                                    controls
                                                                  
                                    className={styles.polaroidMedia} 
                                    />
                                </div>
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                Taking Away Negatives 🌸
                            </div>
                        </div>
                             
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                Udas nhi raha karo.....<br/> Dant Fatkaar Diya karo...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                Chup Reh kar overthink mat karo...
                            </p>
                            <div className={styles.headerBox} style={{padding: '1rem', marginTop: '3rem'}}>
                                <h2 className={styles.acneTitle} style={{fontSize: '2rem'}}>Maje Le Liya Karo</h2>
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 4: RIGHT (The Ambiguity) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(4) ? styles.flipped : ''}`} style={{ zIndex: zIdx(4) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 04</div>
                             
                             <div className={styles.chargesSection} style={{marginTop: '3rem'}}>
                                <h3 className={styles.chargesTitle}>THE REAL ISSUE:</h3>
                                <ul className={styles.checklist}>
                                    <li><span className={styles.checkbox}>✖</span> Yours/Mine</li>
                                    <li><span className={styles.checkbox}>✔</span> AMBIGUITY</li>
                                </ul>
                            </div>

                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                Tum Bs Meri Baaton se pareshan mt hua karo, me kabhi tumko bura nhi keh sakta. Tummmmm bohot acchi ho.
                            </p>
                            <div className={styles.doodlesLeft} style={{bottom: '3rem'}}>
                                <span className={styles.sticker} style={{fontSize: '3rem'}}>🌪️</span>
                                <span className={styles.sticker} style={{fontSize: '3rem', transform: 'rotate(15deg)'}}>🎀</span>
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 5: LEFT (Everything I Built) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>EVERYTHING<br/>I BUILT 🛠️</h2>
                            <p className={styles.handWritten}>
                                Jo Banata hu Wo bs Apne Badmosh ke  <span className={styles.underline}>liye</span> bhool jao wo impress mimpress wali baat.
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom}`} style={{position: 'relative', marginTop: '3rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                80% CARE, 20% IMPRESS
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 6: RIGHT (The Projects) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(6) ? styles.flipped : ''}`} style={{ zIndex: zIdx(6) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '65%' }}>💻</div>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 06</div>
                            <div className={styles.chargesSection} style={{marginTop: '3rem', background: 'transparent'}}>
                                <h3 className={styles.chargesTitle}>THE EFFORTS:</h3>
                                <ul className={styles.checklist}>
                                    <li><span className={styles.checkbox}>✔</span> <b>PrachiVerse:</b> To store everything</li>
                                    <li><span className={styles.checkbox}>✔</span> <b>Prachify:</b> No ads, no distractions</li>
                                    <li><span className={styles.checkbox}>✔</span> <b>Diaries:</b> Comm. solution</li>
                                    <li><span className={styles.checkbox}>✔</span> <b>Games:</b> To make you feel pampered</li>
                                    <li><span className={styles.checkbox}>✔</span> <b>Baaki sab:</b> Kisi na kisi Porblem ka sol.</li>
                                </ul>
                            </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem', textAlign: 'center', fontWeight: '900'}}>
                                Everything For a reason, diary ka to aisa hai ki ite lambe paragraph dekh ke mn hi nhi hota dekhne ka, lekin presentation acchi ho to kharab dish bhi worth tasting bn jaati hai.                            </p>

                            <p className={styles.handWritten} style={{marginTop: '2rem', textAlign: 'center', fontWeight: '900'}}>
                                Waise wo music app bina install kare bhi chal jayega,<br/>website ki tarah bhi chalega or app jaise bhi chalega.<br/>Or us se kuch hack vack nhi hoga 😂👾. Me new new features daalta rehta hu usme. OR mene extra songs bhi add kar diye the. Spotify me 128kbps quality milegi, isme 320kbps. Or waise me aisi kaam ki cheezen banata rahunga🤨 tumse thodi poochunga.
                            </p>
                        </div>

                    </div>

                    {/* ── PAGE 7: LEFT (What Actually Hurt) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(7) ? styles.flipped : ''}`} style={{ zIndex: zIdx(7) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 07</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>WHAT ACTUALLY HURT 🌧️</h2>
                            <p className={styles.handWritten}>
                                Jab bhi tumse serious baat karta tha, mere haath-pair kaanpne lagte the. Isiliye diary prefer karta tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                Or jab me gusse me hota hu tab bhi kuch bhi nikal jata h☹️🌵. Or fir tum pareshan ho jaati ho, or wo mujhe accha nhi lagta.
                            </p>

                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={cuteGif} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Aise to nhi karti tum 👾."
                                    </div>
                            </div>





                            <div className={styles.doodlesLeft} style={{bottom: '1rem'}}>
                                <span className={styles.sticker} style={{fontSize: '3rem'}}>🔥</span>
                                <span className={styles.sticker} style={{fontSize: '3rem'}}>😫</span>
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 8: RIGHT (The Curse) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(8) ? styles.flipped : ''}`} style={{ zIndex: zIdx(8) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 08</div>
                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelOuch} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "😏😏."
                                    </div>
                                </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem', textAlign: 'center'}}>
                                Dekh kya rhi ho, tum bhi aisi hi ho. Clumsy- Dumsy. 
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', textAlign: 'center'}}>
                                Waise agar Amazing Hone ka bill aata hota. To tum to Bankrupt ho jate👾🎀.
                            </p>
                        </div>
                    </div>

                    {/* ── PAGE 9: LEFT (Priority) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.leftBorder} ${flipped(9) ? styles.flipped : ''}`} style={{ zIndex: zIdx(9) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 09</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>PRIORITY 🌸</h2>



                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={cuteFlower} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Sorry Flower Tumko Hurt karne ke liye..."
                                    </div>
                                </div>

                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelSurprised} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Aisi Acchi lagti ho..."
                                    </div>
                                </div>

                                <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={styles.polaroid}>
                                    {/* Yahan imagePlaceholder ko hata kar apna GIF lagao */}
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelYay} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Aisi bhi..."
                                    </div>
                                </div>




                            <p className={styles.handWritten}>
                                Asii hasti khelti, idhar udhar fudakti hui, humming bee jaisi.
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom}`} style={{position: 'relative', marginTop: '4rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                YOU ARE ABSOLUTELY AMAZING
                            </div>
                            <p className={styles.handWritten} style={{marginTop: '3rem'}}>
                                Sabse best sabse alag, sabse AMAZING.
                            </p>
                        
                        </div>


                    </div>

                    {/* ── PAGE 10: RIGHT (Teachings) ── */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(10) ? styles.flipped : ''}`} style={{ zIndex: zIdx(10) }}>
                        <div className={`${styles.skullTab} ${styles.clayMolded}`} style={{ top: '75%' }}>🌙</div>
                        <div className={styles.content}>
                            <h2 className={styles.mainTitle} style={{textAlign: 'center', marginTop: '1rem'}}>BEFORE I GO...</h2>
                            <div className={styles.chargesSection}>
                                <ul className={styles.checklist}>
                                    <li><span className={styles.checkbox}>1</span> Taunt mara karo mujhe maza ata h. 🫣wo appreciation jaisa feel hota h mujhe, jaise jethalal maarta h daya ko</li>
                                    <li><span className={styles.checkbox}>2</span> Apni khushi aur wellbeing hamesha pehle.</li>
                                    <li><span className={styles.checkbox}>3</span> Always be proud of yourself.</li>
                                </ul>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2rem'}}>
                                <div className={styles.clayPill}>🚫 Do not Overthink This</div>
                                <div className={styles.clayPill}>🥤 Stay Hydrated & Happy</div>
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 11: BACK COVER ── */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(11) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(11) }}
                    >
                        <div className={styles.coverInner}>
                            <h1 className={styles.cTitle} style={{fontSize: '2.5rem', letterSpacing: '2px'}}>TAKE CARE</h1>
                            <p className={styles.cSub} style={{marginTop: '2rem', color: '#fff', textShadow: 'none'}}>
                                Tumhare andar,<br/>koi kami nhi h.<br/>Sabse best ho tum.
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom}`} style={{position: 'relative', bottom: '-40px'}}>
                                LIL ANGEL MISS...
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom}`} style={{position: 'relative', bottom: '-40px'}}>
                                PERFECTLY IMPERFECT...
                            </div>
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

export default BurnBookDiary;