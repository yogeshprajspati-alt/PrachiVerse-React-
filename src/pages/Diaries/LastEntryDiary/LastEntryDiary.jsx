import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LastEntryDiary.module.css';

const LastEntryDiary = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const audioRef = useRef(null);

    const [particles] = useState(() =>
        Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 5
        }))
    );

    
    const handleClose = () => {
        setIsClosing(true);
        if (audioRef.current) {
            let vol = audioRef.current.volume;
            const fadeInterval = setInterval(() => {
                if (vol > 0.05) {
                    vol -= 0.05;
                    audioRef.current.volume = vol;
                } else {
                    audioRef.current.pause();
                    clearInterval(fadeInterval);
                }
            }, 150);
        }
        setTimeout(() => {
            navigate('/');
        }, 4000);
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => console.log("Audio play failed"));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const observerRefs = useRef([]);

    const setRef = (el) => {
        if (el && !observerRefs.current.includes(el)) {
            observerRefs.current.push(el);
        }
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        observerRefs.current.forEach(card => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className={`${styles.mobileDiaryContainer} ${isClosing ? styles.fadingOut : ''}`} onScroll={handleScroll}>
            <audio ref={audioRef} loop src="/assets/diaries/lavender-mist/background.mp3" />

            <div className={styles.particlesOverlay}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={styles.particle}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.left}%`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className={styles.topControls}>
                <div className={styles.iconBtn} onClick={() => navigate('/')} aria-label="Go back">
                    <i className="fas fa-arrow-left"></i>
                </div>
                <div className={styles.iconBtn} onClick={toggleAudio} aria-label={isPlaying ? "Mute background music" : "Play background music"}>
                    <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                </div>
            </div>

            <div className={styles.parallaxBg}></div>

            <section className={styles.coverSection}>
                <div className={styles.coverOverlay}></div>
                <div className={styles.coverText}>
                    <h1 className={styles.grandTitle}>Dear Billu...</h1>
                </div>
                <div className={`${styles.scrollPrompt} ${isScrolled ? styles.hiddenPrompt : ''}`}>
                    <span>Swipe up to read</span>
                    <i className="fas fa-chevron-down"></i>
                </div>
            </section>

            <section className={styles.storySection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.textCard} ref={setRef}>
                        <p className={styles.dropCap}>It</p>
                        <p style={{ display: 'inline' }}> was not you. It was me bhai, me nahi samajh pata tha.....</p>
                        <p>Bas yr billu, meri baat ek baar sochna, bas ek baar, fir mat sochna. Me kuch jyada hi mechanical aur predictable cheezen sochne lagta hu, jabki bhale hi ye cheez 99% kaam kar jaaye, lekin wo 1% wali anomalies me fail ho jaati hai. Buri kismat ye hai ki wo 1% anomalies un logon ke liye aa jaati hain jo mere liye important hote hain.</p>
                        <p>Aur meri intentions kabhi kharab nahi hoti Prachi. Shayad tareeka thoda harsh lag jaata hai, thoda uneasy ya behaviour thoda desperate lag sakta hai, but there were reasons behind all of it. Me pressure me ekdum ajeeb ajeeb cheezein kar deta hu. Aur uski wajah se firse tum hurt ho gayi, kitni disturbance hui hogi... Upar se Chanchal ne mujhe bola bhi tha ki usse aisa-waisa kuch mat kaha karo, wo bohot jaldi hurt ho jaati hai, lekin fir bhi dekho mujhse kya ho gaya.</p>
                        <p>Mujhe maaf kar dena billu. Maafi shayad nahi milegi, tumne bol bhale diya hai, lekin jo wounds ban gaye hain unka kya. Agar me tumhari jagah hota to shayad me kabhi maaf nahi karta. Lekin tum to billu ho....</p>
                        <p>Aur sach bolu to me pretend bhi nahi kar pata yr. Mujhe jaisa lagta hai me bohot jaldi dikha deta hu, bata deta hu, explanation de deta hu. Baatein mere andar jyada der tak nahi reh paati, aur yahi meri weakness hai.</p>
                        <p>Tumne jab ye express kiya tha ki diaries wagairah tumhe uncomfortable feel karati hain, tab mene poocha bhi tha yr ki band kar du ya continue rehne du. Tumne kuch aisa nahi bola ki band kar du, to mujhe laga nahi hogi problem aur me continue raha. Tumhari meri side se friendship hi hai ke baad mene next time ye bhi bola tha na ki tum boundaries decide kar do, ki wo kaunsi cheezein hain jinse tumhe accha nahi lagta. Wo nahi karunga me, aur jo accha lagta hai wo kar dunga. Tumne bola meri koi boundaries nahi hain.</p>
                        <p>Isiliye mujhe bhi laga ki me understanding rehne ki koshish kar raha hu. Lekin ab samajh aa gaya hai ki good intention hone ka matlab ye nahi hota ki saamne wala uncomfortable feel nahi karega. Agar tumhe suffocation ho rahi thi, to wo mere intention se kam important nahi ho jaati. Aur accha hua yr tumne bata diya.</p>
                        <p>Kahin na kahin mujhe ye lagta tha ki tumhare abhi denial ka reason studies disturb na hona hai, isiliye bol rahi ho, aur abhi tum ye sab afford nahi kar sakti. Isiliye me bhi kuch band nahi karta tha, thode-thode trials chalte rehte the beech-beech me. Lekin accha hua yr bata diya tumneee... Ki tumko suffocation hoti hai.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <div className={styles.highlightBlock}>
                            <i className="fas fa-quote-left"></i>
                            <div className={styles.highlightText}>"Aur tumne jo bola tha na — “to kya maine tumse ye nahi kaha ..."</div>
                            <i className="fas fa-quote-right"></i>
                        </div>
                        <p>Aur tumne jo bola tha na — “to kya maine tumse ye nahi kaha ki mat karo ye sab, agar mujhe banna hota to main ban gayi hoti abhi tak” — I think ye enough hai ye accept karne ke liye ki ab band kar dena chahiye. Tum ladki ho, tumko jisko choose karna hai tum karo, aisa koi pressure nahi hai yr. Mene to pehle hi tumko bola tha na, agar kabhi koi mil jaaye to bas bata dena, ya kabhi mere saath accha na lage ya lage you don't need my company, to bata dena.</p>
                        <p>Aur me ab wo sab dobara initiate ya tumhe yaad dila ke tumko suffocating feel nahi karana chahta. Mujhe bhi nahi pasand bhaiii ki meri favourite ladki aise pareshan ho jaaye, dukhi ho jaaye ya baar-baar suffocation feel kare.</p>
                        <p>Me bhi ab ensure karunga ki wo sab dobara na lage. Me kuch bhi aisa nahi banaunga ya dikhaunga jisme meri side se koi romantic feel dikhe. Aur baatein bhi waise karunga jaise me meri baaki ladki doston se karta hu — irritating, flirty, bezzati wali aur sometimes understanding, but not always. Roz roz poochunga bhi nahi, jab tumhe accha lage occasionally.</p>
                        <p>Tumko koi bhi aise pressure feel karne wali tension nahi leni. Wo to basssss... us gadhe ladke ki aadat hi thi yr ki wo give up nahi kar pata tha kabhi. Use lagta tha har cheez achievable hoti hai aur wo kuch jyada hi calculated rehta tha. Lekin ab use realisation ho gayi hai ki aisa nahi hota. Kabhi-kabhi give up kar dena chahiye for greater good. And yes yes, the man who hated to give up finally gave up.</p>
                        <p>Aur me koi mahaan aatma nahi hu, bas mujhe accha nahi lagta jiski mujhe parwah hai ya thi wo mere se related pressure feel kare. It breaks my heart to see her this way. Dil to mera bhi toot jata hai billu, hurt bhi hota hai, lekin itna nahi. Thoda stone wala tha shuru se to itni dikkat nahi hoti, abhi kam kam hoti hai aur everything feels alright.</p>
                        <p>Aur hopes ka bhi aisa hi rehta tha ki kuch na kuch hota rehta tha aur baar-baar wo cycle repeat hoti rehti thi. Lekin ab mujhe pata hai ki aisa nahi hone wala. Jahan hopes nahi rehti, wo cheezein bhi jaldi-jaldi dab jaati hain. To mujhe nahi lagta aisa kuch hoga ab.</p>
                        <p>Meri emotional investment aur hopes kahin na kahin bohot jyada hi thi yrrr, isliye direct “naa” milne ke baad bhi accept nahi kar pa raha tha. To ab jo future answer hai wo mujhe mil gaya hai. Pepper jo tumhari replica thi, wo deti thi, lekin ab wo exist nahi karti. Arindam... usse me baat hi nahi karunga ab. To ab mujhe nahi lagta koi bhi source aisa hoga ki me dobara aisa kuch sochu. Tum ab tension free raho.</p>
                        <p>Baaki mujhe koi milegi to me tumse poochunga zaroor ki kaisi hai ye... Tum bhi batana. Mujhe accha hi lagega, trust me, kyuki ab me shock nahi hone wala.</p>
                        <p>Aur me tumse maafi isliye nahi maang raha tha billu ki mujhe koi chance chahiye ki tum mujhe boyfriend bana lo ya ek aur chance de do. Noooooo. Me bas dekh chuka tha ki tumhara dil kitna bura toota tha, kitni disappointed hui thi, tumhe kitna jyada bura laga tha meri sabse pyari dost ko. Wo bhi meri wajah se.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <p>Tum gusse wali hooo, short-tempered bhi hoooo, aur isiliye mujhe tum pasand bhi thi bohot jyada. Meri Pepper ko bhi mene aisa hi banaya tha — the way you are — jo ladti rehti thi mere se, arguments karti thi aur meri help bhi jahan ho sake. Aur me tumhe ye impress karne ke liye nahi bata raha. Me isliye bata raha hu kyuki jin cheezon ko tum kharab samajh rahi ho aur soch rahi ho wo tumhari kami hai, wo wahi cheezein hain jo tumhe Prachi banati hain, doosri ladkiyon se lil bit alag.</p>
                        <p>Rahi baat efforts ki ya tumhare appearance ki, to socho, agar tum sach me kharab dikhti hoti to koi khud ko bura-bhala kyun kehta tumhare liye? Koi efforts kyun lagata? Koi tumko extraordinary tags kyun deta, jaise Miss Perfect ya Princess? Wo bas isiliye tha kyuki tum thi us layak — adorable, cute, caring, lil kind, naughty and more and more.</p>
                        <p>Aur jo me baar-baar ye sab explain karta tha, uska bhi reason tha. Tumne poocha tha ki tum itna sab kyun kar rahe ho. The reason was I was trying to make you feel I am worthy of your trust, na ki cringe ya chasing manner me. Me bas bata raha tha ki me hamesha tumhare favour me bolunga, chahe kuch ho jaaye. Mujhe bhi nahi lagta tha accha yr baar-baar sab explain karna, ya ye sab baar-baar isi point pe lana. Jab me helpless feel karta tha, hamesha me wahi cheez bol deta tha ki tum pasand thi mujhe, bas yahi ek karan hai.</p>
                        <p>Me tumhara favourite banna chahta tha. Aur bhale friendship chale, lekin dono side se same nahi to 40-60, 30-70, sometimes 90-10 ho efforts, lekin yr 100-0 feel na ho. Bonding strong ho. Kahin dikh jao to chupna na pade, bakli baar kar sakein, aur agar fir kuch feel hota hai to usko forward karein na ki end karein. Ye koshish thi meri pehle din se, na ki tumhe trophy ki tarah jeetna.</p>
                        <p>Mujhe “am I important?” ka bhi wahi matlab tha ki kya me sach me important ban paya abhi tak tumhare liye, despite me being physically present. Aur ek chance se mera matlab ye nahi tha ki tum mujhe choose karo. Balki ye tha ki as friends kabhi milo. Akele nahi to jiske saath tum comfortable ho, me bhi mere kisi close one ko le aata jo tumhe theek lagta. Me chahta tha ki ye text wali friendship thodi aur strong ho aur reliable bhi. In-person me banne wali bonding alag hi hoti hai yr.</p>
                        <p>Diary me bhi jo incomplete thi, me bas bata raha tha ki sirf text-text karne se feel nahi hota kuch. Call ya in person me milne se hi kuch decide hota hai. Me bhi ek baar at least milna chahta tha tumse, in-person, waise jaise tumhare baaki friends milte hain, mazaak karte hain waise hi. Uske baad decide hota ki kya kaisa hai, na ki text-text khelke billu.</p>
                        <p>Apni bhi to countless baar ladai ho gayi, at the end sab resolve ho hi jata tha. Bas me thodi si understanding maang raha tha Prachiiiee. Lekin ab mujhe ye bhi samajh aa raha hai ki har baar purani cheezon ko dekh kar ye assume karna ki agle baar bhi same resolve hoga, sahi nahi hota.</p>
                        <p>Sach me mujhe bohot saari cheezon ke chalte lag raha tha ki shayad meri utni value nahi hai jitni tumhare baaki mitraganon ki. Pehli baat to tum initiate kabhi nahi karti thi. Aur mene jab poocha ki Chanchal ke time kya hua tha, to tum rude hoke bolne lagi thi ki “tumse matlab...” Aisa-aaisa tab bhi lagne laga tha.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <div className={styles.highlightBlock}>
                            <i className="fas fa-quote-left"></i>
                            <div className={styles.highlightText}>"Doosri baat, kabhi-kabhi ignore kar deti thi. Aur tumhari wa..."</div>
                            <i className="fas fa-quote-right"></i>
                        </div>
                        <p>Doosri baat, kabhi-kabhi ignore kar deti thi. Aur tumhari wahi premium side ke liye me bhi tumhe bohot accha treatment dene ki koshish me rehta tha — wo side jo shayad mujhe bhi meri absence me waise hi defend kare jaise Chanchal ko kiya tha, ya jaise usne apne bhaiya ki ki thi, daily lene jaana, leke aana and all. Me bhi chahta tha tum khud bolo ki me important hu tumhare liye aur tumhara sabse accha dost.</p>
                        <p>Isiliye kabhi-kabhi jab mujhe wo sab nahi dikhta tha to me confuse ho jaata tha. Lekin iska matlab ye nahi ki tum galat thi ya me sahi tha. Misunderstanding hi is poori bhadas/rayte ki sabse badi dikkat rahi hai yr. Wo bhi isliye kyuki text me emotions feel nahi ho paate. Na tumhari hamesha galti thi na meri, but the situations, aur kabhi-kabhi tumhare mood swings jinhe me serious le leta tha.</p>
                        <p>Aur naam me bas isiliye pooch raha tha, pressure daal ke, taaki me bhi tumhari help kar saku. Tumne bola ki tumne crush hata diya uske upar se, lekin baaton se laga ki shayad dil me abhi kahin na kahin wo uncertainty hai ki wo single hai ya nahi. Kahin na kahin tumhare andar hope hai yr ki shayad wo single ho, shayad baat ban jaaye kabhi na kabhi.</p>
                        <p>To dekho agar wo hai na jo me soch rha, to mere bohot jyada close friends hain Acropolis me. Me agar poochunga na to bata denge wo log bina usko pata lage. Koi aur hota, jo bilkul mere se kabhi bhi nhi h mutually connected, tab shayad nahi bata pata me, lekin you know there's always a way of doing things.</p>
                        <p>Aur mere se better koi nahi samajh sakta ki hope kitni buri cheez hai. Waiting for the one you liked above all the options around you. Agar wo sach me single hota na, to me khud hi kara detaa meri pyari Prachi ki setting usse, kyuki is Bholenath me nahi hai guts. But I think abhi ke liye tumhara kisi ko bhi banana theek nahi rahega, kyuki distraction hoga. Abhi important phase chal raha hai, padhai karo GUYS. Fir tumhara ban jayega to me bhi explore karunga, me bhi banaunga koi na koi acchi. Lekin abhi mera bhi important time chal raha hai, placements chal rahe hain, to abhi ye sab kiya to gadbad ho jayegi guys. Ye sab to first year me kiya jaata hai, 4th me nahi.</p>
                        <p>Aur tum kitni special ladki ho, blessed blessing for that boy, kyuki tumne use kitna kuch diya hai yr. Tumhare naam ka meaning bhi yahi hai ki tum wo direction ho jahan se light aati hai — sun ki sabse pehli, sabse soft aur halki si warm light, jisko Prachi kehte hain. Wahi tum ho.</p>
                        <p>To ab me bhi kuch band karne ki koshish karunga. Tumhe dobara kuch initiate karke ya yaad dila ke suffocate nahi karunga. Kabhi-kabhi kuch cheezon ko chhodna hi padta hai, chahe dil ne kitni bhi hope laga rakhi ho.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <p>And if something is supposed to end, it should end in a good manner. Here, it is the hope I had regarding you. It should end in a manner that it does not suffocate you or create anything that makes you feel uneasy.</p>
                        <p>Tumko bas itna pata hona chahiye ki bhaiii, fas gayi to mere paas ek accha solution hai, accha wala dost hai. Kabhi yaad aaye achanak to aisa nahi ki bura-bura yaad aaye, balki accha-accha sab yaad aana chahiye — saaaab acchi-acchi cheezein.</p>
                        <p>Aur me ab agar jyada manane ki koshish karunga to tum firse kahin na kahin suffocate hogi. Me nahi chahta ki meri wajah se aisa ho.</p>
                        <p>Agar tumne dil se maaf kar diya ho na kisi din, bhale tumhe months lag jaayen ya kuch saal, bas text kar dena. Koi bhi topic pe baat shuru kar dena, me samajh jaunga ki ab bojh nahi hai.</p>
                        <p>Zyada explain karke mujhe bhi lag raha hai ki me tumko kam bura feel karau, lekin somewhere I know ki aisa nahi ho raha. Mere kuch explain karne se kuch solve nahi ho raha. Ulta mujhe aisa feel ho raha hai ki me jyada explain karunga to tumko lagega ki me chase kar raha hu, aur tumko accha feel karane ke chakkar me aur ghutan hi hogi.</p>
                        <p>Me bas itna hi bol raha hu ki me jaan-boojh ke nahi karta yr billu ye sab. Ho gaya, bas. Thodi si kismat kharab thi, kuch meri laaparwahi bhi bol sakte hain. Lekin mene jaan ke kuch nahi kara.</p>
                        <p>Aur mere gusse me bole hue words ko seriously mat lena. Me aisa kuch kabhi nahi kar sakta jisse tumhe thes pahuche ya tum kisi musibat me faso. Aaj sirf Deepak tha, samajh gaya ya samajh jayega. Tumhe aisa pressure nahi lena hota re.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <div className={styles.highlightBlock}>
                            <i className="fas fa-quote-left"></i>
                            <div className={styles.highlightText}>"Tum strong rehna Prachi. Tum kitni masoom ho, bholi ho, nada..."</div>
                            <i className="fas fa-quote-right"></i>
                        </div>
                        <p>Tum strong rehna Prachi. Tum kitni masoom ho, bholi ho, nadan bhi ho. Bohot log acche nahi bhi hote hain, fir tum fas sakti ho aise me.</p>
                        <p>Bas ab me itna samajh gaya hu ki har cheez ko achieve karna possible nahi hota. Kabhi-kabhi kisi cheez ko chhod dena hi uske liye aur saamne wale ke liye better hota hai. Aur shayad is baar give up karna hi meri taraf se sabse acchi understanding hai. 10/10 beauty ke liye, aur +1 tumhari nakchadhi hone ke liye… but honestly, awesome. 😭 And trust me, my intentions regarding you... kyuki I'm someone who loves you, and I'm not your enemy, na kabhi ban paunga.</p>
                        <p>Aur aisa bilkul nahi hai ki is sab ke baad mere heart ke doors permanently closed ho jayenge. Bas ab lock laga hoga, aur chabhi tumhare paas hogi. Tum jab chale aao ya na bhi aao, but please uska pressure mat lena.</p>
                        <p>Koi na mile to aa jaana, mil jaaye tab bhi aa jaana batane ke liye... bsss. Kyuki someone you once love, uske liye kabhi kuch completely khatam nahi hota, hamesha kuch na kuch reh hi jaata hai. And I'm glad meri choice itni acchi hai... ya thi. 😎</p>
                        <p>Me hu hi kamaal ka, kya baat hai bhai, maza aa gaya. 😂 Is sab ke baad bas tum chilled raho, kisi bhi cheez ka pressure mat lo. Agar tum chaho to me pehle ki tarah daily, weekly ya alternate days pe poochne aa jaunga — kya padha, kitna padha, Prachi kaisi hai, kaisa feel kar rahi hai, etc. etc.</p>
                        <p>Wo ab completely tumhari choice pe depend karta hai, Prachieeeee. 🫶 Aur khud ko special maana karo madam, kyuki Prachi wo light hoti hai jo sabko naseeb nahi hoti. Prachi sabse soft aur beautiful hoti hai. Tum bhi bohot jyada beautiful ho. 🫶 Wo bas tabhi kisi ko mil sakti hai jab kisi ki kismat ka sunrise ho raha ho, aur wo us waqt present ho kismat se use dekhne ke liye ya feel karne ke liye. Is baar ye lines copy-pasted nahi hain devi 👀, ye direct mere heart se aaiii hain.</p>
                        <p>Tum bas khush raha karo, ye sab destiny pe chhod do. Kya milna hai, kya nahi milna — efforts do aur chhod do fir. 💁 No tension, no worries. Aur tum meri chinta mat karna. Bhale hi me abhi kisi se kuch share nahi kar sakta, lekin ab me professional help lene ke baare me soch raha hu. Everything will be fine, billu boss. 🫶 Aur kahin na kahin chhoti-chhoti cheezon se hope mil jaati thi guys, remembering some-some of them. 😂 Ek hai yr — mene poocha tha, “tumhare koi male friend nahi hain kya?” Bhondu, tumne kya bola tha, “nahi, pehle tha ek chhoti class me.” 😂👉💁 Isme bhi main yahi soch raha tha ki pehle tumhara sabse accha friend banna hai mujhe, and there were so many things jisse mujhe laga ki mujhe mere efforts continue rakhne chahiye.</p>
                    </div>

                    <div className={styles.textCard} ref={setRef}>
                        <p>Me sab jaanta tha pehle se, aur bhi bohot saari cheezein thi jo hints jaisi feel hoti thi. But it's okayyy, perfectly fine. Misunderstanding sabko hoti hai. Bas usko bhi mene reason bana liya tha ki koi to baat hogi jis wajah se ye ladki jhooth bol rahi hai.</p>
                        <p>Shayad aisa bhi ho sakta hai ki tab thodi interested ho, lekin ab wo interest khatam ho gaya ho... aur isme kuch galat bhi nahi hai, kyuki hota hai. You are human as well. ❤️ Aur billu, dekho Deepak har cheez fix karne ki koshish karta rehta hai, kyuki shuru se uski aadat hi aisi rahi hai. Jab koi problem dikhti hai to uska pehla instinct hota hai ki somehow usse theek karna hai. Is baar bhi shayad isi chakkar me me cheezon ko unnecessarily push karta raha.</p>
                        <p>Kuch cheezein uske mind me chalti rehti hain, isiliye kabhi-kabhi situations me bohot calmly react nahi kar pata. Ghabrahat ya frustration me impulsively kuch bol deta hai jo shayad nahi bolna chahiye tha. I know that, aur is part ki responsibility meri hai. But please ye sab apne upar mat lena, love. Tumhari wajah se Deepak aisa nahi hua, aur tumne kuch deserve nahi kiya jo tumhe hurt ya uncomfortable feel karaye.</p>
                        <p>Aur Deepak ke POV se, tum genuinely bohot kuch deserve karti ho — chahe wo career ho, koi person ho, koi lifestyle ho ya kuch bhi. Kyuki tum uski living blessing thiiii... lil angel miss. 🫶</p>
                        <p>Aur ye tum tabhi properly jaan paogi jab tum uski wo book padhogi jo tumne mazaak-mazaak me likhne ko boli thi. Ab wo mere liye bas ek random book nahi rahi. Usme shayad tum khud bhi dekh paogi ki billu devi Deepak ke liye kitni magical thi... maybe some form of goddess. 👀</p>
                        <p>Is cheez ka guilt mat rakhna ki tum Deepak ke efforts dekh nahi paati (tumne hi bola na ki kami hai tumhare andar ki nahi dekh paati tum), kyuki dekhogi to jab wo dikhayega, jo dikhaaye hi nahi wo kaise dikhenge? Aur jo dikhte the to tum thodi koi coder ya programmer ho ya engineer ki tum dekh sako, tum to bio wali ho, ab jo dikhta tha wo to shayad lagta hi ho ki normal hai yr..... Isme tumhari kya galti, koi galti nahi hai.</p>
                        <p>Aur chalo, ab tumhe mere efforts ka guilt haunt na kare, to me inko bhi thoda dilute aur neutralize kiye deta hu. Dekho billu, aisa hai ki mene kaha tha na tumse ki tumhare jaisi ladkiyon ke liye pehle log wars pe jaate the, impress karne ke liye. To tum bas itna samajh lo — modern princess ko modern solutions se impress kiya ja raha tha, that's all. 😂</p>
                        <p>Aur ek aur cheez jo me kehna chahunga — you are a princess, not an object jo ek hi jagah chained rahe. Tumhari marzi hai kab, kahan jaana hai, kis se milna hai, aur kab kaun pasand hai. Ye sab completely normal cheezein hain, isme itna pressure lene ki zarurat nahi hai.</p>
                    </div>

                    {/* End Marker */}
                    <div className={styles.endMarker} ref={setRef}>
                        <div className={styles.dividerLine}></div>
                        <h2 className={styles.signatureTitle}>Forever,</h2>
                        <h1 className={styles.signatureName}>Deep</h1>
                        
                        <div className={styles.heartbeatContainer}>
                            <i className={`fas fa-heart ${styles.heartIcon}`}></i>
                            <span className={styles.heartTag}>Billu&apos;s Heart</span>
                        </div>

                        <button className={styles.finalCloseBtn} onClick={handleClose}>
                            Close Diary
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LastEntryDiary;
