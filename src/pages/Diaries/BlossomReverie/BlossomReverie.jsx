import React, { useState, useEffect, useRef } from 'react';
import styles from './BlossomReverie.module.css';
import BackButton from '../../../components/BackButton/BackButton';
import bgMusic from '../../../assets/diariesbgm/blossomreverie.mp3';

const BlossomReverie = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [particles, setParticles] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Cover + 5 content pages + Back Cover = 7 pages (0 to 6)
    const totalPages = 7;

    useEffect(() => {
        // Generate falling petals
        const p = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            size: Math.random() * 10 + 5,
            left: Math.random() * 100,
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 8
        }));
        setParticles(p);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
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
            <div className={styles.lightRays}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>

            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={styles.petal}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size + p.size / 2}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Intro Screen */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.fade : ''}`}>
                <div className={styles.introHeart}>🐞</div>
                <h1 className={styles.introText}>Blossom Reverie</h1>
                <div className={styles.introSubtext}>A Whisper of Feelings</div>
                <button className={styles.introBtn} onClick={startDiary}>Open Your Heart</button>
            </div>

            {/* Notebook Base */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.spiral}>
                    {[...Array(14)].map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>

                    {/* Cover (Page 0) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(0) }} onClick={() => currentPage === 0 && flipNext()}>
                        <div className={styles.coverGlow}></div>
                        <div className={styles.coverFrame}>
                            <div className={styles.coverCrest}></div>
                            <div className={styles.coverTitle}>For You</div>
                            <div className={styles.coverSubtitle}>
                                A BEAUTIFUL SOUL
                            </div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(1) }}>
                        <div className={`${styles.cornerDecoration} ${styles.topLeft}`}></div>
                        <div className={`${styles.cornerDecoration} ${styles.bottomRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>The First Glance</div>
                            <p>Hyeeee prachieeeee,</p>
                            <p>Bade din ho gaye naa koi dairy nhi banaii,, lo ab bana diii..</p>
                            <p>Are tumhhe pata h me itni jaldi kaise maan gaya tha, uski bhi ek badi wajah h aur wo itni lambii h, ki ek diary to deserve karti hi haii. Waise waisa kuch kabhhi hota h to please mujhe turant batana 😂🐞</p>
                            <p>Badi badi baaten text pe karne se bohot time jata h isiliye ye method acchi lagi mujhe. Waise bhi, abhi tuhara time mere se jyada valuable hai.</p>

                            <div className={styles.polaroidFrame}>
                                <div className={styles.polaroidImage}>✨Remember You're the best</div>
                                <div className={styles.polaroidCaption}>Turn-Turn</div>
                            </div>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(2) }}>
                        <div className={`${styles.cornerDecoration} ${styles.topLeft}`}></div>
                        <div className={`${styles.cornerDecoration} ${styles.bottomRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Little Things</div>
                            <p>Haaan to back story batane ka time........ Apne free time me padh lena.</p>
                            <p>Tumne jab outfit change kara tha na, uske kuch 12 se 13 din ppahle mujhe ek dream aya tha. Usme tumne mere se bola tha deepak mujhe koi mil gaya haii. Aur uska naam "bhaskar mishra" bataya tha. Waise handsome hi tha kaafi. Fir wo matching outfit change kar liya tha tumne (sapne me hi 😂) red-pink ya hot-pink colour ki hoodie thii. Aur ye cheez mene kisi ko nhi batai thi.</p>

                            <div className={styles.highlightBox}>
                                "Fir tumne jab ye nayya outfit dala tha to me thoda shock hua tha, kyuki colour to wahi tha.... neeche bhi upar bhi. mene us din arindam se baat kari thi is baare meeee...."
                            </div>

                            <p>To kl jab mene wo dekha bhale wo majak hi tha 😂 lekin ek pal ko laga shyd wo sapna adha nhi poora sach hi thaa. Mene shyd pahle bhi bataya ho..... mere kaaafi sapne actual me ho jaate. Isiliye to me sone se tk darta tha 👾</p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(3) }}>
                        <div className={`${styles.cornerDecoration} ${styles.topLeft}`}></div>
                        <div className={`${styles.cornerDecoration} ${styles.bottomRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Unspoken Words</div>
                            <p>This thing is fishy but real, aur agar wo sach ho bhii jaaye to me prepared rahu bs👾😂.</p>
                            <p>Aur agar kabhi aisa hua bhi to me bade aaram se move-on kar lunga 👾 tumko chinta karne ki jaroorat nhi h. Or mujhe pasand bhi nhi tum apna BP badhao✌️ </p>

                            <p>Aur devi👾 Kabhi aisa kuch sachme ho to disclose kar dena😂 Mana ki me dangerous hu, lekin i could never hurt your belongings. Aur naam aur basic details jaanna to deserve karta hi huuuuu👾. Waise bhi tum kisi ko bhi aise hi choose to nhi karogiii... kuch to khhass hoga usme tabhi toooo...</p>
                            <p> Kyuki tum kuch bhi kaho ek natural bonding to ban chuki hai.Tabhhi tooo, kya pta kaise achanak se tumko yaad aya ki aaj mera birthday hai😂 Tum toooooo, telegram pe bhi kabhi kabhi visit karti hoooooo, kaafi km probability thi is cheez ki. Maybe it was God's plan. Aur me bohot wait bhi to kar rha tha😂</p>

                            <div className={styles.polaroidFrame} style={{ transform: 'rotate(2deg)' }}>
                                <div className={styles.polaroidImage} style={{ background: 'linear-gradient(45deg, #ffdab9, #ffb6c1)' }}>💭</div>
                                <div className={styles.polaroidCaption}>if you only knew</div>
                            </div>
                            <div className={styles.highlightBox}>Tumko low feel nhi hone dunga, appreciation ke liye to kuch kuch bhejta rahunga😜😜 time time pe....</div>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div className={`${styles.page} ${isFlipped(4) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(4) }}>
                        <div className={`${styles.cornerDecoration} ${styles.topLeft}`}></div>
                        <div className={`${styles.cornerDecoration} ${styles.bottomRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Quiet Realization</div>
                            <p>Arey me kitna bolta huuuu😂 explaination on Top 😂.</p>
                            <p>Tumhari Late wish ne bhi mere mood ko itna elevate kara tha jo shraddha aur radhika ke bade bade itne fruitful beautiful paragraphs ne nhi kara, naa hi anukritii aur deeksha ke greeting cards ne, naa hi kisi aur ke greeting ne, wo bhi kaafi acchhe the aur bohot accha laga tha, tumhari baat hi alag hai lekin  😂 Aur ye me tumhe chada nhi rha.... jo sach hai wo samne haiii...</p>
                            <p>Aur tummm.... ha tummm.... Aise majak doobara mmat karna 👾❌🔫 Warnaaaaa...... mme naaaaaa (ek to rona nhi ata mujhe. warna rote rote meri naak behnne lagti aur me tumhharre saare kapde kharab kar deta usi se 😎🐞) Ha agar tumne ye majak doobara kara to  🔫tumhhe keechad me dhakka de dunga 👾👾 Ya kachra gaadi me daal dunga...</p>
                            <p>Khud pe kabhi doubt mat karna, me bohot selected logon ko apna dost banata hu. Aur unme kuch na kuch bohot special cheez hoti hai. And if I say you are a living blessing to uska bhi kuch to karan hoga naaa.. Fir bataunga exam ke baad agar tum pooochogi to.. </p>

                            <div className={styles.highlightBox}>
                                Always Trust Yourself more than annyone else. Tum sabkuch kar sakti ho, I could tell...
                            </div>


                            <div className={styles.highlightBox}>
                                You are poetry in a world that's still trying to learn the alphabet.
                            </div>

                            <p>I didn't plan for this. But then again, the best chapters in life are usually the ones we never outlined.</p>

                        </div>
                    </div>

                    {/* Page 5 */}
                    <div className={`${styles.page} ${isFlipped(5) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(5) }}>
                        <div className={`${styles.cornerDecoration} ${styles.topLeft}`}></div>
                        <div className={`${styles.cornerDecoration} ${styles.bottomRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalHeader}>Yours</div>
                            <p>Point ki baat pe aate hai aisi side wli baaten to hotii rehtii hain.</p>
                            <p>Prachiiieee, bholi bhalli pyri si Prachiiieee</p>
                            <p>Tumko pata hai koi bhi exam ka last 1 mahina bohot important hota hai..</p>

                            <p>Or me mere pooore mn se chahta hu ki tum is baar wo achieve karo jiske liye tumne itni cheezen sacrifice karii haiin. Tum wo sab deserve karti hooo. </p>

                            <p>Ab tum ye ek mahina bina kisi distracation ke poore mn se padho acche se. Me bhi tabtak apne drowning cheezon ko peak of the sky pe lejane ki kosishen karunga.</p>
                            <p>Koi distraction nhi hona chaiye is time. isiliye tumse lambi baat to tumhare exam ke shaam ko yaa uske next day karenge. (ladai nhi kari bohot din se 👾🔫😂) Tbtak sirf thodi bohot ya bilkul nhiii</p>

                            <div className={styles.highlightBox}>Kabhi off feel karo ya jyada hi anxiety lage to call ya text kar lena. Tumhare liye to 24 ghante free hu me. Waise bhi wo mere liye time waste nhi h(best use of time hai👾 dil khush ho jaata hai) </div>
                            <div className={styles.highlightBox}>Dono Jn apne apne Goals ke liye mehnat karte hain ab.🫰✌️</div>
                            <div className={styles.highlightBox}>Apna bohot boht dhyn rakhnaaa. Aur khabardaar agar meri pyri dost ko pressurise kiya to🔫 ya use stress diya to 🔫 aur garmi me hydrated bhi rehna 🥤🫗</div>
                            <p>Until then bye bye...... </p>





                            <div style={{ textAlign: 'right', marginTop: '40px', fontFamily: 'Parisienne, cursive', fontSize: '2rem', color: '#db7093' }}>
                                Lil Angel Miss....
                            </div>
                        </div>
                    </div>

                    {/* Back Cover (Page 6) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(6) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(6) }}>
                        <div className={styles.coverGlow}></div>
                        <div className={styles.coverFrame} style={{ borderStyle: 'dashed' }}>
                            <div className={styles.coverTitle} style={{ fontSize: '2.5rem' }}>Take Care</div>
                            <div style={{ fontSize: '3rem', margin: '20px 0', textShadow: '0 4px 6px rgba(255, 182, 193, 0.5)' }}>🐰🐻‍❄️</div>
                        </div>
                    </div>

                </div>

                <div className={styles.helperText}>Tap the sides gently to turn the pages</div>
            </div>

            {/* Controls */}
            {!isIntroVisible && (
                <>
                    <div className={`${styles.touchZone} ${styles.zoneLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.touchZone} ${styles.zoneRight}`} onClick={flipNext}></div>
                    <div className={styles.musicToggle} onClick={toggleMusic}>
                        <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>{isPlaying ? '⏸' : '🎵'}</span>
                    </div>
                </>
            )}

            {/* Background music resolved via Vite import for Vercel production deployment */}
            <audio ref={audioRef} loop src={bgMusic} />
        </div>
    );
};

export default BlossomReverie;
