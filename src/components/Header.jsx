import { MdOutlineNightlight, MdOutlineLightMode } from "react-icons/md";
import { Link } from "react-router-dom";

const Header = ({ isLightTheme, toggleTheme, isLoggedIn }) => {

    const login = () => {
        console.log('Open dialog');
    }

    const logout = () => {
        console.log('Close dialog');
    }

  return (
    <header>
      <nav className="flex justify-between">
        <ul className="flex gap-10 text-xl text-textColor items-center">
          <li>
            <Link to="/">Browse</Link>
          </li>
          <li>
            <Link to="/released">Released</Link>
          </li>
          <li>
            {isLoggedIn && <Link to="/account">Account</Link>}
          </li>
        </ul>
        <ul className="flex gap-10 text-xl text-textColor items-center">
          <li>
            {isLightTheme ? (
              <MdOutlineNightlight onClick={toggleTheme} />
            ) : (
              <MdOutlineLightMode onClick={toggleTheme} />
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/" onClick={logout}>Logout</Link>
            ) : (
              <Link to="/" onClick={login}>Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;