import React, { useState, useEffect, useRef } from 'react';
import styles from './PinkButterflyDiary.module.css';


const ScratchToReveal = ({ children, coverText = "Rub to reveal ✨" }) => {
    const canvasRef = useRef(null);
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Match container size
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            // Fill paint
            ctx.fillStyle = '#e9a6ad'; // Pink leather color
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw scratch text
            ctx.font = 'bold 22px Caveat, cursive';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(coverText, canvas.width/2, canvas.height/2);
            
            // Add some metallic pattern or simple noise
            for(let i=0; i<100; i++) {
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI*2);
                ctx.fill();
            }
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
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();
            checkCleared();
        };

        const checkCleared = () => {
            // Check if 50% cleared to fade it out entirely
            // (Optimized: just random check or check every Nth time, but simpler is fine)
            // Just let user scratch. We can add a double click to clear if they get tired.
        };

        const start = (e) => { isDrawing = true; scratch(e); };
        const end = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', end);
        canvas.addEventListener('mouseleave', end);
        
        canvas.addEventListener('touchstart', start, {passive: false});
        canvas.addEventListener('touchmove', scratch, {passive: false});
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
    }, []);

    return (
        <div className={styles.scratchWrapper}>
            <div style={{ visibility: 'visible', padding: '10px 20px', background: 'rgba(255,255,255,0.7)', borderRadius: '4px', border: '1px dashed #c06c80' }}>
                {children}
            </div>
            <canvas 
                ref={canvasRef}
                className={`${styles.scratchCanvas} ${cleared ? styles.scratchCanvasCleared : ''}`}
                onDoubleClick={(e) => { e.stopPropagation(); setCleared(true); }}
            />
        </div>
    );
};

const TapeReveal = ({ secretText, tapeText = "Peel Tape 🩹" }) => {
    const [peeled, setPeeled] = useState(false);
    return (
        <div className={styles.tapeRevealContainer}>
            <div className={`${styles.tape} ${styles.peelableTape} ${peeled ? styles.peeled : ''}`} onClick={(e) => {e.stopPropagation(); setPeeled(true);}}>
                {tapeText}
            </div>
            <div className={`${styles.secretContent} ${peeled ? styles.secretVisible : ''}`}>
                {secretText}
            </div>
        </div>
    );
};


