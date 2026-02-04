import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './BirthdayMaze.module.css';
import BackButton from '../../../components/BackButton/BackButton';

const BirthdayMaze = () => {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [popupState, setPopupState] = useState({ open: false, message: '' });
    const [gameState, setGameState] = useState({ won: false, progress: 0 });

    // Game Logic State (Refs for mutable values in game loop)
    const gameData = useRef({
        playerPos: { row: 1, col: 1 },
        collectedCheckpoints: new Set(),
        cakeSpawned: false,
        cakePos: { row: 8, col: 8 },
        cellSize: 0,
        playerSize: 0,
        checkPointSize: 0,
        cakeSize: 0,
        animationFrame: 0,
        firstMoveMade: false
    });

    const GRID_SIZE = 10;
    const checkpoints = [
        [1, 1], [1, 5], [3, 3], [5, 7],
        [5, 1], [7, 1], [7, 8]
    ];

    // Maze layout (1 = wall, 0 = path)
    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const messages = [
        "Prachiii, aaj ka yeh safar sirf khazane tak nahi… balki tumhari muskurahat tak le jaayega!",
        "Tumhare ek message ne kabhi mera din banaya tha… aaj main wapas wahi khushi tumhe dena chahta hoon.",
        "I don't understand whether you are blessed or not, but one thing is for sure, you are a blessing itself.❤️.",
        "For you, it might be a normal day :) But for me, it is an occasion — 'That's why I'm here with this hard coded game!'",
        "Yes Yes Yes, You're Damn special, not on the basis of your looks(face, personality, intelligence, etc.❌), but on the basis of the heart you have.❤️, the innocence you hold✨",
        "Yaad hai wo din jab apan first row mein baithe the, saath me?\nMujhe ummeed nhi thi tumhe yaad hogi… lekin tumhe thi. ❤️ I can still remember that day clearly.🕵️‍♂️ Thankyouuuuu Ram sir!🥳",
        "Happy Birthday, Prachiii!\n\nDuniya tumhe har khushi de… par agar na de, toh main hoon na!\nYou can always count on me, for anything and everything!🥳"
    ];

    // --- Audio ---
    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const tryAutoPlay = () => {
        if (!gameData.current.firstMoveMade) return;
        if (!isPlaying && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
        }
    };

    // --- Drawing ---
    const calculateSizes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Find component size (parent width)
        const size = Math.min(window.innerWidth - 40, 360);

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        const customCtx = canvas.getContext('2d');
        customCtx.scale(dpr, dpr);

        gameData.current.cellSize = size / GRID_SIZE;
        gameData.current.playerSize = gameData.current.cellSize * 0.65;
        gameData.current.checkPointSize = gameData.current.cellSize * 0.55;
        gameData.current.cakeSize = gameData.current.cellSize * 0.85;
    };

    const drawGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { cellSize, playerSize, checkPointSize, cakeSize, animationFrame, playerPos, collectedCheckpoints, cakeSpawned, cakePos, firstMoveMade } = gameData.current;

        // Clear (logical size)
        ctx.clearRect(0, 0, GRID_SIZE * cellSize, GRID_SIZE * cellSize);

        // Draw Maze
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (maze[row][col] === 1) {
                    const gradient = ctx.createLinearGradient(
                        col * cellSize, row * cellSize,
                        (col + 1) * cellSize, (row + 1) * cellSize
                    );
                    gradient.addColorStop(0, '#ffb3e6');
                    gradient.addColorStop(1, '#ff99cc');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

                    ctx.strokeStyle = '#ff80b3';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);
                } else {
                    ctx.fillStyle = '#ffe6f2';
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }

        // Draw Checkpoints
        checkpoints.forEach((pos, index) => {
            if (!collectedCheckpoints.has(index)) {
                const x = pos[1] * cellSize + cellSize / 2;
                const y = pos[0] * cellSize + cellSize / 2;
                const pulse = Math.sin(animationFrame * 0.1 + index) * 0.3 + 0.7;
                const glowSize = checkPointSize * pulse;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
                gradient.addColorStop(0, 'rgba(255, 20, 147, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 20, 147, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, glowSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.font = `${checkPointSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💖', x, y);
            }
        });

        // Draw Cake
        if (cakeSpawned && !gameState.won) {
            const x = cakePos.col * cellSize + cellSize / 2;
            const y = cakePos.row * cellSize + cellSize / 2;
            const pulse = Math.sin(animationFrame * 0.15) * 0.3 + 0.7;
            const glowSize = cakeSize * pulse;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 223, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = `${cakeSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎂', x, y);
        }

        // Draw Player
        const x = playerPos.col * cellSize + cellSize / 2;
        const y = playerPos.row * cellSize + cellSize / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, playerSize * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, playerSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.font = `${playerSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤠', x, y);
    }, [gameState.won]);

    // --- Game Loop ---
    useEffect(() => {
        calculateSizes();
        let frameId;
        const loop = () => {
            gameData.current.animationFrame++;
            drawGame();
            if (!gameState.won) {
                frameId = requestAnimationFrame(loop);
            }
        };
        frameId = requestAnimationFrame(loop);

        const handleResize = () => {
            calculateSizes();
            drawGame();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        }
    }, [drawGame, gameState.won]);

    // --- Gameplay Logic ---
    const movePlayer = (dRow, dCol) => {
        if (gameState.won || popupState.open) return;

        const { playerPos: pos } = gameData.current;
        const newRow = pos.row + dRow;
        const newCol = pos.col + dCol;

        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && maze[newRow][newCol] === 0) {
            gameData.current.playerPos = { row: newRow, col: newCol };

            if (!gameData.current.firstMoveMade) {
                gameData.current.firstMoveMade = true;
                tryAutoPlay();
            }

            checkCheckpoints(newRow, newCol);
            checkCake(newRow, newCol);
        }
    };

    const checkCheckpoints = (row, col) => {
        checkpoints.forEach((pt, index) => {
            if (!gameData.current.collectedCheckpoints.has(index) && row === pt[0] && col === pt[1]) {
                gameData.current.collectedCheckpoints.add(index);
                const progress = (gameData.current.collectedCheckpoints.size / checkpoints.length) * 100;
                setGameState(prev => ({ ...prev, progress }));

                // Show popup
                setPopupState({ open: true, message: messages[index] });
            }
        });
    };

    const checkCake = (row, col) => {
        const { cakeSpawned, cakePos } = gameData.current;
        if (cakeSpawned && !gameState.won && row === cakePos.row && col === cakePos.col) {
            setGameState(prev => ({ ...prev, won: true }));
            createConfetti();
        }
    };

    const closePopup = () => {
        setPopupState({ ...popupState, open: false });
        // Check if all collected
        if (gameData.current.collectedCheckpoints.size === checkpoints.length && !gameData.current.cakeSpawned) {
            gameData.current.cakeSpawned = true;
        }
    };

    const createConfetti = () => {
        // Simple confetti DOM implementation
        const emojis = ['🎉', '🎊', '🎈', '🎁', '💖', '✨', '🌟', '💝', '🎂', '🥳', '🎀', '🌸'];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = styles.confetti;
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.left = Math.random() * 100 + '%';
                el.style.animationDuration = (Math.random() * 3 + 2.5) + 's';
                el.style.fontSize = (Math.random() * 10 + 20) + 'px';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 6000);
            }, i * 40);
        }
    };

    // Keyboard Controls
    useEffect(() => {
        const handleKey = (e) => {
            if (popupState.open) {
                if (e.key === 'Enter' || e.key === ' ') closePopup();
                return;
            }
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': movePlayer(-1, 0); break;
                case 'ArrowDown': case 's': case 'S': movePlayer(1, 0); break;
                case 'ArrowLeft': case 'a': case 'A': movePlayer(0, -1); break;
                case 'ArrowRight': case 'd': case 'D': movePlayer(0, 1); break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [popupState.open, gameState.won]);


    return (
        <div className={styles.gameWrapper}>
            <BackButton />
            <button className={`${styles.musicToggle} ${!isPlaying ? styles.muted : ''}`} onClick={toggleAudio}>
                {isPlaying ? '🎵' : '🔇'}
            </button>
            <audio ref={audioRef} loop src="/assets/games/birthday-maze/birthday-music.mp3" />

            <div className={styles.topPanel}>
                <h1 className={styles.title}><span>🎂</span> Prachiii's Birthday Maze <span>🎂</span></h1>
            </div>

            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${gameState.progress}%` }}></div>
            </div>

            <div className={styles.gameContainer}>
                <canvas ref={canvasRef} className={styles.canvas}></canvas>
            </div>

            <div className={styles.instructions}>
                Use Arrow Keys to move • Collect all 💖 hearts!
            </div>

            {/* Popup */}
            {popupState.open && (
                <>
                    <div className={styles.overlay} onClick={closePopup}></div>
                    <div className={styles.popup}>
                        <div className={styles.popupMessage}>{popupState.message}</div>
                        <button className={styles.continueBtn} onClick={closePopup}>Continue</button>
                    </div>
                </>
            )}

            {/* Win Screen */}
            {gameState.won && (
                <div className={styles.winScreen}>
                    <div className={styles.winMessage}>
                        {messages[6]}
                        <div className={styles.signature}>–Deepak</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BirthdayMaze;
