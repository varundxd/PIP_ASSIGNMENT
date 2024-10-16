
import React from 'react';


const BtFooter = () => {
  return (
    <footer className="postnest-btfooter">
      <div className="btfooter-container">
        <div className="btfooter-column">
          <h3 class="h">About Us</h3>
          <p>About PostNest...Learn more <a href="/about" aria-label="Learn more about PostNest">here</a>.</p>
        </div>
        <div className="btfooter-column">
        <p>Elevate Your Life with Seamless & lifetime Posts & Connections!</p>
        </div>
        <div className="btfooter-column">
          <h3 class="h">Contact Us</h3>
          <p>Email: <a href="mailto:info@postnest.com">info@postnest.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+123 456 7890</a></p>
        </div>
      </div>
    </footer>
  );
};

export default BtFooter;