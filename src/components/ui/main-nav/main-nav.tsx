import { NavLink } from 'react-router-dom';
import './main-nav.css';

function MainNav() {
    return (
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
                {/* <li>
                    <NavLink
                        to="/components"
                        className={({ isActive }) =>
                            `${isActive ? 'active' : ''}`
                        }
                    >
                        Components
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/you"
                        className={({ isActive }) =>
                            `${isActive ? 'active' : ''}`
                        }
                    >
                        You
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ants"
                        className={({ isActive }) =>
                            `${isActive ? 'active' : ''}`
                        }
                    >
                        Ants
                    </NavLink>
                </li> */}
            </ul>
        </nav>
    )
}

export default MainNav;