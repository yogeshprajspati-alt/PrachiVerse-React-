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
                            <div className={styles.cSub}>FOR THE PRINCESS<br/>(Yeah You)</div>
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
                                    Hey Prachi... Kabhi dhyan diya hai ki tum aur Cinderella kitne similar ho? Itni adorable, itni kind, par andar se ekdum fiercely independent.
                                </p>
                                <p className={styles.handWritten} style={{marginTop: '1rem'}}>
                                    Or ek baat, tumhara naam sunke hi ekdum alag feel aata hai... samjho bina matlab ke smile aa jata hai. Control nahi hota bas. 
                                </p>
                                <div className={styles.elegantQuote} style={{marginTop: '1.5rem'}}>
                                    "Kuch shikayatein hain waise princess se meri thodi. Matlab dekho, aise type karne me hi dar lag raha hai... lil complaints."
                                </div>

                                <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelSurprised} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "Literally the best. ✨"
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{marginTop: '3rem', position: 'relative'}}>
                                EKDUM SEEDHI BAAT
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
                                        Cinderella theek 12 baje bhag jati thi kyunki usko lagta tha uska magic khatam ho jayega... Aur tum? Jab bhi tum accha feel nahi karti, tum bhi achanak gayab ho jati ho. Sab se disconnect kar leti ho khud ko. 
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
                                Kahan chali jati ho? 🌸
                            </div>
                        </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>
                                Jab tum aise chup-chaap gayab hoti ho, tab saamne wale ko waisa hi feel hota hai jaise Prince holding the glass slipper... confuse aur pareshan ki tum aakhir gayi kahan, kyun gai, kab aayegi.
                            </p>
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
                                Today this isn't about disappearing, but a lil explanation and request. No trolling, no teasing.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>Dekho I have noticed tum bohot time se bohot jyada changed ho, or kuch bhi bina karan nhi hota.</p>
                            <p className={styles.handWritten} style={{marginTop: '1rem'}}>Small change ya mood shift thode time ke liye samajh aata hai, not for months... kuch-kuch rude bhi rehne lagi ho kuch time se.</p>
                        </div>
                    </div>

                    {/* PAGE 5 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${styles.leftBorder} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>Point to be noted 🛫 </h2>
                            <div className={styles.glassyBox}>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '0.2s'}}>
                                    Point ki baat is, Dekho yr, Chanchal has been really good to me, aur achanak se tumhare behaviour se mujhe lagne laga tha ki kahin koi badi problem toh nahi ho gayi. Main worst case imagine karne laga tha. Shayad mamla utna serious ho bhi na, par it felt like kuch toh karna padega. 
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s'}}>
                                    Or tumne bataya bhi kaafi kam tha... jo starting me bola us se toh laga ki family bohot zyada strict hogi, you said:
                                </p>
                                <ul className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s', fontWeight: 'bold', margin: '0.5rem 0 0.5rem 2rem'}}>
                                    <li>"Ladke toh hai nahi hum ki muh uthaya aur mil liya"</li>
                                    <li>"Unse toh koi kuch kehta nahi hai"</li>
                                    <li>"Nahi hum toh aawara hain"</li>
                                </ul>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s'}}>
                                    ye sab sunke kya hi lagega yr? Tum khud hi socho kya tum meri jagah hoti toh tumko kaise feel hota. Mera darr toh genuine tha na.
                                </p>
                                <div className={`${styles.neonText} ${styles.magicalFadeIn}`} style={{animationDelay: '2.2s'}}>
                                    Listen Princess
                                </div>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '3.2s'}}>
                                    The reason I am using princess notation repeatedly, is just to show that I am putting my points forward with respect.
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '4.2s'}}>
                                    Aur main judge nahi kar raha tha, ek normal insaan jo karta wahi kiya. Chanchal ko ye sab mat batana, aur agar batao toh ye bhi batana ki tumne iske pehle kya context diya tha, taaki fairness rahe (I cannot afford her hate for me, aur aisi cheezon se uska bharosa toot jayega mere upar se).
                                </p>
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '3rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                THINK FROM MY PERESPECTIVE TOO
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
                                    At last you said...
                                </p>
                                <ul className={styles.handWritten} style={{fontWeight: '900', fontSize: '1.2rem', paddingLeft: '2rem', textAlign: 'left', width: 'fit-content', margin: '0 auto'}}>
                                    <li>"Use bohot princess treatment milta hai ghar pe"</li>
                                    <li>"Sabke ghar ki baat alag hoti hai, tumhare ghar par bhi toh tum logon ka mindset alag hai"</li>
                                </ul>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem', marginTop: '0.5rem'}}>
                                    Princess you are a lovely girl. Lekin kabhi kabhi ajeeb lagta hai.
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Prachi I know tum bas meri wo baat ki wajah se hi bol rahi thi kyunki tum hurt ho gayi thi, aur tumhe laga hoga ki tumhari wajah se hai, lekin aisa kuch nahi hai. Main meri marzi se wahan gaya tha. Kyunki tum bohot achhi ladki ho.. aur accha treatment deserve karti ho.
                                </p>
                                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                                    <span className={styles.bouncingEmoji}>🎃</span>
                                    <span className={styles.bouncingEmoji} style={{animationDelay: '1s'}}>✨</span>
                                </div>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Aur wo funding wala word hi maine soch ke bola tha taaki kharab na lage. Mujhe bas bohot zyada chinta ho rahi thi. <br></br><br></br>
                                    Tumne galat samajh liya. I was thinking ki itne saal ho gaye, you still don't notice ki main kabhi aisa kuch nahi sochta jis se Prachi ko bura lage.
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Aur mujhe tumse relationship chahiye bhi nahi tha kabhi (maybe haan agar tum agree karti), bas some affection, understanding, aur bharosa ki Deepak sab kar dega. Aur tumhara trust bhi. <br></br><br></br>
                                    I wanted to give you something better, kuch aisa jo tumhe chubhe na kabhi. I wanted to be your favorite person. Someone you can always trust, and rely on, jahan judgment ka darr naa ho, kyunki main toh tumhari hi side lunga bhale tum kisi ka murder kardo 🤨. Saari cheezen batao ki kya kya hua. Bas itnaa.
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
                                For some recent snaps and aawara wali line for boys, I would like to say... jo ladki un snaps me thi uska accident ho gaya tha. Jin logon ko wo dost bolti thi wo 500m door se bhi uski help karne nahi aaye.<br></br><br></br> She called me and she was crying wagerah wagerah, toh main aur Arindam isiliye gaye the raat ke 12 baje ke aaspass taaki uski dressing ho sake, medicines de sake aur ghar chhod sake. Kyunki ye itni badi city me akele, unsafe toh lagta hai na. Aur koi paas me bhi nahi the, humlog se 28km door thi wo ladki, isiliye bhi itna late ho gaya tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                Aur main raat ko 10 ke baad kahin nahi jata. Jata hu toh kisi aur ke karan (koi dukhi aatma!).<br></br>
                                Moreover, main bhi ghar me mummy ki permission ke bina ghoomne firne nahi jata, despite being this big.
                            </p>
                            <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={magic_cyndrella} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeMidnight}`}>
                                        "Ab ye mt bolna bahar to gaye the bina bataye 👾 Wo kaam ki wajah se."
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
                                        "For that trip."
                                    </div>
                                </div>
                            <p className={styles.handWritten} style={{marginTop: '2rem', textAlign: 'center'}}>
                                Wo Deeksha mere papa ke dost ki beti hai. Wo 2 ladke log uske cousins the, aur ek ladki bhi Deeksha ki dost thi. Wo ladki ka naam Mandvi tha, aur wo man-hater thi.... Isiliye bulaya tha Deeksha ne hum dono ko taaki uska perception change ho jaaye hum dono se milke, jo ho bhi gaya.  
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', textAlign: 'center'}}>
                                And maybe I was not supposed to explain so much, lekin if those things disappointed you, then you should know the details, not the overview by snaps. Wo snaps sabko jaate bhi nahi hain, wo toh bas you, Chanchal, sometimes my sister and Anukriti sometimes... bas. 
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
                                Sorry na Prachiii, dekho ye time accha nahi tha... bohot se logon ke karan main thoda rage me tha toh nikal gaya muh se. I won't say it again.<br></br><br></br>
                                Wo toh bas andar ka bhara hua nikal gaya.<br></br><br></br> 
                                Aur itne dinon se toh tumne snaps bhi band kar diye, maine toh start hi tumhari wajah se kara tha. Toh jab most important insaan hi interest naa le toh kya matlab snaps banane ka. <br></br><br></br> 
                                Lekin mujhe pata hai, kabhi kabhi aisa hota hai ki kisi se koi baat karne ka mann nahi karta, aur repeated convo bhi acchi nahi lagti daily daily. Related to food, day, and study. Boriyat aajati hai. I Understand.... 
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '4rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                waise wo apology express sahi se fit na ho browser me, to tum naa - Three dots pe click karna - uske baad desktop site pe click kar dena. fir enjoy.
                            </div>
                            <div className={styles.glassyBox} style={{marginTop: '3rem', transform: 'rotate(1deg)', padding: '1.2rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', border: '2px dashed #bbaacc'}}>
                                <p className={styles.handWritten} style={{fontSize: '1.05rem', lineHeight: '1.5', margin: 0}}>
                                    <strong style={{color: '#886699'}}>P.S. 🛠️</strong> Dekho is baar koi glitch, lag ya hang ho toh ye last time adjust kar lena. Main koi designer ya website developer nahi hu, main ek AI Engineer hu. Sach kahu toh difference utna hi hai jitna ki ek Cardiologist aur ek Pulmonologist mein hota hai... Doctors toh dono hain lekin field alag hai! Isiliye upgrade ke pehle padhna padta hai yr 🫣(Deepak Ke efforts) Ye Apology Express actually tumhare birthday ke liye bna rha tha lekin idhar use karni padi abh...  isiliye thodi imperfect hai. Isme bohot saari cheezen sochi thi mene 13 january ke liye.
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
                                    <li><span className={styles.checkbox}>1</span> Low feel karne par gayab mat hua karo. Talk about it.</li>
                                    <li><span className={styles.checkbox}>2</span> Always remember how immensely STRONG you are.</li>
                                    <li><span className={styles.checkbox}>3</span> Apna dhyaan rakho, you are a princess.</li>
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
                                    And I know tumhare paas bohot mitra mandali hai, shayad sab ke sab mere se bohot saari cheezon me acche bhi ho. Aur jo main feel karta hu, wo cheez common bhi ho sakti hai, koi badi baat nahi. Par shayad tumhare is denial aur baar-baar door chale jaane ke peeche bhi kuch aisa ho jo main nahi jaanta... 
                                </p>
                                
                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    Tumko mere se better mil sakta hai, lekin I know koi itne dramatically maafi nahi maang payega 😂 Mujhe khud nahi pata main aisi bacchon wali harkaten kyun karta tha. Maybe you pulled the child inside me, itna kisi ko hold back nahi karta main... Aur pata nahi kismat se sab kaand tumhare side hi kyun ho jaate hain mere, baaki jagah toh nahi hote, wahan toh sab perfect chalta hai as planned.
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                                    Sometimes I feel ki shayad main tumhare layak hi nahi hu kisi bhi case me... tummmmm..... tum toh princess ho. 👑
                                </p>

                                <p className={styles.handWritten} style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                                    Maybe you deserve someone jis se tum naturally attract hooo (wo natak naa kare bas). And I don't know what I deserve... maybe someone jo thoda sa appreciate kare, thoda sa meri doings ke peeche ka soche, thoda sa... bassssssss.
                                </p>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '3rem'}}>
                                I'm still holding your glass slipper. Bas dooriyan itni mat badha lena ki main tum tak pahunch hi na saku... ✨
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
