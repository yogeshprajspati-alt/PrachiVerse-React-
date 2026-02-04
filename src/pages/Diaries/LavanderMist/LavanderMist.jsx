import { useEffect, useRef, useState } from "react";
import styles from "./LavenderMist.module.css";

export default function LavenderMist() {
    const particlesRef = useRef(null);
    const pagesRef = useRef([]);
    const audioRef = useRef(null);

    const [introHidden, setIntroHidden] = useState(false);
    const [bookOpen, setBookOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [thanksStep, setThanksStep] = useState(false);
    const [playing, setPlaying] = useState(false);

    /* PARTICLES */
    useEffect(() => {
        const container = particlesRef.current;
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const p = document.createElement("div");
            p.className =
                Math.random() > 0.8
                    ? `${styles.particle} ${styles.firefly}`
                    : styles.particle;

            const size = Math.random() * 5 + 2;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDuration = `${Math.random() * 10 + 5}s`;
            p.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(p);
        }
    }, []);

    /* PAGE STACKING */
    useEffect(() => {
        pagesRef.current.forEach((page, index) => {
            if (page) page.style.zIndex = pagesRef.current.length - index;
        });
    }, []);

    const enterDiary = () => {
        setIntroHidden(true);
        setTimeout(() => {
            setBookOpen(true);
            playAudio();
        }, 500);
    };

    const flipNext = () => {
        if (currentPage < pagesRef.current.length - 1) {
            const page = pagesRef.current[currentPage];
            page.classList.add(styles.flipped);
            page.style.zIndex = 50 + currentPage;
            setCurrentPage((p) => p + 1);
        }
    };

    const flipPrev = () => {
        if (currentPage > 0) {
            const prev = currentPage - 1;
            const page = pagesRef.current[prev];
            page.classList.remove(styles.flipped);
            page.style.zIndex = pagesRef.current.length - prev;
            setCurrentPage(prev);
        }
    };

    /* AUDIO */
    const playAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
    };

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    /* OVERLAY */
    const moveNoBtn = (e) => {
        const btn = e.target;
        const card = btn.parentElement.parentElement;
        const maxX = card.clientWidth - btn.offsetWidth - 20;
        const maxY = card.clientHeight - btn.offsetHeight - 20;
        btn.style.position = "absolute";
        btn.style.left = Math.random() * maxX + "px";
        btn.style.top = Math.random() * maxY + "px";
    };

    return (
        <div className={styles.wrapper}>
            {/* Background */}
            <div className={styles.globalTexture}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>
            <div ref={particlesRef} className={styles.particles}></div>

            {/* Intro */}
            <div className={`${styles.intro} ${introHidden ? styles.hidden : ""}`}>
                <h1 className={styles.introTitle}>Lavender Mist</h1>
                <button className={styles.introBtn} onClick={enterDiary}>
                    OPEN DIARY
                </button>
            </div>

            {/* Book */}
            <div className={`${styles.bookContainer} ${bookOpen ? "" : styles.closed}`}>
                <div className={styles.spiral}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={styles.ring}></div>
                    ))}
                </div>

                <div className={styles.book}>
                    {["Cover", "Page1", "Page2", "Page3", "Back"].map((_, i) => (
                        <div
                            key={i}
                            ref={(el) => (pagesRef.current[i] = el)}
                            className={`${styles.page} ${i === 0 || i === 4 ? styles.cover : ""}`}
                        >
                            <div className={styles.pageContent}>
                                {i === 0 && (
                                    <>
                                        <div className={styles.coverContent}>
                                            <div className={styles.coverTitle}>Lavender<br />Mist</div>
                                            <div className={styles.coverDate}>26 JANUARY 2026</div>
                                        </div>
                                    </>
                                )}

                                {i === 4 && <div className={styles.goodbye}>GoodBye</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className={styles.helper}>Tap sides to flip</div>
            <div className={`${styles.zone} ${styles.left}`} onClick={flipPrev}></div>
            <div className={`${styles.zone} ${styles.right}`} onClick={flipNext}></div>
            <div className={styles.musicBtn} onClick={toggleAudio}>🎵</div>

            <audio ref={audioRef} loop src="background.mp3" />

            {/* Overlay */}
            {overlayOpen && (
                <div className={styles.overlay}>
                    {!thanksStep ? (
                        <div className={styles.card}>
                            <img src="beg-dont-leave.gif" alt="gif" />
                            <h2>A Small Request</h2>
                            <p>Will you accept this warm hug?</p>
                            <div className={styles.btnGroup}>
                                <button className={styles.btnYes} onClick={() => setThanksStep(true)}>YES!</button>
                                <button className={styles.btnNo} onMouseOver={moveNoBtn}>NO</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.card}>
                            <img src="cat-holding-flowers.gif" alt="gif" />
                            <h2>Yay! Thank You!</h2>
                            <button className={styles.btnYes} onClick={() => setOverlayOpen(false)}>
                                Return
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
