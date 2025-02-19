import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About ProjectTracker</h4>
          <p>Empowering educators to manage and monitor student progress in projects.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: deepanshupathak03@gmail.com</p>
          <p>Phone: (+91) 9521669416</p>
          <p>Address: Indian Institute of Technology, Madras</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/profile.php?id=100070557186455" className="social-icon"><FaFacebookF /></a>
            <a href="https://x.com/Deepanshu016" className="social-icon"><FaTwitter /></a>
            <a href="https://www.linkedin.com/in/deepanshu-pathak/" className="social-icon"><FaLinkedinIn /></a>
            <a href="https://github.com/deepanshu-iitm" className="social-icon"><FaGithub /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 ProjectTracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;