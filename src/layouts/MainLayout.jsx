import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    return (
        <div className={styles.layoutWrapper}>
            {/* Global Back Button - Only show if not on home page */}
            {!isHome && (
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                    aria-label="Go Back"
                >
                    ← Back
                </button>
            )}

            <Outlet />
        </div>
    );
};

export default MainLayout;