const PinkButterflyDiary = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [turning, setTurning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Lock State
    const CODE = [1, 1, 3];
    const [dials, setDials] = useState([0, 0, 0]);
    const [unlocked, setUnlocked] = useState(false);
    const [shake, setShake] = useState(false);
    const [sparkle, setSparkle] = useState(false);

    const TOTAL = 23; // Cover + 6 pages + back

    const spin = (i) => setDials(d => d.map((v, k) => k === i ? (v + 1) % 10 : v));

    const goNext = () => {
        if (currentPage < TOTAL - 1 && !turning) {
            setTurning(true);
            setCurrentPage(p => p + 1);
            setTimeout(() => setTurning(false), 950);
        }
    };
    
    const goPrev = () => {
        if (currentPage > 0 && !turning) {
            if (currentPage === 1) return; // Cant go back to cover once unlocked
            setTurning(true);
            setCurrentPage(p => p - 1);
            setTimeout(() => setTurning(false), 950);
        }
    };

    useEffect(() => {
        if (unlocked) return;
        if (dials.join('') === CODE.join('')) {
            setUnlocked(true);
            setSparkle(true);
            setTimeout(() => { 
                goNext(); 
                audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {}); 
            }, 1200);
        } else if (dials.every((d, i) => d !== 0 || i === 0) && dials[2] !== 0 && dials[1] !== 0 && dials[0] !== 0) {
            setShake(true); 
            setTimeout(() => setShake(false), 400);
        }
    }, [dials]);

    useEffect(() => {
        const audio = audioRef.current;
        return () => { if (audio) { audio.pause(); audio.currentTime = 0; } };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => { });
        setIsPlaying(p => !p);
    };

    const FlirtyReveal = ({ question, answer, buttonText = "[ TAP TO REVEAL ]" }) => {
        const [isRevealed, setIsRevealed] = useState(false);

        return (
            <div className={`${styles.secretNote} ${isRevealed ? styles.secretNoteOpened : ''}`}>
                <div className={styles.pin}></div>
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
        currentPage === 0 ? 'Code = tumhara special din (113) 🦋' :
            currentPage === TOTAL - 1 ? 'Time to let go 🦋' :
                `${currentPage} / ${TOTAL - 2}  ·  tap sides to turn`;

    return (
        <div className={styles.wrap}>
            <div className={styles.fairyDustContainer}>
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className={styles.fairyDust} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 5}s`
                    }}></div>
                ))}
            </div>
            
            <div className={styles.bgSpotlight} />

            <div className={`${styles.book} ${sparkle ? styles.bookGlow : ''}`}>
                <div className={styles.spine} />
                <div className={styles.progBar}>
                    <div className={styles.progFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.pages}>
                    {/* PAGE 0 - Cover */}
                    <div
                        className={`${styles.page} ${styles.leather} ${flipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(0) }}
                    >
                        <div className={styles.emboss} />
                        
                        <div className={styles.stickyNote}>
                            <div className={styles.tape} style={{top: '-8px', left: '50%', transform: 'translateX(-50%) rotate(0deg) scale(0.6)', padding: '4px 25px'}}></div>
                            <span className={styles.handWritten} style={{fontSize: '1.3rem', color: '#444', lineHeight: '1.2', display: 'block', marginTop: '5px'}}>
                                Code:<br/> 1-1-3
                            </span>
                        </div>

                        <div className={`${styles.strap} ${unlocked ? styles.strapOpen : ''}`}>
                            <div className={`${styles.lock} ${shake ? styles.lockShake : ''} ${sparkle ? styles.lockUnlock : ''}`}>
                            {dials.map((d, i) => (
                                <button key={i} className={styles.dial} onClick={(e) => { e.stopPropagation(); spin(i); }}>
                                <span>{d}</span>
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>

                    {/* PAGE 1 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(1) ? styles.flipped : ''}`} style={{ zIndex: zIdx(1) }}>
                        <div className={styles.content}>
                            <div className={`${styles.tape} ${styles.tapeTopLeft}`}></div>
                            <h2 className={styles.mainTitle} style={{marginTop: '1rem'}}>LOVE & CRUSHES</h2>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Ye tumhare liye thiii hi nhi, galati se display pe dal gai or tumne padhli, isiliye me ise hata raha hu. Mujhe nhi pta tha tum idhar visit karti ho isiliye itna dhyn bhi nhi gaya mera.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Or ye mene meri Rage ko control me laane ke liye likh di thi, naa ki tumhe dikhane ke liye.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ....
                            </p>
                        </div>
                    </div>

                    {/* PAGE 2 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(2) ? styles.flipped : ''}`} style={{ zIndex: zIdx(2) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 02</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                ..... 
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ....
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .....
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .....
                            </p>
                        </div>
                    </div>

                    {/* PAGE 3 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 03</div>
                             
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .....
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ..
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ...
                            </p>
                        </div>
                    </div>

                    {/* PAGE 4 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(4) ? styles.flipped : ''}`} style={{ zIndex: zIdx(4) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 04</div>
                             
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 5 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ....
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ?
                            </p>
                        </div>
                    </div>

                    {/* PAGE 6 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(6) ? styles.flipped : ''}`} style={{ zIndex: zIdx(6) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 06</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ..
                            </p>
                        </div>
                    </div>

                    {/* PAGE 7 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(7) ? styles.flipped : ''}`} style={{ zIndex: zIdx(7) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 07</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 8 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(8) ? styles.flipped : ''}`} style={{ zIndex: zIdx(8) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 08</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 9 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(9) ? styles.flipped : ''}`} style={{ zIndex: zIdx(9) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 09</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                ...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ?
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 10 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(10) ? styles.flipped : ''}`} style={{ zIndex: zIdx(10) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 10</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 11 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(11) ? styles.flipped : ''}`} style={{ zIndex: zIdx(11) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 11</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                ?
                            </p>
                        </div>
                    </div>

                    {/* PAGE 12 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(12) ? styles.flipped : ''}`} style={{ zIndex: zIdx(12) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 12</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                😕
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                 .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 13 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(13) ? styles.flipped : ''}`} style={{ zIndex: zIdx(13) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 13</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                ....
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>s
                    </div>

                    {/* PAGE 14 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(14) ? styles.flipped : ''}`} style={{ zIndex: zIdx(14) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 14</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 15 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(15) ? styles.flipped : ''}`} style={{ zIndex: zIdx(15) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 15</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 16 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(16) ? styles.flipped : ''}`} style={{ zIndex: zIdx(16) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 16</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold'}}>
                                .
                            </p>
                        </div>
                    </div>

                                        {/* PAGE 17 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(17) ? styles.flipped : ''}`} style={{ zIndex: zIdx(17) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 17</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 18 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(18) ? styles.flipped : ''}`} style={{ zIndex: zIdx(18) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 18</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 19 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(19) ? styles.flipped : ''}`} style={{ zIndex: zIdx(19) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 19</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 20 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(20) ? styles.flipped : ''}`} style={{ zIndex: zIdx(20) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 20</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                        </div>
                    </div>

                    {/* PAGE 21 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(21) ? styles.flipped : ''}`} style={{ zIndex: zIdx(21) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 21</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                .
                            </p>




                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                .
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                always feel free to reach because someone will still try to treat you the right way
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                waise mujhe abhi bhi lagta h tumhare dil me mere liye soft corner hai
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                kabhi by chance tumhare andar kuch feelings wagrah aajaye to chipana mat(jo tum hamesha karti ho), bata dena kyuki me utna cold nhi hu.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 22 (Last Page) */}
                    <div
                        className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(22) ? styles.flipped : ''}`}
                        style={{ zIndex: zIdx(22) }}
                    >
                        <div className={styles.content} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <div className={styles.polaroidBox} style={{transform: 'rotate(-2deg)', width: '90%', padding: '20px 20px 60px 20px', boxShadow: '4px 10px 25px rgba(0,0,0,0.15)'}}>
                                <div className={styles.pin} style={{top: '-12px'}}></div>
                                <div className={`${styles.tape} ${styles.tapeTopRight}`}></div>
                                
                                <div className={styles.polaroidInner} style={{flexDirection: 'column', textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.7)', border: '2px dashed var(--ink-soft)'}}>
                                    <h1 className={styles.mainTitle} style={{fontSize: '2.5rem', color: 'var(--ink)', textShadow: '1px 1px 0 #fff'}}>TIME TO LET GO</h1>
                                    
                                    <div style={{marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.1)'}}>
                                        <p className={styles.handWritten} style={{fontSize: '1.6rem', margin: 0, fontWeight: 'bold', color: 'var(--ink)'}}>
                                            Jo bhi tha, accha tha.<br/>
                                            Thank you, Prachi, ki tum meri story ka main character banke aain.<br/>
                                            Be happy, Hamesha. 🦋
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Final Decorative Elements */}
                            <div className={`${styles.sticker} ${styles.stickerRandom1}`} style={{bottom: '40px', left: '40px', transform: 'rotate(25deg) scale(1.3)'}} />
                            <div className={`${styles.sticker} ${styles.stickerRandom2}`} style={{bottom: '70px', right: '50px', transform: 'rotate(-20deg) scale(1.5)'}} />
                        </div>
                    </div>
                </div>{/* /pages */}
                <div className={styles.hint}>{pageLabel}</div>
            </div>{/* /book */}

            <div className={`${styles.zone} ${styles.zL}`} onClick={goPrev} />
            <div className={`${styles.zone} ${styles.zR}`} onClick={goNext} />
            <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arL}`} onClick={goPrev} disabled={currentPage <= 1}>‹</button>
            <button className={`${styles.clayBtn} ${styles.arrow} ${styles.arR}`} onClick={goNext} disabled={currentPage === TOTAL - 1}>›</button>
            <button className={`${styles.clayBtn} ${styles.musicBtn}`} onClick={toggleMusic}>
                <span>{isPlaying ? '⏸' : '🎵'}</span>
            </button>
            
            <audio ref={audioRef} loop src="/assets/golbalgifs/background.mp3" />
        </div>
    );
};

export default PinkButterflyDiary;
