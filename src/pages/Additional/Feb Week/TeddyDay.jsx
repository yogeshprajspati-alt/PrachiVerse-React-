import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TeddySVG, { Emotion } from './TeddySVG';
import styles from './TeddyDay.module.css';

const FOOD_ITEMS = ['🍕', '🍦', '🍩', '🍫', '🍪', '🍯', '🍓', '🍔'];

const SWEET_MESSAGE =
    `Ye Prachi,

Maybe this time you'd like this .
Hasti Raha karo, bohot acchi lagti ho.

I miss those old days👉👈.
Those Conversations, Truth-Dares.
Sab Refresh ho jata kaashhhhh...! 🌟
ajeeb sa lagne lagta h, to fir text karne se rok nhi pata....
aisa lagta h ki tension me naa ho ye ladki..!!


-Teddy 🧸`;

const FOOD_REACTIONS = [
    { text: "Yummy, Prachi! 😋", emotion: Emotion.HAPPY },
    { text: "Thanks Prachi! 💖", emotion: Emotion.GIGGLE },
    { text: "Prachi's the best! 🍯", emotion: Emotion.BLUSH },
    { text: "You're sweet, Prachi! 🥰", emotion: Emotion.HUG },
    { text: "Prachiiiiii! 🤤", emotion: Emotion.HAPPY },
    { text: "Prachi prachii!  🍓", emotion: Emotion.EATING },
];

