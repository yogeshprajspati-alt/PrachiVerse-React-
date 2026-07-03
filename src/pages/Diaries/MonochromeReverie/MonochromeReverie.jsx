import React, { useState, useEffect, useRef } from 'react';
import styles from './MonochromeReverie.module.css';

// import bgMusic from '../../../assets/diariesbgm/blossomreverie.mp3';

const MonochromeReverie = () => {
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

    const [petals] = useState(() =>
        Array.from({ length: isMobile ? 8 : 18 }).map((_, i) => ({
            id: i,
            size: Math.random() * 8 + 4,
            left: Math.random() * 100,
            dur: Math.random() * 10 + 8,
            del: Math.random() * 14,
        }))
    );

    useEffect(() => {
        const t = setTimeout(() => setIntroReady(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
    }, []);

    const TOTAL = 8;

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

    const zIdx = i => (i < currentPage ? 50 + i : TOTAL - i);
    const flipped = i => i < currentPage;
    const progress = (currentPage / (TOTAL - 1)) * 100;

    const pageLabel =
        currentPage === 0 ? 'Tap the cover to begin  ✦' :
            currentPage === TOTAL - 1 ? '✦  The End  ✦' :
                `${currentPage} / ${TOTAL - 2}  ·  tap sides to turn`;

    return (
        <div className={styles.wrap}>

            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />
            <div className={styles.bgOrb3} />
            <div className={styles.rays} />
            <div className={styles.noise} />

            <div className={styles.petals} aria-hidden="true">
                {petals.map(p => (
                    <div key={p.id} className={styles.petal} style={{
                        width: `${p.size}px`,
                        height: `${p.size * 1.5}px`,
                        left: `${p.left}%`,
                        animationDuration: `${p.dur}s`,
                        animationDelay: `${p.del}s`,
                    }} />
                ))}
            </div>

            {isIntroVisible && (
                <div className={`${styles.intro} ${introReady ? styles.introIn : ''} ${introFading ? styles.introOut : ''}`}>
                    <div className={styles.introFlare1} />
                    <div className={styles.introFlare2} />
                    <div className={styles.introBloom}>🌸</div>
                    <p className={styles.introEye}>A Final Letter</p>
                    <h1 className={styles.introTitle}>Monochrome Reverie</h1>
                    <p className={styles.introSub}>a whisper of feelings</p>
                    <div className={styles.introRule}>
                        <span /><span className={styles.introDots}>✦ ✦ ✦</span><span />
                    </div>
                    <button className={styles.introBtn} onClick={openDiary}>
                        <span>📖</span> Open My Heart
                    </button>
                    <p className={styles.introFoot}>scroll gently · read slowly · feel deeply</p>
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

                    {/* ── COVER ── */}
                    <div
                        className={`${styles.page} ${styles.cover} ${flipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(0) }}
                        onClick={() => currentPage === 0 && goNext()}
                    >
                        <div className={styles.coverShimmer} />
                        <div className={styles.coverInner}>
                            <div className={styles.cBloom}>🌸</div>
                            <div className={styles.cTitle}>For You</div>
                            <div className={styles.cSub}>A Beautiful Soul</div>
                            <div className={styles.cHint}>tap to open  ✦</div>
                        </div>
                    </div>

                    {/* ── PAGE 1 — Hey There (Beginning) ── */}
                    <div className={`${styles.page} ${flipped(1) ? styles.flipped : ''}`} style={{ zIndex: zIdx(1) }}>
                        <div className={styles.pgNum}>01</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>Hey There 🌸</h2>
                            <p>Kabhi-kabhi lagta hai ki tumhe shayad kabhi samajh hi nahi aaya — ki main baar-baar poochta kyun tha, clarity kyun maangta tha, ya tumhare bina bataye chale jaane par itna pareshan kyun ho jaata tha. Ye aaj ki baat nahi hai. Ye kaafi pehle se hi andar bani hui cheez hai.</p>
                            <p>Mujhe bachpan se hi achanak se gayab ho jaane wali cheezen daraati rahi hain. Isiliye main hamesha kehta tha — bata ke jaana. Mujhe daant kha lena bura nahi lagta, mana lena bhi bura nahi lagta. Lekin jab koi bina explanation ke door chala jaaye, to dimaag hazaar possibilities sochne lagta hai. Aur un hazaron mein se ek hoti thi — shayad main matter hi nahi karta.</p>
                            <p>Phir bhi, pata nahi kyun, tum mere liye hamesha matter karti rahi. Baar baar. Bina kisi logical wajah ke.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Some people just matter more, and no amount of logic explains why.
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 2 — Little Things (Bonding & Misunderstandings) ── */}
                    <div className={`${styles.page} ${flipped(2) ? styles.flipped : ''}`} style={{ zIndex: zIdx(2) }}>
                        <div className={styles.pgNum}>02</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>Little Things 🍃</h2>
                            <p>Tumhari jagah koi aur hota to shayad main kab ka connection cut kar chuka hota. Lekin tumhare case mein — har baar gussa aane se pehle, main reasons dhoondhne lagta tha. Sochta tha shayad tum depressed ho, shayad kisi tension mein ho, shayad kisi aur cheez se lad rahi ho.</p>
                            <p>Jab koi cheez objectively disrespectful lagti thi tab bhi mera pehla reaction gussa nahi hota tha — balki ye hota tha ki "koi wajah to hogi." Shayad isi wajah se kabhi-kabhi mujhe khud lagne laga tha ki itni understanding dikhate-dikhate main apni self-esteem hi lose kar raha hoon.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Ek taraf tumhe samajhne ki koshish thi, doosri taraf apni feelings thi — aur dono ke beech main khud hi phans gaya tha.
                            </div>
                            <p>Sabse zyada dukh mujhe rejection se nahi, ambiguity se hua. Jawab "naa" hota toh bhi chalta. Problem ye thi ki jawab hota hi nahi. Tum chup rehti thi, aur main us khamoshi ka matlab samajhne ki koshish karta rehta tha.</p>
                            <div className={styles.tagline}>Kabhi lagta tha — haan, shayad matter karta hoon. Phir kuch aur dekhkar lagta tha — nahi, shayad nahi karta. Aur phir bhi har paanch minute mein phone check kar leta tha. Kuch log bas important ho jaate hain. Tum unhi logon mein se thi.</div>
                        </div>
                    </div>

                    {/* ── PAGE 3 — Everything I Built (Projects & Care) ── */}
                    <div className={`${styles.page} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                        <div className={styles.pgNum}>03</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>Everything I Built 🛠️</h2>
                            <p>Mujhe sabse zyada hurt tab hota tha jab genuine care ko patane ki koshish samajh liya jaata tha. Haan, main tumhe impress karna chahta tha — kaun nahi chahega apni pasandeeda ladki ko impress karna? Lekin jo main karta tha uska bahut bada hissa sirf tumhe khush dekhne ke liye tha. Agar percentage mein bolun — 80% care tha, 20% impress karne ki ichchha.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                PrachiVerse sirf ek website nahi thi — wo un saare moments ka collection tha jahan main tumhare liye aur zyada feel karne laga tha. Prachify sirf ek music app nahi thi — wo us soch ka result tha ki tumhe baar baar ads na sunni padhein.
                            </div>
                            <p>Diaries sirf dairiyan nahi thi — wo meri communication difficulty ka solution tha. Tumse serious baat karte waqt mere haath-pair kaanpne lagte the, isiliye main pehle se likh leta tha. Games isiliye banata tha taaki tum childish, pampered aur cared feel karo.</p>
                            <div className={styles.tagline}>Har cheez ke peeche ek hi intention thi — care. Aur care sirf un cheezon tak seemit nahi thi jo tumne dekhi. Bahut si cheezen thi jo kisi ne notice nahi ki — micro efforts, chhoti planning, chhote decisions. Bas ki gayi. Bina kisi expectation ke.</div>
                            <p>Isliye jab mujhe laga ki meri image ek aise insaan ki ban gayi hai jo bas tumhe paana chahta tha — tab mujhe laga ki ek baar apni side explain karni chahiye. Sympathy ke liye nahi. Bas isliye ki shayad tum meri intentions ko us nazariye se dekh pao jahan se main unhe dekhta tha.</p>
                        </div>
                    </div>

                    {/* ── PAGE 4 — Efforts No One Saw & Why You Were Different ── */}
                    <div className={`${styles.page} ${flipped(4) ? styles.flipped : ''}`} style={{ zIndex: zIdx(4) }}>
                        <div className={styles.pgNum}>04</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>What Actually Hurt 🌧️</h2>
                            <p>Us din bhi — aadhi galti meri thi, aadhi tumhari. Lekin saza sirf mujhe mili. Ye theek tha — agar tum meri pasandeeda na hoti, to main tolerate bhi na karta, baat bhi na karta. Bilkul bhi nahi.</p>
                            <p>Jab bhi tumse serious baat karta tha, mere haath-pair kaanpne lagte the. Isiliye diary prefer karta tha — bhasad aur rayeta bhi isi wajah se fail ho jaata tha. Aur jab gussa aata hai to meri body mein burning sensation hone lagti hai. Matlab thoda-bahut gussa nahi aata, bahut zyada hi aata hai. Isiliye kuch bhi bol deta tha. Wo sirf gussa tha — aur parwah. Dono ek saath.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Mujhe pata tha tumhe birthday yaad nahi rahega. Isiliye dopahar ke 12 bajte hi mene khud apni DOB add kar di — taaki tumko notification mil jaaye, tumko bura na lage. Kabhi bhi apni DOB kahi nahi daalta warna. Ye ek example hai. Aisi countless cheezen hain.
                            </div>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Sometimes it feels ki genuine care hold karna ek curse hai. Samne wale ko hamesha lagta hai usko kuch chahiye — jabki chahiye to bas khushi thi. Mene kab maanga kuch? Galati meri bhi hai — knowing ki zyada availability attraction kill karta hai, phir bhi mene hamesha koshish ki ki tumko wait na karna pade.
                            </div>
                            <p>Despite you ignoring me, taking me for granted, ya kuch bhi ho — main hamesha ruka. Kyunki I loved you from the very beginning. Aur meri intentions really pure thi from the start. Ab aur proof dena mere liye possible nahi hai.</p>
                        </div>
                    </div>

                    {/* ── PAGE 5 — Acceptance & Growth ── */}
                    <div className={`${styles.page} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.pgNum}>05</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>Yours 🌸</h2>
                            <p>Mene kabhi kisi ladki ko approach nahi kiya — except you. Ek hi ladki pasand thi. Poore mann se. Collage ke baad bhi options mile — sundar ladkiyaan, samne se aayi bhi. Lekin mere liye tum hamesha priority rahi — option nahi.</p>
                            <p>Tumse jooth nahi bola — buttering ke liye bhi nahi. Mene tumhe analyse kiya, multiple times test kiya. Tum na sirf pass hui, balki topped. Aur isliye kehta tha — tum different ho.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Bol sakti ho ki main weak tha ki ek hi ladki ki hope mein latka raha. Lekin jo log 17 jagah try karke 17wi ke saath chale jaate hain — unhe main strong nahi maanta. Aur main to nahi hun atleast aisa.
                            </div>
                            <p>Hamesha koshish ki tumhare har negative factor ke peeche ka reason samajhne ki — taaki better treat kar sakun. Lekin is baar main thak gaya. This time I just gave up.</p>
                            <div className={styles.tagline}>I don't want to be your bad memory. Main sirf wo insaan tha jo tumhe genuinely chahta tha — bina kisi condition ke. Aur shayad yahi meri sabse badi galati thi bhi, aur sabse sacchi cheez bhi.</div>
                            <div className={styles.pillRow}>
                                <span className={styles.pill}>Do not Overthink Over This</span>
                                <span className={styles.pill}>🥤 Stay Hydrated</span>
                                <span className={styles.pill}>✌️ Stay Happy</span>
                            </div>
                            <p>Until then bye bye......</p>
                            <div className={styles.signature}>
                                Wanted To Be Your Priority, Not an After-Thought<br />Lil Angel Miss....
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE 6 — Before I Go (Teachings & Closure) ── */}
                    <div className={`${styles.page} ${flipped(6) ? styles.flipped : ''}`} style={{ zIndex: zIdx(6) }}>
                        <div className={styles.pgNum}>06</div>
                        <div className={`${styles.corner} ${styles.cTL}`} /><div className={`${styles.corner} ${styles.cBR}`} />
                        <div className={styles.topRule} />
                        <div className={styles.content}>
                            <h2 className={styles.chHead}>Before I Go 🌙</h2>
                            <p>Appropriate time pe batana tha ye sab. Ab waqt nahi raha. Phir bhi — kuch cheezen hain jo chahta hun ki tum yaad rakho. Apne baare mein.</p>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Taunt mat mara karo kisi ko bhi. Normal logon ko gussa aata hai — especially males. Agar kuch kehna ho to ek dhang hoti hai — seedhi baat, indirect nahi. Ladkon se jyada dikkat ladkiyaan de deti hain is mamle mein — without you even realising.
                            </div>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                No matter what happens — apni khushi aur wellbeing hamesha pehle. Koi kuch bhi kahe, usse dabana nahi. Kisi ke judgment ko personally justify nahi karna. Sabki thinking alag hoti hai — kyunki unhe mili hui privileges alag hain.
                            </div>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Always be proud of yourself. Tum deserving ho — har cheez ki.
                            </div>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Never hold the past. Never try to bind the future. Cherish the present — cherish your smile.
                            </div>
                            <div className={styles.quote}>
                                <span className={styles.qMark}>"</span>
                                Agar tum sochti ho ki main kuch bhi bol sakta hun ab — to bhool jaao. Meri pasandeeda ladki alag hai. Princess — tum jaanti ho.
                            </div>
                        </div>
                    </div>

                    {/* ── BACK COVER ── */}
                    <div
                        className={`${styles.page} ${styles.cover} ${styles.backCover} ${flipped(7) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(7) }}
                    >
                        <div className={styles.coverShimmer} />
                        <div className={styles.coverInner}>
                            <div className={styles.cBloom} style={{ fontSize: '3.2rem' }}>👋🎀</div>
                            <div className={styles.cTitle} style={{ fontSize: '2.6rem' }}>Take Care</div>
                            <div className={styles.backQuote}>"Until we meet again in the pages of the next chapter... If it exists"</div>
                            <div className={styles.backHearts}>🌸 ✨ 🌸</div>
                        </div>
                    </div>

                </div>{/* /pages */}

                <div className={styles.hint}>{pageLabel}</div>

            </div>{/* /book */}

            {!isIntroVisible && (
                <>
                    <div className={`${styles.zone} ${styles.zL}`} onClick={goPrev} />
                    <div className={`${styles.zone} ${styles.zR}`} onClick={goNext} />
                    <button className={`${styles.arrow} ${styles.arL}`} onClick={goPrev} disabled={currentPage === 0} aria-label="Previous">‹</button>
                    <button className={`${styles.arrow} ${styles.arR}`} onClick={goNext} disabled={currentPage === TOTAL - 1} aria-label="Next">›</button>
                    <button className={styles.musicBtn} onClick={toggleMusic} aria-label="Toggle music">
                        <span>{isPlaying ? '⏸' : '🎵'}</span>
                    </button>
                </>
            )}

            <audio ref={audioRef} loop src="" />
        </div>
    );
};

export default MonochromeReverie;