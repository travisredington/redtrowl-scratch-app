import './header.css';
import logoImage from '../../../assets/images/logo.png';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div id="main-logo">
                <img src={logoImage} alt="TR Logo" />
            </div>

            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `${isActive ? 'active' : ''}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/streaming"
                            className={({ isActive }) =>
                                `${isActive ? 'active' : ''}`
                            }
                        >
                            Components
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
