import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeddyQuest.module.css';

// ─── Game Data ───
const MEMORY_EMOJIS = ['❤️', '💖', '💕', '💘', '💝', '💟', '💗', '💓'];

const QUIZ_QUESTIONS = [
    { q: "What makes a perfect gift?", options: ["Money", "Thoughtfulness", "Expensive things", "Random stuff"], answer: 1 },
    { q: "How do you show someone you care?", options: ["Ignore them", "Listen to them", "Criticize them", "Forget their birthday"], answer: 1 },
    { q: "What's the best way to make someone smile?", options: ["Be kind", "Be rude", "Be selfish", "Be distant"], answer: 0 },
    { q: "True love is about:", options: ["Control", "Understanding", "Jealousy", "Possession"], answer: 1 },
    { q: "The most important thing in a relationship is:", options: ["Trust", "Money", "Looks", "Status"], answer: 0 },
];

const DRAW_COLORS = ['#ff6b9d', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#1f2937'];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Floating Hearts Background ───
function FloatingHearts() {
    const hearts = useMemo(() =>
        Array.from({ length: 10 }, (_, i) => ({
            id: i,
            x: (Math.random() * 100).toFixed(0),
            dur: (12 + Math.random() * 10).toFixed(0),
            delay: (Math.random() * 15).toFixed(0),
            size: (16 + Math.random() * 16).toFixed(0),
        })), []);

    return (
        <div className={styles.floatingHearts}>
            {hearts.map(h => (
                <div key={h.id} className={styles.floatingHeart}
                    style={{ '--x': `${h.x}%`, '--dur': `${h.dur}s`, '--delay': `${h.delay}s`, '--size': `${h.size}px` }}>
                    ❤️
                </div>
            ))}
        </div>
    );
}

// ─── Main Component ───
export default function TeddyQuest() {
    const navigate = useNavigate();
    const [screen, setScreen] = useState('welcome'); // welcome, memory, catcher, quiz, drawing, final
    const [totalHearts, setTotalHearts] = useState(0);

    const progress = { welcome: 0, memory: 20, catcher: 40, quiz: 60, drawing: 80, final: 100 };

    const addHearts = useCallback((n) => setTotalHearts(h => h + n), []);

    const nextScreen = useCallback((from) => {
        const flow = ['welcome', 'memory', 'catcher', 'quiz', 'drawing', 'final'];
        const idx = flow.indexOf(from);
        if (idx < flow.length - 1) setScreen(flow[idx + 1]);
    }, []);

    const restart = () => {
        setTotalHearts(0);
        setScreen('welcome');
    };

    return (
        <div className={styles.container}>
            <FloatingHearts />
            <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>

            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress[screen]}%` }} />
            </div>

            {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('memory')} />}
            {screen === 'memory' && <MemoryGame onComplete={() => nextScreen('memory')} addHearts={addHearts} />}
            {screen === 'catcher' && <HeartCatcher onComplete={() => nextScreen('catcher')} addHearts={addHearts} />}
            {screen === 'quiz' && <QuizGame onComplete={() => nextScreen('quiz')} addHearts={addHearts} />}
            {screen === 'drawing' && <DrawingScreen onComplete={() => nextScreen('drawing')} addHearts={addHearts} />}
            {screen === 'final' && <FinalScreen totalHearts={totalHearts} onRestart={restart} />}
        </div>
    );
}

// ─── Welcome ───
function WelcomeScreen({ onStart }) {
    return (
        <div className={styles.screen}>
            <div className={styles.welcomeEmoji}>🧸</div>
            <h1 className={styles.welcomeTitle}>Teddy's Quest</h1>
            <p className={styles.welcomeSubtitle}>Complete fun challenges to earn hearts! 💕</p>
            <button className={styles.startGameBtn} onClick={onStart}>Start Quest ▶</button>
        </div>
    );
}

// ─── Memory Game ───
function MemoryGame({ onComplete, addHearts }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [canFlip, setCanFlip] = useState(true);
    const done = matched.length === MEMORY_EMOJIS.length * 2;

    useEffect(() => {
        const deck = shuffle([...MEMORY_EMOJIS, ...MEMORY_EMOJIS]).map((emoji, i) => ({ id: i, emoji }));
        setCards(deck);
    }, []);

    const handleFlip = (id) => {
        if (!canFlip || flipped.includes(id) || matched.includes(id)) return;

        const next = [...flipped, id];
        setFlipped(next);
        setMoves(m => m + 1);

        if (next.length === 2) {
            setCanFlip(false);
            const [a, b] = next;
            if (cards[a].emoji === cards[b].emoji) {
                setMatched(prev => [...prev, a, b]);
                addHearts(2);
                setFlipped([]);
                setCanFlip(true);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setCanFlip(true);
                }, 900);
            }
        }
    };

    return (
        <div className={styles.screen}>
            <h2 className={styles.gameTitle}>🧠 Memory Match</h2>
            <p className={styles.gameSubtitle}>Moves: {moves} | Pairs: {matched.length / 2}/{MEMORY_EMOJIS.length}</p>

            <div className={styles.memoryGrid}>
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    const isMatched = matched.includes(card.id);
                    return (
                        <button
                            key={card.id}
                            className={`${styles.memoryCard} ${isFlipped ? styles.memoryCardFlipped : ''} ${isMatched ? styles.memoryCardMatched : ''}`}
                            onClick={() => handleFlip(card.id)}
                        >
                            {isFlipped ? card.emoji : <span className={styles.memoryCardBack}>🧸</span>}
                        </button>
                    );
                })}
            </div>

            {done && <button className={styles.nextBtn} onClick={onComplete}>Next Challenge →</button>}
        </div>
    );
}

// ─── Heart Catcher ───
function HeartCatcher({ onComplete, addHearts }) {
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const [basketX, setBasketX] = useState(50);
    const [hearts, setHearts] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const areaRef = useRef(null);
    const done = score >= 10 || timeLeft <= 0;
    const goalReached = score >= 10;

    // Start game
    const start = () => {
        setStarted(true);
        setScore(0);
        setHearts([]);
        setTimeLeft(20);
    };

    // Timer
    useEffect(() => {
        if (!started || done) return;
        const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(t);
    }, [started, done]);

    // Spawn hearts
    useEffect(() => {
        if (!started || done) return;
        const interval = setInterval(() => {
            const id = Date.now() + Math.random();
            const x = Math.random() * 80 + 10;
            const speed = 2 + Math.random() * 2;
            setHearts(prev => [...prev, { id, x, speed, caught: false }]);
        }, 700);
        return () => clearInterval(interval);
    }, [started, done]);

    // Mouse/touch tracking
    const handleMove = (clientX) => {
        if (!areaRef.current) return;
        const rect = areaRef.current.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(5, Math.min(95, pct)));
    };

    const catchHeart = (id) => {
        setHearts(prev => prev.map(h => h.id === id ? { ...h, caught: true } : h));
        setScore(s => s + 1);
        addHearts(3);
    };

    // Remove hearts that fell
    const removeHeart = (id) => {
        setHearts(prev => prev.filter(h => h.id !== id));
    };

    return (
        <div className={styles.screen}>
            <h2 className={styles.gameTitle}>💕 Heart Catcher</h2>
            <p className={styles.gameSubtitle}>Tap the falling hearts! Catch 10 to win!</p>

            <div className={styles.catcherArea} ref={areaRef}
                onMouseMove={(e) => handleMove(e.clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            >
                <span className={styles.catcherTimer}>⏱ {timeLeft}s</span>
                <span className={styles.catcherScore}>❤️ {score}/10</span>

                {/* Basket */}
                <div className={styles.catcher} style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}>🧺</div>

                {/* Falling hearts */}
                {hearts.filter(h => !h.caught).map(h => (
                    <div key={h.id} className={styles.fallingHeart}
                        style={{ left: `${h.x}%`, '--speed': `${h.speed}s` }}
                        onClick={() => catchHeart(h.id)}
                        onAnimationEnd={() => removeHeart(h.id)}
                    >
                        ❤️
                    </div>
                ))}
            </div>

            {!started && <button className={styles.nextBtn} onClick={start}>Start! 🎮</button>}
            {done && goalReached && <button className={styles.nextBtn} onClick={onComplete}>Next Challenge →</button>}
            {done && !goalReached && <button className={styles.nextBtn} onClick={start}>Try Again 🔄</button>}
        </div>
    );
}

// ─── Quiz ───
function QuizGame({ onComplete, addHearts }) {
    const [current, setCurrent] = useState(0);
    const [answered, setAnswered] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const isDone = current >= QUIZ_QUESTIONS.length;

    const handleAnswer = (idx) => {
        if (answered !== null) return;
        setAnswered(idx);
        if (idx === QUIZ_QUESTIONS[current].answer) {
            setQuizScore(s => s + 1);
            addHearts(5);
        }
    };

    const nextQ = () => {
        setAnswered(null);
        setCurrent(c => c + 1);
    };

    if (isDone) {
        return (
            <div className={styles.screen}>
                <h2 className={styles.gameTitle}>🎉 Quiz Complete!</h2>
                <p className={styles.gameSubtitle}>Score: {quizScore}/{QUIZ_QUESTIONS.length}</p>
                <button className={styles.nextBtn} onClick={onComplete}>Next Challenge →</button>
            </div>
        );
    }

    const q = QUIZ_QUESTIONS[current];

    return (
        <div className={styles.screen}>
            <h2 className={styles.gameTitle}>🧠 Love Quiz</h2>
            <p className={styles.gameSubtitle}>Score: {quizScore}/{QUIZ_QUESTIONS.length}</p>

            <div className={styles.quizCard}>
                <p className={styles.quizQuestion}>{q.q}</p>
                <div className={styles.quizOptions}>
                    {q.options.map((opt, i) => {
                        let cls = styles.quizOption;
                        if (answered !== null) {
                            if (i === q.answer) cls += ` ${styles.quizCorrect}`;
                            else if (i === answered && i !== q.answer) cls += ` ${styles.quizWrong}`;
                        }
                        return (
                            <button key={i} className={cls} onClick={() => handleAnswer(i)}>{opt}</button>
                        );
                    })}
                </div>
                <p className={styles.quizProgress}>Question {current + 1} of {QUIZ_QUESTIONS.length}</p>
            </div>

            {answered !== null && <button className={styles.nextBtn} onClick={nextQ}>Next →</button>}
        </div>
    );
}

// ─── Drawing ───
function DrawingScreen({ onComplete, addHearts }) {
    const canvasRef = useRef(null);
    const [color, setColor] = useState(DRAW_COLORS[0]);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
    }, []);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const ctx = canvasRef.current.getContext('2d');
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const pos = getPos(e);
        ctx.strokeStyle = color;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDraw = () => setIsDrawing(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const finish = () => {
        addHearts(10);
        onComplete();
    };

    return (
        <div className={styles.screen}>
            <h2 className={styles.gameTitle}>🎨 Draw for Teddy!</h2>
            <p className={styles.gameSubtitle}>Draw a heart, a teddy, or anything sweet!</p>

            <div className={styles.drawingArea}>
                <canvas ref={canvasRef} className={styles.canvas}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                    onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                />
                <div className={styles.drawControls}>
                    {DRAW_COLORS.map(c => (
                        <button key={c}
                            className={`${styles.colorBtn} ${c === color ? styles.active : ''}`}
                            style={{ background: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                    <button className={styles.clearBtn} onClick={clearCanvas}>Clear</button>
                </div>
            </div>

            <button className={styles.nextBtn} onClick={finish}>Done! ✨</button>
        </div>
    );
}

// ─── Final Screen ───
function FinalScreen({ totalHearts, onRestart }) {
    const completion = Math.min(100, Math.round((totalHearts / 50) * 100));

    const resultMsg = completion >= 80
        ? "👑 PERFECT! Teddy is super impressed!\nYou're ready to make someone's day extra special! 💘"
        : completion >= 60
            ? "✨ AMAZING! Teddy loves your effort!\nYour special person will definitely appreciate this! 💕"
            : "🥰 SWEET! Teddy is happy!\nYou put in great effort — that's what matters! 💖";

    return (
        <div className={styles.finalScreen}>
            <div className={styles.finalEmoji}>🧸💝</div>
            <h1 className={styles.finalTitle}>Quest Complete!</h1>

            <div className={styles.scoreCard}>
                <p className={styles.scoreTitle}>Hearts Earned</p>
                <p className={styles.scoreValue}>❤️ {totalHearts}</p>
            </div>

            <p className={styles.finalMessage}>{resultMsg}</p>
            <button className={styles.replayBtn} onClick={onRestart}>Play Again 🔄</button>
        </div>
    );
}
