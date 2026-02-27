import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GameBirthday2.module.css';

const GameBirthday2 = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('playing'); // playing, message, win
    const [currentMessage, setCurrentMessage] = useState('');
    const [confettiPieces, setConfettiPieces] = useState([]);

    // Game Constants
    const CELL_SIZE = 32;
    const ROWS = 10;
    const COLS = 10;
    const WALL = 1;
    const PATH = 0;
    const CHECKPOINT = 2;
    const TREASURE = 3;
    const TOTAL_CHECKPOINTS = 7;

    // Game State Refs (to avoid stale closures in event listeners)
    const stateRef = useRef({
        maze: [],
        player: { x: 1, y: 1 },
        collectedCheckpoints: 0,
        treasurePlaced: false
    });

    const messages = [
        "Prachi, aaj ka yeh safar sirf khazane tak nahi… balki tere muskurahat tak le jaayega!",
        "Tumhare ek message ne kabhi mera din banaya tha… aaj main wapas wahi khushi tumhe dena chahta hoon.",
        "Duniya mein kitne log honge jinke liye tum bas 'ek aur ladki' ho… par mere liye? Tum ho meri peace.",
        "Raaton ko jab sochta hoon, toh sirf yehi aata hai — 'Kash Prachi aaj khush ho!'",
        "Tumhare saath baat karna, chahe real ho ya texts… hamesha lagta hai jaise ghar pahunch gaya hoon.",
        "Yaad hai wo din jab apan first desk row mein baithe the, saath me?\nMujhe ummeed nhi thi tumhe yaad hogi… lekin tumhe thi. ❤️",
        "Happy Birthday, Prachi!\n\nDuniya tumhe har khushi de… par agar na de, toh main hoon na!\nHamesha muskurate raho, Beta!"
    ];

    // Initialize Game
    useEffect(() => {
        initGame();
        draw();

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const initGame = () => {
        const maze = generateMaze();
        // Place Checkpoints
        const checkpointPositions = [
            { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 3 },
            { x: 7, y: 5 }, { x: 5, y: 7 }, { x: 3, y: 7 }, { x: 1, y: 5 }
        ];
        checkpointPositions.forEach(pos => {
            maze[pos.y][pos.x] = CHECKPOINT;
        });

        stateRef.current = {
            maze,
            player: { x: 1, y: 1 },
            collectedCheckpoints: 0,
            treasurePlaced: false
        };
        draw();
    };

    const generateMaze = () => {
        const maze = Array(ROWS).fill().map(() => Array(COLS).fill(WALL));

        // Create open grid
        for (let y = 1; y < ROWS; y += 2) {
            for (let x = 1; x < COLS; x += 2) {
                maze[y][x] = PATH;
                if (x < COLS - 1) maze[y][x + 1] = PATH;
                if (y < ROWS - 1) maze[y + 1][x] = PATH;
            }
        }

        // Borders
        for (let i = 0; i < COLS; i++) {
            maze[0][i] = WALL;
            maze[ROWS - 1][i] = WALL;
        }
        for (let i = 0; i < ROWS; i++) {
            maze[i][0] = WALL;
            maze[i][COLS - 1] = WALL;
        }

        return maze;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { maze, player } = stateRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw maze
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const px = x * CELL_SIZE;
                const py = y * CELL_SIZE;

                if (maze[y][x] === WALL) {
                    ctx.fillStyle = '#f0e6f5';
                    ctx.strokeStyle = '#e0d0eb';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    // Using roundRect if supported, else rect
                    if (ctx.roundRect) {
                        ctx.roundRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
                    } else {
                        ctx.rect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                    }
                    ctx.fill();
                    ctx.stroke();
                } else if (maze[y][x] === CHECKPOINT) {
                    ctx.fillStyle = '#ff9ec6';
                    ctx.shadowColor = '#ff9ec6';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#fff';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('❤️', px + CELL_SIZE / 2, py + CELL_SIZE / 2 + 1); // +1 for better vertical center
                } else if (maze[y][x] === TREASURE) {
                    ctx.fillStyle = '#ffd700';
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(px + CELL_SIZE / 2, py + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#ff6b6b';
                    ctx.font = '18px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🎂', px + CELL_SIZE / 2, py + CELL_SIZE / 2 + 2);
                }
            }
        }

        // Draw player
        const playerPx = player.x * CELL_SIZE + CELL_SIZE / 2;
        const playerPy = player.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.fillStyle = '#ff4d94';
        ctx.shadowColor = '#ff4d94';
        ctx.shadowBlur = 10;
        ctx.font = `${CELL_SIZE - 4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🙂', playerPx, playerPy + 2);
        ctx.shadowBlur = 0;
    };

    const movePlayer = (dx, dy) => {
        if (gameState !== 'playing') return;

        const { maze, player } = stateRef.current;
        const newX = player.x + dx;
        const newY = player.y + dy;

        if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
            if (maze[newY][newX] !== WALL) {
                stateRef.current.player = { x: newX, y: newY };

                // Checkpoint collection
                if (maze[newY][newX] === CHECKPOINT) {
                    stateRef.current.collectedCheckpoints++;
                    stateRef.current.maze[newY][newX] = PATH; // remove checkpoint

                    // Show message
                    setCurrentMessage(messages[stateRef.current.collectedCheckpoints - 1]);
                    setGameState('message');

                    if (stateRef.current.collectedCheckpoints === TOTAL_CHECKPOINTS && !stateRef.current.treasurePlaced) {
                        placeTreasure();
                    }
                }

                // Treasure collection
                if (maze[newY][newX] === TREASURE) {
                    setCurrentMessage(messages[6]); // Last message logic handled in render
                    setGameState('win');
                    createConfetti();
                }
            }
        }
        draw();
    };

    const placeTreasure = () => {
        const treasureX = 9;
        const treasureY = 9;
        stateRef.current.maze[treasureY][treasureX] = TREASURE;
        stateRef.current.treasurePlaced = true;
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowUp': movePlayer(0, -1); break;
            case 'ArrowDown': movePlayer(0, 1); break;
            case 'ArrowLeft': movePlayer(-1, 0); break;
            case 'ArrowRight': movePlayer(1, 0); break;
            default: break;
        }
    };

    const handleContinue = () => {
        setGameState('playing');
        draw();
    };

    const createConfetti = () => {
        const emojis = ['🎉', '💖', '✨', '🎁', '🎈', '💐'];
        const pieces = [];
        for (let i = 0; i < 80; i++) {
            pieces.push({
                id: i,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                left: Math.random() * 100 + '%',
                fontSize: (Math.random() * 16 + 14) + 'px',
                animationDuration: (Math.random() * 2 + 1) + 's',
                opacity: Math.random()
            });
        }
        setConfettiPieces(pieces);
    };

    // Touch Handling
    const touchStart = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > 30 || absDy > 30) {
            if (absDx > absDy) movePlayer(dx > 0 ? 1 : -1, 0);
            else movePlayer(0, dy > 0 ? 1 : -1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.backBtn} onClick={() => navigate('/')}>←</div>
            <div className={styles.gameContainer}>
                <div className={styles.uiPanel}>🎂 7 Yaadein • Prachi</div>
                <canvas
                    ref={canvasRef}
                    className={styles.gameCanvas}
                    width={320}
                    height={320}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />

                {gameState === 'message' && (
                    <div className={styles.messageScreen}>
                        <div className={styles.messageText} dangerouslySetInnerHTML={{ __html: currentMessage.replace(/\n/g, '<br>') }} />
                        <button className={styles.btn} onClick={handleContinue}>Continue 💖</button>
                    </div>
                )}

                {gameState === 'win' && (
                    <div className={styles.winScreen}>
                        <div className={styles.winMessage} dangerouslySetInnerHTML={{ __html: messages[6].replace(/\n/g, '<br>') }} />
                        <div className={styles.signature}>–Deepak</div>
                        <div className={styles.confettiContainer}>
                            {confettiPieces.map(piece => (
                                <span
                                    key={piece.id}
                                    className={styles.confettiPiece}
                                    style={{
                                        left: piece.left,
                                        fontSize: piece.fontSize,
                                        animationDuration: piece.animationDuration,
                                        opacity: piece.opacity,
                                        top: '-20px'
                                    }}
                                >
                                    {piece.emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBirthday2;
