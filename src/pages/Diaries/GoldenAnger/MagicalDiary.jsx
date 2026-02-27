import React, { useEffect, useRef, useState } from "react";
import styles from "./MagicalDiary.module.css";

export default function MagicalDiary() {
    const firefliesRef = useRef(null);
    const pagesRef = useRef([]);
    const [opened, setOpened] = useState(false);

    /* Fireflies setup */
    useEffect(() => {
        const container = firefliesRef.current;
        if (!container) return;

        // Clear existing to prevent duplicates if strict mode doubl-invokes
        container.innerHTML = '';

        for (let i = 0; i < 40; i++) {
            const f = document.createElement("div");
            f.className = styles.firefly;
            f.style.left = Math.random() * 100 + "%";
            f.style.top = Math.random() * 100 + "%";
            f.style.animationDelay = Math.random() * 5 + "s";
            f.style.animationDuration = Math.random() * 10 + 10 + "s";
            container.appendChild(f);
        }
    }, []);

    /* Initial Page Stacking */
    useEffect(() => {
        // pagesRef.current might have nulls if filtering happens, but here we map clearly
        pagesRef.current.forEach((page, index) => {
            if (page) {
                // Total pages is 6 (Cover + 5)
                // zIndex = totalPages - index
                page.style.zIndex = 6 - index;
            }
        });
    }, []);

    const flipForward = () => {
        // Find first unflipped page
        for (let i = 0; i < pagesRef.current.length; i++) {
            const page = pagesRef.current[i];
            if (page && !page.classList.contains(styles.flipped)) {
                page.classList.add(styles.flipped);
                // Move to top of left stack (100 + i)
                page.style.zIndex = 100 + i;
                break; // Only one at a time
            }
        }
    };

    const flipBack = () => {
        // Find last flipped page
        for (let i = pagesRef.current.length - 1; i >= 0; i--) {
            const page = pagesRef.current[i];
            if (page && page.classList.contains(styles.flipped)) {
                page.classList.remove(styles.flipped);
                // Restore original z-index
                page.style.zIndex = 6 - i;
                break;
            }
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!opened) return;
            if (e.key === "ArrowRight") flipForward();
            if (e.key === "ArrowLeft") flipBack();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [opened]);

    return (
        <div className={styles.appRoot}>
            <div className={styles.stars} />
            <div className={styles.glowOverlay} />
            <div ref={firefliesRef} className={styles.fireflies} />

            {/* Tutorial Overlay */}
            {!opened && (
                <div className={styles.tutorialOverlay}>
                    <div className={styles.tutorialText}>Welcome, Prachi</div>
                    <div className={styles.tutorialSub}>
                        A small collection of unspoken thoughts...
                    </div>
                    <button
                        className={styles.enterBtn}
                        onClick={() => setOpened(true)}
                        aria-label="Open diary"
                    >
                        Open Diary
                    </button>
                </div>
            )}

            {/* Notebook Container */}
            <div
                className={`${styles.notebookContainer} ${!opened ? styles.closed : ""
                    }`}
            >
                <div className={styles.helperText}>
                    Tap Right side to Next • Tap Left side to Back
                </div>

                <div className={styles.notebook}>
                    {/* Spiral */}
                    <div className={styles.spiral}>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={styles.spiralRing} />
                        ))}
                    </div>

                    {/* Pages */}
                    {/* Page 0: Cover */}
                    <div
                        ref={el => pagesRef.current[0] = el}
                        className={`${styles.page} ${styles.cover}`}
                        onClick={() => pagesRef.current[0]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.coverTitle}>Prachi Devi</div>
                            <div className={styles.coverSubtitle}>
                                Things I don't wanna tell
                            </div>
                        </div>
                    </div>

                    {/* Page 1 */}
                    <div
                        ref={el => pagesRef.current[1] = el}
                        className={styles.page}
                        onClick={() => pagesRef.current[1]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>1</div>
                            <p>Prachi (instead of Prachiii), ✨</p>
                            <p>
                                Dekho mujhe nhi pata tumhe kya, kaisa or kyun feel hua, bs itna saaf h shyd tumhe koi saccha
                                insaan nhi dikha. Or uske liye I could hardly be blamed for your dissapointment.
                            </p>
                            <p>
                                Haan ye to sach h, ki tumhari jagah thodi upar thi unlog se bhi. Lekin aisa nhi h ki me unke
                                texts ghanton tk latka ke rakhu ya shaam ko dekhu. Unlog ke me turant hi dekhta hun. Or tumse
                                bhi to me bolta hi rha naa ki jao kaam karlo. Ab tumhra mn ho to batiyaooooo.... nhi to
                                jaoooo.... mera to aisa rehta h ki me bs kar leta hu sab parallaly. Or me bohot km logon se
                                interact karna pasand karta hu.
                            </p>
                            <p className={styles.highlight}>"Me kisi ko as an option treat nhi karta..."</p>
                            <p>
                                (For me conversation is a form of respect, and if I can, then why would I make them wait for so
                                long.)
                            </p>
                        </div>
                    </div>

                    {/* Page 2 */}
                    <div
                        ref={el => pagesRef.current[2] = el}
                        className={styles.page}
                        onClick={() => pagesRef.current[2]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>2</div>
                            <p>
                                Ab agar kisi ko koi emergency ho or me shaam tk latka ke rakhu to kya hi hoga unka?? or bs aisa
                                hota rehta h.
                            </p>
                            <p>
                                Ab jab mene dekha tha ki "prachi has not added you as a friend, they won't be able to see your
                                messages until they do"
                            </p>
                            <p>
                                Ye dekh ke thoda ajeeb sa to laga tha, gussa nhi aya ekdum se. Wo baad me aya tha. Lekin me bohot
                                jyada busy tha or continous nuksaan hi jhel rha tha pichle din se to itna jyada impact nhi pada
                                initially. Kuch ghant baad gussa aya tha prachi pe fir khud pe.
                            </p>
                            <p className={styles.highlight}>
                                Sote Time jaroor Dimag kharab ho gaya tha mera.... wo overthinking wala phase
                                tabhi shuru hota h.
                            </p>
                        </div>
                    </div>

                    {/* Page 3 */}
                    <div
                        ref={el => pagesRef.current[3] = el}
                        className={styles.page}
                        onClick={() => pagesRef.current[3]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>3</div>
                            <p>
                                Kher mene ye notification dekha tha wo calender wala tab 50% gussa khatam ho gaya tha(tumahre
                                liye),
                                baaki 50% tumhare wo text ke baad, tumhare upar nhi h ab koi naragzi.
                            </p>
                            <p>
                                Agar hoti to me tumahre texts nhi dekhta. Kya pata itne jaldi thanda kyun ho jata hu me. Ab gussa
                                bs mujhe mere upar aa rha h.
                            </p>
                            <p>
                                <i>Dekho prachi, abhi me bs confused hu ki me kya karu. Mere dimag me countless possibilities h,
                                    to me kya kya soch ke kya hi chunu, ek to aisa hota kyun h ki mere prediction specifically
                                    tumhare samne hamesha fail hote h. To me nhi janta ki what should I do next.</i>
                            </p>
                            <p className={styles.highlight}>
                                "Agar tum meri friendship nhi chahti to tum hata sakti ho, me kuch nhi bolne
                                wala..., na hi naraz hone wala.... Telegram khula h mera tumhare liye."
                            </p>
                            <p>
                                I was just trying to be the best temporary person of your life. Or haa meri decided lifespan km h
                                isliye me nhi milunga tumse baad me.
                            </p>
                            <p className={styles.highlight}>However you'll recieve something GREAT before I leave.</p>
                        </div>
                    </div>

                    {/* Page 4 */}
                    <div
                        ref={el => pagesRef.current[4] = el}
                        className={styles.page}
                        onClick={() => pagesRef.current[4]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <div className={styles.pageNumber}>4</div>
                            <p className={styles.highlight}>
                                Ab mene tumko kabhi whatsapp pe text nhi kara/ call bhi nhi kara kabhi, uska karan ye h
                                kii wo
                                tumhari personal space hai. Or me aisi koi cheez acceot nhi kar sakta jis se tumhe takeef ho. Wo
                                instagram pe bhi isiliy mene mana kar diya tha, kyuki tum enthusisam me aake bina jyada soche
                                maang rhi thi. To mujhe pata tha ye baad me regret karegi to mene samne se hi bol diya ki follow
                                mat karna.
                            </p>
                            <p>
                                Or me bohot hard hu bahar walon ke liye. Serious face or extra serious responses hi milte h unko.
                                Tumko ordinary banna h to theek h fir, thoda mushkil h lekin kar hi dunga me tumhare liye🫡
                            </p>
                            <p>
                                Or mene wo jo sab banaya tha sherlock se bolke trash kara diya. to wo kuch nhi bhejega. Christmas
                                newyear kuch nhii, wo webapp bhi delete kar diya hoga shyd usne.
                            </p>
                        </div>
                    </div>

                    {/* Page 5 (Back Cover / Final Thoughts) */}
                    <div
                        ref={el => pagesRef.current[5] = el}
                        className={`${styles.page} ${styles.backCover}`}
                        onClick={() => pagesRef.current[5]?.classList.contains(styles.flipped) ? flipBack() : flipForward()}
                    >
                        <div className={styles.pageContent}>
                            <p
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "3px",
                                    color: "#ffd700",
                                    marginBottom: "10px"
                                }}
                            >
                                Final Thoughts
                            </p>
                            <p>
                                Me janta hu tumne mere chakkar me bohot overthinking kari hogi. Dekho me nhi chahta tum bhi is
                                beemari ka shikar ban jao. Isiliye me CLEAR kar rha hu ki me tumse 1% bhi naraz nhi hu, you are
                                free to move!
                            </p>

                            <p>
                                <i>"Or is waqt me bohot jyada gusse me hu (Tumhara koi role nhi usme, wo bs meri khudki wajah se
                                    h)..."</i>
                            </p>

                            <p>
                                Kyuki mene tumhe ya kisi ko bhi bura feel karaya to meri chest me firse wo ajeeb sa lagne lagega.
                                Isiliye I am
                                thinking to walk away, ab tum batao tumhare kya vichar h. I think we should have a serious TRUTH
                                AND DARE SESSION
                            </p>
                            <p>
                                Or haa me chahunga tum ye notebook doobara padho ek baar mere perspective se or fir bhool jao
                                sab. Agar tumne soch samajh ke ye sab nhi kiya to mere hisab se wo bs ek mood swing tha. To tum
                                bs apni state or mind ko calm rakho or udas mat hona kisi faltoo mood swing ke impact se. Lekin
                                agar wo mood swing nhi tha to ho sakti ho!!
                            </p>
                            <p className={styles.highlight}>
                                Tum padho chupchaap or chill karo 🐼 Faltoo cheezon ki chinta karne ki jaroorat
                                nhi h.
                            </p>

                            <div className={styles.finalSignature}>Bye 🌟 Bye</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Navigation Zones (Mobile/Easy access) */}
            {opened && (
                <>
                    <div
                        className={`${styles.navZone} ${styles.left}`}
                        onClick={flipBack}
                        aria-label="Previous page"
                    />
                    <div
                        className={`${styles.navZone} ${styles.right}`}
                        onClick={flipForward}
                        aria-label="Next page"
                    />
                </>
            )}
        </div>
    );
}
