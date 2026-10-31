import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useEscapeBack from '../../../hooks/useEscapeBack';
import styles from './MidnightFlash.module.css';

const AUDIO_SRC = '/assets/music/LoveStoryPianoCover.mp3';

// ─── Interactive Scratch Card Component ──────────────────────────────────────
const ScratchToReveal = ({ children, coverText = "Rub to reveal secret wish ✨" }) => {
    const canvasRef = useRef(null);
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            // Warm golden-bronze coating
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#c99a53');
            gradient.addColorStop(0.5, '#e0b571');
            gradient.addColorStop(1, '#a67735');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Shimmer noise
            for (let i = 0; i < 90; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(80, 45, 15, 0.25)';
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Cover Text with high contrast
            ctx.font = 'bold 20px Caveat, cursive';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 4;
            ctx.fillText(coverText, canvas.width / 2, canvas.height / 2);
            ctx.shadowBlur = 0;
        };

        resize();

        let isDrawing = false;
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const scratch = (e) => {
            if (!isDrawing) return;
            if (e.cancelable) e.preventDefault();
            const { x, y } = getPos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 24, 0, Math.PI * 2);
            ctx.fill();
        };

        const start = (e) => { isDrawing = true; scratch(e); };
        const end = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', end);
        canvas.addEventListener('mouseleave', end);

        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        canvas.addEventListener('touchend', end);

        return () => {
            canvas.removeEventListener('mousedown', start);
            canvas.removeEventListener('mousemove', scratch);
            canvas.removeEventListener('mouseup', end);
            canvas.removeEventListener('mouseleave', end);

            canvas.removeEventListener('touchstart', start);
            canvas.removeEventListener('touchmove', scratch);
            canvas.removeEventListener('touchend', end);
        };
    }, [coverText]);

    return (
        <div className={styles.scratchWrapper}>
            <div className={styles.scratchInnerContent}>
                {children}
            </div>
            <canvas
                ref={canvasRef}
                className={`${styles.scratchCanvas} ${cleared ? styles.scratchCanvasCleared : ''}`}
                onDoubleClick={(e) => { e.stopPropagation(); setCleared(true); }}
                title="Scratch with finger or double tap to clear"
            />
        </div>
    );
};

// ─── Interactive Peelable Washi Tape Component ────────────────────────────────
const TapeReveal = ({ secretText, tapeText = "Peel Tape For A Secret 🩹" }) => {
    const [peeled, setPeeled] = useState(false);
    return (
        <div className={styles.tapeRevealContainer}>
            <div
                className={`${styles.tape} ${styles.peelableTape} ${peeled ? styles.peeled : ''}`}
                onClick={(e) => { e.stopPropagation(); setPeeled(true); }}
            >
                {tapeText}
            </div>
            <div className={`${styles.secretContent} ${peeled ? styles.secretVisible : ''}`}>
                {secretText}
            </div>
        </div>
    );
};

