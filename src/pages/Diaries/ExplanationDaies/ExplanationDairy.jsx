import React, { useEffect, useRef, useState } from 'react';
import styles from './ExplanationDairy.module.css';
import BackButton from '../../../components/BackButton/BackButton';

// Reusing assets from GreenChronicalGame for now, as no specific assets were provided
import begGif from '../GreenChronicalGame/beg-dont-leave.gif';
import catGif from '../GreenChronicalGame/cat-holding-flowers.gif';
import bgAudio from '../../../assets/diariesbgm/ExplanationDairy.mp3';

const ExplanationDairy = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hearts, setHearts] = useState([]);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [overlayStep, setOverlayStep] = useState(1);
    const [audioPlaying, setAudioPlaying] = useState(false);

    const audioRef = useRef(null);
    const fleeBtnRef = useRef(null);

    const totalPages = 5; // cover + 3 pages + back cover

    useEffect(() => {
        const h = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            drift: (Math.random() - 0.5) * 50 + 'px',
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 10
        }));
        setHearts(h);
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
                {hearts.map(h => (
                    <div
                        key={h.id}
                        className={styles.heart}
                        style={{
                            left: `${h.left}%`,
                            '--drift': h.drift,
                            animationDuration: `${h.duration}s`,
                            animationDelay: `${h.delay}s`
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            {/* Intro */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.hidden : ''}`}>
                <h1 className={styles.introTitle}>
                    The Velvet<br />Chronicles
                </h1>
                <button className={styles.introBtn} onClick={openDiary}>
                    Unlock The Truth
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
                                <div className={styles.coverTitle}>COSMIC<br />JOURNAL</div>
                                <div className={styles.coverSubtitle}>Explanation & Reality</div>
                            </div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(1) }}
                    >
                        <div className={styles.pageTexture}></div>
                        <div className={`${styles.cornerRune} ${styles.tr}`}>🌌</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Hey, Pirachiiiiiiii..</div>
                            <p>Sometimes things aren't what they appear to be. The stars align in mysterious ways, and confusion is just a cloud passing over the moon.</p>
                            <div className={styles.highlightBox}>
                                "Clarity comes to those who seek it with an open heart."
                            </div>
                            <p>Here I unravel the knots of misunderstanding. Not with excuses, but with the raw threads of truth.</p>
                            <p>Listen closely to the silence between the words...</p>
                            <p>Chalo dekho yr, me janta hu us raat tum bohot jyada gusse me thi, or me bhi bohot gusse me tha. Me tumse bs poochne aaya tha yr, ye texts ki yahi dikkat h ki apne true emotions dikhte nhi h usme.</p>
                            <p>Fir tumhare rude replies, despite knowing ki tumhara time hi wo gusse wala h(Tumhari koi galati nhi h usme, mujhe thoda aur control me reh ke sunna chaiye tha bs). Fir tum bhi bolne lagi bolo bolo to mere se control nhi hua fir👉👈, mene wo dabi cheezen kehdi👉👈.</p>

                            <div className={styles.highlightBox}>Or dekho chanchal ko manane wali baat mene bs isiliye ki thi kyuki wo tumhari bestie h, pahle accha bolti thi ab fir tum use kuch batati to shyd wo gap aajata tum dono me. Pata h pata h tum dono ki bonding bohot strong h still, aajati h thodi si bs isiliye. </div>
                            <p> Pata nhi me tumko achnak se jhoota kyun lagne laga. Dekho meri compliments hamesha se wahi the jo mere mn se nikalte h. Never fake..!! Or dekho tum meri ikcha to nhi thi is baar over explain karne ki👉👈 Lekin tum mere liye valuable ho bs isiliye firse pesh h meri boring explanation 😂</p>
                            <p>Me nhi chahta tumhare mn me kisi baat ki chinta rahe, is time. Keh do tum bhi chanchal ki tarah 😂 "Mujhe pharak nhi padta" truth is farak padta h yr, nhi padta to response gentle hota devi🦥 anddddd.... it wasn't, narazgi to thi mn me. Ye samne wala janta h or me janta hu👉👈 </p>

                            <div className={styles.highlightBox}>Or dekho wo 2 saal pahle bhi chanchal mere liye tumhare saath conversation ka topic thi, mene tab bhi bs itna hi bola tha ki mene suna h ki uski ladai hoti h, banti nhi jyada. Bs baaki tumne us se keh diya to mamla garam ho gaya tha.</div>
                            <div className={styles.highlightBox}>Or wo 23 ko bhi me bs poochne aya tha lekin shyd firse misunderstanding create ho gai or me already gusse me tha to portray waise ho gai cheezen.</div>
                            <p>Are bhai me bura nhi hu 👉👈 aur tumhari nazron me banna bhi nhi chahta bhale sabse ladna pade. Mene pahle bhi kaha tha tum mere liye sabse jyada important ho, aur tum kisi bhi ladki se poochogi to koi mujhe defame nhi karegi.</p>

                            <p>Chalo chhoro ye topic(or me is vishay me baat nhi karunga kyuki tume fir wo cheezen trigger hongi or tumko accha nhi lagega), farak mujhe pahle nhi padta tha, lekin ab padta h kyuki she is associated to you. </p>

                            <div className={styles.highlightBox}>Aur mujhe mujhe yaad h, us raat tumne last me kaha tha tum or chanchal dono hi bhasad me ho. Me nhi janta wo kya dikkaten h, your hearts might be as heavy as a stone. Ye time waise bhi tum dono ke liye bohot critical h, both of you girls are struggling badly. Me sab samajhta hu prachiii, family pressure, dostlog se milte hoge to alag dukh hota h ki kitna time nikal gaya. And things I don't even know about. Or sabse badi baat ye h ki tum dono akeli ho. Tum ladkiyon ko bohot cheezon ka dar hoga.</div>
                            <div className={styles.highlightBox}>Tum dono bohot brave ho, acche se taiyaari karo, me baat bhale na karu... lekin cheer to kar sakta hu, waise bhi restrictions mere upar h baat na karne ke, tumhare upar nhi h 🦥tum mere se har tareeke ki cheezen pooch sakti ho share kar sakti ho. Me to tumhari kisi dost wagerah ko janta bhi nhi, to kisi cheeez ka dar bhi nhi h. Aur sabse important mujhe tumhare gusse se hi dar lagta h to kisi ko kya bolunga me, jyada se yada ye hannah ko pata chalega bs 😂 aur kaun hi h jise me kuch batau.</div>
                            <p>Mene isiliye tumhare samne wo weekly, monthly, yearly wali cheez rakhi thi. Mujhe kaafi time se lag rha tha, lag hii rha tha bs. Isiliye is baar execute kar diya.</p>
                            <p>Me janta tha you need some space and air, isiliye I offered.</p>
                            <p>Me bhi ab notifications off kar chuka, bohot kaam h re 👉😂👈 pressure wala time chal rhaaa........ to time bhi km hi h.</p>




                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(2) }}
                    >
                        <div className={styles.pageTexture}></div>
                        <div className={`${styles.cornerRune} ${styles.tr}`}>🔮</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Perspective</div>
                            <p>Oh come-on me pahle bata to chuka tha tumko, ki meri kisi bhi feeling se tumhe koi harm nhi hone dunga me. </p>
                            <div className={styles.highlightBox}>
                                "Wo Aishwarya ki behen psycologist thi. Aishwarya ne mujhe promise kiya tha meri help karegi moveon karne me. Kyuki tum har baar same reason se naraz hoti thi, halan ki mene in saalon me khudse kosishen kari thi, mujhe laga ki moveon ho jayega to shyd prachiii ko doobara insecure hone se bacha lunga. Tumhe accha kaha lagta tha. Ab mene socha ye help kar rhi h, wo to memories kharab karne ki kosishen karne me lagi thi. To mene band kar diya sunna. Bhaad me jaaye..!!"
                            </div>
                            <p>Jaise tum chanchal ke baare me ek shabd nhi sun sakti me tumhare baare me nhi sun sakta. Lad hi lunga lekin burai nhi sununga..!!</p>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    className={`${styles.magicBtn} ${styles.btnAccept}`}
                                    onClick={() => {
                                        setOverlayOpen(true);
                                        setOverlayStep(1);
                                    }}
                                >
                                    Glimpse The Future
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
                        <div className={`${styles.cornerRune} ${styles.tr}`}>💫</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Final Thoughts</div>
                            <p>Waise tum mujhe direct bola karo na prachiiiiiii. kuch bhi jo tumhe accha na lage, jaise wo comments wali baat. Mene to delete kar dii thi, shyd tumne check kiye bina delete kar diya video.</p>
                            <p>Uske peeche bhi koi wajah zaroor hogi, me samajh nhi paya....</p>

                            <p>Mene bs isiliye kii thi kyuki youtube ka algorithm waise hi push karta h content ko, likes , shares average view duration aur comments se👉👈. Shyd tumhe dar ho ki koi dekhega to kuch sochega...</p>
                            <div className={styles.highlightBox}>
                                Me ab kabhi tumhare video pe comment nhi karunga, saare videos ki comment ko band mat karna, content growth ke liye accha nhi h yr.
                                Aur daalna band mat karna, alteast mere jaise kisi aire gaire ladke ki wajah se, kyuki me ab tumhara koi video nhi dekhunga. Unsubscribe me kar nhi sakta kyuki bohot saare accounts se subscribed h yr 😂✌️ atleast 15 honge arindam ki email mila ke, kosish yahi rehti h sabse view dedu.
                            </div>
                            <div className={styles.highlightBox}>Or tum direct bola karo yr, jaise ki deepak jaake comments delete karo, sab dekhenge to accha nhi lagega.... ya deepak kuch din texts mat karna mujhe accha nhi lag rha baad me bataungi kyun.... ya deepak mujhe kabhi text mat karna(iska reason dena padega bs). Tumhara har hukum sar ankhon pe maharaaj 🫡 Dekho aur har ladka mere jaisa kharab nhi hota👉👈 to acche bhi hote h ladke👉👈 me nhi chahta tum meri kisi harkat ki wajah se kisi gender se conversation band kardo</div>
                            <p>Aur dekho yaad karo tumne wo dance wali video pahle bheji thiiii.... Mene Bola tha "Kitne smooth moves h yr, tum kitni talanted ho", aur tumne kaha tha ki "abhi to dekho collage mile fir sab karungi me". Mene wahi yaad karke tareef ki thi prachiii. Me kisi ki tareef nhi karta, or jab karta hu to genuine. And yes "Every single tareef of mine was straight from the heart"</p>
                            <p>Or meri Maaaaaa tum bhale mujhe parasari ke bridge se dhakka de ke gira do, me end of may tak sirf tumhari side lunga. Ab asli tareef suno, </p>
                            <div className={styles.highlightBox}>You are an Absolute Idiot..!! yahi sach h. And this quality makes you different from others. Ab bhale tum katrina nhi ho, lekin tumhari ye innocence or idiot pane ki wajah se tumhari ranking badh jaati h.</div>
                            <p>Or haa tum itni nadaan bholi ho ki tum baat ka batangad bana deti ho😂 gusse me tumhare kaan laal ho jaate h, kabhi check karke dekhna..!!</p>
                            <p>Or haa ye bezzati ke saath wali tareef h😎✌️ Tum kya hi bigad logi mera, me tumse itni door hu ki tum mujhe maar bhi nhi sakti😂 </p>
                            <div className={styles.highlightBox}>Dhyn rakha karo apna, or khush raha karo..!!</div>
                            <div className={styles.highlightBox}>PrachiVerse is now Smoother, or back hone pe wapis login nhi mangega ab..!!</div>
                            <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Until our stars cross again.</p>
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
                                    Chalo Bye<br />✨
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
                            <img src={begGif} alt="plea" style={{ borderColor: '#b39ddb' }} />
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
                                        Ignore Logic
                                    </button>
                                    {/* The real runner button */}
                                    <button
                                        ref={fleeBtnRef}
                                        className={`${styles.magicBtn} ${styles.btnDeny}`}
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                        onMouseEnter={dodgeBtn}
                                        onClick={dodgeBtn}
                                    >
                                        Ignore Logic
                                    </button>
                                </div>
                            </div>
                            <div
                                className={styles.overlayClose}
                                style={{ marginTop: '15px', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => setOverlayOpen(false)}
                            >
                                Close this vision
                            </div>
                        </div>
                    )}

                    {overlayStep === 2 && (
                        <div className={styles.crystalCard}>
                            <img src={catGif} alt="happy" style={{ borderColor: '#b39ddb' }} />
                            <h2>Firse meri jeet huiii!</h2>
                            <p>Everything is clear now. 🌌✨</p>
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

export default ExplanationDairy;
