import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BirthdayDairy.module.css';

const BirthdayDairy = () => {
    const navigate = useNavigate();
    const [giftOpened, setGiftOpened] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // 0 = Cover
    const [candleBlown, setCandleBlown] = useState(false);

    // Balloons and Confetti data
    const [balloons] = useState([...Array(5)].map((_, i) => ({
        id: i,
        left: Math.random() * 90 + 5 + '%',
        delay: Math.random() * 5 + 's',
        duration: (15 + Math.random() * 5) + 's',
        bg: `rgba(${255}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 0.4)`
    })));

    const [confetti] = useState([...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 2 + 's',
        duration: (3 + Math.random() * 2) + 's',
        bg: Math.random() > 0.5 ? '#ffd700' : '#ff6b81'
    })));

    const openGift = () => {
        setGiftOpened(true);
    };

    const flipPage = (direction) => {
        if (direction === 'next' && currentPage < 3) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const blowCandle = (e) => {
        e.stopPropagation();
        setCandleBlown(true);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Background Effects */}
            <div className={styles.confettiContainer}>
                {confetti.map(c => (
                    <div key={c.id} className={styles.confetti} style={{
                        left: c.left,
                        animationDelay: c.delay,
                        animationDuration: c.duration,
                        background: c.bg
                    }} />
                ))}
            </div>
            <div className={styles.balloonContainer}>
                {balloons.map(b => (
                    <div key={b.id} className={styles.balloon} style={{
                        left: b.left,
                        animationDelay: b.delay,
                        animationDuration: b.duration,
                        background: b.bg
                    }} />
                ))}
            </div>

            {/* Back Button */}
            <div className={styles.backButton} onClick={() => navigate('/')}>←</div>

            {/* Entrance Gift */}
            <div className={`${styles.giftOverlay} ${giftOpened ? styles.hidden : ''}`}>
                <div className={styles.giftBox} onClick={openGift}>
                    <div className={styles.giftLid}>
                        <div className={styles.ribbonV}></div>
                        <div className={styles.ribbonH}></div>
                        <div className={styles.bowContainer}>
                            <div className={`${styles.bowLoop} ${styles.left}`}></div>
                            <div className={`${styles.bowLoop} ${styles.right}`}></div>
                            <div className={styles.bowCenter}></div>
                        </div>
                    </div>
                    <div className={styles.giftBody}>
                        <div className={styles.ribbonV}></div>
                    </div>
                </div>
                <div className={styles.tapHint}>Tap to Reveal 🎁</div>
            </div>

            {/* Notebook Area */}
            <div className={`${styles.notebookContainer} ${giftOpened ? styles.active : ''}`}>
                {!giftOpened && <div style={{ height: '100%' }}></div>} {/* Spacer */}

                {giftOpened && (
                    <>
                        {/* Book Navigation Hints */}
                        <div className={styles.navHint}>Tap Right ➔ to Flip | Tap Left ⬅ to Back</div>

                        <div className={styles.notebook}>
                            {/* Spiral Binding */}
                            <div className={styles.spiral}>
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className={styles.ring}></div>
                                ))}
                            </div>

                            {/* Pages - Rendered from back to front order visually, but DOM order matters for z-index */}
                            {/* We use z-index to manage stacking, and transform for flipping */}

                            {/* Page 4: Memories */}
                            <div className={styles.page} style={{ zIndex: 3 }} onClick={() => flipPage('prev')}>
                                <div className={styles.pageContent}>
                                    <h2>Remember...</h2>
                                    <p>
                                        Dekho me ye texts tabhi likhta hu jab me sone hi wala hu or bistar me pada hu to almost sahiii
                                        hi h sab. Lappy toppy mere pittu pe...
                                    </p>
                                    <p>
                                        <em>"Age is merely the number of years the world has been enjoying you."</em>
                                    </p>
                                    <hr style={{ border: 0, borderTop: '1px dashed #ccc', margin: '20px 0' }} />
                                    <p>
                                        Chand me daag uski kami nhi hote prachiii, wo uski khoobi hoti h. Bina un daagon ke Chand Chand
                                        nhi koi bulb lagega🦥. Or me to bachpan se un daagon ko chand ka face samajhta tha🌛, I hope tum
                                        bhi samajhti hogi.
                                    </p>
                                    <p>
                                        Tumhari andar koi kami nhi h. Tum jaisi ho ekdum perfect ho.
                                    </p>
                                </div>
                            </div>

                            {/* Page 3: Cake Interaction */}
                            <div className={`${styles.page} ${currentPage >= 3 ? styles.flipped : ''}`}
                                style={{ zIndex: 4 }}
                                onClick={(e) => { if (currentPage >= 3) flipPage('prev'); else flipPage('next'); }}>
                                <div className={styles.pageContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <h2>Make a Wish!</h2>
                                    <p style={{ textAlign: 'center' }}>Close your eyes, make a wish, and tap the candle to blow it out!</p>

                                    <div className={styles.cakeContainer} onClick={blowCandle}>
                                        <div className={styles.candle}>
                                            <div className={`${styles.flame} ${candleBlown ? styles.out : ''}`}></div>
                                        </div>
                                        <div className={styles.cakeBody}>
                                            <div className={styles.cakeLayer}></div>
                                        </div>
                                    </div>

                                    <div className={`${styles.wishMsg} ${candleBlown ? styles.show : ''}`}>
                                        ✨ May all your wishes come true! ✨
                                    </div>
                                </div>
                            </div>

                            {/* Page 2: Note */}
                            <div className={`${styles.page} ${currentPage >= 2 ? styles.flipped : ''}`}
                                style={{ zIndex: 5 }}
                                onClick={(e) => { if (currentPage >= 2) flipPage('prev'); else flipPage('next'); }}>
                                <div className={`${styles.sticker} ${styles.heart}`}>💖</div>
                                <div className={styles.pageContent}>
                                    <h2>Prachiii✨,</h2>
                                    <p>Kaha tha na impress to tum ho jaogiii..... ✨</p>
                                    <p>
                                        Is special day par, I just want to remind you kitni special ho tum. Not just because it's your
                                        birthday, but because of who you are.
                                        Tumhari smile, tumhara gussa (thoda sa 🤏), and your unique vibe sab kuch bohot precious hai.
                                    </p>
                                    <p>
                                        May this year bring you as much joy as you bring to everyone around you. (Or thoda kam stress
                                        lena please! 😂)
                                    </p>
                                    <div style={{ textAlign: 'right', fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem', marginTop: '20px' }}>
                                        - Deepak
                                    </div>
                                </div>
                            </div>

                            {/* Page 1: Cover */}
                            <div className={`${styles.page} ${styles.coverPage} ${currentPage >= 1 ? styles.flipped : ''}`}
                                style={{ zIndex: 6 }}
                                onClick={() => flipPage('next')}>
                                <div className={styles.coverFrame}>
                                    <div className={`${styles.goldBorderCorner} ${styles.tl}`}></div>
                                    <div className={`${styles.goldBorderCorner} ${styles.tr}`}></div>
                                    <div className={`${styles.goldBorderCorner} ${styles.bl}`}></div>
                                    <div className={`${styles.goldBorderCorner} ${styles.br}`}></div>

                                    <div className={styles.coverTitle}>Happy<br />Birthday</div>
                                    <div className={styles.coverSubtitle}>Prachiii ✨</div>

                                    <div className={styles.coverIcon}>🥳</div>

                                    <div style={{ fontFamily: "'Parisienne', cursive", color: '#ffd700', fontSize: '1.2rem', marginTop: '10px' }}>
                                        Birthday Diary
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BirthdayDairy;
