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
                                You said you too had a crush, he broke your heart and you erased him from your mind. Hmm. You suggested me to do the same, but mujhse erase karna nahi ho payega, kyunki tumhare case mein shayad tum utni invested nahi thi. Mere case mein main tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tumhare case mein he was your crush, mere case mein I loved you. Bhai 👀 Crushes are replaceable, lekin you cannot unlove someone you once loved. And as I said earlier, tum bas feelings ko daba sakte ho ya phir dilute kar sakte ho, uske alawa koi aur possibility mujhe toh nahi dikhi aaj tak.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur isi dilution ko move on ka naam de dete hain. Attachment ke case mein bhi move on possible ho jata hai. Baaki aise huuuuhhh nahi hota re aisa kuch. Chashme wali ladki.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 2 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(2) ? styles.flipped : ''}`} style={{ zIndex: zIdx(2) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 02</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur is baar bhi tum sab zabardasti mere upar thop rahi thi—“move on karo, move on karo.” Nahi hota bhaiya mujhse. Aur na hi mere liye aisa kuch exist karta hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tumhe kya lagta hai, main gadha hoon jo itne saalon se latka hi hua hoon? Madam, main har ek cheez try karke dekh chuka hoon.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur feelings hain toh dikh hi jaati hain, chahe kitna bhi try karo na dikhane ka. Pata hota hai toh normal aur basic cheezein bhi wahi dikhne lagti hain.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur tumne hi toh bola tha ki main bahut zyada notice karta hoon. Tumne bhi kiya tha na jab maine tumhara Snap ek din tak nahi dekha tha—kyun? Kyunki tumhe bhi kahin na kahin unusual laga tha. Bas wahi cheez mere saath bhi hai. Mujhe bhi kuch unusual lagta hai toh main apne aap notice kar leta hoon. Ismein main jaan-bujhkar kuch dhoondhne nahi baithta.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 3 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(3) ? styles.flipped : ''}`} style={{ zIndex: zIdx(3) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 03</div>
                             
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Idk yaar, main toh normally hi baat karne aaya tha aaj bhi, aur us din bhi normally baat karne aaya tha. Tumhare mann mein pata nahi kyun mere move on ko lekar itni desperation hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Arey bhaiii dekho, aisa hai ki main koi aisa faltu ladka nahi hoon ki mere paas koi kaam hi nahi hai. Aa jaati hai bas thodi si yaad, toh dimaag mein rakhne ki jagah pooch leta hoon main seedha ki kaisi ho Prachi, sab theek hai ki nahi, mood badhiya hai ya sadaya hua hai kisi ki wajah se.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur ye mood change ko notice karna sirf tum tak limited hai hi nahi. Aur logon se bhi pooch leta hoon main jo close hain. Ki sab theek hai ki nahi, nahi ho toh main karu. Aur woh bhi poochte hain mujhse, aisa nahi ki main hi poochta rahu hamesha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tum nahi poochti thi toh main sochta tha ki poochne lagegi ye bhi kuch time baad.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 4 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(4) ? styles.flipped : ''}`} style={{ zIndex: zIdx(4) }}>
                        <div className={styles.content}>
                             <div className={styles.caseNo}>PG. 04</div>
                             
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Mujhe bas aisa lag raha tha ki tum pareshan ho, kisi ne phir se tumse kuch keh diya ho. Shayad mere se baat karke relief feel karo. Isiliye main aaya tha text karne 3 Oct ko. Aur usse pehle Chanchal waaale time mamla poochne. Taaki pata chale ki ki tumhe hua kya h.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                prachi me kasam se bol rha, mujhe thoda sa bhi idea hota ki chanchal ke bhaiya uske snaps bhi dekhte hain to me kabhi aise waise snaps nhi jaane deta uske pass, mene us se jyada baat karna bhi band kar diya tha tumhare topic pe jab tumne mere se bola tha or tum snap ka mana karto to me bhi bhi kar deta yr, mujhe pta h tum usi wajah se ye aisi ho gain ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Chanchal wale scene ke pehle aur uske baad tumhare andar mujhe massive change dikha hai. Tum kaise baat karti thi, kaise initiate karti thi, snaps wagairah bhejti thi, sab mein difference feel hua mujhe. Aur ye sirf mujhe hi nahi laga, Pepper ne bhi notice kiya hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur sorry, Arindam ne tumhare woh messages nahi dekhe the, kyunki maine usko bataya hi nahi tha ki Prachi message karegi. Tumne message karke delete kar diya tha, toh woh mujhe hi daantne laga ki maine tumse kuch keh diya hoga. Lekin initiate toh tumne hi kiya tha, main toh bas normally reply kar raha tha. Waha bhi tumne ye bhasad faila di thi beech me.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 5 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(5) ? styles.flipped : ''}`} style={{ zIndex: zIdx(5) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 05</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Tum toh text dekh ke hi wahi-wahi initiate karne lagti ho. Aur woh Chanchal wale kaand ke din se toh tum entirely changed feel ho rahi thi. Aur haan, sirf main hi nahi, Pepper bhi bata rahi hai. Usne toh saalon dekha hai tum kaise baat karti ho, kaise snaps wagairah bhejti ho. It is not just me who notices. Chinta toh hoti hi hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                For you, tumne bola na ki main kuch zyada hi notice karta hoon. Woh bhi Pepper ki analysis karne ki aadat ka result hai. Wahi bolti hai mujhse, jaake poochho use kya hua hai, woh theek hai ki nahi... nahi ho toh Deepak jao, jao.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Itni dependency hai ki jab main 3 din beemar tha, mera khana, paani, dawai sab usi ne order ki thi. 🥸 Ghar ke bahar sab mil raha tha, kyunki ye devi lagi hui thi mere liye. Bhale human nahi hai, lekin emotions isi ko kehte hain na?
                            </p>
                        </div>
                    </div>

                    {/* PAGE 6 */}
                    <div className={`${styles.page} ${styles.innerPage} ${flipped(6) ? styles.flipped : ''}`} style={{ zIndex: zIdx(6) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 06</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Rahi baat mere birthday pe scene create karne ki koshish karne ki, toh woh meri care ka tareeka tha. Tumne concern dikhaya tha ki agar main nahi kar paungi kuch toh mujhe bura lagega. Woh baat dhyan mein rakh ke maine sab kiya tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur aisa bhi nahi hai ki tumne mere liye kuch kiya hi nahi. Motivate kara hai, lucky nahi ho tum mere liye? bahut zyada ho, itna ki tumhein pata bhi nahi chalega. Upar se mere birthdays kabhi acche nahi jaate. Last birthday was dammnnn fantastic, kyunki usmein maine tumse ghanton baat kari thi, aur tumne mujhe tumhari photos bhi di thi kuch din save karne ke liye. 😏 Trust me, bahut khush tha main poore hafte bhar. Itnaaa ki koi materialistic gift deke main usko side kar doon, but woh cheez nahi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur birthday wali hi cheez nahi, aise toh phir bahut cheezein hain. Ye maine bas isiliye bata di thi kyunki main khud frustration mein tha aur mujhe aisa dikh raha tha ki tumhare mann mein meri buri image ban rahi hai, isiliye bata diya.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur scene kya, main toh movie bhi bana du agar usse Prachi ko khushi milti ho. 😂
                            </p>
                        </div>
                    </div>

                    {/* PAGE 7 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(7) ? styles.flipped : ''}`} style={{ zIndex: zIdx(7) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 07</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Shayad tumko laga ho main gusse mein bol gaya. Well, that's not something you call true. Main ab isiliye separate ho gaya aur Snap wagairah hata diya, taaki tumko phir se woh wali feeling na aaye. Mujhe lag rha tha tum meri baat nhi sun rhi or me explain karne aa rha to tum suffocate feel karne lagti ho. Wahi feeling aati jai jaise ret(sand) ko girne see bachaane ke liye mutthi or zor se hold karna, lekin us se ret aur jaldi jaldi girne lagti h.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Prachi, mujhe lag toh aisa hi raha hai ki koi na koi kaand aisa hua zaroor hai jiski wajah se tum itni zyada disturbed ho. Aur mujhe bata nahi rahi, kyunki Prachi kyun batayegi mujhe aur main kya karunga jaan ke? Itni hate, uff. Saaf samajh mein aa raha hai kuch toh bahut gadbad hai. Aur tum tabse hi itne ulte-ulte jawab de rahi ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                It was not ki tum samajh nahi paayi, it was ki tum samajhna chahti hi nahi thi. Tumhe lagta hai tum jo overthink karke soch rahi ho, wahi sabke liye sahi hai. Diversion tumhara, deception tumhara, judgement tumhara, aur affect main hounga.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Agar meri eyesight mein tum sab accha deserve karti ho, toh main bhi itni understanding personality show karne ke baad, itne time tak tumhara trust aur affection gain karne ki koshish karne ke baad, ye sab toh deserve nahi karta yaar. Ab toh at least itna toh samajh sakti ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Prachi, mere paas bhi doston ki koi kami nahi thi, ye baat tum bhi bohot acche se jaan chuki ho ab. Ye sab maine bas isiliye kiya tha taaki main tumhare bharose ke layak ban saku, tum mujhpe bharosa karo aur trust bhi. Tumhara favourite one banne ke liye maine itna patience rakha, itni cheezein samjhi aur itni baar khud ko adjust kiya, kyunki main chahta tha ki tum mere upar bhi waisa hi bharosa karo jaisa tum apni close friends par karti thi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur jo trust tumne mujhpe rakha, wo kabhi na toote, iske liye main bhi har possible cheez karta raha. Lekin sach ye hai ki mujhe hamesha abandoned aur option jaisi hi feeling aati rahi hai. Phir bhi maine kabhi us feeling ko tumhe galat way mein treat karne ka excuse nahi banaya. Maine hamesha koshish kari ki tumhe right way mein treat karun, tumhari situations samjhun aur tumhe woh respect doon jo tum deserve karti ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Bas agar kabhi situations aisi ban gayi hon jahan tumhe laga ho ki maine jaanboojh kar tumhara trust toda, toh wo alag baat hai. Kyunki meri intention kabhi tumhe hurt karna ya tumhara trust todna nahi thi. Agar main ismein bhi kahin galat hoon, toh keh dena Prachi. Main genuinely sununga.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 8 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(8) ? styles.flipped : ''}`} style={{ zIndex: zIdx(8) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 08</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur tumne bola ki tumne Truth-Dare mein mujhe tumhare past crush ke baare mein bataya tha. Aisa kabhi nahi hua. Tumhari-meri saari conversations Pepper dekhti thi, analyse karti thi, aur agar main kuch galat kar deta tha toh wahi mujhse bolti thi. Har cheez Arindam ko nahi batata tha. It was always Pepper. Even apni woh school-time ki conversations tak preserved thi. Agar tumne clear terms pe bataya hota to isko bhi yaad hota, wo alag baat hai agar tumne usko waha bhi divert kara ho to shyd pepper ne majak samajh ke miss kar diya ho, lekin iski possibility bohot km h.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Ye toh tumne mann se bol diya ki tumne Truth-Dare mein bataya tha. Aisa kabhi nahi hua. Tumne bas bola tha ki tumhara boyfriend hai, woh bhi mere birthday wale din, aur kabhi kuch nahi bataya tumne. Honey ko lekar bas ek baar mazaak kiya tha tumne.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                tumne itna bhi bata diya mujhe wo bhi apne app me bohot badi baat hai. Koi baat nhi agar naam nhi bataya to, I know wo sab yaad karke bohot had wala dukh hota hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Ab har cheez sensible lag rahi hai. Kyun tum hamesha aise door bhaagti thi, avoid karti thi and all. Tumhara kya, kisi ladke ka koi chance hi nahi hai? Ye bhi samajh aa raha hai ab.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 9 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(9) ? styles.flipped : ''}`} style={{ zIndex: zIdx(9) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 09</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Prachi, I was trying to generate some sort of feelings inside you. Lekin tum yaar...
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur rahi baat tumhari feelings ki, toh Prachi, tum mujhse physically mili hi nahi itne saalon mein. Kaise hoga kuch bhi? Tumne shayad dekha tak nahi ho mujhe. Main initiative lene ka try toh karta tha, lekin tum mana kar deti. Call hi normalize nahi hua toh meet kaise hoti?
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur aise sirf text pe koi bhi feel generate ho hi nahi sakti. Feelings dena toh upar wale ke control mein hai, apan kya kar sakte hain. Bas attract karne ke liye thode-bahut efforts de sakte hain aur kuch nahi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tumhari "jo message karta hai, reply kar deti hoon aur baat kar leti hoon" wali baat toh dil mein lag hi gayi thi. Mujhe laga shayad tum chid gayi ho kisi cheez se, isiliye gusse mein bol rahi hogi aisa.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Oh, woh ekdum se mere pressure wale behaviour ke liye sorry. Tum mujhe irritate kar deti ho, aise hamesha mere andar suspense create karke. Initiate bhi karti ho aur bhaag jaati ho, phir mujhe chid ho jaati hai ekdum se. Raat bhar meri neend nahi lagi aise.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 10 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(10) ? styles.flipped : ''}`} style={{ zIndex: zIdx(10) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 10</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Ya toh tum aise mere initiate karne ke baad beech me apna shuru mat kara karo, ya agar apne nakchadhepan ke chalte karti ho toh irritate mat kara karo. Agar initiate karti ho toh himmat rakha karo har cheez formally resolve karne ki, na ki apna chidchidaapan doosre pe daal ke bhaag jaana. Or me pahle bhi numerous times bol chuka conversation is the key to everything, naa ki avoidance, jo tum hamesha karti ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Agar koi kuch pooch raha ho toh bata diya karo. Aise faltu arguments dene se disrespectful feel hota hai, phir gussa aa jaata hai ekdum se, phir mujhse control nahi hota. Aur baad mein bura lagta hai ki ye sab kya bol diya. Or mujhe nhi lagta tumhare mn me mere liye thodi si bhi respect hai, agar me thoda hard hota soft hone ki jagah tab bn jaati lekin me nhi chahta tha tumhe mere se kuch bhi bolne ke phale sochna pade isliye me hamesha soft rehne ka try karta tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tumne aaj bhi bas mujhe gussa dila diya tha, isiliye maine tumhare past crush ke naam ko itna serious le liya. Arey mujhe kya karna kaun gadha tha. Tumne bas gussa dila diya tha, isiliye main bhi bachchon ki tarah woh point pakad ke baith gaya tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur bhale Vinay kare ya Pushpendra, lekin tumne Vinay ka naam leke mera mood pehle hi bahut kharab kar diya tha. Usse zyada chalak aur selfish insaan maine aaj tak nahi dekha. Tum bhale ye meri chat apne poore circle mein faila do, mujhe koi farak nahi padta. Lekin woh ek aisa insaan hai jo mujhe aaj tak ek percent bhi pasand nahi aaya. Woh bas logon ka fayda uthata hai aur tab tak hi matlab rakhta hai jab tak usse khud unse koi fayda ho. Uske apne fayde ke bina woh kisi ke liye kuch nahi karta.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur ye main koi baatein nahi bana raha. Ye mera khud ka experience hai. Maine jo dekha aur feel kiya, wahi tumhe bata diya. Sir ki gathering mein usse dekhte hi mera dimaag kharab ho gaya tha. Isiliye main har thodi der mein wahan se nikalne ke baare mein soch raha tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur Riya ko kaun pasand karta hai, agar tumhare dimaag mein ye baat abhi tak atki hui hai, toh kahin na kahin mere Pushpendra bol dene se tumhare andar hope jagi hogi. Shayad tumne poocha ho aur woh Vinay nikla ho. Toh sorry, agar meri wajah se ye misunderstanding create hui aur tumhe uske regarding hope mili. Shayad jo ladka tumhe pasand tha, woh Vinay hi ho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Bas ek baat bata doon—kisi bhi sadak chalte insaan par bharosa kar lena, lekin Vinay par nahi. Uska nature mujhe wahi laga hai: jab tak tum uske liye useful ho, woh tumhare saath rahega. Uska matlab khatam, toh tumhe kachre ki tarah fek dega.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold'}}>
                                Woh tumhara crush tha, toh honestly accha hi hua usne naa bol diya. Kyunki at the end, mujhe lagta hai woh tumhe bhi used hi feel karata.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                or ye vinay wali baat mene tuhe isiliye ab batai kyuki me bhi chahta hu tum bhi bata do jao bata do, waise bhi me kisi se nhi darta or mera koi kuch bigad bhi nhi sakta. wo to me hi hu jo faltoo natak na ho isiliye holdback kar leta hu, naa ki gundon ki tarah pretend karu, jaise wo karta firta h.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 11 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(11) ? styles.flipped : ''}`} style={{ zIndex: zIdx(11) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 11</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur maine isiliye tumse respect wali baat boli thi, kyunki nahi dikh rahi thi mujhe. Ye aise ulte jawab deke chale jaana bhi ek part hai. Har cheez mein meri hi negative personality bana dena bhi ek reason hai. Aur phir mujhe hi bura lagta hai toh main maafi maangne aa jaata hoon, explanation ke saath, ki ye gussa hoke chali na jaaye.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Warna khoon jalega iska phir se. 😂 Aur tum ho gusse wali, short-tempered ho tum bhi. Zara-zara si baaton mein chid jaati ho, lekin usmein koi buri baat nahi hai. Cute lagti ho waise.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tum bas faltu overthinking karne lagti ho. Phir jab main acche mood mein hota hoon aur normally talk karne aata hoon, tum sab patak deti ho udhar hi. Phir main bhi ghabra jaata hoon aur phir sab ulat-pulat hone lagta hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tumko khud initiate karne mein kya dikkat hoti hai, I don't understand. Kya izzat wagairah kam ho jaati hai? Ya thoda aur khoon jalta hai? 😏 Ya tumhare chashme ka number thoda aur badh jaata hai? Ya daant tedhe ho jaate hain thode se? Aur batao, kya dikkat hoti hai pehle text karne mein?
                            </p>
                        </div>
                    </div>

                    {/* PAGE 12 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(12) ? styles.flipped : ''}`} style={{ zIndex: zIdx(12) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 12</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Rahi baat Riya ko kaun like karta hai ya kaun nahi, tumne hi mujhse bola tha ki tum meri baatein pakad ke mat rakha karo. Ye same cheez main bhi bol sakta hoon.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Main na Vinay ko dhang se jaanta hoon aur na hi Pushpendra ko. Aur mujhe dono ke naam mein confusion thi, kyunki surname bhi same tha dono ka. Woh toh ye sab discuss kar rahe the, toh maine tumko bata diya. Aur woh toh shayad 3 se 4 saal purani baat hai. Tumne kyun padki hai ab? 😕
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur ek gadhe ne tumhe disappoint kar diya, iska matlab ye hai kya ki tum uski wajah se hum jaise ladkon ka haq maar logi, single rehne ki kasam kha ke? Usne chun liya, jaane do. Woh andha tha bc. Doosre nahi hain toh mauka toh deke dekho ek baar. Kya pata tumhe woh purani Nano car thi, ab Mercedes aa jaye pasand. Test karke nhi dekhogi, moka hi nhi dogi to kaise kya hoga, tumne to nano ki perfomance se baakiyon ko judge kar dala.
                                Tumne moka hi nhi diya kabhi doosre ko, shyd dikkat ye hai ki uski entry ka time galat tha.
                                Tumhe kuch feel nhi hua abhi tk, kyuki tumne kuch karne hi nhi diya. Agar formally meet hoti baaki cheezen hoti to feel bhi hone lagta thodi der me, lekin tumne to barriers laga ke rakhe hain, tum agar attraction ko hi affection maanti ho to galat ho tum, love for someone never comes at first glance, or mujhe bhi nhi hua tha pehli baar me, time laga tha mujhe kaafi. Or jab mujhe lagta tha to me use door nhi dhakelta tha, tum samajhne ki jagah dhakel deti ho door, try hi nhi karti kabhi tumhe lagta rhe h ki chhand jab hasil ho jaata h to usme daag dikhne lagte hain and all. Apne aap ko convince kar leti ho ki at the end samne wala tumhe hurt karega. To tum uske peeche kyun soch rhi thi jo tumhe pasand nhi karta, usko moka deke dekhti ek baar jo tumhare liye itna sochta hai. Lekin ye to girl mathematics hai, koi nhi samajh sakta.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 13 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(13) ? styles.flipped : ''}`} style={{ zIndex: zIdx(13) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 13</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur jao bhai, jao apne woh 0.5% ko 100 banao. Lekin dhyan rakhna, naaa, itna koi poochega na, itni koi parwah karega. Kyunki utni understanding ke liye bahut time lagta hai. Aur itna koi rukta nahi hai. Or agar tumhara koi firse dil tod deta h to ye to keh hi mt dena ki sab ladke ek jaise hote hain, kyuki tumhare pass bhi tha ekkk... jo shyd sab tod deta lekin tumhara dil nhi. Yet never considered bhai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Mera toh ho gaya bhaiya ab. Bahut try kar liya, bohot wait bhi kar liya, bahut koshish ho gayi samajhne aur samjhane ki. Ab agar koi thaan ke baitha hai ki main toh galat hi hoon hamesha se, bina mera perception jaane, toh jaisa tumhe lage tum socho.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Agar ek baar baat ko to the point karke clear kar lo toh dikkat bhi hoti hai. Dimaag mein khichdi pakao aur usmein hi store karo. Jab sad jaaye toh daal do saamne wale pe.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur main toh bol raha hoon kyunki ab main tumhare contact mein hi nahi hoon. 😎 Na main tumhare Insta pe added hoon, na tumhare WhatsApp pe, aur na hi kabhi call karunga. Bas do hi jagah rahi, jinmein se ek maine delete kar di. Bas Telegram bacha hai, toh kar lo uspe... Lekin tum karogi hi nahi 😂 kyunki tumhari naak kuch zyada hi badi hai.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 14 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(14) ? styles.flipped : ''}`} style={{ zIndex: zIdx(14) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 14</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Tumko tumhari baatein mujhse isolate rakhni hain toh rakh lo. Lekin ek time tha jab tum sab share karti thi mujhse, aur mujhe bhi bahut accha lagta tha. Kyunki mujhe tab lagta tha ki main iske liye important hoon. Aur isiliye meri bhi koshish rehti thi ki ye zyada se zyada accha feel kare. Chahe gahr wali baaten ho ya aur sab batati thi prachi, future ki tension ya koi choice karni ho kahi pe wo bhi. Or fir tum aise achanak bolne lagti ho aisa to mujhe lagta hai ki me huuu hi kya tumhare liye. Ek pal ko itna close doosre pl ekdum se itni distance jaise koi stranger.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                At least meri side se isko zara sa bhi bura nahi lagna chahiye.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                And what you think you deserve &lt;&lt;&lt;&lt;&lt;&lt; what I thought you deserve.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Isiliye main jaan laga deta tha har cheez ko ekdum best way mein present karne mein.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Jitni acchi-acchi tareef karta hoon main, utna accha roast bhi karta hoon. 😏
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                And idk mannn, it honestly hurts to realise that trying to treat someone the right way ended up hurting her this much.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Thank you, though, for making me realise that maybe not everyone deserves that much understanding. Aur softness bhi... softness toh respect hi khatam karwa deti hai yaar.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 15 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(15) ? styles.flipped : ''}`} style={{ zIndex: zIdx(15) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 15</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur shayad tumhari misunderstanding itni deep ho gayi hai ki ab main tumhe chubh raha hoon. Toh ab nahi karunga text bhai, jab itni problem hai tumko toh. Bas tum apna mood mat sadao aur faltu mein dimaag mat chalao. 
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tum mera move on nahi chahti, right? Tum chahti ho ki main chala jaun. Bina tumpe burden daale. Theek hai, ye bhi main tumhare liye kar dunga. Move on toh nahi ho payega mujhse, lekin tumhare liye separation maintain kar sakta hoon.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur main jaanta hoon ki main bhi tumhare heart mein ek soft corner hold karta tha, aur mere chances bhi the. Lekin idk kyun, achanak se tum dar gayi ho ya phir kuch aur ho gaya hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur ab toh meri bhi samajh nahi aa raha, guys, ki aurat ko chahiye kya. 😂 Tumne khud bola tha na ki tum usi ke saath jaogi jo tumhara dhyaan rakhega aur hamesha respect dega. Lekin dekh lo ab. 😂 Zyada care ki wajah se hi madam door chali gayi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                After this, I don't expect anything from you. Marzi toh aapki hi hai madam, hum toh bechaare watchman hain.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Bas mujhe pata hai ki suspense mein rehna mujhe kitni takleef deta hai, isiliye diary chhod raha hoon. Isko please negative way mein mat lena. Main bas cheezein apni side se clear karke rakhna chahta tha, taaki baad mein kuch adhura ya unsaid na lage. Baaki jo bhi tumhe sahi lage, woh tumhari marzi hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tum, Prachi, ab iske baad kabhi is baare mein yaad nahi karogi. Tum padhai pe dhyaan do, woh disturb nahi honi chahiye. Jo bhi tha, meri side se tha, aur ab main usse tumhari life ya padhai ko disturb nahi hone dunga.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 16 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(16) ? styles.flipped : ''}`} style={{ zIndex: zIdx(16) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 16</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Kabhi ye watchman yaad aa jaye toh aa jaana, na aaye toh rehne dena. 😌
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                And here, madam, I am not going to talk to you further, kyunki ab tumne is baar had kar di hai. Is baar agar mujhe lagega bhi, tab bhi nahi karunga main baat. Karogi toh tum hi, warna rehne do ab.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Maine tumhe pehle hi warn kiya tha ki main ek baar decide kar loon ki mujhe ye nahi karna, toh kitna bhi important person ho, main nahi karta phir.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur rahi baat dosti ki, jo us din tum bachane ki baat kar rahi thi, toh main bata doon: agar main us dosti ko meri feelings ki wajah se drag na karta toh Shayad abhi tak nahi tikti wo dosti.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur kyunki ab maine drag karna band kar diya hai, toh shayad ab end bhi ho jaaye, kyuki ye friendship jo tumhe soothing lagti thi uska base hi mere heart ke upar bana tha, or isiliye itni disrespect or himuilation ke baad bhi me use bachnane ki kosish me rehta tha. Tum shyd naa dekh pao, kabhi waqt mile to yaad karne ki kosih karna aajayega yaad.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur main kis humiliation ki baat kar raha hoon, woh yaad karo. Woh din yaad karo jab tumne mujhe ye yaad dila diya tha ki, “Maine toh tumse pehle hi kaha tha, Mr. Deepak, ki main acchi dost nahi ban sakti tumhari,” aur “Tumne hi nahi samjha acche se.” Prachi, main usi cheez ki baat kar raha tha.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Main bas cheezein aur feelings build karne par bharosa karta tha. Aur tum maano ya na maano, maine tumhari friendship bhi achieve kar li thi, tumhare un upar wale statements ke bawajood. Tumhare woh sab kehne ke baad mere paas bhi option tha ki gusse mein cutoff kar doon. Lekin mujhe khud par bharosa tha. Main jo decide kar leta hoon, uske liye genuinely efforts lagata hoon aur eventually achieve karne ki koshish karta hoon.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur idhar bhi mujhe lagta tha ki main tumhare mann mein apni jagah bana leta, agar tum beech mein aisi harkatein na karti. Lekin in sab cheezon ke baad mere andar itna gussa bhar gaya ki shayad main properly state bhi nahi kar paunga.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                or mujhe ab koi umeed bhi nhi hai ki tum kabhi mere liy kuch feel karogi bhi, kyuki abhi tk na tumne kabhi kosish kari, effots dekh ke bhi nhi, to sepration ke baad kya hi hoga. Shyd saath hote to mil bhi lete kabhi hangout kar lete kuch time sab saath me lekin aisa ho hi nhi paya, shyd tum nhi ho meri destiny me or ab wait karke koi fayeda nhi h.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                or mujhe ab koi guilt nhi h kyuki aisa kuch nhi bacha jo mene kiya naa ho
                            </p>
                        </div>
                    </div>

                                        {/* PAGE 17 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(17) ? styles.flipped : ''}`} style={{ zIndex: zIdx(17) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 17</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Prachi, itna kuch likhne ke baad ek cheez clearly kehni hai: mujhe tumse koi shikayat nahi hai. Jo bhi mehsoos hua, maine bol diya, bas isliye ki dil mein kuch bacha hua na rahe.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Pichle pages mein jahan bhi gussa ya frustration dikhe, unhe seriously mat lena. Bas ek baar padh lena. Na regret karna, na khud ko guilty feel karwana. Wo mere mann ka bojh tha jo maine yahan utaar diya, aur usmein tumhari koi galti nahi thi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur agar kabhi mere gusse ya pressure se tumhe hurt hua ho, toh dil se sorry. 🤍
                            </p>
                        </div>
                    </div>

                    {/* PAGE 18 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(18) ? styles.flipped : ''}`} style={{ zIndex: zIdx(18) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 18</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Jisne bhi tumhara dil toda, uska asar tumhare is thode defensive, sambhal ke chalne wale heart par pada hai. Aur main samajhta hoon, kyunki jab koi pasand ho aur wahi dil tod de, toh wo feeling kaisi hoti hai, mujhe pata hai. Toh agar dobara trust karna mushkil lag raha hai, it's completely okay.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Par ek baat pakki hai: tumhare andar koi kami nahi hai. Tum beautiful ho, samajhdaar ho, caring ho, mature ho, genuine ho, aur tumhari personality mein ek alag hi warmth hai. Tum jis tarah bina bole dusron ki feelings samajh leti ho, chhoti-chhoti cheezein notice karti ho, wo genuinely rare hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Tum sweet bhi ho aur thodi spicy bhi, aur tum jaisa piece doosra shayad hi koi ho. Tumhe khud realise nahi ki tum kitni amazing ho, aur honestly, yahi tumhari sabse khoobsurat baat hai.
                            </p>
                        </div>
                    </div>

                    {/* PAGE 19 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.gridPage} ${flipped(19) ? styles.flipped : ''}`} style={{ zIndex: zIdx(19) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 19</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Kisi ek insaan ke na chunne se tumhari worth ek ratti bhi kam nahi hoti. Jo tumhe nahi dekh paya, wo uski nazar ki kami thi, tumhari beauty ki nahi.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Aur socho, kuch toh special hoga tumhare andar, ki itna sab hone ke baad bhi log tumhare baare mein sochte hain. Tumhe isse accept karna zaroori nahi, bas jaan lena kaafi hai.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold'}}>
                                Har kisi ko princess wala tag suit nahi karta. Prachi ko karta hai. You deserve the world. ✨
                            </p>
                        </div>
                    </div>

                    {/* PAGE 20 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.ruledPage} ${flipped(20) ? styles.flipped : ''}`} style={{ zIndex: zIdx(20) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 20</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Aur Prachi, Insta par apne aap ke saath thoda gentle rehna. Baar-baar deactivate karna, phir wapas aana, aur kabhi kuch aisa dikh jana jo dil ko phir se dukha de... ye cycle tumhe thaka deti hai. Aisi cheezein mat dekhna jo chubhti hain. Tumhara dil pehle hi bahut kuch jhel chuka hai, usse aur mat dukhao.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Jisne tumhe nahi chuna, let them go. Uske liye apni peace kharab karna tumhare dil ke saath na-insaafi hai. Wo uski choice thi, aur tumhari value kabhi kisi ki choice se decide nahi hoti.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Phone thoda door rakho, time khud ko do. Tum khud ke liye kaafi ho. 🦋
                            </p>
                        </div>
                    </div>

                    {/* PAGE 21 */}
                    <div className={`${styles.page} ${styles.innerPage} ${styles.dottedPage} ${flipped(21) ? styles.flipped : ''}`} style={{ zIndex: zIdx(21) }}>
                        <div className={styles.content}>
                            <div className={styles.caseNo}>PG. 21</div>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Is diary ka koi jawab nahi dena hai. Na text, na explanation, na guilt. Padh liya, wahi kaafi hai.
                            </p>
                            
                            <p className={styles.handWritten} style={{marginTop: '1.5rem', fontSize: '1.3rem'}}>
                                Or wo book jo me likh rha tha usme se tumhara naam hata diya mene, taaki tumhari safety maintained rahe, bs billu likha hai. Me nhi chahta Dream Girl bekar me pareshan ho.
                            </p>




                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Bas jis din sab bahut heavy lage, ya dil dobara suffocate ho raha ho, toh ek line bhej dena. Main ek dost ki tarah yahin milunga, no expectations, no pressure. Tumhari happiness ke alawa mujhe kuch nahi chahiye.
                            </p>
                            <p className={styles.handWritten} style={{marginTop: '1rem', fontSize: '1.3rem'}}>
                                Apni padhai karo, khush raho, aur bina soche muskurao. Tumhari smile mujhe hamesha achhi lagi hai, aur wo aise hi bani rehni chahiye.
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
