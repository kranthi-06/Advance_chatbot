import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, FileHeart, Leaf, BrainCircuit, BarChart3, Menu, X, Sparkles, Globe, Wheat, Cog, Stethoscope, Sun, Moon } from 'lucide-react';
import { LANGUAGES } from '../constants/languages.js';
import { DOMAINS } from '../constants/domains.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const navItems = [
    { path: '/', label: 'AI Chatbot', icon: MessageCircle, gradient: 'from-blue-500 to-purple-500', desc: 'Smart Assistant' },
    { path: '/medical', label: 'Medical Report', icon: FileHeart, gradient: 'from-rose-500 to-pink-500', desc: 'Lab Analysis' },
    { path: '/leaf', label: 'Leaf Disease', icon: Leaf, gradient: 'from-green-500 to-emerald-500', desc: 'Crop Health' },
    { path: '/quiz', label: 'Quiz Generator', icon: BrainCircuit, gradient: 'from-amber-500 to-orange-500', desc: 'Test Knowledge' },
    { path: '/advisor', label: 'Crop Advisor', icon: Wheat, gradient: 'from-green-600 to-teal-500', desc: 'Smart & IoT' },
];

const domainIcons = {
    agriculture: Wheat,
    engineering: Cog,
    medicine: Stethoscope,
};

const domainGradients = {
    agriculture: 'gradient-green-emerald',
    engineering: 'gradient-blue-purple',
    medicine: 'gradient-rose-pink',
};

export default function Sidebar({ currentLanguage, onLanguageChange, currentDomain, onDomainChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
    const currentDom = DOMAINS.find(d => d.id === currentDomain) || DOMAINS[0];

    const isDark = theme === 'dark';

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl"
                id="sidebar-toggle"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                id="main-sidebar"
                style={{ width: '280px' }}
            >
                {/* Logo + Theme Toggle */}
                <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                padding: '9px',
                                background: 'linear-gradient(135deg, #58a6ff, #bc8cff)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 14px rgba(88, 166, 255, 0.2)',
                            }}>
                                <Sparkles className="w-5 h-5" style={{ color: 'white' }} />
                            </div>
                            <div style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                width: '9px', height: '9px',
                                background: '#3fb950',
                                borderRadius: '50%',
                                border: '2px solid var(--bg-secondary)',
                            }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                fontSize: '1.1rem', fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}>
                                ChartBot AI
                            </h1>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Analysis Suite
                            </p>
                        </div>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            id="theme-toggle"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <div className={`theme-toggle-track ${isDark ? 'theme-dark' : 'theme-light'}`}>
                                <div className="theme-toggle-thumb">
                                    {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px' }}>
                        Navigation
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                        : ''
                                    }`
                                }
                                style={({ isActive }) => ({
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease',
                                    ...(isActive ? { boxShadow: '0 4px 14px rgba(0,0,0,0.25)' } : {}),
                                })}
                                id={`nav-${item.path.replace('/', '') || 'home'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div style={{
                                            padding: '7px',
                                            borderRadius: '8px',
                                            background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
                                        }}>
                                            <item.icon className="w-4 h-4" style={{ color: isActive ? 'white' : 'var(--text-secondary)' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: isActive ? 'white' : 'var(--text-primary)' }}>{item.label}</p>
                                            <p style={{ fontSize: '0.65rem', color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}>{item.desc}</p>
                                        </div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Domain */}
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px', marginTop: '18px' }}>
                        Domain
                    </p>
                    <div className="sidebar-selector-grid" id="domain-selector">
                        {DOMAINS.map((dom) => {
                            const Icon = domainIcons[dom.id];
                            return (
                                <button
                                    key={dom.id}
                                    onClick={() => onDomainChange(dom.id)}
                                    className={`domain-select-btn ${currentDomain === dom.id ? 'domain-select-active ' + domainGradients[dom.id] : ''}`}
                                    id={`domain-${dom.id}`}
                                    title={dom.description}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{dom.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Language */}
                    <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '8px', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe className="w-3 h-3" /> Language
                    </p>
                    <div className="sidebar-selector-grid" id="language-selector">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => onLanguageChange(lang.code)}
                                className={`lang-select-btn ${currentLanguage === lang.code ? 'lang-select-active' : ''}`}
                                id={`lang-${lang.code}`}
                            >
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-name">{lang.nativeName}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: '14px 10px', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{
                        background: 'var(--glass-bg)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        border: '1px solid var(--glass-border)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Powered by</p>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span style={{ fontSize: '0.58rem', fontWeight: 600, padding: '2px 8px', background: 'var(--glass-bg-strong)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                                    {currentLang.nativeName}
                                </span>
                                <span style={{ fontSize: '0.58rem', fontWeight: 600, padding: '2px 8px', background: 'var(--glass-bg-strong)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                                    {currentDom.name}
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            Groq Qwen 3.6 • Gemini 2.5 Flash
                        </p>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#58a6ff' }} />
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bc8cff' }} />
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3fb950' }} />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