// ─── Interactive Pinned Note Reveal Component ─────────────────────────────────
const FlirtyReveal = ({ question, answer, buttonText = "[ TAP TO REVEAL ]" }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className={`${styles.secretNote} ${isRevealed ? styles.secretNoteOpened : ''}`}>
            <div className={styles.pin}></div>
            <p className={styles.handWritten} style={{ margin: 0 }}>
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

// ═════════════════════════════════════════════════════════════════════════════════
// MAIN DIARY COMPONENT: 22:05 VINTAGE PARCHMENT FLIPBOOK
// ═════════════════════════════════════════════════════════════════════════════════
const MidnightFlash = () => {
    const navigate = useNavigate();
    useEscapeBack();
    const [currentPage, setCurrentPage] = useState(0);
    const [turning, setTurning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Combination Lock State: 1-1-3 (Prachi's special day)
    const CODE = [1, 1, 3];
    const [dials, setDials] = useState([0, 0, 0]);
    const [unlocked, setUnlocked] = useState(false);
    const [shake, setShake] = useState(false);
    const [sparkle, setSparkle] = useState(false);

    const TOTAL = 18; // Cover + 16 Story Pages + Back Cover

    const spin = (i) => setDials(d => d.map((v, k) => k === i ? (v + 1) % 10 : v));

    // Instant unlock option
    const unlockInstantly = () => {
        setDials(CODE);
        setUnlocked(true);
        setSparkle(true);
        setTimeout(() => {
            goNext();
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
        }, 800);
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
            if (currentPage === 1) return; // Keep unlocked once open
            setTurning(true);
            setCurrentPage(p => p - 1);
            setTimeout(() => setTurning(false), 950);
        }
    };

    // Combination dial unlock listener
    useEffect(() => {
        if (unlocked) return;
        if (dials.join('') === CODE.join('')) {
            setUnlocked(true);
            setSparkle(true);
            setTimeout(() => {
                goNext();
                audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
            }, 1000);
        } else if (dials.every((d, i) => d !== 0 || i === 0) && dials[2] !== 0 && dials[1] !== 0 && dials[0] !== 0) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
        }
    }, [dials, unlocked]);

    // Audio cleanup
    useEffect(() => {
        const audio = audioRef.current;
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => { });
        }
        setIsPlaying(p => !p);
    };

    const zIdx = i => (i < currentPage ? 50 + i : TOTAL - i);
    const flipped = i => i < currentPage;
    const progress = (currentPage / (TOTAL - 1)) * 100;

    const pageLabel =
        currentPage === 0 ? 'Unlock Code: 113 (Tumhara Special Din) 🌹' :
            currentPage === TOTAL - 1 ? 'Always a safe space ✦ Be happy' :
                `${currentPage} / ${TOTAL - 2} · tap sides to turn`;

    return (
        <div className={styles.wrap}>
            {/* Ambient Floating Dust */}
            <div className={styles.fairyDustContainer}>
                {Array.from({ length: 35 }).map((_, i) => (
                    <div
                        key={i}
                        className={styles.fairyDust}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3.5 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className={styles.bgSpotlight} />

            {/* Back to Home Button */}
            <button
                type="button"
                className={styles.homeBtn}
                onClick={() => navigate('/')}
                title="Back to Prachiverse"
            >
                <i className="fas fa-arrow-left"></i>
                <span>Prachiverse</span>
            </button>

            {/* ══════════════════════════════════════════════════════════════
                3D FLIPBOOK NOTEBOOK
            ══════════════════════════════════════════════════════════════ */}
            <div className={`${styles.book} ${sparkle ? styles.bookGlow : ''}`}>
                <div className={styles.spine} />

                {/* Reading Progress Indicator */}
                <div className={styles.progBar}>
                    <div className={styles.progFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.pages}>

                    {/* ─── PAGE 0: VINTAGE LEATHER COVER WITH BRASS LOCK ─── */}
                    <div
                        className={`${styles.page} ${styles.leather} ${flipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(0) }}
                    >
                        <div className={styles.emboss} />

                        {/* Title Emboss */}
                        <div className={styles.coverTitlePlate}>
                            <span className={styles.coverSubtitle}>A MIDNIGHT MEMOIR</span>
                            <h1 className={styles.coverMainTitle}>Dear Prachi</h1>
                            <span className={styles.coverTimestamp}>22:05 ✦ A STOLEN MOMENT</span>
                        </div>

                        {/* Sticky Hint Note */}
                        <div className={styles.stickyNote}>
                            <div className={styles.tape} style={{ top: '-8px', left: '50%', transform: 'translateX(-50%) rotate(0deg) scale(0.6)', padding: '4px 25px' }}></div>
                            <span className={styles.handWritten} style={{ fontSize: '1.25rem', color: '#3d2516', lineHeight: '1.3' }}>
                                Secret Code:<br />
                                <strong>1 - 1 - 3</strong>
                            </span>
                        </div>

                        {/* Leather Strap & Dials */}
                        <div className={`${styles.strap} ${unlocked ? styles.strapOpen : ''}`}>
                            <div className={`${styles.lock} ${shake ? styles.lockShake : ''} ${sparkle ? styles.lockUnlock : ''}`}>
                                {dials.map((d, i) => (
                                    <button
                                        key={i}
                                        className={styles.dial}
                                        onClick={(e) => { e.stopPropagation(); spin(i); }}
                                        title={`Spin dial ${i + 1}`}
                                    >
                                        <span>{d}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick unlock button */}
                        {!unlocked && (
                            <button
                                type="button"
                                className={styles.quickUnlockBtn}
                                onClick={(e) => { e.stopPropagation(); unlockInstantly(); }}
                            >
                                <i className="fas fa-key"></i> Tap to Open with Key
                            </button>
                        )}
                    </div>

                    {/* ─── PAGE 1: THE HERO PAGE (Reference Artwork + Washi Tag) ─── */}
                    <div
                        className={`${styles.page} ${styles.heroPage} ${flipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(1) }}
                    >
                        <div className={styles.content} style={{ justifyContent: 'flex-end', paddingBottom: '20px' }}>
                            <div className={styles.heroStickyTag}>
                                <div className={styles.tape} style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) scale(0.7)' }}></div>
                                <p className={styles.handWritten} style={{ margin: 0, textAlign: 'center' }}>
                                    Hellooooo madam....... aaj lauki toh nhi bani hogi for sure 😏 poori sabziii...😂
                                </p>
                            </div>
                        </div>
                    </div>

                                        {/* ─── PAGE 2: ALWAYS IN YOUR FAVOUR (Dost bura-bhala & Misunderstandings) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(2) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 02</div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>ALWAYS IN YOUR FAVOUR</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Tum darti ho ki tumhare baare mein mere dost bura-bhala kahenge.... Aisa kabhi nhi hoga Prachi. Me bhi, you know, maine bas 1-2 din hi bola tha, woh bhi directly tumse, naa ki kisi aur se. Aur 1-2 din ke baad me firse tumhare favour mein aa gaya tha.
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Tumhare baare mein koi kuch bhi bole, toh main har baar usse agree karunga, aisa thodi hai yr. Main tumhe jaanta hoon, aur sirf kuch baaton ya misunderstandings ki wajah se tumhare baare mein apni poori thinking change nahi kar sakta.
                            </p>

                            <div className={styles.elegantQuote} style={{ marginTop: '0.6rem' }}>
                                Very much possible hai ki tumhe lekar meri thinking mein kuch galat ho, ya tumhari kuch cheezein mujhe samajh na aayi hon, but that doesn't mean ki main tumhare against ho jaunga. 🌸
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 3: THE LIVING PROOF (Arindam's Side & Protection) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(3) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(3) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 03</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>THE LIVING PROOF</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Yr tum khud soch ke dekho naa, jab bhi apni ladai hoti thi arindam tumhari side kyun leta thaa.. jabki dost to wo mera hai.. or tumse to interaction bhi nhi hue.. technically usko meri side leni chaiye na?? Kyuki batata bhi to me hu mere pov se??
                            </p>

                            <div className={styles.elegantQuote} style={{ marginTop: '0.8rem' }}>
                                Wo isiliye hai kyuki me tumhare against sun hi nhi sakta kuchh.. usko bhi pta hai ye cheez.. or yahi cheez sabke upar applicable hai. ❤️
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 4: DON'T FEEL FLOODED (Why Deepak creates things) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(4) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(4) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 04</div>
                            <div className={`${styles.tape} ${styles.tapeTopLeft}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>NEVER FEEL FLOODED</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Aur yr, ek aur cheez hai jo main tumhe batana chahta hoon. Woh sab cheezein jo maine ab tak banayi hain, jo banata hoon aur aage bhi banata rahunga, unse tumhe flooded feel nahi karna hai kabhi bhi.
                            </p>

                            <TapeReveal
                                tapeText="Peel washi tape for Deepak's honest thought 🩹"
                                secretText="Woh sab maine tumhe impress karne se zyada tumhari help karne ke liye banayi thi. Aur waise bhi.... tum ho hi itni special aur khaas ki mann kar jaata hai kuch toh karo, kuch toh karo alag saaaa.... 😂"
                            />

                            <p className={styles.handWritten} style={{ marginTop: '0.6rem' }}>
                                Main karta hoon kyunki main kar sakta hoon, aur main apni marzi se karta hoon sab. Tumhe achha lage, tumhari help ho jaaye, tumhara koi kaam easy ho jaaye, bas isi liye.
                            </p>
                        </div>
                    </div>

                    {/* ─── PAGE 5: PRESSED FLOWERS (Apni Khushi Se Karta Hoon & Return) ─── */}
                    <div
                        className={`${styles.page} ${styles.flowerPage} ${flipped(5) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(5) }}
                    >
                        <div className={styles.content} style={{ justifyContent: 'flex-end', paddingBottom: '25px' }}>
                            <div className={styles.flowerParchmentCard}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Iska matlab ye thodi hai ki tumhe bhi uske badle mein kuch karna hai ya meri expectations poori karni hain. Please kabhi pressure mat lena in sab cheezon ka. Main jo karta hoon, apni khushi se karta hoon yr. Tumhe har cheez ka return dene ki zaroorat nahi hai. Pehli baat to return mujhe apne aap mil jata h wo bhi multiply hoke.... ✨
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 6: APAN KI BONDING ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(6) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(6) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 06</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>BEST FRIENDS BONDING</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Dekho, apan ki bonding ordinary friendship se kahin jyada better thi.... best friends jaisi hi toh ban rahi thi na yr? 😂😭 Matlab itni achhi bonding ban rahi thi, apan itni saari baatein karte the, itna kuch share karte the.... toh aise kaise tod dein yr ye?
                            </p>

                            <div className={styles.quoteParchmentCard} style={{ marginTop: '0.8rem' }}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Lekin gusse mein bas negatives hi dikhte hain yr, us waqt achhi cheezein yaad hi nahi rehti. Aur jab gussa thanda hota hai, tab samajh aata hai ki jis insaan se itni saari achhi memories judi hain, uske saath sirf kuch galat moments ko lekar sab kuch khatam kar dena bhi toh sahi nahi lagta.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 7: DIL SE MAAFI (Arindam & Realization) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(7) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(7) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 07</div>
                            <div className={`${styles.tape} ${styles.tapeTopLeft}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>DIL SE MAAFI</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                I agree, maine gusse mein bohot kuch bol diya tha. Main ye nahi keh raha ki meri galti nahi thi, ya gusse mein bol diya toh sab maaf ho jaana chahiye. Galat tha toh galat tha.
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Mene bohot galat kara tha yr gusse me, tum kisi bhi scenario ke liye sure nhi thi tum mujhe samjhane ki kosish kar rhi thi ki arindam se baat karo, lekin me samajh hi nhi rha tha.. me bs force kar ke result nikalne me laga tha.. tumko takleef deke..
                            </p>

                            <div className={styles.quoteParchmentCard} style={{ marginTop: '0.6rem' }}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Or please jo bhi mene abtak bola gusse me, bhool jao yr sab ho sake to, kyuki usme se kuch bhi sahi nhi tha, kuch bhi bol diya wo to ab dekh ke itna bura lag rha na me bata nhii sakta...
                                </p>
                            </div>

                            <div className={styles.elegantQuote} style={{ marginTop: '0.6rem' }}>
                                Aage se me aisa kabhi nhi hone dunga. Mujhe maaf kardo Prachii, me improve karunga yr sab. 🌸
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 8: MISS PERFECT & BLESSED ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(8) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(8) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 08</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>MISS PERFECT & BLESSED</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Mujhe pta h shyd me tumara bohot accha dost tha, tum bol nhi paati thi. Or shyd chanchal ke baad me hi importance hold karta tha... Lekin me to hila hua hu..... isliye faltoo cheezen sochne laga tha.
                            </p>

                            <div className={styles.quoteParchmentCard} style={{ marginTop: '0.6rem' }}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    "Waise accha hua ye sab hua, atleast mujhe meri galatiyan to dikhi kamiyan bhi ab me kuch to improve karunga apne andar."
                                </p>
                            </div>

                            <div className={styles.elegantQuote} style={{ marginTop: '0.6rem' }}>
                                Isiliye me kehta hu tum 'Miss Perfect ho' kyuki har baar kuch na kuch magic sa kar deti ho. Or yr Maan jao Blessed bhi ho..... Me kisi din dikha hi dunga kyunnnn.... bol ke shyd tum waise na dekh pao.... ✨🌸
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 9: AT LEAST BEST FRIEND TOH HO NA? (Relationship & Ladna) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(9) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(9) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 09</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>BEST FRIEND TOH HO NA?</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.5rem' }}>
                                Prachi, bhale hi apan ka bond kabhi relationship mein convert naa ho.... lekin at least tum mujhe apna best friend toh maanogi na? 😭
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.5rem' }}>
                                Matlab har cheez ka end relationship hi thodi hota hai yr. Apan ki bonding achhi hai, toh use achha hi rehne dete hain na. Future mein kya hoga, kaisa hoga, woh abhi se decide karna zaroori hai kya?
                            </p>

                            <FlirtyReveal
                                question="Ek honest sawaal Prachi... 💭"
                                answer="Or waise bhi tumse ladne me jyada maja ata h 😩😂"
                                buttonText="[ TAP TO REVEAL ]"
                            />
                        </div>
                    </div>

                    {/* ─── PAGE 10: PRESENT OVER FUTURE (Sapne & Bechaini) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(10) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(10) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 10</div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>PRESENT OVER FUTURE</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Aur haan, itne din lagataar bhaiya, yash, tumhare or mere sapne dekhne ke baad aur fir bechain rehne ke baad, I feel like apan ko future ko itna pressurise nahi karna chahiye yr. 😂
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.5rem' }}>
                                Matlab kitna sochenge ki aage kya hoga, kya nahi hoga, apan kabhi us point par pahunchenge bhi ya nahi.... aur fir inhi sab cheezon ko soch-soch kar present mein jo achha hai, woh bhi kharab kar dein.
                            </p>

                            <div className={styles.elegantQuote}>
                                Future prediction ke chakkar mein present kyun kharab karna hai, hai na??
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 11: GO WITH THE FLOW (Efforts & No Guilt) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(11) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(11) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 11</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>GO WITH THE FLOW</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Bas apni side se effort do thoda sa, aur fir naturally jo hona hai, hone dooo.... Jo milna hota hai, woh mil jaata hai; jo nahi hota, woh nahi milta. Har cheez ko force karke ya pehle se decide karke thodi na paaya ja sakta hai.
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Mujhe lagta hai apan logon ko bhi same hi karna chahiye. Apan apni side se achhe rahein, ek doosre ko samjhein, apni bonding ko achha banayein, aur baaki cheezein naturally hone dein.
                            </p>

                            <div className={styles.quoteParchmentCard}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Nahi toh shayad mujhe bhi kabhi guilt ho ki maine itni achhi bonding bas apni overthinking ke chakkar mein kharab kar di.... aur shayad at some point tumko bhi same guilt ho. Ki yr, cheezein itni buri bhi nahi thi, fir bhi humne unhe itna complicated bana diya. Isiliye rehne dete hain yr. Let's go with the flow and results ko jaisa aana hai, naturally aane dete hain. Abhi se har cheez ka answer nikaalne ki zaroorat nahi hai. Jo aaj achha hai, use aaj achha rehne dete hain na. 😂❤️
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 12: ZERO BETRAYAL (Uncertainty & Respect) ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(12) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(12) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 12</div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>ZERO BETRAYAL</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Aur rahi baat kabhi kuch uncertain hone ki.... waise toh pehli baat, uncertain kehna hi nahi chahiye. If you find someone really good, toh mat sochna yr ki main tumhe bura-bhala bolunga ya tumhare baare mein kuch galat sochunga.
                            </p>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Agar maine aisa kiya, toh main apni hi nazron mein gir jaunga. Kyuki meri language mein, jab tum kisi ko apna maante ho aur fir uske saath aisa kuch karte ho, toh usko betrayal kehte hain. Aur main aisa nahi kar sakta kabhi bhiiiiii......
                            </p>

                            <div className={styles.quoteParchmentCard}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Tumhari life hai yr, tumhe jo sahi lage, jiske saath tum khush raho, woh important hai. Main tumhe apna maanta hoon toh iska matlab ye thodi ki tumhari life mein aane wale har insaan ko main apne against samajhne lagunga. Aisa thodi hota hai. Kisi ko apna maanne ka matlab ye thodi ki uski khushi par apna haq samajh lo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 13: SAHELI & PROTEIN LOGIC ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(13) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(13) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 13</div>
                            <div className={`${styles.tape} ${styles.tapeTopLeft}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>SAHELI PROTOCOL 💅🏻</h2>

                            <div className={styles.elegantQuote}>
                                If not your man, thennnn I'll be your saheli 😂❤️ har jagah support dene ke liye....
                            </div>

                            <TapeReveal
                                tapeText="Peel for Deepak's scientific milk theory 🥛"
                                secretText="Aur waise bhi, jaise milk kisi bhi form mein lo, protein toh milta hi hai 😂😂 waise hi Prachi ko saath rakhne se luck achha rehta hai yr, bhale kisi bhi form mein hooooo.... 😂 Relationship nahi toh bestfriends, bestfriend nahi toh saheli. Bas madam ki presence rehni chahiye, baaki sab go with the flow 😂🤌🏻❤️"
                            />
                        </div>
                    </div>

                    {/* ─── PAGE 14: CUTOFF SOLUTION NAHI HOTA ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(14) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(14) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 14</div>
                            <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>NO CUTOFFS</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.35rem' }}>
                                Aur ek baat aur.... cutoff solution thodi hota hai yr 😂😂 Woh toh bas problem ko ignore karna hota hai, fix thodi karna hai usse. Haan, kabhi-kabhi distance lena zaroori hota hai, aur main ye bhi samajhta hoon ki har cheez ko baith kar sort karna possible nahi hota. Lekin agar kisi bond mein achha bhi bahut kuch raha ho, toh kya usko samajhne aur better karne ka ek chance bhi nahi hona chahiye?
                            </p>

                            <div className={styles.elegantQuote}>
                                Chahe kuch bhi ho jaaye me tumhara saath nhi chhorunga, bhale kuch bhi ho jaaye. ❤️
                            </div>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Main ye nahi keh raha ki har cheez pehle jaisi hi ho jaye, ya tum zabardasti kuch maintain karo. Bas itna ki jo bhi decision ho, woh gusse, guilt ya overthinking mein nahi, balki aaram se soch kar ho.
                            </p>

                            <div className={styles.quoteParchmentCard}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Bas apan achhe se rahein yr. Tum apni life jiyo, main apni life mein aage badhun, dono apne-apne goals par focus karein, aur jab baat ho toh achhe se ho. Koi unnecessary pressure nahi, koi obligation nahi. Aur jo bond naturally maintain ho sakta hai, use naturally maintain hone dein.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 15: CLEAR & FREE ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(15) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(15) }}
                    >
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 15</div>
                            <div className={`${styles.tape} ${styles.tapeTopLeft}`}></div>

                            <h2 className={styles.mainTitle} style={{ marginTop: '0.6rem' }}>CLEAR & FREE</h2>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                Me apni side se bohot clear hu is baar se, tum har cheez ke liye free ho. Or me bhi, kisi cheez ka koi pressure nhi h kisi pe abse.
                            </p>

                            <div className={styles.elegantQuote}>
                                Kuch hota h to good, nhi hota tab bhi good. And nothing's gonna change.
                            </div>

                            <p className={styles.handWritten} style={{ marginTop: '0.4rem' }}>
                                If you find somebody, i'll not cutoff lekin thoda sa distance bsss... koi ni milta to same cheez chalti rahegi. Mujhe milti h to me bhi wahi karunga..
                            </p>

                            <div className={styles.quoteParchmentCard} style={{ marginTop: '0.6rem' }}>
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Tum na tension nhi liya karo, bs bekar ka pressure nhi liya karo. Or me tumhara bura nhi karne wala kabhi, Please prachi please me tab bohot gusse me tha yr, ange se me aisa kabhi nhi karunga. I promise I'll work on it. Tum hi nhi rahogi to me ladunga kis se 😩 kon mujhe taunt maarega  😩 suggestions kon dega😩 please mujhe saaf mat karoo... maaf kardo... 
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── PAGE 16: AARAM SE SOCHNA & CLOSURE ─── */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(16) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(16) }}
                    >
                        <div className={styles.content} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <p className={styles.handWritten} style={{ margin: '4px 0 10px', textAlign: 'center' }}>
                                Baaki madam, tum aaram se sochna. Main tumse abhi koi final answer ya promise nahi maang raha. Jo tum genuinely feel karti ho, wohi batana. Bas apne dil se poochna woh kya chahta hai, jo first time mein nikle wahi karna, kisi se suggestion nahi lena. Main bas nahi chahta ki apan ki achhi bonding ko hum apne hi dimaag mein itna complicated bana dein ki jo achha hai, woh bhi achha na reh paaye.
                            </p>

                            <ScratchToReveal coverText="Rub for final midnight note 🌙">
                                <p className={styles.handWritten} style={{ margin: 0 }}>
                                    Aur haan, lauki bani ho toh bata dena. Itni serious baaton ke baad kuch toh normal rehna chahiye na madam 😂😂❤️ add back karo to bata dena, snapchat download kar lunga me bhi fir...... telegram bada boring hai.....
                                </p>
                            </ScratchToReveal>

                            <div className={styles.closureCard} style={{ marginTop: '12px', padding: '16px 20px', width: '92%' }}>
                                <div className={styles.pin} style={{ top: '-10px' }}></div>
                                <h2 className={styles.closureHeader}>ALWAYS YOUR SAFE HAVEN</h2>
                                <div className={styles.dividerGold}></div>
                                <p className={styles.handWritten} style={{ margin: '6px 0', color: '#1f1107' }}>
                                    Main tumhe apna maanta hoon, toh tumhari khushi aur tumhari comfort bhi mere liye matter karti hai. Be happy, Hamesha! 🌸
                                </p>
                                <h1 className={styles.closureSign} style={{ margin: '4px 0 0' }}>— Deepak ❤️</h1>
                            </div>

                            <button
                                type="button"
                                className={styles.finishCloseBtn}
                                onClick={() => navigate('/')}
                            >
                                Close Diary & Keep Smiling 🌸
                            </button>
                        </div>
                    </div>

                    {/* ─── PAGE 17: ANTIQUE LEATHER BACK COVER ─── */}
                    <div
                        className={`${styles.page} ${styles.backCover} ${flipped(17) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(17) }}
                    >
                        <div className={styles.waxSeal}>
                            <span className={styles.waxSealIcon}>✦</span>
                            <span className={styles.waxSealText}>PRACHIVERSE • 22:05</span>
                        </div>
                    </div>

                </div>{/* /pages */}

                <div className={styles.hint}>{pageLabel}</div>
            </div>{/* /book */}

            {/* Tap zones for intuitive page turning */}
            <div className={`${styles.zone} ${styles.zL}`} onClick={goPrev} />
            <div className={`${styles.zone} ${styles.zR}`} onClick={goNext} />
            <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arL}`} onClick={goPrev} disabled={currentPage <= 1}>‹</button>
            <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arR}`} onClick={goNext} disabled={currentPage === TOTAL - 1}>›</button>
            <button className={`${styles.clayBtn} ${styles.musicBtn}`} onClick={toggleMusic}>
                <span>{isPlaying ? '⏸' : '🎵'}</span>
            </button>

            <audio ref={audioRef} loop src={AUDIO_SRC} />
        </div>
    );
};

export default MidnightFlash;
