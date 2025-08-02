import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { useState } from 'react';
import './Header.css'

export const Header = () => {
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-left"></div>
            <Link to="/projects" className="header-link">
                <h1 className="header-title">Spréachscéal</h1>
            </Link>
            <div className="header-actions">
                <button 
                    className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                    
                    <nav className="menu-items">
                        <Link 
                            to="/morning-pages" 
                            className="menu-item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Morning Pages
                        </Link>
                        <Link 
                            to="/scratchpad" 
                            className="menu-item"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Scratchpad
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }} 
                                    className="menu-item"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="menu-item"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
