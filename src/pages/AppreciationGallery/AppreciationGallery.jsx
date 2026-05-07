import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { appreciationList } from '../../config/appreciation';
import { staggerContainerVariant, staggerItemVariant, scrollRevealVariant } from '../../animations/variants';
import styles from './AppreciationGallery.module.css';

const AppreciationGallery = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <motion.button 
        className={styles.backButton}
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <motion.div 
        className={styles.header}
        variants={scrollRevealVariant}
        initial="hidden"
        animate="visible"
      >
        <h1 className={styles.title}>Appreciation Gallery</h1>
        <p className={styles.subtitle}>A collection of heartfelt appreciations, just for you.</p>
      </motion.div>

      <motion.div 
        className={styles.grid}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
      >
        {appreciationList.map((item) => (
          <motion.div 
            key={item.id}
            className={styles.card}
            variants={staggerItemVariant}
            onClick={() => navigate('/appreciation/' + item.id)}
          >
            <span className={styles.emoji}>{item.emoji}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.date}>{item.date}</p>
            <p className={styles.description}>{item.description}</p>
            <button className={styles.openButton}>
              Open ✨
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AppreciationGallery;
