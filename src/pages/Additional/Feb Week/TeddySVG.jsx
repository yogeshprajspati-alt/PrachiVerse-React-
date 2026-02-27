import { useState, useEffect } from 'react';
import styles from './TeddyDay.module.css';

// Emotion constants matching original types.ts
export const Emotion = {
    NEUTRAL: 'NEUTRAL', HAPPY: 'HAPPY', BLUSH: 'BLUSH', HUG: 'HUG',
    EATING: 'EATING', SLEEP: 'SLEEP', GIGGLE: 'GIGGLE', DIZZY: 'DIZZY',
    KISS: 'KISS', HURT: 'HURT', CRY: 'CRY', SHOCKED: 'SHOCKED',
    SCARED: 'SCARED', SNEEZE: 'SNEEZE', SNEEZE_BUILD: 'SNEEZE_BUILD',
    COLD: 'COLD', DANCE: 'DANCE', SECRET: 'SECRET', COOL: 'COOL',
};

export default function TeddySVG({ emotion, hasNote, costume, overlays = {}, onInteract, onLongPress }) {
    const [blink, setBlink] = useState(false);
    const isShowering = overlays.shower;

    useEffect(() => {
        const id = setInterval(() => {
            if (![Emotion.SLEEP, Emotion.SHOCKED, Emotion.CRY, Emotion.DIZZY, Emotion.HURT, Emotion.COOL, Emotion.COLD, Emotion.SNEEZE_BUILD].includes(emotion) && !isShowering && costume.eyes === 'none') {
                setBlink(true);
                setTimeout(() => setBlink(false), 180);
            }
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(id);
    }, [emotion, isShowering, costume.eyes]);

    // Animation class
    let animClass = styles.animFloat;
    if (emotion === Emotion.HUG) animClass = styles.animHug;
    else if (emotion === Emotion.GIGGLE) animClass = styles.animShiver;
    else if (emotion === Emotion.DIZZY) animClass = styles.animWiggle;
    else if (emotion === Emotion.KISS) animClass = styles.animKiss;
    else if (emotion === Emotion.SLEEP) animClass = styles.animBreathe;
    else if (emotion === Emotion.SCARED) animClass = styles.animTremble;
    else if (emotion === Emotion.SHOCKED) animClass = styles.animShocked;
    else if (emotion === Emotion.COLD) animClass = styles.animShiverHard;
    else if (emotion === Emotion.DANCE) animClass = styles.animDance;
    else if (emotion === Emotion.COOL) animClass = styles.animFloat;
    else if (emotion === Emotion.SNEEZE_BUILD) animClass = styles.animSneezeBuild;
    else if (emotion === Emotion.SNEEZE) animClass = styles.animSneezeRelease;
    if (isShowering || overlays.brush) animClass = styles.animBounceSoft;
    if (overlays.slap === 'left') animClass = styles.animSlapLeft;
    if (overlays.slap === 'right') animClass = styles.animSlapRight;
    if (emotion === Emotion.HURT && !overlays.slap) animClass = styles.animImpact;

    // Face filter
    let filterStyle = 'none';
    if ((emotion === Emotion.SHOCKED || (emotion === Emotion.CRY && overlays.bomb)) && !isShowering) filterStyle = 'brightness(0.3) sepia(0.6)';
    else if (emotion === Emotion.COLD) filterStyle = 'hue-rotate(180deg) brightness(1.1) saturate(0.6)';

    // Mouth
    let mouthPath = "M96,108 Q100,112 104,108", mouthFill = "transparent";
    if (isShowering || overlays.brush) { mouthPath = "M94,108 Q100,116 106,108"; }
    else if (emotion === Emotion.KISS || emotion === Emotion.SECRET) { mouthPath = "M98,106 Q100,108 102,106 Q102,112 98,112 Q96,108 98,106"; mouthFill = "#D65A5A"; }
    else if ([Emotion.EATING, Emotion.GIGGLE, Emotion.HAPPY, Emotion.DANCE].includes(emotion)) { mouthPath = "M94,108 Q100,120 106,108 Q100,104 94,108"; mouthFill = "#5D4037"; }
    else if (emotion === Emotion.SLEEP) { mouthPath = "M98,110 Q100,111 102,110"; }
    else if (emotion === Emotion.DIZZY || emotion === Emotion.HURT) { mouthPath = "M94,115 Q100,105 106,115"; }
    else if (emotion === Emotion.COLD) { mouthPath = "M94,112 L97,110 L100,112 L103,110 L106,112"; }
    else if (emotion === Emotion.CRY) { mouthPath = "M92,112 Q100,100 108,112"; mouthFill = "#3E2723"; }
    else if (emotion === Emotion.SHOCKED) { mouthPath = "M97,110 Q100,118 103,110"; }
    else if (emotion === Emotion.SCARED) { mouthPath = "M94,112 Q97,108 100,112 Q103,108 106,112"; }
    else if (emotion === Emotion.COOL) { mouthPath = "M94,110 Q100,114 106,110"; }
    else if (emotion === Emotion.SNEEZE_BUILD) { mouthPath = "M98,108 Q100,105 102,108"; }
    else if (emotion === Emotion.SNEEZE) { mouthPath = "M92,110 Q100,105 108,110"; mouthFill = "#3E2723"; }

    const renderEyes = () => {
        if (['sunglasses', '3d', 'star', 'patch', 'aviator'].includes(costume.eyes)) return null;
        if (emotion === Emotion.SLEEP || isShowering || overlays.brush || emotion === Emotion.SNEEZE_BUILD) {
            return <g stroke="#4A3B2C" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"><path d="M72,85 Q82,92 92,85" /><path d="M108,85 Q118,92 128,85" /></g>;
        }
        if (emotion === Emotion.SNEEZE) {
            return <g stroke="#4A3B2C" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M72,82 L82,92" /><path d="M82,82 L72,92" /><path d="M118,82 L128,92" /><path d="M128,82 L118,92" /></g>;
        }
        if (emotion === Emotion.DIZZY || emotion === Emotion.SHOCKED) {
            return <g stroke={emotion === Emotion.SHOCKED ? "#FFF" : "#4A3B2C"} strokeWidth="4" strokeLinecap="round"><path d="M72,78 L90,92" /><path d="M90,78 L72,92" /><path d="M110,78 L128,92" /><path d="M128,78 L110,92" /></g>;
        }
        if (emotion === Emotion.HURT || emotion === Emotion.CRY || emotion === Emotion.COLD) {
            return <g stroke="#4A3B2C" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M72,85 L80,90 L72,95" /><path d="M90,85 L82,90 L90,95" /><path d="M110,85 L118,90 L110,95" /><path d="M128,85 L120,90 L128,95" /></g>;
        }
        if (emotion === Emotion.SCARED) {
            return <g><circle cx="81" cy="85" r="10" fill="white" stroke="#3E2723" strokeWidth="1" /><circle cx="81" cy="85" r="2" fill="#000" /><circle cx="119" cy="85" r="10" fill="white" stroke="#3E2723" strokeWidth="1" /><circle cx="119" cy="85" r="2" fill="#000" /></g>;
        }
        if ([Emotion.GIGGLE, Emotion.HAPPY, Emotion.KISS, Emotion.DANCE].includes(emotion)) {
            return <g stroke="#4A3B2C" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M72,90 Q81,78 90,90" /><path d="M110,90 Q119,78 128,90" /></g>;
        }
        // Default glossy eyes
        return (<g>
            <ellipse cx="81" cy="88" rx="11" ry="12" fill="#3E2723" /><ellipse cx="81" cy="88" rx="6" ry="7" fill="#000" />
            <circle cx="85" cy="84" r="4.5" fill="white" opacity="0.9" /><circle cx="78" cy="92" r="2" fill="white" opacity="0.7" />
            <ellipse cx="119" cy="88" rx="11" ry="12" fill="#3E2723" /><ellipse cx="119" cy="88" rx="6" ry="7" fill="#000" />
            <circle cx="123" cy="84" r="4.5" fill="white" opacity="0.9" /><circle cx="116" cy="92" r="2" fill="white" opacity="0.7" />
            <g className={`${blink ? styles.blinkShow : styles.blinkHide}`}>
                <path d="M70,88 Q81,98 92,88" stroke="#E6B065" strokeWidth="24" fill="none" strokeLinecap="round" />
                <path d="M108,88 Q119,98 130,88" stroke="#E6B065" strokeWidth="24" fill="none" strokeLinecap="round" />
            </g>
        </g>);
    };

    // Long press
    let pressTimer = null;
    const onDown = () => { pressTimer = setTimeout(onLongPress, 800); };
    const onUp = () => clearTimeout(pressTimer);

    return (
        <div className={`${styles.teddyWrapper} ${animClass}`} onMouseDown={onDown} onMouseUp={onUp} onTouchStart={onDown} onTouchEnd={onUp}>
            {overlays.bomb && <div className={styles.explosionFlash} />}
            <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className={styles.teddySvg}>
                <defs>
                    <radialGradient id="bodyGrad" cx="50%" cy="30%" r="80%"><stop offset="0%" stopColor="#F4C886" /><stop offset="100%" stopColor="#D49E55" /></radialGradient>
                    <radialGradient id="snoutGrad" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#FFFBF5" /><stop offset="100%" stopColor="#F8E2C2" /></radialGradient>
                    <radialGradient id="earGrad" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="#8D6E63" /><stop offset="100%" stopColor="#5D4037" /></radialGradient>
                    <filter id="blushBlur"><feGaussianBlur in="SourceGraphic" stdDeviation="4" /></filter>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFF176" /><stop offset="30%" stopColor="#FFD700" /><stop offset="60%" stopColor="#FBC02D" /><stop offset="100%" stopColor="#F57F17" /></linearGradient>
                    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F5F5F5" /><stop offset="50%" stopColor="#BDBDBD" /><stop offset="100%" stopColor="#757575" /></linearGradient>
                    <linearGradient id="darkGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#424242" /><stop offset="100%" stopColor="#000000" /></linearGradient>
                    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(255,255,255,0.6)" /><stop offset="100%" stopColor="rgba(200,240,255,0.2)" /></linearGradient>
                    <linearGradient id="blueFabric" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#42A5F5" /><stop offset="100%" stopColor="#1565C0" /></linearGradient>
                    <linearGradient id="redFabric" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#EF5350" /><stop offset="100%" stopColor="#C62828" /></linearGradient>
                    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#A1887F" /><stop offset="50%" stopColor="#8D6E63" /><stop offset="100%" stopColor="#5D4037" /></linearGradient>
                    <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8D6E63" /><stop offset="30%" stopColor="#6D4C41" /><stop offset="100%" stopColor="#3E2723" /></linearGradient>
                    <linearGradient id="silkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1A237E" /><stop offset="45%" stopColor="#303F9F" /><stop offset="50%" stopColor="#7986CB" /><stop offset="55%" stopColor="#303F9F" /><stop offset="100%" stopColor="#1A237E" /></linearGradient>
                    <radialGradient id="pearlGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#CFD8DC" /></radialGradient>
                </defs>

                <g style={{ filter: filterStyle }} className={styles.teddyFilterTransition}>
                    {/* Bunny ears behind head */}
                    {costume.head === 'bunny' && <g><ellipse cx="65" cy="40" rx="12" ry="35" fill="#FFF" stroke="#E0E0E0" strokeWidth="2" transform="rotate(-15 65 40)" /><ellipse cx="65" cy="40" rx="6" ry="25" fill="#FFCDD2" transform="rotate(-15 65 40)" /><ellipse cx="135" cy="40" rx="12" ry="35" fill="#FFF" stroke="#E0E0E0" strokeWidth="2" transform="rotate(15 135 40)" /><ellipse cx="135" cy="40" rx="6" ry="25" fill="#FFCDD2" transform="rotate(15 135 40)" /></g>}
                    {/* Viking horns behind */}
                    {costume.head === 'viking' && <g><path d="M50,70 Q20,60 30,30 L40,65" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1" /><path d="M150,70 Q180,60 170,30 L160,65" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1" /></g>}

                    {/* Ears */}
                    <g className={styles.earLeft} onClick={() => onInteract('left_ear')}><circle cx="45" cy="60" r="24" fill="url(#bodyGrad)" /><circle cx="45" cy="60" r="14" fill="url(#earGrad)" opacity="0.7" /></g>
                    <g className={styles.earRight} onClick={() => onInteract('right_ear')}><circle cx="155" cy="60" r="24" fill="url(#bodyGrad)" /><circle cx="155" cy="60" r="14" fill="url(#earGrad)" opacity="0.7" /></g>

                    {/* Headphones band */}
                    {costume.head === 'headphones' && <path d="M50,80 Q100,20 150,80" fill="none" stroke="#212121" strokeWidth="12" strokeLinecap="round" />}

                    {/* Body */}
                    <g onClick={() => onInteract('belly')} style={{ cursor: 'pointer' }}><ellipse cx="100" cy="175" rx="55" ry="48" fill="url(#bodyGrad)" /><ellipse cx="100" cy="180" rx="32" ry="28" fill="url(#snoutGrad)" opacity="0.5" /></g>
                    {/* Legs */}
                    <ellipse cx="65" cy="205" rx="18" ry="14" fill="url(#bodyGrad)" /><ellipse cx="135" cy="205" rx="18" ry="14" fill="url(#bodyGrad)" />
                    <circle cx="65" cy="208" r="5" fill="#8D6E63" opacity="0.3" /><circle cx="135" cy="208" r="5" fill="#8D6E63" opacity="0.3" />

                    {/* Neck costumes */}
                    {costume.neck === 'bowtie' && <g transform="translate(100,145)"><path d="M0,0 L-18,-12 Q-20,0 -18,12 Z" fill="url(#redFabric)" /><path d="M0,0 L18,-12 Q20,0 18,12 Z" fill="url(#redFabric)" /><circle cx="0" cy="0" r="5" fill="#B71C1C" /></g>}
                    {costume.neck === 'scarf' && <g><path d="M70,140 Q100,165 130,140" stroke="url(#blueFabric)" strokeWidth="14" strokeLinecap="round" fill="none" /><path d="M115,140 L120,170 L140,175 L135,140" fill="#1565C0" /></g>}
                    {costume.neck === 'necklace' && <g><path d="M75,145 Q100,170 125,145" fill="none" stroke="url(#silverGrad)" strokeWidth="1" /><circle cx="80" cy="152" r="4" fill="url(#silverGrad)" /><circle cx="90" cy="157" r="4" fill="url(#silverGrad)" /><circle cx="100" cy="158" r="5" fill="url(#silverGrad)" /><circle cx="110" cy="157" r="4" fill="url(#silverGrad)" /><circle cx="120" cy="152" r="4" fill="url(#silverGrad)" /></g>}
                    {costume.neck === 'chain' && <g><path d="M75,145 Q100,180 125,145" fill="none" stroke="url(#goldGrad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 3" /><rect x="92" y="160" width="16" height="16" rx="2" fill="url(#goldGrad)" transform="rotate(45 100 168)" /><text x="100" y="172" fontSize="10" textAnchor="middle" fill="#5D4037" fontWeight="bold">$</text></g>}
                    {costume.neck === 'bandana' && <g><path d="M75,140 Q100,160 125,140 L100,175 Z" fill="#D32F2F" /><circle cx="90" cy="150" r="1" fill="#FFF" opacity="0.7" /><circle cx="110" cy="150" r="1" fill="#FFF" opacity="0.7" /></g>}
                    {costume.neck === 'tie' && <g transform="translate(100,145)"><path d="M-6,-8 L6,-8 L4,0 L-4,0 Z" fill="url(#silkGrad)" /><path d="M-4,0 L4,0 L8,35 L0,45 L-8,35 Z" fill="url(#silkGrad)" /></g>}
                    {costume.neck === 'pearls' && <g>{[75, 83, 91, 100, 109, 117, 125].map((x, i) => { const y = 145 + Math.sin((i / 6) * Math.PI) * 20; return <circle key={i} cx={x} cy={y} r="5" fill="url(#pearlGrad)" stroke="#CFD8DC" strokeWidth="0.5" />; })}</g>}

                    {/* Arms */}
                    <g className={`${styles.armTransition} ${hasNote ? styles.armLeftNote : emotion === Emotion.HUG || emotion === Emotion.SECRET ? styles.armLeftHug : isShowering || emotion === Emotion.SNEEZE_BUILD ? styles.armLeftShower : styles.armLeftWave}`}><ellipse cx="45" cy="155" rx="16" ry="24" fill="url(#bodyGrad)" /></g>
                    <g className={`${styles.armTransition} ${hasNote ? styles.armRightNote : emotion === Emotion.HUG ? styles.armRightHug : isShowering || emotion === Emotion.SNEEZE_BUILD ? styles.armRightShower : styles.armRightWave}`}><ellipse cx="155" cy="155" rx="16" ry="24" fill="url(#bodyGrad)" /></g>

                    {/* Letter in hand */}
                    {hasNote && <g transform="translate(82,175) rotate(-5)" onClick={(e) => { e.stopPropagation(); onInteract('note'); }} style={{ cursor: 'pointer' }} className={styles.letterHover}>
                        <rect x="-10" y="-10" width="60" height="50" fill="transparent" />
                        <rect x="2" y="3" width="36" height="26" rx="2" fill="rgba(0,0,0,0.2)" />
                        <rect x="0" y="0" width="36" height="26" rx="2" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
                        <path d="M0,0 L18,14 L36,0" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1" />
                        <path d="M0,26 L18,14 L36,26" fill="#FFF" opacity="0.5" />
                        <circle cx="18" cy="14" r="5" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />
                        <circle cx="18" cy="14" r="3" fill="none" stroke="#FF5252" strokeWidth="1" opacity="0.5" />
                    </g>}

                    {/* HEAD */}
                    <g onClick={() => onInteract('head')} style={{ cursor: 'pointer' }}>
                        <circle cx="100" cy="90" r="62" fill="url(#bodyGrad)" />
                        <ellipse cx="100" cy="105" rx="24" ry="18" fill="url(#snoutGrad)" />
                        <g onClick={(e) => { e.stopPropagation(); onInteract('nose'); }}><path d="M94,98 Q100,94 106,98 Q100,108 94,98 Z" fill="#4A3B2C" /><circle cx="98" cy="97" r="1.5" fill="white" opacity="0.4" /></g>
                        {emotion === Emotion.SECRET && <ellipse cx="100" cy="110" rx="8" ry="10" fill="url(#bodyGrad)" stroke="#D49E55" strokeWidth="1" />}
                        <path d={mouthPath} fill={mouthFill} strokeWidth="3" strokeLinecap="round" stroke="#4A3B2C" className={styles.mouthTransition} />
                        {renderEyes()}

                        {/* Eye costumes */}
                        {costume.eyes === 'sunglasses' && <g transform="translate(0,-5)"><path d="M60,75 L95,75 L90,95 Q75,100 60,90 Z" fill="url(#darkGlassGrad)" stroke="#212121" strokeWidth="2" /><path d="M105,75 L140,75 L140,90 Q125,100 110,95 Z" fill="url(#darkGlassGrad)" stroke="#212121" strokeWidth="2" /><line x1="95" y1="78" x2="105" y2="78" stroke="#212121" strokeWidth="3" /><path d="M65,78 L85,78 L75,92" fill="rgba(255,255,255,0.2)" /><path d="M110,78 L130,78 L120,92" fill="rgba(255,255,255,0.2)" /></g>}
                        {costume.eyes === 'glasses' && <g transform="translate(0,-3)"><circle cx="81" cy="88" r="14" fill="url(#glassGrad)" stroke="#333" strokeWidth="2" /><circle cx="119" cy="88" r="14" fill="url(#glassGrad)" stroke="#333" strokeWidth="2" /><path d="M95,88 Q100,85 105,88" stroke="#333" strokeWidth="2" fill="none" /><line x1="67" y1="88" x2="50" y2="85" stroke="#333" strokeWidth="2" /><line x1="133" y1="88" x2="150" y2="85" stroke="#333" strokeWidth="2" /></g>}
                        {costume.eyes === 'monocle' && <g><circle cx="119" cy="88" r="13" fill="url(#glassGrad)" stroke="url(#goldGrad)" strokeWidth="2" /><path d="M132,88 Q135,110 135,140" stroke="#FBC02D" strokeWidth="1" fill="none" /></g>}
                        {costume.eyes === 'star' && <g transform="translate(0,-5)"><path d="M81,70 L85,80 L96,80 L87,88 L90,98 L81,92 L72,98 L75,88 L66,80 L77,80 Z" fill="#E91E63" stroke="#880E4F" strokeWidth="1" /><path d="M119,70 L123,80 L134,80 L125,88 L128,98 L119,92 L110,98 L113,88 L104,80 L115,80 Z" fill="#E91E63" stroke="#880E4F" strokeWidth="1" /><line x1="90" y1="85" x2="110" y2="85" stroke="#880E4F" strokeWidth="2" /></g>}
                        {costume.eyes === '3d' && <g transform="translate(0,-3)"><rect x="65" y="80" width="32" height="18" rx="2" fill="rgba(255,0,0,0.4)" stroke="#333" strokeWidth="2" /><rect x="103" y="80" width="32" height="18" rx="2" fill="rgba(0,255,255,0.4)" stroke="#333" strokeWidth="2" /><line x1="97" y1="89" x2="103" y2="89" stroke="#333" strokeWidth="2" /></g>}
                        {costume.eyes === 'patch' && <g><path d="M50,60 L120,90" stroke="#212121" strokeWidth="2" /><path d="M70,80 Q81,70 92,80 Q92,100 81,100 Q70,100 70,80" fill="#212121" /></g>}
                        {costume.eyes === 'aviator' && <g transform="translate(0,-2)"><path d="M60,88 Q60,75 75,75 Q90,75 90,88 Q90,100 75,100 Q60,100 60,88" fill="url(#darkGlassGrad)" stroke="#FBC02D" strokeWidth="2" /><path d="M110,88 Q110,75 125,75 Q140,75 140,88 Q140,100 125,100 Q110,100 110,88" fill="url(#darkGlassGrad)" stroke="#FBC02D" strokeWidth="2" /><path d="M90,82 L110,82" stroke="#FBC02D" strokeWidth="2" fill="none" /><path d="M90,78 Q100,75 110,78" stroke="#FBC02D" strokeWidth="2" fill="none" /></g>}

                        {/* Head costumes */}
                        {costume.head === 'hat' && <g transform="translate(85,10) rotate(-10)"><ellipse cx="15" cy="40" rx="35" ry="10" fill="#212121" /><path d="M-15,40 L-10,0 L40,0 L45,40 Z" fill="#424242" /><rect x="-13" y="30" width="56" height="8" fill="#D32F2F" /></g>}
                        {costume.head === 'crown' && <g transform="translate(75,15) rotate(0)"><path d="M0,35 L10,5 L20,35 L30,0 L40,35 L50,5 L60,35 L60,45 Q30,50 0,45 Z" fill="url(#goldGrad)" stroke="#F57F17" strokeWidth="1" /><circle cx="10" cy="5" r="3" fill="#E91E63" stroke="white" strokeWidth="0.5" /><circle cx="30" cy="0" r="4" fill="#2196F3" stroke="white" strokeWidth="0.5" /><circle cx="50" cy="5" r="3" fill="#E91E63" stroke="white" strokeWidth="0.5" /><rect x="5" y="38" width="50" height="4" fill="#F9A825" rx="2" /></g>}
                        {costume.head === 'flower' && <g transform="translate(135,45) rotate(20)">{[0, 60, 120, 180, 240, 300].map(d => <path key={d} d="M0,0 Q5,-15 0,-20 Q-5,-15 0,0" fill="#FF80AB" transform={`rotate(${d})`} />)}<circle cx="0" cy="0" r="6" fill="#FFEB3B" /></g>}
                        {costume.head === 'cap' && <g transform="translate(60,20) rotate(-5)"><path d="M-10,25 Q40,-25 90,25" fill="#1E88E5" stroke="#1565C0" strokeWidth="1" /><path d="M0,25 L80,25 L70,45 Q40,50 10,45 Z" fill="#0D47A1" /><circle cx="40" cy="2" r="3" fill="#0D47A1" /></g>}
                        {costume.head === 'viking' && <g transform="translate(50,20)"><path d="M0,35 Q50,-10 100,35" fill="#CFD8DC" stroke="#78909C" strokeWidth="2" /><rect x="0" y="32" width="100" height="8" fill="#B0BEC5" /><circle cx="50" cy="36" r="3" fill="#546E7A" /><circle cx="20" cy="36" r="3" fill="#546E7A" /><circle cx="80" cy="36" r="3" fill="#546E7A" /></g>}
                        {costume.head === 'headphones' && <g><rect x="35" y="70" width="15" height="30" rx="5" fill="#212121" /><rect x="150" y="70" width="15" height="30" rx="5" fill="#212121" /><circle cx="42" cy="85" r="12" fill="#333" stroke="#4CAF50" strokeWidth="2" /><circle cx="157" cy="85" r="12" fill="#333" stroke="#4CAF50" strokeWidth="2" /></g>}
                        {costume.head === 'party' && <g transform="translate(85,10) rotate(-10)"><polygon points="0,50 30,50 15,0" fill="url(#blueFabric)" /><circle cx="15" cy="0" r="5" fill="#FFEB3B" /><circle cx="10" cy="30" r="3" fill="white" opacity="0.5" /><circle cx="20" cy="15" r="2" fill="white" opacity="0.5" /></g>}
                        {costume.head === 'cowboy' && <g transform="translate(60,0) rotate(-5)"><ellipse cx="40" cy="55" rx="55" ry="15" fill="url(#leatherGrad)" stroke="#3E2723" strokeWidth="2" /><path d="M15,55 Q15,10 40,5 Q65,10 65,55" fill="url(#leatherGrad)" stroke="#3E2723" strokeWidth="2" /><path d="M16,50 Q40,55 64,50" fill="none" stroke="#3E2723" strokeWidth="4" /></g>}
                        {costume.head === 'beanie' && <g transform="translate(65,15)"><path d="M0,45 Q35,-10 70,45" fill="#546E7A" stroke="#37474F" strokeWidth="2" /><rect x="-5" y="45" width="80" height="12" rx="4" fill="#455A64" stroke="#37474F" strokeWidth="2" /></g>}
                        {costume.head === 'beret' && <g transform="translate(65,15) rotate(5)"><path d="M-10,30 Q35,-10 90,40 Q35,35 -10,30" fill="#B71C1C" /><path d="M40,0 L40,5" stroke="#B71C1C" strokeWidth="3" /></g>}

                        {/* Blush */}
                        <ellipse cx="65" cy="102" rx="14" ry="8" fill="#FFAB91" filter="url(#blushBlur)" opacity="0.4" />
                        <ellipse cx="135" cy="102" rx="14" ry="8" fill="#FFAB91" filter="url(#blushBlur)" opacity="0.4" />
                        <ellipse cx="65" cy="102" rx="14" ry="8" fill="#FF5252" filter="url(#blushBlur)" className={emotion === Emotion.BLUSH || emotion === Emotion.KISS ? styles.blushActive : styles.blushInactive} />
                        <ellipse cx="135" cy="102" rx="14" ry="8" fill="#FF5252" filter="url(#blushBlur)" className={emotion === Emotion.BLUSH || emotion === Emotion.KISS ? styles.blushActive : styles.blushInactive} />

                        {/* Slap marks */}
                        {emotion === Emotion.HURT && <g opacity="0.6" className={styles.scaleIn}>
                            {overlays.slap === 'left' && <path d="M55,80 L70,85 L65,110 L50,105 Z" fill="#FF0000" filter="url(#blushBlur)" />}
                            {overlays.slap === 'right' && <path d="M145,80 L130,85 L135,110 L150,105 Z" fill="#FF0000" filter="url(#blushBlur)" />}
                        </g>}
                        {overlays.lipstick && <g transform="translate(120,90) rotate(-15)" className={styles.popIn}><path d="M0,0 Q6,6 12,0 Q18,-6 24,0 Q12,18 0,0" fill="#E91E63" opacity="0.9" /></g>}

                        {/* Tears */}
                        {emotion === Emotion.CRY && <g>
                            <path d="M72,95 Q68,110 72,125" stroke="#4FC3F7" strokeWidth="3" fill="none" className={styles.animWiggle} />
                            <circle cx="72" cy="130" r="4" fill="#4FC3F7" className={styles.animBounceSoft} />
                            <path d="M128,95 Q132,110 128,125" stroke="#4FC3F7" strokeWidth="3" fill="none" className={styles.animWiggle} style={{ animationDelay: '0.1s' }} />
                            <circle cx="128" cy="130" r="4" fill="#4FC3F7" className={styles.animBounceSoft} style={{ animationDelay: '0.1s' }} />
                        </g>}
                    </g>

                    {/* Sneeze particles */}
                    {emotion === Emotion.SNEEZE && <g className={styles.sneezeSpray} transform="translate(100,110)">{[...Array(6)].map((_, i) => <circle key={i} cx={(Math.random() - 0.5) * 40} cy={Math.random() * 20} r={Math.random() * 3 + 1} fill="#E1F5FE" opacity="0.8" />)}</g>}
                    {/* Sleeping Zzz */}
                    {emotion === Emotion.SLEEP && <g className={styles.pulse}><text x="150" y="50" fontSize="30" fill="white" style={{ opacity: 0.9 }}>z</text><text x="175" y="30" fontSize="20" fill="white" style={{ opacity: 0.7 }}>z</text></g>}
                </g>

                {/* Shower overlay */}
                {isShowering && <g pointerEvents="none">
                    {[...Array(12)].map((_, i) => <line key={`r${i}`} x1={30 + i * 14 + (i % 2) * 5} y1="-20" x2={30 + i * 14 + (i % 2) * 5} y2="5" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" className={styles.rain} style={{ animationDelay: `${i * 0.1}s`, opacity: 0.6 }} />)}
                    {[...Array(6)].map((_, i) => <circle key={`b${i}`} cx={40 + i * 25} cy="220" r={4 + (i % 3) * 3} fill="white" stroke="#E1F5FE" strokeWidth="1" className={styles.bubble} style={{ animationDelay: `${i * 0.4}s` }} />)}
                </g>}

                {/* Brush overlay */}
                {overlays.brush && <g className={styles.brushMove} transform="translate(50,40)">
                    <path d="M15,-40 L15,10 Q15,20 25,20 Q35,20 35,10 L35,-40" fill="url(#woodGrad)" stroke="#5D4037" strokeWidth="1" />
                    <ellipse cx="25" cy="20" rx="30" ry="12" fill="url(#woodGrad)" stroke="#5D4037" strokeWidth="1" /><ellipse cx="25" cy="20" rx="26" ry="9" fill="#3E2723" />
                    {[...Array(20)].map((_, i) => <line key={i} x1={5 + i * 2} y1="20" x2={5 + i * 2} y2="28" stroke="#D7CCC8" strokeWidth="1" opacity="0.8" />)}
                </g>}

                {/* Slap star */}
                {emotion === Emotion.HURT && overlays.slap && <g className={styles.flash} transform={overlays.slap === 'left' ? "translate(40,70)" : "translate(130,70)"}><polygon points="10,0 13,7 20,10 13,13 10,20 7,13 0,10 7,7" fill="#FFF" stroke="#FF5252" strokeWidth="2" transform="scale(3)" /></g>}
                {/* Bomb explosion */}
                {overlays.bomb && <g className={styles.popIn}><path d="M100,40 L120,80 L160,70 L130,110 L170,150 L120,140 L100,190 L80,140 L30,150 L70,110 L40,70 L80,80 Z" fill="#FFD54F" stroke="#FF7043" strokeWidth="3" /></g>}
                {/* Slash */}
                {overlays.slash && <g><path d="M40,160 L160,40" stroke="#FFF" strokeWidth="6" strokeLinecap="round" className={styles.fadeOut} /></g>}

                {/* Face hitboxes for slap */}
                <rect x="40" y="60" width="60" height="90" fill="transparent" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onInteract('face_left'); }} />
                <rect x="100" y="60" width="60" height="90" fill="transparent" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onInteract('face_right'); }} />
            </svg>
        </div>
    );
}
