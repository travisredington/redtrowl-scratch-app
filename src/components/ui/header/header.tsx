import { useState } from 'react';
import './header.css';
import logoImage from '../../../assets/images/logo.png';
import { useMatches } from 'react-router-dom';
import PageTitle from '../page-title/page-title';
import MainNav from '../main-nav/main-nav';

interface RouteHandle {
    title?: string;
}

const symbols: number[] = [
    0x260F, 0x2606, 0x262F, 0x2630, 0x2631, 0x2632, 0x2633, 0x2634, 0x2635, 0x2636, 0x2637, 0x2638, 0x263F, 0x2640, 0x2641, 0x2642, 0x2643, 0x2644, 0x2645, 0x2646, 0x2647
];

function Header() {
    const matches = useMatches();
    const routeTitle = (matches.at(-1)?.handle as RouteHandle | undefined)?.title;
    const [symbol] = useState(() => String.fromCodePoint(symbols[Math.floor(Math.random() * symbols.length)]));
    const pageTitle = routeTitle && `${routeTitle} ${symbol}`;

    return (
        <header>
            <div id="header-content">
                <div id="main-logo">
                    <img src={logoImage} alt="TR Logo" />
                </div>

                <MainNav />
            </div>
            
            {pageTitle && (
                <div id="page-title-container">
                    <PageTitle pageTitle={pageTitle} />
                </div>
            )}
        </header>
    )
}

export default Header;
