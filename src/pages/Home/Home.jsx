import React, { useState, useMemo, useDeferredValue, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './Home.module.css';
import { dashboardData } from '../../data/dashboardData';
import { staggerContainerVariant, staggerItemVariant, scrollRevealVariant, customEasing } from '../../animations/variants';

// ─── Helper: save to sessionStorage when an internal card is clicked ───────────
const saveLastVisited = (item) => {
    sessionStorage.setItem('lastVisited', JSON.stringify({
        title: item.title,
        icon: item.icon || '✨',
        link: item.link,
    }));
};

// ─── Category Section ──────────────────────────────────────────────────────────
// If `disableStagger` is true (meaning the user has started interacting with search),
// we completely remove the Framer Motion variants from the inner grid and items.
// This prevents newly mounted items (after clearing a search) from getting stuck
// in an inherited "hidden" state waiting for a stagger transition that already finished.
const CategorySection = ({ category, disableStagger }) => {
    const shouldReduceMotion = useReducedMotion();
    const skipVariants = shouldReduceMotion || disableStagger;

    return (
        <motion.section
            className={styles.categorySection}
            data-section={category.title}
            variants={shouldReduceMotion ? {} : scrollRevealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
        >
            <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <span className={styles.categoryCount}>
                    {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <motion.div
                className={styles.cardsGrid}
                style={{ perspective: '1200px' }}
                variants={shouldReduceMotion ? {} : staggerContainerVariant}
                initial={skipVariants ? "visible" : undefined}
                animate={skipVariants ? "visible" : undefined}
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
                            key={item.title || idx} // Better key than just idx to preserve state
                            variants={shouldReduceMotion ? {} : staggerItemVariant}
                            initial={skipVariants ? "visible" : undefined}
                            animate={skipVariants ? "visible" : undefined}
                            whileHover={shouldReduceMotion ? {} : {
                                scale: 1.03,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                transition: { type: 'tween', ease: customEasing, duration: 0.2 }
                            }}
                            whileTap={shouldReduceMotion ? {} : {
                                scale: 0.97,
                                transition: { type: 'tween', ease: customEasing, duration: 0.1 }
                            }}
                        >
                            {isInternal ? (
                                <Link
                                    to={item.link}
                                    className={styles.card}
                                    onClick={() => saveLastVisited(item)}
                                >
                                    {innerContent}
                                </Link>
                            ) : (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.card}
                                >
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

// ─── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => {
    const shouldReduceMotion = useReducedMotion();
    const { scrollY } = useScroll();

    // Feature 1 — Search with deferred value for smooth typing
    const [searchQuery, setSearchQuery] = useState('');
    const deferredQuery = useDeferredValue(searchQuery);
    const searchInputRef = useRef(null);

    // Track if the user has ever typed in the search bar.
    // If true, we disable stagger animations so dynamically added children don't get stuck hidden.
    const [hasEverSearched, setHasEverSearched] = useState(false);
    useEffect(() => {
        if (searchQuery !== '') {
            setHasEverSearched(true);
        }
    }, [searchQuery]);

    // Feature 2 — Last Visited chip; use state so dismiss re-renders without reload
    const [lastVisited, setLastVisited] = useState(() =>
        JSON.parse(sessionStorage.getItem('lastVisited') || 'null')
    );

    // Parallax effects for hero
    const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Floating background particles
    const [particles] = useState(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 20 + 's',
            duration: (15 + Math.random() * 10) + 's',
        }))
    );

    // Ctrl+K / Cmd+K to focus search
    useEffect(() => {
        const handleShortcut = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    /*
     * Search — memoized per-category results
     * Uses deferredQuery so typing stays responsive while filtering is deferred.
     * Matches title, description, badge, and date fields.
     */
    const q = deferredQuery.trim().toLowerCase();

    const matchedResultsMap = useMemo(() => {
        if (!q) return null; // null = show everything
        const map = new Map();
        for (const category of dashboardData) {
            const matched = category.items.filter(item =>
                (item.title ?? '').toLowerCase().includes(q) ||
                (item.description ?? '').toLowerCase().includes(q) ||
                (item.badge ?? '').toLowerCase().includes(q) ||
                (item.date ?? '').toLowerCase().includes(q)
            );
            map.set(category.title, matched);
        }
        return map;
    }, [q]);

    // Derived counts
    const totalMatched = matchedResultsMap
        ? Array.from(matchedResultsMap.values()).reduce((sum, arr) => sum + arr.length, 0)
        : 0;
    const hasResults = !q || totalMatched > 0;

    // Stable callback for getting matched items (no re-creation on every render)
    const getMatchedItems = useCallback(
        (category) => matchedResultsMap ? matchedResultsMap.get(category.title) ?? [] : category.items,
        [matchedResultsMap]
    );

    // Dismiss handler — no page reload
    const handleDismissLastVisited = () => {
        sessionStorage.removeItem('lastVisited');
        setLastVisited(null);
    };

    return (
        <div className={styles.homeContainer}>
            {/* Animated background particles */}
            <div className={styles.bgAnimation}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={styles.floatingParticle}
                        style={{
                            left: p.left,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}
            </div>

            {/* Hero header */}
            <motion.header
                className={styles.header}
                style={{ y: heroY, opacity: heroOpacity }}
            >
                <h1 className={styles.mainTitle}>✨Prachiii Verse✨</h1>
                <p className={styles.subtitle}>A Collection of Digital Memories &amp; Beautiful Moments</p>
            </motion.header>

            {/* ── Feature 1: Search Bar ─────────────────────────── */}
            <div className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search memories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Search memories"
                    />
                    {!searchQuery && (
                        <span className={styles.searchShortcut}>Ctrl K</span>
                    )}
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                className={styles.searchClear}
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}
                            >
                                ✕
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Result count */}
                <AnimatePresence>
                    {q && hasResults && (
                        <motion.span
                            className={styles.searchResultCount}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                        >
                            {totalMatched} {totalMatched === 1 ? 'result' : 'results'} found
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Feature 2: Continue Reading Chip ─────────────── */}
            <AnimatePresence>
                {lastVisited && (
                    <motion.div
                        className={styles.continueWrapper}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <span className={styles.continueLabel}>Continue where you left off →</span>
                        <Link to={lastVisited.link} className={styles.continueChip}>
                            <span>{lastVisited.icon}</span>
                            <span>{lastVisited.title}</span>
                        </Link>
                        <button
                            className={styles.continueDismiss}
                            onClick={handleDismissLastVisited}
                            aria-label="Dismiss"
                            title="Dismiss"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main content ──────────────────────────────────── */}
            <main className={styles.main}>
                {/*
                 * FIX: Never unmount CategorySection — use display:none on a wrapper
                 * instead of removing from DOM. This preserves Framer Motion's
                 * whileInView state so scroll-reveal works correctly after clearing search.
                 */}
                {dashboardData.map((category) => {
                    const matchedItems = getMatchedItems(category);
                    const isHidden = !!q && matchedItems.length === 0;

                    return (
                        <div
                            key={category.title}
                            style={isHidden ? { display: 'none' } : undefined}
                        >
                            <CategorySection 
                                category={{ ...category, items: matchedItems }} 
                                disableStagger={hasEverSearched}
                            />
                        </div>
                    );
                })}

                {/* Empty state — only when truly no results anywhere */}
                <AnimatePresence>
                    {!hasResults && (
                        <motion.div
                            className={styles.noResults}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span>✨</span>
                            <p>No memories found for &ldquo;{searchQuery}&rdquo;</p>
                            <button
                                className={styles.noResultsClear}
                                onClick={() => setSearchQuery('')}
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>

                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>✨ Prachiii Verse ✨</div>
                        <p className={styles.footerTagline}>Where Every Memory Sparkles</p>
                    </div>

                    <div className={styles.footerLinks}>
                        <button className={styles.footerLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
                        <button className={styles.footerLink} onClick={() => document.querySelector('[data-section="Diaries"]')?.scrollIntoView({ behavior: 'smooth' })}>Diaries</button>
                        <button className={styles.footerLink} onClick={() => document.querySelector('[data-section="Birthday Projects"]')?.scrollIntoView({ behavior: 'smooth' })}>Birthday Projects</button>
                        <button className={styles.footerLink} onClick={() => document.querySelector('[data-section="Special Occasions"]')?.scrollIntoView({ behavior: 'smooth' })}>Special Occasions</button>
                        <button className={styles.footerLink} onClick={() => document.querySelector('[data-section="Other Projects"]')?.scrollIntoView({ behavior: 'smooth' })}>Other Projects</button>
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