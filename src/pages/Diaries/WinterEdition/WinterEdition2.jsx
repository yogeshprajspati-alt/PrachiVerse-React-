import React, { useState, useRef } from 'react';
import styles from './WinterEdition.module.css';

const WinterEdition2 = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 5; // Cover + 4 pages

    const [snowflakes] = useState(() => {
        const count = 50;
        const flakeArray = [];
        for (let i = 0; i < count; i++) {
            flakeArray.push({
                id: i,
                left: Math.random() * 100 + '%',
                animationDuration: (Math.random() * 10 + 10) + 's',
                animationDelay: Math.random() * 10 + 's',
                fontSize: (Math.random() * 1 + 0.5) + 'em',
                opacity: Math.random() * 0.6 + 0.4
            });
        }
        return flakeArray;
    });

    const handleFlip = (direction) => {
        if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'back' && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Touch handling
    const touchStart = useRef(null);
    const touchEnd = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const onTouchStart = (e) => {
        touchEnd.current = null;
        touchStart.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
        setIsScrolling(false);
    };

    const onTouchMove = (e) => {
        if (!touchStart.current) return;
        const touchY = e.targetTouches[0].clientY;
        if (Math.abs(touchY - touchStart.current.y) > 10) {
            setIsScrolling(true);
        }
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current || isScrolling) return;

        const distance = touchStart.current.x - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleFlip('next');
        } else if (isRightSwipe) {
            handleFlip('back');
        }
    };

    const handleClick = (e) => {
        if (isScrolling) return;

        const screenWidth = window.innerWidth;
        const clickX = e.clientX;

        // Check if click target is closest to a "link" or interactive element?
        // For now, implementing the split screen logic as per source
        if (clickX > screenWidth / 2) {
            handleFlip('next');
        } else {
            handleFlip('back');
        }
    };

    // Helper to determine if a page should be flipped
    const getPageClass = (index) => {
        // In the HTML: if direction is next, add 'flipped' to current page then increment
        // If direction is back, decrement then remove 'flipped'
        // So if currentPage is 1 (Page 1 is visible), index 0 (Cover) is flipped.
        // Meaning all pages with index < currentPage are flipped.
        return index < currentPage ? `${styles.page} ${styles.flipped}` : styles.page;
    };

    return (
        <div className={styles.winterEditionContainer}>
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
            <div className={`${styles.navHint} ${currentPage > 0 ? styles.hidden : ''}`}>
                👈 Tap left/right to turn pages 👉
            </div>

            {/* Notebook */}
            <div className={styles.notebookContainer}>
                <div
                    className={styles.notebook}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={handleClick}
                >
                    <div className={styles.spiral}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={styles.spiralRing}></div>
                        ))}
                    </div>

                    {/* Cover Page (Index 0) */}
                    <div className={`${getPageClass(0)} ${styles.cover}`}>
                        <div>Pirachiiiiiiii....... 💖✨</div>
                        <div className={styles.coverSubtitle}>Title khud bana lo</div>
                    </div>

                    {/* Page 1 (Index 1) */}
                    <div className={getPageClass(1)}>
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>1</div>
                            <p><span className={styles.emoji}>❄️</span> <span className={styles.highlight}>Againn... I know, I know </span></p>
                            <p>Haannn... bola to tha mene ki wo hi last h, lekinnnn mera code meri marzi 🦥🐼 Tum to padh logiii.</p>
                            <p>Kitni Thand hai yaha basoda me, Dhyn rakhoo or kya🐣</p>
                            <p>Waise mene wo "Bs itna shareef hu" aise hi bhej diya tha. Dikha rha tha bs ki almost sab mere around safe feel karti h 🦥, they knows well me kaisa hu 🙃, Bs meri crush ko nhi kara paya thaa..</p>
                            <p>Wo tumne saksham ki chat padhi thii na, me crop karna hi bhool gaya wo "r" word. Dekhne me kharab, sunne me aur jyada kharab.</p>
                            <p>Me wo word use nhi karta🙃. Kher sirf saksham nhi un dono ko sab bolte thee starting se, shyd unko pata bhi ho. Mene to nhi bola, or shyd bolunga bhi nhi🙃🦥 Meri khud bhi self esteem h isiliyeee.. </p>
                        </div>
                    </div>

                    {/* Page 2 (Index 2) */}
                    <div className={getPageClass(2)}>
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>2</div>
                            <p><span className={styles.emoji}>🌨️</span> <span className={styles.highlight}>.........</span></p>
                            <p>Mene jooth bola tha kl, ki me screen ke samne tha or phone pass me rakha tha. Asal me wo adha sach tha.</p>
                            <p>Sach ye h ki me poorani conversation padh rha thaa.. Taaki dekh saku ki kahi mene kuch galati naa kar diii ho :)</p>
                            <p>Poorani adat h ye meri, kyuki me sab bigad deta hu hamesha.</p>
                            <p>Wo photo bhale hi blur thi lekin tum acchi lag rhi thi usmee.. "Divaa hi kehnde" iska mtlb star performer h kyaa prachiii????</p>
                            <p>Ek or cheez. Tumhara koi dost ho to usme koi galat baat nhi h. Aise to mere bhi dost h. Zaroori thodi h har dost ka mtlb kuch galat hoo.. </p>
                            <p>Me to bs pooch hi rha tha ki raaj h ki nhi. Wo accha ladka h waise. Meri last time uske birthday pe baat hui thi, pichle saal. </p>

                            <p><span className={styles.highlight}>Pata nhi aisa kyun hota h😂 Sahi time me sahi words nhi milte. Or jab milte h tab sahi moka nhi hota</span></p>
                            <p>Waise ek tum hi nhi ho jisko mene nickname diya h. </p>
                            <p>Jinki bohot jyada hi parvah hoti h unko de deta hu. Meri behen ko to me kuch bhi bol ke bula leta hu😂 wo mere se aloo bolti h 😂 or ye meri id bhi "deep.ak2294 se "aloo2294" usi dusht ne kari thii..</p>
                            <p>Shraddha ko captain bola hu me, shuru se 🦥 wo mujhe computer bolti h 😂. Anukriti se kurkura bolta tha me🦥 wo mere se beta biloni 😂</p>
                        </div>
                    </div>

                    {/* Page 3 (Index 3) */}
                    <div className={getPageClass(3)}>
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>3</div>
                            <p><span className={styles.emoji}>💙</span> <span className={styles.highlight}>Mujhe shak h tum ye padhti bhi ho ki nhi😼</span></p>
                            <p>Ab tumko billu nhi pasand to koi accha sa naam sochunga meee....</p>
                            <p>Jiska use sirf me kar saku😂 Even though Prachiii bohot bohot accha naam h.</p>
                            <p>Prachiiiii to bhole naath h</p>
                            <p>
                                Tumhari kichdi ki recipe do yr, mujhe bhi ameer banna h 😂 or dekhni h ki kya bawal cheez banati ho tumm....
                            </p>
                            <p>Chalo ye sab to faltoo baaten h, tum ye batao ki tumko sabse best songs konse lagte h, dekhu to kya taste h tumhara🦥🐼</p>
                        </div>
                    </div>

                    {/* Page 4 (Index 4) */}
                    <div className={getPageClass(4)}>
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>4</div>
                            <p><span className={styles.emoji}>🎄</span> <span className={styles.highlight}>Final Words...</span></p>
                            <p>Or lastly... chanchal me mujhe koi interest nhiiii...., even ab kisi me nhi h 🦥🐼 isliye don't worry 😂 wo bs majak tha</p>
                            <p>Mujhe tumhare wo sentence pe hasi aa rhi h 😂 ki "To me kyu help karu tumhari, Wo bhi meri hi dost ko ptane ke liye"🐼🐣😂 mere bure haal ho gaye the has has ke 😂😂 </p>
                            <p>Or haaa tumne bola tha ladkon ko to koi bhi pasand aajati h 😂 shyd ye sach hooo..., lekin mere case me aisa nhi h 🦥. Me thoda alag hi hu... ab mujhe koi pasand nhi 😎 me free hu 😎</p>

                            <p>Wiase me ye tumko impress karne ke liye nhi banata 🙃 Wo bs accha lagta h kuch unique cheez karna 🦥 Atleast yaaden to banengi ki haa ek insaan tha 😼 jo kuch toofani cheezen karta tha😂🐼. Shyd ye tum tumhari dostlog ko batao to wo mere se impress ho jaayeeenn , who knows 😂😂 wo jo pehli wali banai thi na 😂 wo mene Expert systems ke lecture me peeche beth ke banai thi 😂 mera dost mere saath betha tha to bol rha tha bhai😂 me agar ladki hota to tere peeche pad jata 😂😂 or me 🥸 &gt;&gt; hattt beeee door bhag. </p>

                            <p>Winter special banaya h tumhare liye... ❄️</p>
                            <p>Ek ad din dosa special bhi banaunga 🫔</p>
                            <p>Batana zaroor ye wali design kaisi lagi or rating bhii chaiyee apun ko🧸</p>
                            <p>I'll wait............................. </p>
                            <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '26px' }}>✨ Stay Warm, Pirachi ✨</p>
                            <p style={{ textAlign: 'center', fontSize: '20px', color: '#5a7ba6' }}>☃️</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WinterEdition2;
