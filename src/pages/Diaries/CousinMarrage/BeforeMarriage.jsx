import React, { useState, useRef } from 'react';
import styles from './BeforeMarriage.module.css';

const BeforeMarriage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 6; // Cover (0) + 5 content pages

    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    const handleFlip = (direction) => {
        if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'back' && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleTouchStart = (e) => {
        touchStart.current = e.targetTouches[0].clientX;
        touchEnd.current = null;
    };

    const handleTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleFlip('next');
        } else if (isRightSwipe) {
            handleFlip('back');
        }
    };

    const handlePageClick = (index) => {
        if (index === currentPage && currentPage < totalPages - 1) {
            handleFlip('next');
        }
    };

    // Helper to determine if a page should be flipped
    const getPageClass = (index) => {
        const baseClass = styles.page;
        if (index < currentPage) {
            return `${baseClass} ${styles.flipped}`;
        }
        return baseClass;
    };

    // Z-index helper: Lower index pages should be on top when not flipped ?? 
    // Actually, in a stack:
    // Page 0 (Cover) is on top. z-index: 6
    // Page 1 is below. z-index: 5
    // ...
    // When Page 0 flips, Page 1 becomes visible.
    // So we need decreasing z-index.
    const getZIndex = (index) => {
        return totalPages - index + 5;
    };

    return (
        <div className={styles.container}>
            <div className={styles.backgroundAnimation}></div>

            <div className={styles.notebookContainer}>
                <div
                    className={styles.notebook}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className={styles.spiral}>
                        {[8, 20, 32, 44, 56, 68, 80, 92].map((top, i) => (
                            <div key={i} className={styles.spiralRing} style={{ top: `${top}%` }}></div>
                        ))}
                    </div>

                    {/* Cover Page (Index 0) */}
                    <div
                        className={`${getPageClass(0)} ${styles.cover}`}
                        style={{ zIndex: getZIndex(0) }}
                        onClick={() => handlePageClick(0)}
                    >
                        <div>Billu Bilote ki Book<span className={styles.emoji}>✨</span></div>
                        <div className={styles.coverSubtitle}>Aaiii mene banai h 😒. Thodi tareef to banti h</div>
                    </div>

                    {/* Page 1 */}
                    <div
                        className={getPageClass(1)}
                        style={{ zIndex: getZIndex(1) }}
                        onClick={(e) => handlePageClick(1, e)}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>1</div>
                            <p><span className={styles.emoji}>🌟</span> <span className={styles.highlight}>Hey there!</span></p>
                            <p>Hellewwwwwwwwwwww Prachiiii, jab mene bola tha ki tum kitni acchii ho, mera bohot mn kar rha tha tumhari khoob saariii tareef karne kaa..😂😁 </p>
                            <p>Lekin fir shaam ko mene socha chhoro yr😂, kuch kuch socha, fir kuch kuch aurrr socha, or ruk gaya..</p>
                            <p>Tum to aaj bhi utni hi idiot or bewakoof lagti ho door se jitni tab lagti thi jab apan sab coaching aate the😂, Lekin ho to innocent or rare❤️ </p>
                            <p>Tum yr pata nhi kis duniya se aai ho 😂, agar 21 century ke doraemon ho to gadget dedo🫲🫲</p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        className={getPageClass(2)}
                        style={{ zIndex: getZIndex(2) }}
                        onClick={(e) => handlePageClick(2, e)}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>2</div>
                            <p><span className={styles.emoji}>💭</span> <span className={styles.highlight}>Thoughts</span></p>
                            <p>Ek to meri poori sigma personality ki dhajiya ud jaati h tumhare samne  😂</p>
                            <p>Koi itni bholi or saaf mn ki ladki kaise ho sakti yr😒, sab ko dekhta hu fi tumhara sochta hu to lagta h iska mn kitne patience ke saath design kara hoga bhagwan ne❤️</p>
                            <p>Mujhe to ye samajh nhi ata ki tumhare pass option bhi tha, lekin tum jaane ki jagah wapis aake text kar diyaa, shyd us time tum sirf bohot gussa thi mere se, aurrr me tumhe time time pe gussa dilata rahunga😁</p>
                            <p>Agar wo Lahenga pink h to bs kisi ke compliment ki jaroorat nhi, pink colour tumhare liye hi bana h 😂❤️ </p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        className={getPageClass(3)}
                        style={{ zIndex: getZIndex(3) }}
                        onClick={(e) => handlePageClick(3, e)}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>3</div>
                            <p><span className={styles.emoji}>🎨</span> <span className={styles.highlight}>Isme scroll ka option h BTW</span></p>
                            <p>Tumko to makeup ki bhi jaroorat nhi 😂, bs lip-balm lagao aur all set....</p>
                            <p>Aur us se yaad aya ki apne lips ka dhyn rakhna 😂. Itne lambe h aur tumpe suit karte h. Mere to thandi ki wajah se patthar jaise kadak ho gaye the🪨 abhi sahi kare h 😂 tum lipstick 💄 laga lena.</p>
                            <p>Aur wo saturday ko me kuch bhejne wala tha lekin nhi bheja tha. Meri baat hui thi meri ek dost se. Adha ghanta baat kari or last me usne 2 naam le liye, Tumhara or chanchal ka. Ki wo dono kaisi h 😐 Meri to fat gai thi 😂 tumhara naam sunke. Mujhe sab kuch yaad aya uske call ke baad, ki mene kitni bekar situations create kardi😐 Lekin tum fir bhi bhagi nhi😂</p>
                            <p>Me sachme manta hu mene bohot galat kara, lekin ye us sab ke samne kuchh nhi jo mene kuch doore log ke saaath kari, lekin atleast sab sahi h mere hard descisions ke baad( tumhe batana tha lekinnn nhiiii)</p>
                            <p>Kabhi kabhi lagta h me bohot bura hu. Lekin mere se koi nhi bolta me bura hu😂 sab ke liye kuch na kuch accha karta hu unke hisab se❤️ </p>
                            <p>Tumhare liye bhi me kuch to karungaaa, debt me hu aisa feel hota h kabhi kabhi. You don't know tumne mujhe kya diya h. </p>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div
                        className={getPageClass(4)}
                        style={{ zIndex: getZIndex(4) }}
                        onClick={(e) => handlePageClick(4, e)}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>4</div>
                            <p><span className={styles.emoji}>🌙</span> <span className={styles.highlight}>Midnight Musings</span></p>
                            <p>Tum thodi kamzoor lag rhi thi. Thoda dhyn rakha karo khaane peene pe or rest lene me (rest ka bol bhi kaun rha h 😂) </p>
                            <p>Aur haa mera ye mtlb bilkul nhi h ki tum sundar nhi ho, you are a literal ferry🦋🕊️ Sundar bhi ho aur saath hi saath hadddd se jyada kind❤️ (jo tumhare alawa mene kisi me itni nhi dekhi)</p>
                            <p>Ab tum to ye socho ki ready kasie hona h 😂 Me poochunga ki kitne ladkon ne approach kara 😏😏. Maje bhi lunga 😹😼</p>
                            <p>Dekho bs khaane peene pe dhyn do thoda. Or padhai karo 2 ghante daily. Aur neet clear hoga ya nhi iski tension mat liya karo. Tum agar kuch naa kar paaao or motivation khatam hone lage to me tumhe acchi acchi cheezen sikhaunga fir. Lekin mujhe lagta nhi h iski naubat aayegi, mujhe to intezaar h vprachiii ke daily vlog ka. </p>
                        </div>
                    </div>

                    {/* Page 5 */}
                    <div
                        className={getPageClass(5)}
                        style={{ zIndex: getZIndex(5) }}
                        onClick={(e) => handlePageClick(5, e)}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>5</div>
                            <p><span className={styles.emoji}>💫</span> <span className={styles.highlight}>Ab kya book banvaogi ise😂</span></p>
                            <p>Haaa Haaa me book zaroor likhunga ya likh rha hu (tumko thodi bataunga). Publish karunga jab me kuch major achieve karunga, itna to banta h yr😂</p>
                            <p>Oye or asia nhi h ki mere pass bohot khaali waqt h, aisa bhi nhi h ki me isme barbaad kar rha hu. "🧸This is a thing that I really like to do🧸" aur isiliye me time nikal ke ye banata hu aur online publish kar deta hu🐣🐤🐥</p>
                            <p>Tum padhti ho to accha bhi lagta fir 😂🧸 </p>
                            <p>Or agar meri is chhoti si cheez se meri Little Angle Miss ka din accha ho sakta h to, why not to built it!!</p>
                            <p>Batana zaroor ye wali design kaisi lagi 🧸 I'll wait </p>
                            <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '24px' }}>✨ Chalo jao reeee ✨</p>
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button
                            className={styles.button}
                            disabled={currentPage === 0}
                            onClick={(e) => { e.stopPropagation(); handleFlip('back'); }}
                        >
                            ← Back
                        </button>
                        <button
                            className={styles.button}
                            disabled={currentPage === totalPages - 1}
                            onClick={(e) => { e.stopPropagation(); handleFlip('next'); }}
                        >
                            {currentPage === totalPages - 1 ? 'Finished ✓' : 'Next →'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BeforeMarriage;
