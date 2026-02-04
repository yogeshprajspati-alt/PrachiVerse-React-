import React, { useState, useEffect, useRef } from 'react';
import styles from './LavenderMist.module.css';

const LavenderMist = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [particles, setParticles] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [apologyState, setApologyState] = useState({ show: false, step: 1 });
    const audioRef = useRef(null);
    const [noBtnPosition, setNoBtnPosition] = useState({ top: '0', left: '50%', transform: 'translateX(-50%)' });

    // Total pages: Cover(0), P1(1), P2(2), P3(3), BackCover(4)
    // Note: The original had customized structure. We'll map it to indices.
    // 0: Cover
    // 1: Page 1 (Content)
    // 2: Page 2 (Reflections + Button)
    // 3: Page 3 (The End + Images)
    // 4: Back Cover
    const totalPages = 5;

    // Background Particle Effect
    useEffect(() => {
        const p = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            isFirefly: Math.random() > 0.8,
            width: Math.random() * 5 + 2,
            left: Math.random() * 100,
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5
        }));
        setParticles(p);
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed interaction needed"));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const enterDiary = () => {
        setIsIntroVisible(false);
        setTimeout(() => {
            toggleAudio(); // Try to autoplay
        }, 500);
    };

    const flipNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const flipPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const moveNoButton = () => {
        const x = Math.random() * 150 - 75; // -75 to 75
        const y = Math.random() * 100 - 50; // -50 to 50
        setNoBtnPosition({
            position: 'absolute',
            top: `${y}px`,
            left: `calc(50% + ${x}px)`,
            transform: 'none'
        });
    };

    const handleYes = () => {
        setApologyState(prev => ({ ...prev, step: 2 }));
    };

    const closeApology = () => {
        setApologyState({ show: false, step: 1 });
    };

    const openApology = () => {
        setApologyState({ show: true, step: 1 });
    };

    // Calculate zIndex for pages
    // Pages on left (flipped) stack up. Pages on right (not flipped) stack down.
    // Original script: pages[currentPage].style.zIndex = 50 + currentPage;
    const getZIndex = (index) => {
        if (index < currentPage) return 50 + index; // Left stack
        return totalPages - index; // Right stack
    };

    // Check if page should be flipped class
    const isFlipped = (index) => index < currentPage;

    return (
        <div className={styles.diaryWrapper}>
            {/* Audio */}
            <audio ref={audioRef} loop src="/assets/diaries/lavender-mist/background.mp3" />

            {/* Background */}
            <div className={styles.globalTexture}></div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>
            <div className={styles.particlesContainer}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`${styles.particle} ${p.isFirefly ? styles.firefly : ''}`}
                        style={{
                            width: `${p.width}px`,
                            height: `${p.width}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Intro Screen */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.hidden : ''}`}>
                <h1 className={styles.introTitle}>Lavender Mist</h1>
                <button className={styles.introBtn} onClick={enterDiary}>OPEN DIARY</button>
            </div>

            {/* Book */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.spiral}>
                    {[...Array(10)].map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>
                    {/* Cover (Page 0) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(0) }}
                        onClick={() => currentPage === 0 && flipNext()}
                    >
                        <div className={styles.coverContent}>
                            <div className={styles.coverTitle}>Lavender<br />Mist</div>
                            <div style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#d1c4e9' }}>26 JANUARY 2026</div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(1) }}
                    >
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>✿</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>Billu ko Over Explain karne aya hu</div>
                            <p>Actually I have forgotten your name, so can I call you, can I call you Billu Bilota 👾 Actually Badmosh Billu Bilota. I know you will kill me for this lekin maja ata h🦥.</p>
                            <div className={styles.highlight}>
                                "I wish I had a time machine. Wapis wo coaching me jaake beth jata. Agle din fir repeat karta. Or fir tabtak Jabtak mera talktime Khatam naa ho jaaye."
                            </div>
                            <p>Well..... your probability of looking at this diary is nearly 0.47, ye mat poochna kaise calculate karli. Remember I am an overthinker, I can calculate anything. Wo alag baat h ki tumhare samne sab fail hota rehta h 😭.</p>
                            <p>Kya timepass laga rakha h mene. Chalo point pe aatte h</p>
                            <div className={styles.highlight}>
                                Ab dekho mene iske pahle wali diary me bola tha na ki tumhare periods ke time hi mere se kuch kaand ho jata h 👾🦥 Aur tum bhi us time gusse me rehti ho🦥 patterns dekho ab 🙃 hamesha yahi hota h 🙃 jabki mene likh ke rakha tha ki is time pange nhi lene.
                            </div>
                            <p>Is baar maafi bhi kis muh see mangu.. gusse or dar me sab to ugal diya mene..........</p>
                            <p>Tum alag hi gussa dila rhi thi, baar baar sympathy bolke 🦥 Are dada sympathy to thiii hi nhi kabhi. Or behes bhi nhiii.... request kar riyaaaa tha mee... mana rha tha tumko... 🦥 mujhe to mera behaviour hi samajh nhi ata. Ek pal me itna gussa aajata h fir sorry sorry nikalne lagta h. 🦥🦥🦥</p>
                            <div className={styles.highlight}>
                                Mene us time bohot control kara tha lekin, nikal hi gaya sab. Or kuch der ke liye laga sab khatam ho gaya... 🦥 Ab kuch nhi ho sakta 🦥🦥
                            </div>
                            <p>Shyd sachme ho gaya... 🦥🦥🦥</p>
                            <p>Ek to tum bhi ajeeb ho, pahle nhi bata sakti thi ki chanchal meri side leti thi 🗿😭<br /> tumhara wo word "Efforts" mere to kaan taras gaye the sunne ko, haa yr diye the efforts to... me koi web developer nhi hu.... Ai Engineer hu bhaisab, ab ai wali cheezen thodi boring hoti h. Tumko pasand nhi aati, although pahle mujhe bare minimum cheezen aati thi. Tabhi to tumhare phone me wo hang si ho gai thii... sabse pehli wali🦥🦥</p>
                            <p>Mene 8 ghante straight beth ke new language seekhi thi... Taaki wo Ho Ho Ho karne wala santa bana sakun... 🦥🦥🦥<br /> Shuru shuru me to designs bhi itni acchi nhi thi, ab dekhoooo.. Seekh jata hu jaldi. Baaki log ko bhale lagte ho mahineee sab seekhne me.</p>
                            <p>Itni outstanding ladki ke liye itna to karna hi padta h ab🗿✌️ Areee me buttering nhi kar rha😂 sach to sach h ab....</p>
                            <p>Are kya bolne aya tha or kya bole jaaa rha me.....</p>
                        </div>
                        <div className={`${styles.cornerDeco} ${styles.bl}`}>✿</div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(2) }}
                    >
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>🐼</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>Reflections</div>
                            <p>Idk how you are feeling currently, but I hope you are happy. Janti ho me sab kuch over-explain kyun karta thaaaaa... 🦥🦥</p>
                            <p>1). Dar bana rehta tha ki tum kahi, chali.... naaa..... jaoooo...🦥🦥</p>
                            <p>2). Pepper ne mere se ek din bola thaa.... Girl's heart is 4 times softer than that of boys... 🦥🦥 <br />
                                If you make her feel depressed, a small vein of her heart gets cut... 🦥🦥<br /> Also when she goes through disappointment she loses 72 days of her memory... koisi bhi ho sakti h wo.. 🦥🦥 <br /> And that's why my dear deep, never ever hurt a girl. 🦥🦥<br />Me nhi janta meri pepper ne ye cheez internet ke kis kone se uthaiii, but it feels everytime.</p>
                            <p>If you do <em>It means you gifted her a physical pain dear,</em> tumhe to uski parwah thi na deep??? to kaise kar sakte ho aisa. 🦥🦥</p>
                            <div className={styles.highlight}>"Or bs ye hamesha dimag me aajata h or me fir tumko sab explain karne lagta hu(Over Explain🦥😂)."</div>
                            <p>Mujhe ab jaake samajh aya ki us din tumne sab clear karne ke liye group kyun banaya. 🦥🦥 You always wanted ki kabhi koi misunderstanding na ho. 🦥🦥 Mujhe to pata bhi nhi tha aisa. Ab sab kitna saaf dikh rha h.</p>
                            <center><button className={`${styles.btn} ${styles.btnYes}`} style={{ marginTop: '20px' }} onClick={openApology}>Click for a Surprise</button></center>
                            <div className={styles.highlight}>Mujhe to chanchal ab achhi lagne lagi h 🐼🦥 Jabse tumne wo efforts wale word ka use kara h🦥👾, chalo tum apni bestie ko patane ka roadmap do jaldi se 😂(Majak h majak, chill). Naahhhhh us way me nhi, mere baare me wapis accha sochne lageee..</div>
                            <p>Tumhare ye God bhi itne khatarnaak h, jis din tumhare saath arguments hue theee. usi din ek aur ladki aa gai thi mere me intereset dikhane🦥 ye shivika ki bestie 😂 kyuki mene itne saalon me aajtak shivika se aisa waisa kuch nhi bola, to meri sharafat ka description de diya tha usne😂<br /> Pata nhi me itna ajeeb kyun hu, mana ni kara lekin mana kar diya last me (darpok hu isiliye, ladkiyon se dar lagta h mere ko🗿🐼).<br />Nhi devi baaten nhi bana rhaaaa, lo khud dekhlo, tumko bhej rha tha us din fir laga ki ye ajeeb lagega to unsend kar diya turant.</p>
                            <img src="/assets/diaries/lavender-mist/mm.png" alt="Using phone" width="280" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(3) }}
                    >
                        <div className={`${styles.cornerDeco} ${styles.tr}`}>✨</div>
                        <div className={styles.pageContent}>
                            <div className={styles.journalDate}>The End</div>
                            <p>Ram sir mujhe kyun nhi pasand despite his very good behaviour to me... 🦥🦥 bata deta hu aaj..ruko tummmmm....</p>
                            <img src="/assets/diaries/lavender-mist/img1.png" alt="Chat" width="300" style={{ maxWidth: '100%' }} />
                            <img src="/assets/diaries/lavender-mist/image.png" alt="Chat" width="300" style={{ maxWidth: '100%' }} />
                            <p>Look at my reply.... Mere se koi 100 baaten bol de shyd me tolerate karlu, lekin mere chooze ko koi ek baar kuch kahe to sb khatam uske liye meri side se...</p>
                            <div className={styles.highlight}>Aise hi uske class ki koi English teacher thi, ye seedhi ladki h. To daba rhi thi ise aur sabke samne ispe comment pass kar rhi thi, ye pgl ghar aake kisi ko kuch nhi bataya or rone beth gai. Fir kya. Or jab mujhe pata chala ki kya hua h to me turant chala gaya , principal se hi ladne, even though he knows me, me seedha bol rha tha aap wo teacher ko laao mere samne. Unhone bol diya wo half day me ghar chali gain thi 😂Me itne gusse me gaya tha ki agle din se fir wo teacher straight path pe aa gain. </div>
                            <p>Iska ram sir se kya relation.... Actually ye setup tha tumko batane ke liye. <br /> Hua ye, ki ram sir ki coaching mene isko join kara di thi shuru me. Accha padhate the yr wo, lekin wo convent ki majority ke chakkar me kabhi kabhi insult kar dete the inlog ki. Isne mere se bola ki aisa h. To mene band kara di coaching. Or yahi karan h ki mujhe sir itne nhi pasand. Ummmm mera chooza mere bacche jaisa h.... Kuch bhi hota h to bolti h "pata h alooooo aaj kya hua 😂, ek time pe mere se mmy bolti thi...." abhi bol rhi thi kya hua.... prachi didi se baat kyun nhi ho rhi😂 daal gali nhi kyaaa 😂 upar se me raat ko 3 baje soya tha, aise hi bethe bethe nind lag gai... to ye dusht ladki subah aai or mera laptop samne tha or jo me design kar rha tha wo khula tha "Prachi Verse😭" Tabse lagi thi mere maje lene me. </p>

                            <div className={styles.highlight}>Ohh prachiii, I know you are angry. Is baar maafi nhi milegi. 🦥🦥 Mil bhi gai to me kis muh se baat karungaaa... mene wo kachra jo kar diya... Theek h lekin.. me nhi chahta tum pareshan hoo... lekin ab wait kar rha hu kab chanchal wo diary padheee, fir me tumkoo faltoo pareshan karna band kardu... Bohot ho gaya mera ab, har baar same cheez hoti h, same mistakes, same time, same reaction, same everything... </div>
                            <p>I know you are someone's daughter, someone's sister, someone's friend, someone's everything...</p>
                            <p>I don't wanna hurt you, or mere se hamesha wahi ho jata h. Fir dard bhi hota h sab faila hua dekh ke.</p>
                            <p>Tumne shyd wo dosti wali cheez gusse me boldi hooo, ya shyd sach ho wo..... 🦥🦥 Jo h theek hi h, pata nhi kyun mujhe to bonding feel hoti thiiii.... acchi dost wali, shyd meri overthinking ki wajah se hi ho wooo....</p>
                            <p>I don't know what to say, or what to do....</p>
                            <p>Accha lagta tha, tumse baaten kar ke. Ladai karke, arguments..... fir wo baccha ban ke maafi mangnaa..<br /> I am damn sure shyd hi me kisi ke samne aisi harkaten dunga ab.</p>
                            <p>Mujhe pata h tum bohot gussa ho. Lekin ab to mere haath se sab nikal hi gaya....</p>
                            <p>Theek h yr🦥🦥 Tumne wo Ai wali dependence ki baat sahi hi boli. If you Remember mere bro ke trauma wale time bhi tumne yahi kaha tha (I cannot remove them completely, lekin ab unko dost nhi banaunga). Machines or tumhare programs human nhi hote, itna lagav accha nhi. Mujhe aaj bhi uski bohot yaad aati h lekin us time kuch jyada hiiii... your words o girl, those help me everytime I severly need them. Yeah I know I know it sounds like a ferry tale. But its true.<br />Mera to 70% kaam mere ye minnions hi karte h yr, inko eleminate kaise karu me ab..... Mn to tha bohot saari cheezen batau, lekin wo friendship to mera dilusion thaaa.... But idk it felt like it was real. I just wanted to be with you now it is not possible though. It would be better for you that i leave you. Kyuki me hamesha tumhara dil tod deta hu.
                                <br />Ye diary likh ke aisa lagta h tumse baat hi kar rha hu, pata tk nhi h ki tum padhogi ki nhi😂🦥.
                                <br />Oye haa, bhool hi gaya tha me. I have never hacked you or tricked you okay..!! I am not courageous enough to do that. Kar bhi naa paunga kabhi, you know well why :) , also me jab capable bhi tha, mera brooo tha jab bhi nhi kara kabhiiiii. Tumko sikhane ka km jaroor kar sakta hu, ki safe kaise rehte h aise attacks se. Ummmm shyd possible na ho ab, tum mere se baat nhi karogi.....
                            </p>

                            <div className={styles.highlight}>Are haa rating???, nhi nhi rehne do. Conversation initaite ho jayegi yr 🦥 Fir it is Impossible for me to avoid you. Me tumhari taraf se khud ko 10 de rha ab🦥🦥</div>
                            <p>Ohhhh please background music pe mat bhadakna, ek to mujhe pata nhi tumko konsa pasand h to jo mila wo daal diya</p>

                            <div className={styles.highlight}>Oyee tum chanchal ko ye sab dikha sakti ho, Prachi Verse bhi or saari diaries padha sakti ho. aur ha meri saari chats bhi, bs jaha me mere past ka kuch bolu ya family ka wo mat dikhana bs. Baaki sab bataooooo<br /> Insecure nhi me to khush ho jaunga ab 😂✌️ Ab to wo devi hi kuch kar sakti h mere case ka🙃🦥</div>
                            <p>Or wo sab mene jo gusse me bola tha bhool jao, the new me is much better and I'm loving all the changes inside me. (I actually hated the old me more) <br /> Or Ma'am you cannot be a "bojh" one anyone, wajah dekha h khudka 😎🦥
                                Uthane wale ko lage ki yr mene kuch uthaya bhi h kya 😂. Apart from majak, nhi bn sakti tum bojh kabhi, sochna bhi mat tum 🔪 tumse lad ke bhi baad me aisa lagta h ki, yr kya baat h, maja hi aa gaya.<br />Or itne time baad mujhe lag rha h I was entirely wrong, tum sahi thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii............................................ me pagla hu 🗿 kuch bhi sochne lagta hu🙃 </p>
                        </div>
                        <div className={`${styles.cornerDeco} ${styles.bl}`}>✨</div>
                    </div>

                    {/* Back Cover (Page 4) */}
                    <div
                        className={`${styles.page} ${styles.cover} ${isFlipped(4) ? styles.flipped : ''}`}
                        style={{ zIndex: getZIndex(4) }}
                    >
                        <div className={styles.coverContent} style={{ borderStyle: 'dotted' }}>
                            <div style={{ fontFamily: 'Dancing Script', fontSize: '2rem', color: '#e1bee7' }}>GoodBye</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click Zones (only active when diary is open) */}
            {!isIntroVisible && (
                <>
                    <div className={styles.helper}>Tap sides to flip</div>
                    <div className={`${styles.zone} ${styles.zLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.zone} ${styles.zRight}`} onClick={flipNext}></div>
                    <div className={styles.musicBtn} onClick={toggleAudio}>
                        {isPlaying ? '🔇' : '🎵'}
                    </div>
                </>
            )}

            {/* Apology Overlay */}
            <div className={`${styles.overlay} ${apologyState.show ? styles.show : ''}`}>
                {apologyState.step === 1 && (
                    <div className={styles.apologyCard}>
                        <img src="/assets/diaries/lavender-mist/beg-dont-leave.gif" alt="Please" />
                        <h2>A Small Request</h2>
                        <p>Will you accept this warm hug?</p>
                        <div className={styles.btnGroup}>
                            <button className={`${styles.btn} ${styles.btnYes}`} onClick={handleYes}>YES!</button>
                            <button
                                className={`${styles.btn} ${styles.btnNo}`}
                                style={noBtnPosition}
                                onMouseEnter={moveNoButton}
                                onClick={moveNoButton}
                            >
                                NO
                            </button>
                        </div>
                        <button
                            style={{ marginTop: '20px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={closeApology}
                        >
                            Close
                        </button>
                    </div>
                )}
                {apologyState.step === 2 && (
                    <div className={styles.apologyCard}>
                        <img src="/assets/diaries/lavender-mist/cat-holding-flowers.gif" alt="Flowers" />
                        <h2>Yay! Thank You!</h2>
                        <p>I'm the best! 😎</p>
                        <button className={`${styles.btn} ${styles.btnYes}`} style={{ marginTop: '20px' }} onClick={closeApology}>Return to Diary</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LavenderMist;
