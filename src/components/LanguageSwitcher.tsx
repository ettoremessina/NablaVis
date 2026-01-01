import React from 'react';
import { getLang } from '../utils/translate';

export const LanguageSwitcher: React.FC = () => {
    const currentLang = getLang();

    const toggleLang = () => {
        const params = new URLSearchParams(window.location.search);
        if (currentLang === 'en') {
            params.set('lang', 'it');
        } else {
            params.delete('lang');
        }
        window.location.search = params.toString();
    };

    return (
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: 'white', fontFamily: 'sans-serif' }} onClick={toggleLang}>
            {currentLang === 'en' ? '🇮🇹 Italiano' : '🇬🇧 English'}
        </div>
    );
};
