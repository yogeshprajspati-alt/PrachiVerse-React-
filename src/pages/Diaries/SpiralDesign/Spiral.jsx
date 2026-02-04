import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Spiral.module.css';

// Import local images
import screenshot1 from '../../../assets/Spiral/screenshot1.jpg';
import screenshot2 from '../../../assets/Spiral/screenshot2.jpg';
import flirt1 from '../../../assets/Spiral/flirt1.jpg';
import flirt2 from '../../../assets/Spiral/flirt2.jpg';
import flirt3 from '../../../assets/Spiral/flirt3.jpg';
import flirt4 from '../../../assets/Spiral/flirt4.jpg';
import flirt5 from '../../../assets/Spiral/flirt5.jpg';
import flirt6 from '../../../assets/Spiral/flirt6.jpg';

import richa1 from '../../../assets/Spiral/richa1.jpg';
import richa2 from '../../../assets/Spiral/richa2.jpg';
import richa3 from '../../../assets/Spiral/richa3.jpg';
import richa4 from '../../../assets/Spiral/richa4.jpg';
import richa5 from '../../../assets/Spiral/richa5.jpg';
import richa6 from '../../../assets/Spiral/richa6.jpg';
import richa7 from '../../../assets/Spiral/richa7.jpg';
import richa8 from '../../../assets/Spiral/richa8.jpg';
import richa9 from '../../../assets/Spiral/richa9.jpg';
import richa10 from '../../../assets/Spiral/richa10.jpg';
import richa11 from '../../../assets/Spiral/richa11.jpg';

