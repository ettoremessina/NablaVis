import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from '../utils/translate';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const t = useTranslation();
    const location = useLocation();
    const search = location.search; // Preserve ?lang=it

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f0f0' }}>
            <header style={{ padding: '10px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{t.title}</h1>
                <nav>
                    <Link to={`/gradient${search}`} style={{ color: 'white', marginRight: '15px', textDecoration: location.pathname.includes('gradient') ? 'underline' : 'none' }}>{t.nav_gradient}</Link>
                    <Link to={`/curl${search}`} style={{ color: 'white', marginRight: '15px', textDecoration: location.pathname.includes('curl') ? 'underline' : 'none' }}>{t.nav_curl}</Link>
                    <Link to={`/divergence${search}`} style={{ color: 'white', textDecoration: location.pathname.includes('divergence') ? 'underline' : 'none' }}>{t.nav_divergence}</Link>
                </nav>
                <LanguageSwitcher />
            </header>

            <main style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '15px', borderRadius: '8px', maxWidth: '300px' }}>
                    {/* This will be dynamic based on route */}
                    {location.pathname.includes('gradient') && <p>{t.desc_gradient}</p>}
                    {location.pathname.includes('curl') && <p>{t.desc_curl}</p>}
                    {location.pathname.includes('divergence') && <p>{t.desc_divergence}</p>}
                    {location.pathname === '/' && <p>Select a theorem to visualize.</p>}
                </div>

                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    {children}
                    <Outlet />
                </Canvas>
            </main>
        </div>
    );
};
