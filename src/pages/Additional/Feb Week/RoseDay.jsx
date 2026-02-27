import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoseDay.module.css';

// ─── Data ───
const SCENES = [
    {
        id: 1,
        roseColor: '#fcd34d',
        message: "Sabse pahle tumhari smile yaad aati h...",
        lyric: "Oh, her eyes, her eyes make the stars look like they're not shinin'",
        duration: 5000,
    },
    {
        id: 2,
        roseColor: '#f472b6',
        message: "Phir shukriya un lamhon ka… jo bina kuch kahe ache lage",
        lyric: "Her hair, her hair falls perfectly without her trying",
        duration: 5000,
    },
    {
        id: 3,
        roseColor: '#ffffff',
        message: "For being so simple and not so understanding....",
        lyric: "She's so beautiful and I tell her everyday",
        duration: 4500,
    },
    {
        id: 4,
        roseColor: '#fb923c',
        message: "Har rang me teri si hi vibe hai",
        lyric: "I know, I know when I compliment her she won't believe me",
        duration: 5500,
    },
];

// ─── Rose SVG ───
function Rose({ color, size = 100, className = '' }) {
    const filterId = `watercolor-${color.replace('#', '')}`;
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <defs>
                <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    <feGaussianBlur stdDeviation="0.5" />
                </filter>
            </defs>
            <g filter={`url(#${filterId})`}>
                <path d="M50 95C50 95 52 80 48 70C46 65 50 55 50 50" stroke="#4a5d23" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
                <path d="M50 85C50 85 62 78 68 82C62 88 56 90 50 85Z" fill="#5f7c35" opacity="0.5" />
                <path d="M50 75C50 75 32 70 28 75C34 80 44 78 50 75Z" fill="#5f7c35" opacity="0.5" />
                <g transform="translate(0, -5)">
                    <path d="M50 20C25 20 10 40 25 60C35 75 65 75 75 60C90 40 75 20 50 20Z" fill={color} opacity="0.4" />
                    <path d="M50 25C35 25 25 35 30 50C35 60 65 60 70 50C75 35 65 25 50 25Z" fill={color} opacity="0.5" />
                    <path d="M50 30C42 32 40 45 50 55C60 45 58 32 50 30Z" fill={color} opacity="0.6" />
                    <path d="M35 45Q40 55 50 60Q60 55 65 45" stroke={color} strokeWidth="1" strokeOpacity="0.8" fill="none" />
                    <path d="M45 35Q50 30 55 35" stroke={color} strokeWidth="2" strokeOpacity="0.6" fill="none" />
                </g>
            </g>
        </svg>
    );
}