const Butterfly = ({ className, type }) => {
    // Helper to render butterfly SVGs based on type
    const defs = {
        1: (
            <>
                <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: '#ff00cc', stopOpacity: 1 }} />
                        <stop offset="60%" style={{ stopColor: '#6600cc', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#330066', stopOpacity: 1 }} />
                    </radialGradient>
                    <filter id="glow1">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g className={styles.butterflyWings} filter="url(#glow1)">
                    <path d="M50,52 C35,25 10,20 5,40 C0,60 30,70 50,65 C70,70 100,60 95,40 C90,20 65,25 50,52" fill="url(#grad1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                    <path d="M50,65 C35,75 20,90 25,95 C30,100 45,90 50,75 C55,90 70,100 75,95 C80,90 65,75 50,65" fill="url(#grad1)" opacity="0.9" />
                </g>
            </>
        ),
        2: (
            <>
                <defs>
                    <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
                        <stop offset="70%" style={{ stopColor: '#0000ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#000033', stopOpacity: 1 }} />
                    </radialGradient>
                </defs>
                <g className={styles.butterflyWings}>
                    <path d="M50,52 C32,22 8,18 4,38 C-2,58 28,68 50,63 C72,68 102,58 96,38 C92,18 68,22 50,52" fill="url(#grad2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                    <path d="M50,63 C35,73 15,88 20,93 C25,98 40,88 50,73 C60,88 75,98 80,93 C85,88 65,73 50,63" fill="url(#grad2)" opacity="0.9" />
                </g>
            </>
        ),
        3: (
            <>
                <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#66ff66', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#00cc00', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#003300', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <g className={styles.butterflyWings}>
                    <path d="M50,52 C35,25 10,20 5,40 C0,60 30,70 50,65 C70,70 100,60 95,40 C90,20 65,25 50,52" fill="url(#grad3)" stroke="#ffff00" strokeWidth="0.3" strokeOpacity="0.5" />
                    <path d="M50,65 C35,75 20,90 25,95 C30,100 45,90 50,75 C55,90 70,100 75,95 C80,90 65,75 50,65" fill="url(#grad3)" opacity="0.9" />
                </g>
            </>
        ),
        4: (
            <>
                <defs>
                    <radialGradient id="grad4" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#ffcc00', stopOpacity: 1 }} />
                        <stop offset="60%" style={{ stopColor: '#ff6600', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#cc0000', stopOpacity: 1 }} />
                    </radialGradient>
                </defs>
                <g className={styles.butterflyWings}>
                    <path d="M50,52 C35,25 10,20 5,40 C0,60 30,70 50,65 C70,70 100,60 95,40 C90,20 65,25 50,52" fill="url(#grad4)" stroke="black" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M50,65 C35,75 20,90 25,95 C30,100 45,90 50,75 C55,90 70,100 75,95 C80,90 65,75 50,65" fill="url(#grad4)" opacity="0.9" />
                </g>
            </>
        ),
        5: (
            <>
                <defs>
                    <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ffccff', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#cc99ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#9966ff', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <g className={styles.butterflyWings}>
                    <path d="M50,52 C35,25 10,20 5,40 C0,60 30,70 50,65 C70,70 100,60 95,40 C90,20 65,25 50,52" fill="url(#grad5)" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
                    <path d="M50,65 C35,75 20,90 25,95 C30,100 45,90 50,75 C55,90 70,100 75,95 C80,90 65,75 50,65" fill="url(#grad5)" opacity="0.8" />
                </g>
            </>
        ),
        6: (
            <>
                <defs>
                    <radialGradient id="grad6" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: '#fff700', stopOpacity: 1 }} />
                        <stop offset="60%" style={{ stopColor: '#ffaa00', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ff4500', stopOpacity: 1 }} />
                    </radialGradient>
                </defs>
                <g className={styles.butterflyWings}>
                    <path d="M50,52 C35,25 10,20 5,40 C0,60 30,70 50,65 C70,70 100,60 95,40 C90,20 65,25 50,52" fill="url(#grad6)" />
                    <path d="M50,65 C35,75 20,90 25,95 C30,100 45,90 50,75 C55,90 70,100 75,95 C80,90 65,75 50,65" fill="url(#grad6)" opacity="0.9" />
                </g>
            </>
        )
    };

    return (
        <div className={`${styles.butterfly} ${className}`}>
            <svg viewBox="0 0 100 100">
                {defs[type]}
                <ellipse cx="50" cy="60" rx="2" ry="12" className={styles.butterflyBody} />
                <path d="M48,48 Q40,35 35,40 M52,48 Q60,35 65,40" className={styles.butterflyAntennae} />
            </svg>
        </div>
    );
};

const Spiral = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 5; // Cover, Page 1, Page 2, Page 3, Page 4

    const flipPage = (direction) => {
        if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'back' && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Swipe Handling
    const touchStart = useRef({ x: 0, y: 0 });
    const isScrolling = useRef(false);

    const handleTouchStart = (e) => {
        touchStart.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
        isScrolling.current = false;
    };

    const handleTouchMove = (e) => {
        const touchY = e.changedTouches[0].screenY;
        if (Math.abs(touchY - touchStart.current.y) > 10) {
            isScrolling.current = true;
        }
    };

    const handleTouchEnd = (e) => {
        if (isScrolling.current) return;
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStart.current.x - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) flipPage('next');
            else flipPage('back');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.butterfliesContainer}>
                <Butterfly className={styles.butterfly1} type={1} />
                <Butterfly className={styles.butterfly2} type={2} />
                <Butterfly className={styles.butterfly3} type={3} />
                <Butterfly className={styles.butterfly4} type={4} />
                <Butterfly className={styles.butterfly5} type={5} />
                <Butterfly className={styles.butterfly6} type={6} />
            </div>

            <div className={styles.notebookContainer}>
                <div
                    className={styles.notebook}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.spiral}>
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className={styles.spiralRing}></div>
                        ))}
                    </div>

                    {/* Cover Page */}
                    <div
                        className={`${styles.page} ${styles.cover} ${currentPage > 0 ? styles.flipped : ''}`}
                        onClick={() => currentPage === 0 && flipPage('next')}
                    >
                        <div><span className={styles.emoji}>Pirachiii.........💖✨</span></div>
                        <div className={styles.coverSubtitle}>Maybe this one is LaSt.....</div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={`${styles.page} ${currentPage > 1 ? styles.flipped : ''}`}
                        onClick={() => currentPage === 1 && flipPage('next')}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>1</div>
                            <p><span className={styles.emoji}>🌟</span> <span className={styles.highlight}>Sab kuch ekdum subtle/majak wale way me h, tension me mat jana bilkul bhi 🔪 </span></p>
                            <p>Hellewwwwwwwwww pirachiii😜, Buri tarah thaki hogi tumm..., yaha jao waha jao, ye karo wo karo.</p>
                            <p>Tabiyat mat bigad lena bs. Thand to waise hi h (Khud ko superman mat samajh lena chupchaap sweater pehen lena). Kya likhu ab 😂 Bohot jorrr se nind aa rhi h ab to, aloo ke parontheeee lapet ke betha hu isiliyeee... 🐣 Are haa me bata rha tha ki shyd... se maybee.... I got a lot of control over myself regarding youu...</p>
                            <p>Noww... If I wish, me tumhare notifications ko bhi avoid kar sakta hu 😼😏😎</p>
                            <p>Thoda extra busy rehne ki kosish aur thoda sa meditation. Tumne hi bola tha ek baar, tab kuch kaam nhi kiya tha lekin iss baar ho rha h. Shyd pahle me man se nhi kar rha tha -_- </p>
                            <p>You are Truely, a Lovely Girl🐼💖</p>
                            <p>Pichle itne saalon me mene bohot cheezen try kari thi, anukriti ne to suggest kara tha ki me tumhara bura character arc imagine karu tabhi kuch hoga warna aise hi fasa rahega.</p>
                            <p>Lekin my heart never accepted your dark face(Maybe I never wanted to accept it). Ye wala way jyada accha h . Ab me tumhe roast bhi kar paaunga 😎</p>
                            <p>Bina dimag wale Praniiii....🐣, aisa nhi rehta re ki me hamesha snap pe betha rehta hu😂. Wo ye h ki mene naaa sabke notifications "OFF"📴 kar rakhe h, except yours 🫵.</p>
                            <p>Saare APPS Ke band rehte h, Or mera internet bhi hamesha connected rehta h tooo, um jab kuch bhejti ho to ek hi notification rehta h..., "Pirachiii🤪" is Typing.... to mere se control nhi hota tha🐣😂 or me dekh leta hu... tap karke. ("Lekin mujhe bohot accha lagta h tum mujhe bata deti ho jo bhi lagta h to 🦥🐼")</p>
                            <p>Bohot kaam rehta h reeee, collage ka padho, skills gather karo, khana banao-bartan-waherah, fir Freelancing, yt dekho apna, apne dream ke liye kuch karo, koi help maange to woo karo, apne mn ka kuch seekho, etc etc. </p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={`${styles.page} ${currentPage > 2 ? styles.flipped : ''}`}
                        onClick={() => currentPage === 2 && flipPage('next')}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>2</div>
                            <p><span className={styles.emoji}>🦥</span> <span className={styles.highlight}>Hey You Girl...</span></p>
                            <p> . </p>
                            <img src={screenshot1} className={styles.img} alt="A picture of me smiling" />
                            <p>Ye dekho, almost sabki band h bs family ko chhorkee... 🦥🦥 </p>
                            <img src={screenshot2} className={styles.img} alt="A picture of me smiling" />
                            <p>Ye smackchie anukriti h👾</p>
                            <p>Or meri bye or byeeeeeeeeeeeeeee.... me bohot antar rehta h 🐣😂</p>
                            <p>Kaafi unanswered questions h mere dimag me abhi bhi😂. Us se yaad jaroor aajati h tumhari..</p>
                            <p>Tum janti ho mujhe tumhari itni fikar kyun rehti h???</p>
                            <p>It is because I know how it feels.</p>
                            <p>I care for all of you because I know the importance of being cared...</p>
                            <p>I provide you instant replies because there was a time I was ignored and left alone....</p>
                            <p>Samne se bhiiii... isiliye poochta hu, are you okkk (you can exrpress if you're not). I always get some visions, sabse poochta hu (satyam, arindam, you)</p>
                            <p>For me, everything holds a deep meaning, that's why I value you so much... </p>
                            <p>Tum ye shaadi se free ho, fir dekh lunga me tumheee 🔪</p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        className={`${styles.page} ${currentPage > 3 ? styles.flipped : ''}`}
                        onClick={() => currentPage === 3 && flipPage('next')}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>3</div>
                            <p><span className={styles.emoji}>🎨</span> <span className={styles.highlight}>My Love Language Is "Code"</span></p>
                            <p>Ab tum dekho, jo me sochta hu uska kuch na kuch bana deta hu🦥, dost nhi thee to mera bro bana liya tha, kaam jyada rehte h isliye AI Agents. Tumhara clone bhi banaya tha mene (yaad karo wo neural networks ka poocha tha mene), yaad ho toooo... mene galati se wo snap tumko bhej diya tha or tumne save kar liye tha fir mene delete kar diya tha, Lekin wo clone exactly tumhari copy nhi ban paaiii thi... , kosish rahegi is baar ho jaaye chuttiyon me.Tum conversation se dar rhi thi to wo pages bana diyee. Ab kuch aur banaunga padh padh kee.... Aur wo mail ek tareeka tha... Tumtak wo Webpage ki link bhejne ke liye 🐣😜. Kyuki baaki platforms me tum mera message nhi dekh rhi thiii... 👾</p>
                            <p>Ha ha maan lo maan lo🐣, Me bohot intellignet hu 😼😏😎. Tum idiot ho 😎</p>
                            <p>Tum cashmish 🥸 ho aur meri ankhen telescope🔭</p>
                            <p>Tum tingu 😼👾🐣 Me lambu 😎🐼</p>
                            <p>Tareef karne ka mn to thaaa, lekinn.. tum bhadak jaati ho 🦥🦥 fir bhi peshhhhhh..... h yeeee......</p>
                            <img src={flirt1} className={styles.img} alt="A picture of me smiling" />
                            <img src={flirt2} className={styles.img} alt="A picture of me smiling" />
                            <img src={flirt3} className={styles.img} alt="A picture of me smiling" />
                            <img src={flirt4} className={styles.img} alt="A picture of me smiling" />
                            <p>Is gobhi ki sabzi bana ke mujhe parcel kardo mujhe bhook lagiii h 🐼🐣</p>
                            <p>Or ye lo tumhari fees 👇👇</p>
                            <img src={flirt5} className={styles.img} alt="A picture of me smiling" />
                            <img src={flirt6} className={styles.img} alt="A picture of me smiling" />
                            <p>Hehe Tumse itna door hu ki tum meri kutai bhi nhi kar sakti 🐣😜</p>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div
                        className={`${styles.page} ${currentPage > 4 ? styles.flipped : ''}`}
                        onClick={() => currentPage === 4 && flipPage('next')}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>4</div>
                            <p><span className={styles.emoji}>🌙</span> <span className={styles.highlight}>Arey yr iska kya karuu😭😭</span></p>
                            <p>Isko mene 2 saal pahle mana kiya tha jb isne mujhe approach kara tha to, ye abhi bhi yahi h 🥸</p>
                            <img src={richa1} className={styles.img} alt="A picture of me smiling" />
                            <p>Maje aayenge padhne me dekh lena iski baaten 🦥🦥 </p>
                            <img src={richa2} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa3} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa4} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa5} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa6} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa7} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa8} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa9} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa10} className={styles.img} alt="A picture of me smiling" />
                            <img src={richa11} className={styles.img} alt="A picture of me smiling" />
                            <p>Me kabad bhi bohot ikkatha karta thaa... jaise ki koi book jo kisi ne dii ho, mere papa ne 3 saal pahle perfume ki bottle di thi, mene abhi tak sambhal ke rakhi h....</p>
                            <p>Tumhari wo kharab photo, mene ye wali choose hi isiliye kari thi taaki tumhe farak naa pade, nhi to ek se ek thiii mere pass...😂 (Or dekho ye sab mene khud tumko bataya tha, aisa nhi ki kisi aur se pata chala ho... to tum mere se kuch bhi poochogi me bata dunga.)</p>
                            <p>Batana zaroor ye wali design kaisi lagi 🧸 , ha ha isme change h check karo or dekhoo...</p>
                            <p>I'll wait............................. </p>
                            <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '24px' }}>✨ Chalo jao reeee ✨</p>
                        </div>
                    </div>

                    <div className={styles.controls}>
                        {currentPage === 0 ? (
                            <button
                                className={styles.btn}
                                onClick={() => navigate('/')}
                            >
                                ← Exit
                            </button>
                        ) : (
                            <button
                                className={styles.btn}
                                onClick={() => flipPage('back')}
                                disabled={currentPage === 0}
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            className={styles.btn}
                            onClick={() => flipPage('next')}
                            disabled={currentPage === totalPages - 1}
                        >
                            {currentPage === totalPages - 1 ? 'Finished ✓' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Spiral;
