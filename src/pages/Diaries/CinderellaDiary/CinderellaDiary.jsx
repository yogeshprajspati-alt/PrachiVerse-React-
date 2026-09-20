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

    const TOTAL = 12;

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
                        <span>✨</span> Open The Magic
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
                                    Or ek to aise tumhara naam sunke hi me excited feel karne lagta hu, ekdum se dopamine spike jaisa... to control nhi hi hota. ✨
                                </p>
                                <div className={styles.elegantQuote} style={{marginTop: '1.5rem'}}>
                                    "Kuch cheezen hain waise princess se meri thodi. Mtlb dekho aise type karne me hi dar lag rha. lil complaints."
                                </div>

                                <div className={styles.polaroidContainer}>
                                    <div className={styles.pin}></div>
                                    <div className={`${styles.polaroid} ${styles.swingingPolaroid}`}>
                                        <div className={styles.gifWrapper}>
                                            <img src={rapunzelSurprised} alt="Silence" className={styles.polaroidGif} />
                                        </div>
                                    </div>
                                    <div className={`${styles.tape} ${styles.tapeBottom}`}>
                                        "You are literal magic ✨"
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{marginTop: '3rem', position: 'relative'}}>
                                JUST LIKE A FAIRY TALE
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
                                Today this isn't about disappearing, but lil explanation and request. No trolling, no teasing.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '2rem'}}>Dekho I have noticed tum bohot time se bohot jyada changed ho, or kuch bhi bina karan nhi hota.</p>
                            <p className={styles.handWritten} style={{marginTop: '1rem'}}>Small change ya moodshift works for a smaller time, not for months, kuch kuch rude bhi rehne lagi ho kuch time se.</p>
                        </div>
                    </div>

                    {/* PAGE 5 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${styles.leftBorder} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            <h2 className={styles.mainTitle} style={{marginTop: '2rem'}}>Point to be noted 🛫 </h2>
                            <div className={styles.glassyBox}>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '0.2s'}}>
                                    Point ki baat is, Dekho yr, chanchal was really good to me, or achank se aise mujhe aisa lag rha tha ki jyada problem na hui ho, wahi worst case imagine karne laga and all. Shyd mamla utna serious ho bhi na, it felt like kuch to karo kuch to karo. 
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '1.2s'}}>Or tumne bataya bhi kaafi km tha, jo starting me bola us se to laga ki strict honge bohot jyda hi, you said <strong><ul><li>"Ladke to hai nhi hm ki muh uthaya or mil liya"</li><li>"Unse to koi kuch kehta nhi h"</li><li>"Nhi hum to aawara hain"</li></ul></strong>, ye sab sunke kya hi lagega yr? Tum khudi socho kya tum meri jagah hoti to tumko kaise feel hota. Mera darr toh genuine tha na.</p>
                                <div className={`${styles.neonText} ${styles.magicalFadeIn}`} style={{animationDelay: '2.2s'}}>
                                    Listen Princess
                                </div>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '3.2s'}}>
                                    The reason I am using princess notation repeadily, just to show I am just putting my point with respect.
                                </p>
                                <p className={`${styles.handWritten} ${styles.magicalFadeIn}`} style={{animationDelay: '4.2s'}}>
                                    Or me judge nhi kar rha tha, wo bs normal human jo karta wahi tha, chanhcal ko ye sab mt batana, agar batao to ye bhi batana ki tumne iske pahle kya context diya tha, taaki fairness rahe (I cannot Affoad her hate for me, or aisi cheezon se uska bharosa toot jayega mere upar se).
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
                                    At last you said...<strong><ul><li>"Use bohot princess treatment milta h ghar pe"</li><li>"Sabke ghar ki baat alag hoti hai tumhare ghar bhar bhi to tumlogon ka mindset alag hai"</li></ul></strong> Princess you are a lovely girl. Lekin kabhi kabhi ajeeb lagta h.
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Prachi I know tum bs meri wo baat ki wajah se hi bol rhi thi kyuki tum hurt ho gain thi, or tumhe laga hoga ki tumhari wajah se h, lekin aisa kuch nhi h. Me meri marzi se kata hu sab. Kyukiiiiii tum bohot achhi ladki ho.. or accha treatment deserve karti ho.
                                </p>
                                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                                    <span className={styles.bouncingEmoji}>🎃</span>
                                    <span className={styles.bouncingEmoji} style={{animationDelay: '1s'}}>✨</span>
                                </div>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Or wo funding wala word hi mene soch ke bola tha taaki kharab na lage. Mujhe bs bohot jyada chinta ho rhi thi. <br></br><br></br>
                                    Tumne galat samajh liya. I was thinking ki itne saal ho gaye, you still don't notice ki me kabhi aisa kuch nahi sochta jis se prachi ko bura lage.
                                </p>
                                <p className={styles.handWritten} style={{textAlign: 'center', fontWeight: '900', fontSize: '1.2rem'}}>
                                    Or mujhe tumse relationship chaiye bhi nhi tha kabhi, bs some affection understanding, or bharosa ki deepak sab kar dega. Or tumhara trust bhi. <br></br><br></br>
                                    I wanted to give you something better, kuch aisa jo tumhe chube na kabhi. I wanted to be your favourate person. Someone you can always trust, and rely-on, judgement ka dar naa ho, kyuki me to tumhari hi side lunga bhale tum kisi ka murder kardo 🤨. Saari cheezen batao ki kya kya hua. Bs itnaa.
                                    
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
                                For some recent snaps and aawara wali line for boys, I would like to say. jo ladki un snaps me thi uska accident ho gaya tha. Jinlog ko dost bolti thi wo 500m door se bhi uski help karne nhi aaye.<br></br><br></br> She called me and she was crying wagerah wagerah to me or arindam isiliye gaye the raat ke 12 baje ke aaspass taaki uski dressing ho sake or medicines de sake or ghar chhor sake. kyuki ye itni badi city me akle, unsafe to lagta h na. Or koi pass me bhi nhi the hmlog se 28km door thi wo ladki isiliye bhi itna late ho gaya tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1.5rem'}}>
                                Or me raat ko 10 ke baad kahi nhi jata. Jata hu to kisi or ke karan(koi dukhi aatma!).<br></br>
                                Moreover, me bhi ghar me mmy ki permission ke bina ghoomne firne nhi jata Despite being this big.
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
                                Wo Deeksha mere papa ke dost ki beti hai. Wo 2 ladke log uske cousins the, or ek ladki bhi deeksha ki dost thi. wo ladki ka naam mandvi tha, or wo man hater thi.... Isiliye bulaya tha deeksha ne humdono ko taaki uska perception change ho jaaye hum dono se milke jo ho bhi gaya.  
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', textAlign: 'center'}}>
                                And maybe I was not supposed to explain so much, lekin if those things disappointed you, then you should be knowing details, not the overview by snaps. Wo snaps sabko jaate bhi nhi h, wo to bs you, chanhcal, sometimes my sister and anukriti somethimes bss. 
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
                                Sorry na Prachiii, dekho ye time accha nhi tha bohot se logon ke karan me thoda rage me tha to nikal gaya muh se. I won't say it again.<br></br><br></br>
                                Wo to bs andar ka bhara hua nikal gaya.<br></br><br></br> 
                                Or itne dinon se to tumne snaps bhi band kar diye, mene to start hi tumhari wajah se kara tha. To jab most important insaan hi interest naa le to kya mtlb snaps banane ka. <br></br><br></br> 
                                Lekin mujhe pta hai, kabhi kabhi aisa hota hai ki kisi se koi baat karne ka mn nhi karta, or repeated convo bhi acchi nhi lagti daily daily. Rellated to food and day and study. Boriyat aajati hai. I Understand.... 
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', marginTop: '4rem', width: '90%', transform: 'rotate(-2deg)'}}>
                                waise wo apology express sahi se fit na ho browser me, to tum naa - Three dots pe click karna - uske badd desktop site pe click kar dena. fir enjoy.
                            </div>
                            <p className={styles.handWritten} style={{marginTop: '3rem'}}>
                                ......................................
                            </p>
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
                                <div className={styles.clayPill}>✨ Stay Magical</div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 11 */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(11) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(11) }}
                    >
                        <div className={styles.coverInner}>
                            <h1 className={styles.cTitle} style={{fontSize: '2.5rem', letterSpacing: '2px'}}>TAKE CARE</h1>
                            <p className={styles.cSub} style={{marginTop: '2rem', color: '#1e3a8a', textShadow: 'none'}}>
                                Tumhare andar,<br/>koi kami nhi h.<br/>Sabse best ho tum.
                            </p>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeMidnight}`} style={{position: 'relative', bottom: '-40px'}}>
                                LIL ANGEL MISS...
                            </div>
                            <div className={`${styles.tape} ${styles.tapeBottom} ${styles.tapeSparkle}`} style={{position: 'relative', bottom: '-40px'}}>
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

export default CinderellaDiary;
