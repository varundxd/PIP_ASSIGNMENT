

import React from 'react';


const Footer = () => {
  return (
    <footer className="rentomojo-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="hulk">About Us</h3>
          <p>About PostNest...</p>
        </div>
        <div className="footer-column">
          <h3 className="hulk">Quick Links</h3>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="hulk">Contact Us</h3>
          <p>Email: <a href="mailto:info@postnest.com">info@postnest.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+123 456 7890</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PostNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
