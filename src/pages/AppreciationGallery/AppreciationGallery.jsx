import React from 'react';
import { appreciationList } from '../../config/appreciation';
import { motion } from 'framer-motion';
import { staggerContainerVariant, staggerItemVariant, scrollRevealVariant } from '../../animations/variants';
import { useNavigate } from 'react-router-dom';
import styles from './AppreciationGallery.module.css';

const AppreciationGallery = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <motion.div className={styles.header} variants={scrollRevealVariant} initial="hidden" animate="visible">

        <p className={styles.eyebrow}>A Collection of ....</p>
        <h1 className={styles.headerTitle}>💌 Appreciation Gallery</h1>
        <p className={styles.headerSub}>Every word written here, is only for you</p>
        <div className={styles.countPill}>✨ &nbsp; {appreciationList.length} appreciations</div>
      </motion.div>

      <div className={styles.gridWrapper}>
        <motion.div
          className={styles.grid}
          variants={staggerContainerVariant}
          initial="hidden"
          animate="visible"
        >
          {appreciationList.map((item, index) => (
            <motion.div
              key={item.id}
              className={`${styles.card} ${index === 0 ? styles.featured : ''}`}
              variants={staggerItemVariant}
              onClick={() => navigate('/appreciation/' + item.id)}
            >
              <div className={styles.emojiBox}>{item.emoji}</div>
              <div className={styles.body}>
                <div className={styles.topRow}>
                  <span className={styles.title}>{item.title}</span>
                  {index === 0 && <span className={styles.liveDot} />}
                  <span className={styles.tag}>{item.date}</span>
                </div>
                <p className={styles.desc}>{item.description}</p>
                <div className={styles.bottomRow}>
                  <span className={styles.date}>{item.date}</span>
                  <button className={styles.openBtn} onClick={(e) => { e.stopPropagation(); navigate('/appreciation/' + item.id); }}>Open ✨</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AppreciationGallery;
