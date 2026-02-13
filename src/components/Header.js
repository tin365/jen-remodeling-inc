'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';

function Header() {
    const pathname = usePathname();
    
    return (
        <header className="header">
            <div className="header-container">
                <h1><Link href="/">JEN Remodeling Inc</Link></h1>
                <nav>
                    <ul>
                        <li><Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
                        <li><Link href="/services" className={pathname === '/services' ? 'active' : ''}>Services</Link></li>
                        <li><Link href="/projects" className={pathname === '/projects' ? 'active' : ''}>Projects</Link></li>
                        <li><Link href="/reviews" className={pathname === '/reviews' ? 'active' : ''}>Reviews</Link></li>
                        <li><Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;