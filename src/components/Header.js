import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <h1>JEN Remodeling Inc</h1>
            <nav>
                <ul>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/">Reviews</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;