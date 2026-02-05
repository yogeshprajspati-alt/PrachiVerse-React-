import React, { useState, useEffect, useRef } from 'react';
import styles from './ChanchalDiary.module.css';
import BackButton from '../../../components/BackButton/BackButton';

// Assets
import begGif from '../../../assets/sorry/beg-dont-leave.gif';
import milkBearGif from '../../../assets/sorry/milk-and-mocha-bear-sorry-na.gif';
import jerryGif from '../../../assets/sorry/sorry-na-sorry-jerry.gif';
import catFlowers from '../../../assets/sorry/cat-holding-flowers.jpg';
// Note: Assuming background.mp3 is in ApologyDiary folder based on search results, 
// if not found there we might need to adjust.
import bgMusic from '../../../assets/ApologyDiary/background.mp3';

const ChanchalDiary = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [particles, setParticles] = useState([]);

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Apology Overlay State
    const [showApologyOverlay, setShowApologyOverlay] = useState(false);
    const [apologyScreen, setApologyScreen] = useState(1);
    const [showThankYou, setShowThankYou] = useState(false);

    // Total pages mapping (Cover + 5 Content + Back Cover)
    // 0: Cover
    // 1: Page 1
    // 2: Page 2
    // 3: Page 3
    // 4: Page 4
    // 5: Page 5
    // 6: Back Cover
    const totalPages = 7;

    useEffect(() => {
        const p = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5,
            isSparkle: Math.random() > 0.7
        }));
        setParticles(p);

        // Initialize audio volume
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const openDiary = () => {
        setIsIntroVisible(false);
        // Attempt auto-play music on interaction
        playAudio();
    };

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Audio autoplay blocked", e));
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
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

    // Apology Actions
    const handleNoClick1 = () => setApologyScreen(2);
    const handleNoClick2 = () => setApologyScreen(3);

    const handleMovingNoClick = (e) => {
        e.stopPropagation();
        // Move button logic
        const btn = e.target;
        const container = btn.closest('.' + styles.apologyCard);
        if (!container) return;

        const rect = container.getBoundingClientRect();
        // Simplified random move within container
        const randomX = Math.random() * (rect.width - 100);
        const randomY = Math.random() * (rect.height - 50);

        btn.style.position = 'absolute';
        btn.style.left = `${randomX}px`;
        btn.style.top = `${randomY}px`;
        btn.style.zIndex = 10001;
    };

    const handleYesClick = () => {
        setApologyScreen(4); // Use 4 as 'hidden' state for main screens
        setShowThankYou(true);
    };

    const closeOverlay = () => {
        setShowApologyOverlay(false);
        // Reset states after delay
        setTimeout(() => {
            setApologyScreen(1);
            setShowThankYou(false);
        }, 500);
    };

    return (
        <div className={styles.diaryWrapper}>
            <BackButton />

            {/* Audio Element */}
            <audio ref={audioRef} src={bgMusic} loop />

            <div className={styles.globalTexture}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>

            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`${styles.particle} ${p.isSparkle ? styles.sparkle : ''}`}
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Intro */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.fade : ''}`}>
                <h1 className={styles.introText}>Anonmous Confession</h1>
                <button className={styles.introBtn} onClick={openDiary}>Open Diary</button>
            </div>

            {/* Notebook */}
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
                        <div className={styles.coverFrame}>
                            <div className={styles.coverTitle}>Anonmous Confession</div>
                            <div style={{ fontFamily: 'Montserrat', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '10px', color: '#F0E68C' }}>....</div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(1) }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Hey, Chanchal</div>
                            <p>Hello Ma'am, I hope you remember me ?? <br />
                                I am that boy ..... , smiriti wali misunderstanding wala.
                            </p>
                            <p>Me us din khud confused tha ki, ho kya rha hai...</p>
                            <p>Thoda sa shock me, me prachi ki attention grab karne ki kosish karta tha us time. To conversation ke bahane doonhta tha,</p>
                            <p>Actually hua kya tha me batata hu. Sameer mera dost h. Me uska desktop theek karne gaya tha. Mtlb so bigada rehta tha . To me jata rehta tha aise normally hi. TO AISE HI normally baaten karte the Humalog. Me ye prachi ke nature ke baare me poochta tha 🙂 hamesha, ki wo kaisi ladki h. uske baare me little little details taaki me usko thoda jaan saku.
                            </p>
                            <div className={styles.highlightBox}>"Jab bhi milte the to me kuch na kuch pooch hi leta tha. Fir wahi cheezen prachi ko batata. Accha lagta tha tab."</div>
                            <p>wo bolta tha Bohot acchi ladki h. Bholi bhali h
                                Masoom h. Bohot jyada masoom h, bohot bohot seedhi h. Arey bhai gaaye h gaaye(cow) 🐄, bhole pan ke point of view se.</p>
                            <div className={styles.highlightBox}>"🦥🦥 "</div>
                            <p>Wo tumlog ke school ka nhi h, hamare school ka h lekin, uski padosi smriti h. Us se pooch leta tha wo prachi ke baare me kabhi kabhi meri request pe (although smriti or me kabhi nhi mile, but yes we are friends on instagram. Or mene jitni us se baat kari h wo bohot acchi ladki h yr).<br /> To ekdin wo mujhe drop karne jaa rha tha ghar, to Baton baaton me tumhara usne Bola tha(Sameer ne) ki mtlb ladai hoti h uski aisa kuch jo us time ki baat thi which ( I don't remember exactly what was it, shyd wahi normal prachi related cheezen shyd se mene bola tha ki, prachi ne bhai bola tha mere se, boodhi daadi style me "Jyada nhi hasna chaiye, warna daant gir jayenge..!!").<br /> Tabhi mene uske friend circle ka poocha tha, usne bola uski bestie hai chanchal naam h uska. Mene poocha aur nhi h kya, he replied ki shyd banti nhi hai itni. Thodi ladai wagerah hoti rehti h chanchal se(lekin ye isne man se Bola tha 😭 or me bhi pgl tha mene direct smtiti ka naam le Liya. Aur wo sab ho Gaya 😐)</p>
                            <p>Mtlb aise hi direct nhi kuch prachi se related baaten chal rhi thi to usne ye Bola tha koi baat pe mujhe ekdum acche se yaad nhi tha.</p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(2) }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>.......</div>
                            <p>Fir smriti mere se boli ke deepak mene aisa Kab kaha tumse, or sacchi baat thi usne to mere se kuch kaha hi nhi tha. Acche se jante tk nhi ek doosre ko. Aur to aur fact to face mile tk nhi. Or prachi ne meri screen record karke bheji thi to me shock me tha, ki ye aisa kaise kar sakti h🙂 to mujhe kuch samajh hi nhi aya ki kya karu me..</p>
                            <p>Upar se meri wajah se smtiti ka naam aa gaya tha. Uski to koi galati thi bhi nhi, mere dimag me kuch aya hi nhi us time, aur prachi ne wo group bana diya tha clear karne ko. I had literally no words to speak out. <br />If you remember mene tumko hello ki jagah namaste bola tha(usually tab use karta hu jab ajeeb lagta h) to mene bol diya lastly li mene mn se bol diya wo, wo sab. Or us time to mene smriti ko bhi nhi bataya ki mene uska naam kyun liya...</p>
                            <p>smriti ka isme koi role nhi h. Kyuki me nhi fasa sakta tha faltoo me usko, or usne jab samne se mere se bola ki Deepak mene aisa kab kaha tumse, to wahi guilt wali feel aai thodi jyada. To mene kuch explain karne ki jagah sab apne upar le liya.</p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(3) }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>......</div>
                            <p><em></em></p>
                            <div className={styles.highlightBox}>"Mene jaan booch ke nhi Bola tha mtlb, Wo to Sameer ne mere se Bola mujhe laga hoga aise hi kuch. To mene prachi se bol diya (Dekho and I will not lie, prachi se mujhe shuru se dar lagta h to me kuch bhi bol deta hu darke us se. | Impression accha pade is chakkar me flow flow me aise portray kar diya jaise smriti meri khudki dost ho or sameer ka naam tk nhi liya). Usne tumse or fir wo sa ho gyaa" </div>
                            <p>Agar tumko aaj bhi us cheez ka koi bojh ho to heavy hearted apologies for-granted please.</p>
                            <p>Itne time baad achanak se isiliye, kyuki us time mujhe nhi pata tha, tumhare baare me itna</p>
                            <div className={styles.highlightBox}>Mujhe abhi tk lagta tha tum acchi nhi ho, me galat tha hamesha se. Wo hota h na koi first Impression mil jaaye kahi se to carry-on hota rehta h. Bhale hi wo sach na ho.</div>
                            <p>Ek to ye prachi ne mujhe nhi bataya ki tum uski nursery se dost ho. Aur acchi wali, itni acchi wali dost ho, behen jaisi. Wo ab jaake patachala mujhe.</p>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div
                        className={`${styles.page} ${isFlipped(4) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(4) }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>......</div>
                            <p>Truth is ki me chahta hu tum sab ekdum sahi sahi jaano isiliye ye sab bata diya mene tumko. Isme 1% bhi jooth nhi h 100% genuine or true.</p>
                            <p>Tumko snap request isiliye bheji thi taaki tumko ye direct de saku.</p>
                            <p>Or BTW ye neeche music wale symbol ke liye maafi chahta hu, doosri diary joo prachi ke liye design kari thi usko use kara tha mene, or ye itne bade codebase me se sirf ye section hatana thoda time consuming rehta h isiliye aise hi rehne diya mene</p>
                            <div className={styles.highlightBox}>Ye prachi bohot nadan lagti h mujhe shuru se. Please iska saath kabhi mat chhorna. Tumhari bohot jyada izzat karti h ye. Shuru se dekh rha hu me, you are literally her bestieeeee...</div>
                            <p>Tum wo waise bhi samajhdaar ho. I know it is called buttering, but i'm not buttering maybe buttering. Idk what to call it</p>
                        </div>
                    </div>

                    {/* Page 5 */}
                    <div
                        className={`${styles.page} ${isFlipped(5) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(5) }}
                    >
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>.......</div>
                            <p><em>Tumko ye cheez confess isliye kar rha hu(ye smriti wale time ki) kyuki maybe I and prachi will never talk to each other from now. To Impression ya fir apni side me laane wala concept yaha nhi lagega.</em> Uska nhi pata, lekin ab mere me himmat hi nhi h ki me text karu use 🙃 Bohot pareshan kr diya shyd mene.... or wo gussa bhi h bohot.</p>
                            <div className={styles.highlightBox}>Mujhe koi andaza nhi tha ki tum uske liye kitni important ho..!! Tabhi usne us din clear karne ko bola tha mere se. Lekin me samjha hi nhi tha. I think today is perfect to do whatever was left-out.</div>
                            <p>Usko mat batana please.</p>
                            <div className={styles.highlightBox}>I don't wanna hurt her..!!</div>
                        </div>
                    </div>

                    {/* Back Cover (Page 6) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(6) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(6) }}
                    >
                        <div className={styles.coverFrame}>
                            <div className={styles.coverTitle} style={{ fontSize: '2.5rem' }}>Take Care</div>
                            <div style={{ fontFamily: 'Montserrat', letterSpacing: '1px', fontSize: '0.7rem', color: '#F0E68C', marginTop: '20px' }}>
                                of yourself and her Especially
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.helperText}>Tap Sides to Flip</div>
            </div>

            {/* Click Zones */}
            {!isIntroVisible && (
                <>
                    <div className={`${styles.touchZone} ${styles.zoneLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.touchZone} ${styles.zoneRight}`} onClick={flipNext}></div>

                    {/* Music Toggle */}
                    <div className={styles.musicToggle} onClick={toggleAudio}>
                        <span className={styles.musicIcon}>{isPlaying ? '⏸' : '🎵'}</span>
                    </div>
                </>
            )}

            {/* Apology Overlay */}
            {showApologyOverlay && (
                <div className={styles.apologyOverlay}>
                    <div className={styles.overlayContent}>
                        <button className={styles.backToDiaryBtn} onClick={closeOverlay}>
                            ← Back to Diary
                        </button>

                        <div className={styles.apologyCardContainer}>
                            {/* Screen 1 */}
                            {apologyScreen === 1 && !showThankYou && (
                                <div className={`${styles.apologyCard} ${styles.animateSlide}`}>
                                    <div className={styles.apologyGifContainer}>
                                        <img src={begGif} alt="Please" />
                                    </div>
                                    <div className={styles.apologyMessage}>Maan jao please 🥺</div>
                                    <div className={styles.apologySubMessage}>I'm really sorry...</div>
                                    <div className={styles.apologyButtonContainer}>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnYes}`} onClick={handleYesClick}>Yes ❤️</button>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnNo}`} onClick={handleNoClick1}>No 😔</button>
                                    </div>
                                </div>
                            )}

                            {/* Screen 2 */}
                            {apologyScreen === 2 && !showThankYou && (
                                <div className={`${styles.apologyCard} ${styles.animateSlide}`}>
                                    <div className={styles.apologyGifContainer}>
                                        <img src={milkBearGif} alt="Please reconsider" />
                                    </div>
                                    <div className={styles.apologyMessage}>Ek baar aur sochlo 🥺</div>
                                    <div className={styles.apologySubMessage}>Please Pilizzzz...</div>
                                    <div className={styles.apologyButtonContainer}>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnYes}`} onClick={handleYesClick}>Yes ❤️</button>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnNo}`} onClick={handleNoClick2}>No 😢</button>
                                    </div>
                                </div>
                            )}

                            {/* Screen 3 */}
                            {apologyScreen === 3 && !showThankYou && (
                                <div className={`${styles.apologyCard} ${styles.animateSlide}`}>
                                    <div className={styles.apologyGifContainer}>
                                        <img src={jerryGif} alt="Please think again" />
                                    </div>
                                    <div className={styles.apologyMessage}>Are aise kaise, socho to 🥹</div>
                                    <div className={styles.apologySubMessage}>One more chance please...</div>
                                    <div className={styles.apologyButtonContainer}>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnYes}`} onClick={handleYesClick}>Yes ❤️</button>
                                        <button className={`${styles.apologyBtn} ${styles.apologyBtnNo} ${styles.movingBtn}`} onMouseEnter={handleMovingNoClick} onClick={handleMovingNoClick}>No 💔</button>
                                    </div>
                                </div>
                            )}

                            {/* Thank You Screen */}
                            {showThankYou && (
                                <div className={`${styles.apologyCard} ${styles.animateSlide}`}>
                                    <div className={styles.apologyGifContainer} style={{ width: '180px', height: '180px' }}>
                                        <img src={catFlowers} alt="Thank you" />
                                    </div>
                                    <div className={styles.apologyThankYouMessage}>Thank You! 💕</div>
                                    <div className={styles.apologyThankYouText}>
                                        I knew you'd understand! 😁😎<br />
                                        You're the best! 😎<br />
                                        Chalooo wapis jao aur pages h ange..
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChanchalDiary;
