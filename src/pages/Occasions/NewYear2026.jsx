import React, { useState, useEffect, useRef, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import styles from './NewYear2026.module.css';

const NewYear2026 = () => {
    const [init, setInit] = useState(false);
    const [stage, setStage] = useState(1);
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [showContinue, setShowContinue] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize Particles
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Canvas Fireworks Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor(x, y, vx, vy, color, life) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.color = color;
                this.life = life;
                this.maxLife = life;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.08;
                this.life--;
            }
            draw() {
                ctx.globalAlpha = this.life / this.maxLife;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createFireworkLocal = (x, y) => {
            const colors = ['#ec4899', '#8b5cf6', '#fcd34d', '#fff', '#ff6b6b'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const count = 50 + Math.random() * 30;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 2 + Math.random() * 3;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                particles.push(new Particle(x, y, vx, vy, color, 60 + Math.random() * 40));
            }
        };

        canvas.createFirework = createFireworkLocal;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) particles.splice(i, 1);
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Helper to trigger fireworks
    const triggerFirework = (x, y) => {
        if (canvasRef.current && canvasRef.current.createFirework) {
            canvasRef.current.createFirework(x, y);
        }
    };

    // Stage Management Effects
    useEffect(() => {
        let mounted = true;

        if (stage === 2) {
            const message = `Here's to you,
Prachiii 💖 tareef karunga to tum bologi ki kya hi bolte rehte ho....
digest nhi hota...!!
Kehte h Sharab, gusse or nind me insaan apne aap ko kho deta h....
or jo uske mn me hota h wo sab bahar aa jata h....
Sharab me peeta nhi, gusse me dikhata nhi, nind me ye sab soch soch ke type kar ke rakha hu...!!
toh me apne mn ki baat tumse kehna chahta hu....

wo ek sentence jo tumhe sab samjha dega....

-Butterflies 🦋🌼 can't see their own wings 🧚‍♀️🪶🪽.
 But everyone else admires their beauty🪷🌹.
 You are the same way to me....

As this new year begins,
I wanted you to know something…

She's pretty, she's amazing.
She's rare, she's beautiful.
Her heart is pure gold, and She's a Diamond.
She is YOU🫵.

I'm really grateful you're in my life. And let me tell you one thing...
No one was ever there to replace you, nor will there ever be.

Once again, me bata duuuu me koi shyr nhi huuuuu....!!
Programmer huuuu...!! to lines perfect likh deta huuuu...!!
lekin code me bugs hote h naaa...!!
So, agar me kabhi galti karu toh please mujhe maaf kar dena...!!

Waise me janta hu tumhe jyada padhna pasand nhi h....!!
to wo dairy jo tumne snapchat pe save karke rahi h usme likh deta hu...!!
Mn ho to padh lena...!!

ThankYou for gifting all those moments this year 💖

Or Tum ab buddhe log ki tarah sochna band kar do...!!
Just be happy, be silly, be weird...!!
Be YOU...!! Be Prachiii...!!

Happy New Year Prachiii✨`;

            const typeMessage = async () => {
                for (let i = 0; i <= message.length; i++) {
                    if (!mounted) break;
                    setTypedText(message.substring(0, i));
                    await new Promise(r => setTimeout(r, 50));
                }

                if (mounted) {
                    setTimeout(() => {
                        if (mounted) {
                            setShowContinue(true);
                            triggerFirework(window.innerWidth * 0.25, window.innerHeight * 0.3);
                            setTimeout(() => triggerFirework(window.innerWidth * 0.75, window.innerHeight * 0.3), 300);
                        }
                    }, 400);
                }
            };

            typeMessage();
        }

        if (stage === 3) {
            const createFloatingHeart = () => {
                if (!containerRef.current) return;
                const heart = document.createElement('div');
                heart.className = styles.floatHeart;
                heart.textContent = ['💖', '✨', '💫', '💗', '🌟'][Math.floor(Math.random() * 5)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (5 + Math.random() * 4) + 's';
                containerRef.current.appendChild(heart);
                setTimeout(() => heart.remove(), 9000);
            };

            const interval = setInterval(createFloatingHeart, 600);

            // Welcome fireworks
            setTimeout(() => {
                triggerFirework(window.innerWidth * 0.2, window.innerHeight * 0.3);
                triggerFirework(window.innerWidth * 0.8, window.innerHeight * 0.3);
            }, 300);

            // Auto hearts
            // Fix: Properly store the interval ID for cleanup even if it starts later
            let randomInterval;
            const autoHeartsTimeout = setTimeout(() => {
                randomInterval = setInterval(() => {
                    if (Math.random() < 0.3) createFloatingHeart();
                }, 2000);
            }, 2000);

            return () => {
                clearInterval(interval);
                clearTimeout(autoHeartsTimeout);
                if (randomInterval) clearInterval(randomInterval);
            };
        }

        return () => { mounted = false; };
    }, [stage]);

    // Optimize Particles Options to avoid re-renders on every state change (typing effect)
    const particlesOptions = useMemo(() => ({
        particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } }, // Reduced count slightly for mobile
            color: { value: ['#ec4899', '#8b5cf6', '#fcd34d'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
            move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' }
        },
        interactivity: {
            detectsOn: "canvas",
            events: { onHover: { enable: true, mode: 'bubble' }, onClick: { enable: false } },
            modes: { bubble: { distance: 120, size: 4, duration: 2, opacity: 0.8 } }
        },
        fpsLimit: 40, // Reduced from 60 to 40 for stability
        detectRetina: false // CRITICAL: Disable retina to prevent 4x-9x pixel rendering on mobile
    }), []);

    // Stage 1: Envelope Click
    const handleEnvelopeClick = (e) => {
        e.stopPropagation();
        if (envelopeOpen) return;
        setEnvelopeOpen(true);

        // Auto Play Music
        if (!isPlaying && audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => console.log('Auto-play prevented', err));
        }

        // Fireworks sequence
        setTimeout(() => triggerFirework(window.innerWidth / 2, window.innerHeight * 0.4), 600);
        setTimeout(() => {
            triggerFirework(window.innerWidth * 0.3, window.innerHeight * 0.5);
            triggerFirework(window.innerWidth * 0.7, window.innerHeight * 0.5);
        }, 1000);

        // Switch Stage
        setTimeout(() => {
            setStage(2);
        }, 2100);
    };

    // Stage 3: Interactive
    const handleContinue = () => {
        setStage(3);
    };

    const handleBigHeartClick = (e) => {
        e.stopPropagation();
        triggerFirework(window.innerWidth / 2, window.innerHeight / 2);

        // Helper specifically for this click event since it's transient
        const createTransientHeart = () => {
            if (!containerRef.current) return;
            const heart = document.createElement('div');
            heart.className = styles.floatHeart;
            heart.textContent = ['💖', '✨', '💫', '💗', '🌟'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (5 + Math.random() * 4) + 's';
            containerRef.current.appendChild(heart);
            setTimeout(() => heart.remove(), 9000);
        };

        // Burst of hearts
        for (let i = 0; i < 5; i++) {
            setTimeout(createTransientHeart, i * 100);
        }
    };

    const handleGlobalClick = (e) => {
        if (stage === 3 && e.target.id !== 'bigHeart' && e.target.id !== 'musicToggle') {
            triggerFirework(e.clientX, e.clientY);
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(err => console.log(err));
            setIsPlaying(true);
        }
    };

    return (
        <div
            className={styles.container}
            ref={containerRef}
            onClick={handleGlobalClick}
        >
            {init && (
                <Particles
                    id="tsparticles"
                    className={styles.particles}
                    options={particlesOptions}
                />
            )}

            <canvas id="fireworks" ref={canvasRef} className={styles.fireworksCanvas}></canvas>

            {/* Stage 1: Envelope */}
            <div className={`${styles.stage} ${stage === 1 ? styles.stageActive : ''}`}>
                <div className={styles.envelopeContainer} onClick={handleEnvelopeClick}>
                    <div className={`${styles.envelope} ${envelopeOpen ? styles.envelopeOpen : ''} ${envelopeOpen ? styles.envelopeGlow : ''}`}>
                        <div className={styles.envBack}></div>
                        <div className={styles.envFlap}></div>
                        <div className={styles.envLetter}>
                            <div className={styles.letterContent}>
                                <h2>💌</h2>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>wait.....</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.hint}>✨ Tap the envelope and wait!✨</div>
            </div>

            {/* Stage 2: Message */}
            <div className={`${styles.stage} ${stage === 2 ? styles.stageActive : ''}`}>
                <div className={styles.messageBox}>
                    <h1>Dear Prachiii 💖</h1>
                    <div className={styles.typedText}>{typedText}</div>
                    <button
                        className={`${styles.continueBtn} ${showContinue ? styles.continueBtnShow : ''}`}
                        onClick={handleContinue}
                    >
                        Ab kyaa..?? →
                    </button>
                </div>
            </div>

            {/* Stage 3: Interactive */}
            <div className={`${styles.stage} ${stage === 3 ? styles.stageActive : ''}`}>
                <div className={styles.interactiveBox}>
                    <h1>Happy New Year!</h1>
                    <p>Here's to new beginnings, shared smiles,<br />and moments that matter ✨</p>
                    <div className={styles.heartBig} id="bigHeart" onClick={handleBigHeartClick}>🥂</div>
                    <p>Tension mat lo isme alcohol nhi apple juice h 😁</p>
                    <p className={styles.tapHint}>Tap anywhere for fireworks 🎆</p>
                </div>
            </div>

            <button
                id="musicToggle"
                className={`${styles.musicToggle} ${isPlaying ? styles.musicTogglePlaying : ''}`}
                onClick={toggleMusic}
                title="Toggle Music"
            >
                {isPlaying ? '🔊' : '🔇'}
            </button>

            <audio ref={audioRef} loop>
                <source src="/assets/music/playdate.mp3" type="audio/mpeg" />
            </audio>
        </div>
    );
};

export default NewYear2026;
