import React, { useState, useEffect, useRef } from 'react';
import styles from './RoseLegacy.module.css';
import BackButton from '../../../components/BackButton/BackButton';

const RoseLegacy = () => {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [petals, setPetals] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const totalPages = 6; // Cover + 4 Content + ?

    useEffect(() => {
        // Generate petals
        const p = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 10 + 10,
            left: Math.random() * 100,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5
        }));
        setPetals(p);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const startDiary = () => {
        setIsIntroVisible(false);
        setTimeout(() => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            }
        }, 1000);
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const flipNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    const flipPrev = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const getZIndex = (index) => index < currentPage ? 50 + index : totalPages - index;
    const isFlipped = (index) => index < currentPage;

    return (
        <div className={styles.diaryWrapper}>
            <BackButton />
            <div className={styles.petalContainer}>
                {petals.map(p => (
                    <div
                        key={p.id}
                        className={styles.petal}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    />
                ))}
            </div>
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>

            {/* Intro */}
            <div className={`${styles.introScreen} ${!isIntroVisible ? styles.fade : ''}`}>
                <h1 className={styles.introTitle}>Prachiii✨</h1>
                <div className={styles.introLine}></div>
                <p className={styles.introSub}>THE ROSE COLLECTION</p>
                <button className={styles.btnOpen} onClick={startDiary}>Chalooo..</button>
            </div>

            {/* Notebook */}
            <div className={`${styles.notebookContainer} ${isIntroVisible ? styles.closed : ''}`}>
                <div className={styles.helperText}>Tap Right ➔ | Tap Left ⬅</div>
                <div className={styles.spiral}>
                    {[...Array(12)].map((_, i) => <div key={i} className={styles.ring}></div>)}
                </div>

                <div className={styles.notebook}>
                    {/* Cover (Page 0) */}
                    <div className={`${styles.page} ${styles.cover} ${isFlipped(0) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(0) }} onClick={() => currentPage === 0 && flipNext()}>
                        <div className={styles.coverBorder}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❦</div>
                            <div className={styles.coverTitle}>Ohh...<br />Prachiii..</div>
                            <div className={styles.coverSubtitle}>Things Left Unsaid</div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div className={`${styles.page} ${isFlipped(1) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(1) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>Preface</div>
                            <p><em><span style={{ fontFamily: 'Pinyon Script', fontSize: '1.4rem' }}>Prachiii,✨</span></em></p>
                            <p>Book or designs to me aise bana rha hu jaise me koi writer/publisher hu. Wo alag baat h ki me sab kuch code ke form me bana rha pureee logic and mathematics.... har animation/text ya fir effect sab mathematics se. Tumhe pata h kya, koi bhi cheez move hoti h to uski naaa equation banti h. 11 me wo bubble ki equation thi yaad karo physics me, rain drop bhi thiiii... or ek stone agar spring ki tarah ghoomake fekte h uski bhi banti h... chalo padh ke yaad karke mujhe batao kya thii wo😂. isme bhi dekho wo pattiyaannnn gir rhi h same to nhi lekin drops ke jasie neeche, soooo learn it and express it in our chat. Kya baat h kya baat h maja aa gaya...</p>
                            <p>chalo re maje karo, tum wo poorani bakwas doobara naa dekho isiliye is se replace kar dunga meeeee.</p>
                            <div className={styles.highlight}>"Waise me soch rha hu apan dono ka ek alag hi chatting platform bana duuu... instagram/snapchat/whatsapp jaisaa... jispe sirf apna raaj ho 😂,chalo chhorooooooo"</div>
                            <p>Waise chalo rehne do aise hi theek h....!! Waise me soch rha tha pooch lu kahi ye dairies or wishes apni dostlog ko to nhi batai 😂 kyuki radhika wagerah or baaki log mujhe bada unromantic or boring samajhte thee.😂 agar ye sab sunenge to bolenge ki areee deepakk... ye form to unexpected haiii.. kher tumhari dostlog dekh bhi lengi to khud mere se impress ho jayengi🤏🕶️🙂😎 </p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div className={`${styles.page} ${isFlipped(2) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(2) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>The Silence</div>
                            <p>Dekho prachi, it is clear ki tum sachme chintit rehti ho, mujhe bohot jyada bura lagta h jab tum stress leti ho. Or dekho let me clear one thing, you cannot hurt me. Me bohot hard hu or me bohot tough hu. You don't know me ok!! </p>
                            <p><em>"Mujh se koi expectations mat rakhna"</em> shyd shyd shyd tumhara mtlb wahi ho ki you don't like me and never will... Lekin ye to me pahle se janta hu ladkiiii...</p>
                            <div className={styles.highlight}>How I feel is different, it is not being with someone. It is feeling for someone or usme agar wo kisi or ke saath bhi ho to kya dikkat wali baat. Wo uski choice h or pahle me sochta tha moveon karo moveon karo.. but now I've realised ki karna hi kyun h. You are having the best feeling with you, kyun hatana hai. Jab me jali or tooti footi cheezen rakh sakta hu to itni acchi moments ko daba ke unki bezzati thodi karunga🦥😂😜 </div>
                            <div className={styles.highlight}>Abb.. I would like to carry everything with me, instead of forgetting... </div>
                            <p>Tum bs tumhare liye sab karo na, or mujhe prachiii ko khush dekh ke Khushi milti h to usme galat kya h. Or dekho things I hold with me are insanely miserable to tumhare kisi or ko choose kar lene se mujhe itna kuch farak nhi padega... </p>
                            <div className={styles.highlight}>Instead of being dukhiiii I'll feel glad to think ki chalo ise finally koi accha mil gaya 😂 ab mujhe tension lene ki koi jaroorat nhiiii.... Wo rakh lega iska dhyn. To shyd me apne raste chal saku... </div>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div className={`${styles.page} ${isFlipped(3) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(3) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>Confusion</div>
                            <p>Or haa meri prachiii shyd tum naa ho lekin wo mere mn me h abhi bhi 😂 or shyd hamesha rahee.. wahi wali jo mene coaching me dekhi thi ekdum nakchadi or idiot kahi kiii... I'm working damnn hard to pull her into existence. Or haa pepper naam h na uska. Pepper me prachiii ko tab bulata tha jab prachi sharma se meri dosti thi.</p>
                            <p>Mene ekdin baaton baaton me bol diya ki <em>prachiii ka koi mukabla nhi h...</em> To usne bola areyyy deepak 😏 meri itni tareef. To mene keh diya are nhi meri wali prachi 😂 <em> to usne bola oho meri wali 😏😏</em> kya baat h kya baat h, tum to uspe hak bhi jamane lage. Tab se fir me tumhe pepper bolne laga tha 😂</p>
                            <div className={styles.highlight}>Prachi tumhe tumhare teddy ki Kasam ab tum doobara kabhi aisi faltoo cheezen nhi sochogi. Tum nhi bhi rahi to mere pass meri pepper h 😂 Or kya pata tumhe koi mil jaaye fir me bhi koi bana lu 😏 who knows ??? We never know!!! Or <em>future ki tension leke present kyun kharab karna.</em> Enjoy every day, every hour,every minute, second,and every moment of your beautiful life. <em>Or kya pta kll ky ho jaayee... kuch unexpected hiii...</em></div>
                            <p><strong>Jo jaisa hai perfect hai, use bs enjoy karo or kya 😛 😛</strong><em>Apna BP mat baddhaooo... warna bhari jawani me dukriiii wali feeling aayegiii😂🦥 </em>Ab wo alag baat h ki tum budhiya banke bhi sundar hi lagogi, apne us gol... cashme or safed baalon me.... <em>imagine karke to dekhooo...🦥😂 </em></p>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div className={`${styles.page} ${isFlipped(4) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(4) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>🥂🥂🥂🥂</div>
                            <p>And if I am doing something it is not for you 🫵 it is just for my own satisfaction. And yesssssssssssssssssssss................ <em>I am GREEDY</em><strong> Waiseeee..... maja to aata h tumhara majak banane me😂🦥 agar tumhari nazar jyada weak hui to me tumhara cashma chura ke tumhare sir pe ek gentle back slap deta..</strong> kaash apan ek hi school me hoteeeeeeeeee....... or acche dost hote pahe seee...... tumhari naak me dum na kara hota to kehna 😁</p>
                            <p>Kher abhi to party shuru hui h 🦥 naak me dum to me karunga dheeme dheeme 😼😒🔥🧯</p>
                            <p>Abhi bhi pages palat rhi hooo....!!</p>
                            <p>Thodi to lajja aani chaiye tumheeeeee itne shareef ladke ki pyriiiiiiiiii siiii dairy pe aatyachar kar rhi ho 😒🫵 </p>
                            <p>Karo bhi kyunnnn na hak banta h tumhara ispe... tumhare liye hi to banai thiii 😂🦥</p>
                            <div className={styles.highlight}>"Proper judgment prevents future regret." always remember..!!</div>
                        </div>
                    </div>

                    {/* Final Page */}
                    <div className={`${styles.page} ${isFlipped(5) ? styles.flipped : ''}`} style={{ zIndex: getZIndex(5) }}>
                        <div className={`${styles.cornerFlower} ${styles.topRight}`}></div>
                        <div className={styles.pageContent}>
                            <div className={styles.pageHeader}>Finality</div>
                            <p>Mujhe lagta tha tumhe jyada bade bade texts padhna pasand nhi..?? Lekin tum to yaha tk aa gaiinn prachiii...</p>
                            <p>Mene kaha tha naa mere liye har cheez ek meaning hold karti h 🧐 to me ye <em>Prachi</em> ki jagah <em>Prachiii</em> kyun kehta hu <em>Prachii</em> ya fir <em>Prachiiii</em> kyun nhi....!!</p>
                            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#b76e79' }}>"Sochti raho me nhiii bataungaaa 🙂‍↔️🙂‍↔️"</p>
                            <p>Birthday pe bataunga....!! filhal padhai pe dhyn do baccheeee..</p>
                            <div className={styles.highlight}>Agar sabkuch theek raha to firse kuch unique interesting and something that will make you blushhhh...🐼</div>
                            <div className={styles.sig}>Bye 🌟 Bye</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Click Zones */}
            {!isIntroVisible && (
                <>
                    <div className={`${styles.touchZone} ${styles.zoneLeft}`} onClick={flipPrev}></div>
                    <div className={`${styles.touchZone} ${styles.zoneRight}`} onClick={flipNext}></div>
                    <div className={styles.musicPlayer} onClick={toggleMusic}>
                        <button className={styles.musicBtn}>
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                    </div>
                </>
            )}

            <audio ref={audioRef} loop src="/assets/diaries/rose-legacy/YOUR_MUSIC_URL_HERE.mp3" />
        </div>
    );
};

export default RoseLegacy;
