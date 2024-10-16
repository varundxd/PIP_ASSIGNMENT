
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

function Header(props) {
  const currentLocation = useLocation();
  const navigate = useNavigate();
  
  const [showOver, setShowOver] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [randomColor, setRandomColor] = useState(getRandomColor());
  const [textColor, setTextColor] = useState(getTextColor(randomColor));
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername.charAt(0).toUpperCase());
    }
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username'); 
    setIsLoggedIn(false); 
    navigate('/login');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
  }

  function getTextColor(backgroundColor) {
    const rgb = parseInt(backgroundColor.slice(1), 16); 
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'dark' : 'light';
  }

  return (
    <div className={`header-container ${isLoggedIn ? 'logged-in' : ''} ${currentLocation.pathname === '/' ? 'home-page' : ''} d-flex justify-content-between`}>
      <div className="header">
        {!props.isSearch && (
          <Link className='links' to="/" onClick={() => props.onPostNestLinkClick(false)}>
            <span className="name">PostNest</span>
          </Link>
        )}
        <span className="chunky"></span>

        {currentLocation.pathname !== '/login' && currentLocation.pathname !== '/register' && (
          <span className="sb">
            <input
              className="search"
              type="text"
              value={props.search}
              onChange={(e) => props.handlesearch(e.target.value)}
              placeholder="Search..."
            />
            <button className="search-btn" onClick={props.handleClick}>
              <FaSearch />
            </button>
          </span>
        )}
      </div>

      <div className="tr1">
        {isLoggedIn ? (
          <div
            onClick={() => {
              setShowOver(!showOver);
              const newColor = getRandomColor();
              setRandomColor(newColor);
              setTextColor(getTextColor(newColor));
            }}
            className="profile-circle"
            style={{
              background: randomColor,
              color: textColor === 'light' ? '#fff' : '#000',
            }}
          >
            <span>{username}</span>
          </div>
        ) : (
          <div className="tr">
            <Link className="button-85" to="/login">LOGIN</Link>
            <Link className="button-85" to="/register">REGISTER</Link>
          </div>
        )}

        {showOver && (
          <div className="dropdown-menu">
            <Link to="/add-post">
              <button className="logout-btn">ADD POST</button>
            </Link>
            <Link to="/liked-posts">
              <button className="logout-btn">FAVOURITES</button>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