// ─── Floating Petals ───
function FloatingPetals() {
    const petals = useMemo(
        () => Array.from({ length: 15 }, (_, i) => ({
            id: i,
            delay: (Math.random() * 20).toFixed(1),
            x: (Math.random() * 100).toFixed(1),
            duration: (15 + Math.random() * 10).toFixed(1),
        })),
        []
    );

    return (
        <div className={styles.petalsContainer}>
            {petals.map((p) => (
                <div
                    key={p.id}
                    className={styles.petal}
                    style={{
                        '--delay': `${p.delay}s`,
                        '--x': `${p.x}%`,
                        '--duration': `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

// ─── Main Component ───
export default function RoseDay() {
    const navigate = useNavigate();
    const [currentSceneIndex, setCurrentSceneIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFinal, setShowFinal] = useState(false);
    const [finalPhase, setFinalPhase] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [audioError, setAudioError] = useState(true); // default no audio
    const [audioFileName, setAudioFileName] = useState('');
    const [transitioning, setTransitioning] = useState(false);

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle mute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Scene sequence logic
    useEffect(() => {
        if (!isPlaying || showFinal) return;

        if (currentSceneIndex < SCENES.length) {
            const duration = currentSceneIndex === -1 ? 100 : SCENES[currentSceneIndex].duration;

            const timeout = setTimeout(() => {
                // Start exit animation
                setTransitioning(true);
                setTimeout(() => {
                    setTransitioning(false);
                    setCurrentSceneIndex((prev) => prev + 1);
                }, 800);
            }, duration - 800);

            return () => clearTimeout(timeout);
        } else {
            // Transition to final scene
            const finalTimeout = setTimeout(() => {
                setShowFinal(true);
                handleFinalSequence();
            }, 800);
            return () => clearTimeout(finalTimeout);
        }
    }, [isPlaying, currentSceneIndex, showFinal]);

    const handleFinalSequence = () => {
        setFinalPhase(0);
        setTimeout(() => setFinalPhase(1), 3500);
        setTimeout(() => setFinalPhase(2), 7000);
        setTimeout(() => setFinalPhase(3), 10500);
    };

    const startSequence = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
        setIsPlaying(true);
        setCurrentSceneIndex(0);
        setShowFinal(false);
        setFinalPhase(0);
        setTransitioning(false);
    };

    const restart = () => {
        setIsPlaying(false);
        setCurrentSceneIndex(-1);
        setShowFinal(false);
        setFinalPhase(0);
        setTransitioning(false);
        setTimeout(() => startSequence(), 100);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.loop = false;
            }
            audioRef.current.src = url;
            audioRef.current.load();
            setAudioFileName(file.name);
            setAudioError(false);
        }
    };

    const currentScene = SCENES[currentSceneIndex];

    return (
        <div className={styles.container}>
            <FloatingPetals />

            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className={styles.hidden} />

            {/* Back button */}
            <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>

            {/* Audio toggle */}
            {isPlaying && (
                <button className={styles.audioBtn} onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? '🔇' : '🔊'}
                </button>
            )}

            {/* ─── Intro Screen ─── */}
            {!isPlaying && !showFinal && (
                <div className={styles.introScreen}>
                    <div className={styles.introRose}>
                        <Rose color="#e11d48" size={80} />
                    </div>

                    <p className={styles.introSubtitle}>For Prachi</p>

                    <div className={styles.audioSelector}>
                        <button className={styles.selectMusicBtn} onClick={() => fileInputRef.current?.click()}>
                            🎵 {audioFileName ? 'Music Selected' : 'Select "Just The Way You Are"'} ⬆
                        </button>
                        {audioError && !audioFileName && (
                            <span className={styles.audioWarning}>Please select an audio file</span>
                        )}
                        {!audioError && !audioFileName && (
                            <p className={styles.audioHint}>(Ensure sound is on)</p>
                        )}
                    </div>

                    <button className={styles.startBtn} onClick={startSequence}>
                        Start Sequence ▶
                    </button>
                </div>
            )}

            {/* ─── Scene Sequence ─── */}
            {isPlaying && !showFinal && currentScene && (
                <div
                    key={currentScene.id}
                    className={`${styles.sceneContainer} ${transitioning ? styles.sceneExit : styles.sceneEnter}`}
                >
                    <div className={styles.roseWrapper}>
                        <Rose color={currentScene.roseColor} size={220} />
                    </div>

                    <p className={styles.sceneMessage}>{currentScene.message}</p>

                    <div className={styles.sceneLyric}>
                        <p className={styles.lyricText}>♫ "{currentScene.lyric}"</p>
                    </div>
                </div>
            )}

            {/* ─── Final Scene ─── */}
            {showFinal && (
                <div className={styles.finalScene}>
                    {/* Rose with backlight */}
                    <div className={`${styles.finalRoseWrapper} ${finalPhase === 2 ? styles.pulse : ''}`}>
                        <div className={`${styles.roseBacklight} ${finalPhase >= 2 ? styles.intense : ''}`} />
                        <Rose color="#be123c" size={240} />
                    </div>

                    {/* Dynamic lyrics */}
                    <div className={styles.lyricsOverlay}>
                        {finalPhase === 0 && (
                            <p className={`${styles.lyricPhase} ${styles.lyricNormal}`}>When I see your face...</p>
                        )}
                        {finalPhase === 1 && (
                            <p className={`${styles.lyricPhase} ${styles.lyricNormal}`}>There's not a thing that I would change...</p>
                        )}
                        {finalPhase === 2 && (
                            <p className={`${styles.lyricPhase} ${styles.lyricClimax}`}>'Cause you're amazing</p>
                        )}
                        {finalPhase >= 3 && (
                            <p className={`${styles.lyricPhase} ${styles.lyricNormal}`}>Just the way you are.</p>
                        )}
                    </div>

                    {/* Handwritten note */}
                    <div className={`${styles.noteWrapper} ${finalPhase >= 3 ? styles.visible : ''}`}>
                        <div className={styles.noteCard}>
                            <h1 className={styles.noteTitle}>Happy Rose Day</h1>
                            <p className={styles.noteBody}>Simple, pure, and forever yours.</p>
                        </div>
                        <div className={styles.restartBtnWrap}>
                            <button className={styles.restartBtn} onClick={restart}>↺</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
