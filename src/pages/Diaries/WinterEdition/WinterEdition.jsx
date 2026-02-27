import React, { useState, useEffect, useRef } from 'react';
import styles from './WinterEdition.module.css';

const WinterEdition = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [hintVisible, setHintVisible] = useState(true);
    const totalPages = 5; // Cover + 4 content pages

    // Snowflakes Logic
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const flakeCount = 50;
        const newSnowflakes = Array.from({ length: flakeCount }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            animationDuration: (Math.random() * 10 + 10) + 's',
            animationDelay: Math.random() * 10 + 's',
            fontSize: (Math.random() * 1 + 0.5) + 'em',
            opacity: Math.random() * 0.6 + 0.4
        }));
        setSnowflakes(newSnowflakes);
    }, []);

    // Navigation Hint Logic
    useEffect(() => {
        if (!hintVisible) return;
        // In the original, it hides on first interaction
    }, [hintVisible]);

    const hideHint = () => {
        if (hintVisible) setHintVisible(false);
    };

    const flipPage = (direction) => {
        hideHint();
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'back' && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Touch/Swipe Logic
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isScrolling = useRef(false);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
        touchStartY.current = e.changedTouches[0].screenY;
        isScrolling.current = false;
    };

    const handleTouchMove = (e) => {
        const touchY = e.changedTouches[0].screenY;
        if (Math.abs(touchY - touchStartY.current) > 10) {
            isScrolling.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (!isScrolling.current) {
            const diff = touchStartX.current - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) flipPage('next');
                else flipPage('back');
            }
        }
    };

    // Click Navigation (Split Screen)
    const handleClick = (e) => {
        if (window.innerWidth <= 768) return; // Rely on swipe/tap logic on mobile if needed, but original had click too.
        // Actually original had click on document for split screen.

        // Don't flip if interacting with scrollbar or specific elements if needed
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;

        if (clickX > screenWidth / 2) {
            flipPage('next');
        } else {
            flipPage('back');
        }
    };

    // Check if pages are flipped based on index
    // Page 0 (Cover) is index 0. Page 1 is index 1, etc.
    // If currentPage is 0, no pages flipped.
    // If currentPage is 1, Page 0 is flipped.
    // The original logic: page classes are .page.
    // Original JS: pages[currentPage].classList.add('flipped'); currentPage++; 
    // This means if we are at page 0 and go next, page 0 gets flipped, we are now "looking at" page 1 (technically page 1 is revealed).
    // So if index < currentPage, it is flipped.

    const isFlipped = (index) => index < currentPage;

    return (
        <div className={styles.winterEditionContainer} onClick={handleClick}>
            {/* Aurora Background */}
            <div className={styles.aurora}></div>

            {/* Snowfall Effect */}
            <div className={styles.snowfall}>
                {snowflakes.map(flake => (
                    <div
                        key={flake.id}
                        className={styles.snowflake}
                        style={{
                            left: flake.left,
                            animationDuration: flake.animationDuration,
                            animationDelay: flake.animationDelay,
                            fontSize: flake.fontSize,
                            opacity: flake.opacity
                        }}
                    >
                        ❄
                    </div>
                ))}
            </div>

            {/* Navigation Hint */}
            <div className={`${styles.navHint} ${!hintVisible ? styles.hidden : ''}`}>
                👈 Tap left/right to turn pages 👉
            </div>

            {/* Notebook */}
            <div className={styles.notebookContainer}>
                <div
                    className={styles.notebook}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.spiral}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={styles.spiralRing}></div>
                        ))}
                    </div>

                    {/* Cover Page (Index 0) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: 11 }}
                    >
                        <div>Pirachiiiiiiii....... 💖✨</div>
                        <div className={styles.coverSubtitle}>Title khud bana lo</div>
                    </div>

                    {/* Page 1 (Index 1) */}
                    <div
                        className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: 10 }}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>1</div>
                            <p><span className={styles.emoji}>❄️</span> <span className={styles.highlight}>Againn... I know, I know </span></p>
                            <p>Haannn... bola to tha mene ki wo hi last h, lekinnnn mera code meri marzi 🦥🐼 Tum to padh
                                logiii.
                            </p>
                            <p>Kitni Thand hai yaha basoda me, Dhyn rakhoo or kya🐣</p>
                            <p>Waise mene wo "Bs itna shareef hu" aise hi bhej diya tha. Dikha rha tha bs ki almost sab mere
                                around safe feel karti h 🦥,
                                they knows well me kaisa hu 🙃,
                                Bs meri crush ko nhi kara paya thaa..
                            </p>
                            <p>Wo tumne saksham ki chat padhi thii na, me crop karna hi bhool gaya wo "r" word. Dekhne me
                                kharab, sunne me aur jyada kharab.</p>
                            <p>Me wo word use nhi karta🙃. Kher sirf saksham nhi un dono ko sab bolte thee starting se, shyd
                                unko pata bhi ho. Mene to nhi bola, or shyd bolunga bhi nhi🙃🦥 Meri khud bhi self esteem h
                                isiliyeee.. </p>
                        </div>
                    </div>

                    {/* Page 2 (Index 2) */}
                    <div
                        className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: 9 }}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>2</div>
                            <p><span className={styles.emoji}>🌨️</span> <span className={styles.highlight}>.........</span></p>
                            <p>Mene jooth bola tha kl, ki me screen ke samne tha or phone pass me rakha tha. Asal me wo adha
                                sach tha.</p>
                            <p>Sach ye h ki me poorani conversation padh rha thaa.. Taaki dekh saku ki kahi mene kuch galati naa
                                kar diii ho :)</p>
                            <p>Poorani adat h ye meri, kyuki me sab bigad deta hu hamesha.</p>
                            <p>Wo photo bhale hi blur thi lekin tum acchi lag rhi thi usmee.. "Divaa hi kehnde" iska mtlb star
                                performer h kyaa prachiii????</p>
                            <p>Ek or cheez. Tumhara koi dost ho to usme koi galat baat nhi h. Aise to mere bhi dost h. Zaroori
                                thodi h har dost ka mtlb kuch galat hoo.. </p>
                            <p>Me to bs pooch hi rha tha ki raaj h ki nhi. Wo accha ladka h waise. Meri last time uske birthday
                                pe baat hui thi, pichle saal. </p>

                            <p><span className={styles.highlight}>Pata nhi aisa kyun hota h😂 Sahi time me sahi words nhi milte. Or jab
                                milte h tab sahi moka nhi hota</span></p>
                            <p>Waise ek tum hi nhi ho jisko mene nickname diya h. </p>
                            <p>Jinki bohot jyada hi parvah hoti h unko de deta hu. Meri behen ko to me kuch bhi bol ke bula leta
                                hu😂 wo mere se aloo bolti h 😂 or ye meri id bhi "deep.ak2294 se "aloo2294" usi dusht ne kari
                                thii..</p>
                            <p>Shraddha ko captain bola hu me, shuru se 🦥 wo mujhe computer bolti h 😂. Anukriti se kurkura
                                bolta tha me🦥 wo mere se beta biloni 😂</p>
                        </div>
                    </div>

                    {/* Page 3 (Index 3) */}
                    <div
                        className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`}
                        style={{ zIndex: 8 }}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>3</div>
                            <p><span className={styles.emoji}>💙</span> <span className={styles.highlight}>Mujhe shak h tum ye padhti bhi ho ki
                                nhi😼</span></p>
                            <p>Ab tumko billu nhi pasand to koi accha sa naam sochunga meee....</p>
                            <p>Jiska use sirf me kar saku😂 Even though Prachiii bohot bohot accha naam h.</p>
                            <p>Prachiiiii to bhole naath h</p>
                            <p>
                                Tumhari kichdi ki recipe do yr, mujhe bhi ameer banna h 😂 or dekhni h ki kya bawal cheez banati
                                ho tumm....
                            </p>
                            <p>Chalo ye sab to faltoo baaten h,
                                tum ye batao ki tumko sabse best songs konse lagte h, dekhu to kya taste h tumhara🦥🐼
                            </p>
                        </div>
                    </div>

                    {/* Page 4 (Index 4) */}
                    <div
                        className={`${styles.page} ${isFlipped(4) ? styles.flipped : ''}`}
                        style={{ zIndex: 7 }}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>4</div>
                            <p><span className={styles.emoji}>🎄</span> <span className={styles.highlight}>Final Words...</span></p>
                            <p>Or lastly... chanchal me mujhe koi interest nhiiii...., even ab kisi me nhi h 🦥🐼 isliye don't
                                worry 😂 wo bs majak tha</p>
                            <p>Mujhe tumhare wo sentence pe hasi aa rhi h 😂 ki "To me kyu help karu tumhari, Wo bhi meri hi
                                dost ko ptane ke liye"🐼🐣😂 mere bure haal ho gaye the has has ke 😂😂 </p>
                            <p>Or haaa tumne bola tha ladkon ko to koi bhi pasand aajati h 😂 shyd ye sach hooo..., lekin mere
                                case me aisa nhi h 🦥. Me thoda alag hi hu... ab mujhe koi pasand nhi 😎 me free hu 😎</p>


                            <p>Wiase me ye tumko impress karne ke liye nhi banata 🙃 Wo bs accha lagta h kuch unique cheez karna
                                🦥 Atleast yaaden to banengi ki haa ek insaan tha 😼 jo kuch toofani cheezen karta tha😂🐼. Shyd
                                ye tum tumhari dostlog ko batao to wo mere se impress ho jaayeeenn , who knows 😂😂 wo jo pehli
                                wali banai thi na 😂 wo mene Expert systems ke lecture me peeche beth ke banai thi 😂 mera dost
                                mere saath betha tha to bol rha tha bhai😂 me agar ladki hota to tere peeche pad jata 😂😂 or me
                                🥸 &gt;&gt; hattt beeee door bhag. </p>

                            <p>Winter special banaya h tumhare liye... ❄️</p>
                            <p>Ek ad din dosa special bhi banaunga 🫔</p>
                            <p>Batana zaroor ye wali design kaisi lagi or rating bhii chaiyee apun ko🧸</p>
                            <p>I'll wait............................. </p>
                            <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '26px' }}>✨ Stay Warm, Pirachi ✨</p>
                            <p style={{ textAlign: 'center', fontSize: '20px', color: '#5a7ba6' }}>☃️</p>
                        </div>
                    </div>

                    {/* Dummy Page for z-index padding if needed, or just end of book */}
                </div>
            </div>
        </div>
    );
};

export default WinterEdition;
