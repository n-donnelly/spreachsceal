import { Link } from 'react-router-dom';
import './Header.css'

export const Header = () => {
    return (
        <header className="header">
            <div className="header-left"></div>
            <Link to="/projects" className="header-link">
                <h1 className="header-title">Spréachscéal</h1>
            </Link>
            <div className="header-actions">
                {/* TODO: Add any actions that might be needed here */}
                <Link to="/morning-pages" className="header-link">
                    Morning Pages
                </Link>
            </div>
        </header>
    );
};
