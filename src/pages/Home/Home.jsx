import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { dashboardData } from '../../data/dashboardData';

const Home = () => {
    // Logic for floating particles (ported from script tag)
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 20 + 's',
            duration: (15 + Math.random() * 10) + 's'
        }));
        setParticles(newParticles);
    }, []);

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

            <header className={styles.header}>
                <h1 className={styles.mainTitle}>✨Prachiii Verse✨</h1>
                <p className={styles.subtitle}>A Collection of Digital Memories & Beautiful Moments</p>
            </header>

            <main className={styles.main}>
                {dashboardData.map((category, index) => (
                    <section key={index} className={styles.categorySection}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryIcon}>{category.icon}</span>
                            <h2 className={styles.categoryTitle}>{category.title}</h2>
                            <span className={styles.categoryCount}>{category.count}</span>
                        </div>

                        <div className={styles.cardsGrid}>
                            {category.items.map((item, idx) => {
                                // Determine if it's an internal React route or external/placeholder
                                const isInternal = !item.isExternal;
                                const CardWrapper = isInternal ? Link : 'a';
                                const hrefProps = isInternal ? { to: item.link } : { href: item.link };

                                return (
                                    <CardWrapper
                                        key={idx}
                                        className={styles.card}
                                        {...hrefProps}
                                    >
                                        <div className={styles.cardContent}>
                                            <span className={styles.cardIcon}>{item.icon}</span>
                                            <h3 className={styles.cardTitle}>{item.title}</h3>
                                            <p className={styles.cardDescription}>{item.description}</p>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.cardDate}>{item.date}</span>
                                                <span className={styles.cardBadge}>{item.badge}</span>
                                            </div>
                                        </div>
                                    </CardWrapper>
                                );
                            })}
                        </div>
                    </section>
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
                        <div className={styles.footerCopyright}>
                            <span>It was never Sympathy<br />It was always empathy, and my affection for you was unbridled.</span>
                        </div>
                        <div className={styles.footerCopyright}>
                            <span>© 2026 Prachi Verse</span>
                            <span className={styles.footerHeart}>♥</span>
                            <span>Made with Love</span>
                        </div>
                        <p>All memories preserved with care</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