export default function TeddyDay() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [emotion, setEmotion] = useState(Emotion.NEUTRAL);
    const [isSleeping, setIsSleeping] = useState(false);
    const [speechText, setSpeechText] = useState(null);
    const [costume, setCostume] = useState({ head: 'none', eyes: 'none', neck: 'none' });
    const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
    const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [flyingFood, setFlyingFood] = useState(null);
    const [isReadingNote, setIsReadingNote] = useState(false);
    const [overlays, setOverlays] = useState({});
    const foodIdRef = useRef(0);

    const closeAllMenus = () => { setIsFoodMenuOpen(false); setIsWardrobeOpen(false); setIsActionsOpen(false); };

    // --- Actions ---
    const triggerBomb = () => {
        if (isSleeping) return; closeAllMenus();
        setOverlays(p => ({ ...p, bomb: true }));
        setTimeout(() => { setEmotion(Emotion.SHOCKED); setOverlays(p => ({ ...p, bomb: false })); setTimeout(() => setEmotion(Emotion.CRY), 2000); }, 400);
    };
    const triggerSlash = () => {
        if (isSleeping) return; closeAllMenus();
        setOverlays(p => ({ ...p, slash: true })); setEmotion(Emotion.SCARED);
        setTimeout(() => { setOverlays(p => ({ ...p, slash: false })); setTimeout(() => setEmotion(Emotion.NEUTRAL), 1800); }, 400);
    };
    const triggerKiss = () => {
        if (isSleeping) return; closeAllMenus();
        setEmotion(Emotion.KISS);
        setTimeout(() => { setOverlays(p => ({ ...p, lipstick: true })); setEmotion(Emotion.BLUSH); setTimeout(() => { setOverlays(p => ({ ...p, lipstick: false })); setEmotion(Emotion.NEUTRAL); }, 2000); }, 500);
    };
    const triggerShower = () => {
        setIsSleeping(false); closeAllMenus();
        setOverlays(p => ({ ...p, shower: true }));
        setTimeout(() => { setOverlays(p => ({ ...p, shower: false, bomb: false })); setEmotion(Emotion.HAPPY); setTimeout(() => setEmotion(Emotion.NEUTRAL), 1500); }, 3000);
    };
    const triggerBrush = () => {
        setIsSleeping(false); closeAllMenus();
        setOverlays(p => ({ ...p, brush: true })); setEmotion(Emotion.HAPPY);
        setTimeout(() => { setOverlays(p => ({ ...p, brush: false })); setEmotion(Emotion.NEUTRAL); }, 2500);
    };
    const triggerSneeze = () => {
        setIsSleeping(false); closeAllMenus();
        setEmotion(Emotion.SNEEZE_BUILD); setSpeechText("Ah... Ahhh...");
        setTimeout(() => {
            setSpeechText("CHOO! 💨"); setEmotion(Emotion.SNEEZE);
            setTimeout(() => { setSpeechText(null); setEmotion(Emotion.SHOCKED); setTimeout(() => setEmotion(Emotion.NEUTRAL), 1000); }, 500);
        }, 1500);
    };
    const triggerDance = () => { setIsSleeping(false); closeAllMenus(); setEmotion(Emotion.DANCE); setTimeout(() => setEmotion(Emotion.NEUTRAL), 4000); };
    const triggerCold = () => { closeAllMenus(); setEmotion(Emotion.COLD); setTimeout(() => setEmotion(Emotion.NEUTRAL), 3000); };
    const triggerSecret = () => { closeAllMenus(); setEmotion(Emotion.SECRET); setTimeout(() => setEmotion(Emotion.NEUTRAL), 2000); };
    const triggerYawn = () => { closeAllMenus(); setEmotion(Emotion.SLEEP); setTimeout(() => { if (!isSleeping) setEmotion(Emotion.NEUTRAL); }, 2000); };
    const toggleEaster = () => { closeAllMenus(); setCostume(p => ({ ...p, head: p.head === 'bunny' ? 'none' : 'bunny' })); };

    const handleSlap = (side) => {
        if (isSleeping) return;
        setOverlays(p => ({ ...p, slap: side })); setEmotion(Emotion.HURT);
        setTimeout(() => { setOverlays(p => ({ ...p, slap: null })); setTimeout(() => setEmotion(Emotion.CRY), 100); setTimeout(() => setEmotion(Emotion.NEUTRAL), 2000); }, 300);
    };

    const handleInteraction = (part) => {
        if (isFoodMenuOpen || isWardrobeOpen || isActionsOpen) { closeAllMenus(); return; }
        if (part === 'face_left') return handleSlap('left');
        if (part === 'face_right') return handleSlap('right');
        if (isSleeping && part !== 'note') { setIsSleeping(false); setEmotion(Emotion.HAPPY); setTimeout(() => setEmotion(Emotion.NEUTRAL), 1000); return; }
        if (emotion === Emotion.EATING) return;
        if (part === 'note') { setIsReadingNote(true); setEmotion(Emotion.HAPPY); return; }
        if (part === 'nose') { triggerKiss(); }
        else if (['head', 'belly', 'left_ear', 'right_ear'].includes(part)) { setEmotion(Emotion.GIGGLE); }
        setTimeout(() => {
            const sticky = [Emotion.SHOCKED, Emotion.CRY, Emotion.SLEEP, Emotion.EATING, Emotion.COLD, Emotion.DANCE, Emotion.SNEEZE_BUILD, Emotion.SNEEZE];
            if (!sticky.includes(emotion) && !isReadingNote && !speechText) setEmotion(Emotion.NEUTRAL);
        }, 1500);
    };

    const handleLongPress = () => {
        if (isSleeping) return;
        setEmotion(Emotion.BLUSH); setTimeout(() => { if (!isSleeping) setEmotion(Emotion.NEUTRAL); }, 2000);
    };

    // Food
    const handleFeed = (emoji) => {
        setFlyingFood({ id: ++foodIdRef.current, emoji }); setEmotion(Emotion.EATING); setSpeechText(null);
        setTimeout(() => {
            setFlyingFood(null); setIsFoodMenuOpen(false);
            const r = FOOD_REACTIONS[Math.floor(Math.random() * FOOD_REACTIONS.length)];
            setSpeechText(r.text); setEmotion(r.emotion);
            setTimeout(() => { setSpeechText(null); setEmotion(Emotion.NEUTRAL); }, 2000);
        }, 1000);
    };

    const updateCostume = (type, value) => setCostume(p => ({ ...p, [type]: value }));
    const handleBackgroundClick = () => { if (isFoodMenuOpen || isWardrobeOpen || isActionsOpen) closeAllMenus(); };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.darkMode : styles.lightMode}`} onClick={handleBackgroundClick}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Prachi's Teddy</h1>
                <button onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); }} className={styles.themeBtn}>
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Main */}
            <div className={styles.mainContent}>
                {/* Flying food */}
                {flyingFood && <div className={styles.flyingFood}>{flyingFood.emoji}</div>}

                <div className={styles.teddyArea}>
                    {speechText && <div className={styles.speechBubble}><p className={styles.speechText}>{speechText}</p></div>}
                    {overlays.bomb && <div className={styles.explosionFlashBg} />}
                    <TeddySVG emotion={emotion} hasNote={true} costume={costume} overlays={overlays} onInteract={handleInteraction} onLongPress={handleLongPress} />
                </div>

                {/* Controls */}
                <div className={styles.controlsWrap} onClick={e => e.stopPropagation()}>
                    {/* Quick actions */}
                    <div className={styles.quickActions}>
                        <button className={`${styles.actionBtn} ${styles.btnRed}`} onClick={triggerSlash} title="Scare">⚔️</button>
                        <button className={`${styles.actionBtn} ${styles.btnDark}`} onClick={triggerBomb} title="Bomb">💣</button>
                        <button className={`${styles.actionBtn} ${styles.btnBlue}`} onClick={triggerShower} title="Shower">🚿</button>
                        <button className={`${styles.actionBtn} ${styles.btnPink}`} onClick={triggerKiss} title="Kiss">❤️</button>
                    </div>

                    {/* Menu bar */}
                    <div className={styles.menuBar}>
                        <button className={`${styles.menuBtn} ${isFoodMenuOpen ? styles.active : ''}`} onClick={(e) => { e.stopPropagation(); setIsFoodMenuOpen(!isFoodMenuOpen); setIsWardrobeOpen(false); setIsActionsOpen(false); }}>🍽️</button>
                        <button className={`${styles.menuBtn} ${isWardrobeOpen ? styles.active : ''}`} onClick={(e) => { e.stopPropagation(); setIsWardrobeOpen(!isWardrobeOpen); setIsFoodMenuOpen(false); setIsActionsOpen(false); }}>👔</button>
                        <button className={`${styles.menuBtn} ${isActionsOpen ? styles.active : ''}`} onClick={(e) => { e.stopPropagation(); setIsActionsOpen(!isActionsOpen); setIsFoodMenuOpen(false); setIsWardrobeOpen(false); }}>✨</button>
                        <div className={styles.menuDivider} />
                        <button className={`${styles.menuBtn} ${isSleeping ? styles.sleeping : ''}`} onClick={() => { setIsSleeping(!isSleeping); setEmotion(isSleeping ? Emotion.HAPPY : Emotion.SLEEP); closeAllMenus(); }}>🛏️</button>
                    </div>
                </div>

                {/* Food menu */}
                <div onClick={e => e.stopPropagation()} className={`${styles.dropdown} ${isFoodMenuOpen ? styles.open : styles.closed}`}>
                    <div className={styles.glassPanel}>
                        {FOOD_ITEMS.map((item, i) =>
                            <button key={i} onClick={() => handleFeed(item)} className={styles.foodBtn}>{item}</button>
                        )}
                    </div>
                </div>

                {/* Wardrobe menu */}
                <div onClick={e => e.stopPropagation()} className={`${styles.dropdown} ${isWardrobeOpen ? styles.open : styles.closed}`}>
                    <div className={styles.glassPanel}>
                        <div className={styles.wardSection}>
                            <span className={styles.wardLabel}>Headwear</span>
                            <div className={styles.wardRow}>
                                {['none', 'hat', 'cowboy', 'beanie', 'beret', 'bunny', 'crown', 'flower', 'cap', 'viking', 'headphones', 'party'].map(h =>
                                    <button key={h} onClick={() => updateCostume('head', h)} className={`${styles.wardBtn} ${costume.head === h ? styles.wardSelected : ''}`}>
                                        {h === 'none' ? 'None' : h === 'hat' ? 'Hat 🎩' : h === 'cowboy' ? 'Cowboy 🤠' : h === 'beanie' ? 'Beanie 🧶' : h === 'beret' ? 'Beret 🎨' : h === 'bunny' ? 'Bunny 🐰' : h === 'crown' ? 'Crown 👑' : h === 'flower' ? 'Flower 🌸' : h === 'cap' ? 'Cap 🧢' : h === 'viking' ? 'Viking ⚔️' : h === 'headphones' ? '🎧' : h === 'party' ? 'Party 🥳' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.wardSection}>
                            <span className={styles.wardLabel}>Eyewear</span>
                            <div className={styles.wardRow}>
                                {['none', 'sunglasses', 'aviator', 'glasses', 'monocle', 'star', '3d', 'patch'].map(e =>
                                    <button key={e} onClick={() => updateCostume('eyes', e)} className={`${styles.wardBtn} ${costume.eyes === e ? styles.wardSelected : ''}`}>
                                        {e === 'none' ? 'None' : e === 'sunglasses' ? 'Shades 😎' : e === 'aviator' ? 'Aviators 🕶️' : e === 'glasses' ? 'Glasses 👓' : e === 'monocle' ? 'Monocle 🧐' : e === 'star' ? 'Star ⭐' : e === '3d' ? '3D 🍿' : e === 'patch' ? 'Patch 🏴‍☠️' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.wardSection}>
                            <span className={styles.wardLabel}>Accessories</span>
                            <div className={styles.wardRow}>
                                {['none', 'tie', 'pearls', 'bowtie', 'scarf', 'necklace', 'chain', 'bandana'].map(n =>
                                    <button key={n} onClick={() => updateCostume('neck', n)} className={`${styles.wardBtn} ${costume.neck === n ? styles.wardSelected : ''}`}>
                                        {n === 'none' ? 'None' : n === 'tie' ? 'Tie 👔' : n === 'pearls' ? 'Pearls ⚪' : n === 'bowtie' ? 'Bowtie 🎀' : n === 'scarf' ? 'Scarf 🧣' : n === 'necklace' ? 'Necklace 📿' : n === 'chain' ? 'Chain 💰' : n === 'bandana' ? 'Bandana 🤠' : ''}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions menu */}
                <div onClick={e => e.stopPropagation()} className={`${styles.dropdown} ${isActionsOpen ? styles.open : styles.closed}`}>
                    <div className={`${styles.glassPanel} ${styles.actionsGrid}`}>
                        <button onClick={triggerBrush} className={styles.gridActionBtn}><span>🪥</span><span className={styles.gridLabel}>Brush</span></button>
                        <button onClick={triggerSneeze} className={styles.gridActionBtn}><span>🤧</span><span className={styles.gridLabel}>Sneeze</span></button>
                        <button onClick={triggerDance} className={styles.gridActionBtn}><span>🎵</span><span className={styles.gridLabel}>Dance</span></button>
                        <button onClick={triggerCold} className={styles.gridActionBtn}><span>❄️</span><span className={styles.gridLabel}>Cold</span></button>
                        <button onClick={triggerSecret} className={styles.gridActionBtn}><span>🤫</span><span className={styles.gridLabel}>Secret</span></button>
                        <button onClick={triggerYawn} className={styles.gridActionBtn}><span>🥱</span><span className={styles.gridLabel}>Yawn</span></button>
                        <button onClick={toggleEaster} className={styles.gridActionBtn}><span>🐰</span><span className={styles.gridLabel}>Easter</span></button>
                        <button onClick={() => { setIsActionsOpen(false); setEmotion(Emotion.BLUSH); }} className={styles.gridActionBtn}><span>😳</span><span className={styles.gridLabel}>Blush</span></button>
                    </div>
                </div>

                {/* Note modal */}
                {isReadingNote && (
                    <div className={styles.noteOverlay} onClick={() => setIsReadingNote(false)}>
                        <div className={styles.noteModal} onClick={e => e.stopPropagation()}>
                            <button onClick={() => setIsReadingNote(false)} className={styles.noteCloseBtn}>✕</button>
                            <div className={styles.noteEmoji}>💌</div>
                            <p className={styles.noteText}>{SWEET_MESSAGE}</p>
                            <div className={styles.noteTapHint}>Tap anywhere to close</div>
                        </div>
                    </div>
                )}

                {/* Instructions hint */}
                {!isFoodMenuOpen && !isWardrobeOpen && !isActionsOpen && !isReadingNote && (
                    <div className={styles.hintText}>
                        <span>👆 Tap the letter in Teddy's hand</span>
                        <span>👆 Tap the belly for gudgudi and face to slap</span>
                    </div>
                )}
            </div>
        </div>
    );
}
