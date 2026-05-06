import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Listens for the Escape key and navigates back (-1).
 * Safely ignores Escape when the user is typing inside an input, textarea, or select.
 */
const useEscapeBack = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape') return;
            const tag = document.activeElement?.tagName;
            // Don't fire when user is typing
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            navigate(-1);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);
};

export default useEscapeBack;
