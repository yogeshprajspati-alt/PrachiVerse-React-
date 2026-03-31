import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './Home.module.css';
import { dashboardData } from '../../data/dashboardData';
import { staggerContainerVariant, staggerItemVariant, scrollRevealVariant, customEasing } from '../../animations/variants';

const MotionA = motion.a;

const CategorySection = ({ category }) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.section
            className={styles.categorySection}
            variants={shouldReduceMotion ? {} : scrollRevealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <span className={styles.categoryCount}>{category.count}</span>
            </div>

            <motion.div
                className={styles.cardsGrid}
                style={{ perspective: '1200px' }}
                variants={shouldReduceMotion ? {} : staggerContainerVariant}
            >
                {category.items.map((item, idx) => {
                    const isInternal = !item.isExternal;

                    const innerContent = (
                        <div className={styles.cardContent}>
                            <span className={styles.cardIcon}>{item.icon}</span>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardDescription}>{item.description}</p>
                            <div className={styles.cardMeta}>
                                <span className={styles.cardDate}>{item.date}</span>
                                <span className={styles.cardBadge}>{item.badge}</span>
                            </div>
                        </div>
                    );

                    return (
                        <motion.div
                            key={idx}
                            variants={shouldReduceMotion ? {} : staggerItemVariant}
                            whileHover={shouldReduceMotion ? {} : {
                                scale: 1.03,
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                transition: { type: "tween", ease: customEasing, duration: 0.2 }
                            }}
                            whileTap={shouldReduceMotion ? {} : {
                                scale: 0.97,
                                transition: { type: "tween", ease: customEasing, duration: 0.1 }
                            }}
                        >
                            {isInternal ? (
                                <Link to={item.link} className={styles.card}>
                                    {innerContent}
                                </Link>
                            ) : (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.card}>
                                    {innerContent}
                                </a>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
};

CategorySection.displayName = 'CategorySection';

const Home = () => {
    const shouldReduceMotion = useReducedMotion();
    const { scrollY } = useScroll();

    // Parallax effects for Hero
    const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Logic for floating particles
    const [particles] = useState(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 20 + 's',
            duration: (15 + Math.random() * 10) + 's'
        }))
    );

    return (
        <div className={styles.homeContainer}>
            <div className={styles.bgAnimation}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={styles.floatingParticle}
                        style={{
                            left: p.left,
                            animationDelay: p.delay,
                            animationDuration: p.duration
                        }}
                    />
                ))}
            </div>

            <motion.header
                className={styles.header}
                style={{ y: heroY, opacity: heroOpacity }}
            >
                <h1 className={styles.mainTitle}>✨Prachiii Verse✨</h1>
                <p className={styles.subtitle}>A Collection of Digital Memories & Beautiful Moments</p>
            </motion.header>

            <main className={styles.main}>
                {dashboardData.map((category, index) => (
                    <CategorySection key={index} category={category} />
                ))}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>

                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>✨ Prachiii Verse ✨</div>
                        <p className={styles.footerTagline}>Where Every Memory Sparkles</p>
                    </div>

                    <div className={styles.footerLinks}>
                        <a href="#" className={styles.footerLink}>Home</a>
                        <a href="#diaries" className={styles.footerLink}>Diaries</a>
                        <a href="#birthday" className={styles.footerLink}>Birthday Projects</a>
                        <a href="#special" className={styles.footerLink}>Special Occasions</a>
                        <a href="#utilities" className={styles.footerLink}>Utilities</a>
                    </div>

                    <div className={styles.footerDivider}></div>

                    <div className={styles.footerBottom}>
                        <div className={styles.footerMessage}>
                            <span>Let no guilt touch your joy<br />— you are worthy of everything.</span>
                        </div>

                        <div className={styles.footerCopyright}>
                            <span>© 2026 Prachi Verse</span>
                            <span className={styles.footerHeart}>♥</span>
                            <span>Made with Love</span>
                        </div>

                        <p className={styles.footerDisclaimer}>All memories preserved with utmost care.</p>
                    </div>

                </div>
            </footer>
        </div>
    );
};

export default Home;
