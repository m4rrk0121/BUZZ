import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConnectButton from './ConnectButton';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook for KOA link
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Add responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      
      // Close menu when resizing to desktop
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Link style helper - increase font size by 20% when mobile menu is open
  const getLinkStyle = (path) => ({
    color: isActive(path) ? '#000000' : '#ffb300',
    textDecoration: 'none',
    fontFamily: "'Chewy', cursive",
    padding: isMobile ? '15px 20px' : '8px 12px', // Increased vertical padding on mobile
    borderRadius: '4px',
    fontSize: isMobile ? '1.32rem' : '0.9rem', // 20% increase (1.1rem * 1.2 = 1.32rem)
    backgroundColor: isActive(path) ? '#ffb300' : 'transparent',
    display: 'block',
    width: '100%',
    textAlign: 'center', // Center all menu items
    margin: '5px 0'
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '15px 20px',
      backgroundColor: '#000000',
      borderBottom: '3px solid #ffb300',
      zIndex: 1001
    }}>
      {/* Logo with Dashboard Link */}
      <div>
        <h2 
          style={{ 
            color: '#ffb300', 
            fontFamily: "'Chewy', cursive", 
            margin: 0,
            fontSize: '1.8rem',
            cursor: 'pointer' // Add cursor pointer
          }}
          onClick={() => navigate('/')} // Navigate to home instead of dashboard
        >
          KOA
        </h2>
      </div>
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px'
        }}>
          <Link to="/home" style={getLinkStyle('/home')}>Home</Link>
          <Link to="/nft-mint" style={getLinkStyle('/nft-mint')}>NFT Mint</Link>
        </div>
      )}
      
      {/* Right section with wallet connect and hamburger */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        ...(isMobile && {
          flex: 1,
          justifyContent: 'center',
          position: 'relative'
        })
      }}>
        {/* Connect Button */}
        <ConnectButton />
        
        {/* Hamburger Button - Mobile Only */}
        {isMobile && (
          <div 
            onClick={toggleMenu}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '30px',
              height: '24px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            aria-label="Menu"
          >
            {/* Three distinct lines for the hamburger */}
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              backgroundColor: '#ffb300',
              borderRadius: '3px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(10px) rotate(45deg)' : 'none'
            }} />
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              backgroundColor: '#ffb300',
              borderRadius: '3px',
              transition: 'opacity 0.3s ease',
              opacity: menuOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block',
              width: '100%',
              height: '3px',
              backgroundColor: '#ffb300',
              borderRadius: '3px',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'translateY(-10px) rotate(-45deg)' : 'none'
            }} />
          </div>
        )}
      </div>
      
      {/* Mobile Menu - Full Screen Overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed',
          top: '63px', // Height of navbar
          left: 0,
          width: '100%',
          height: 'calc(100vh - 63px)',
          backgroundColor: '#000000',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
          overflow: 'auto',
          borderTop: '1px solid rgba(255, 179, 0, 0.3)',
          textAlign: 'center' // Ensure text centering
        }}>
          {/* Close button at the top of the mobile menu */}
          <div style={{
            display: 'flex',
            justifyContent: 'center', // Center the close button
            padding: '10px 20px 20px',
            borderBottom: '1px solid rgba(255, 179, 0, 0.2)'
          }}>
            <button
              onClick={closeMenu}
              style={{
                background: 'transparent',
                border: '2px solid #ffb300',
                borderRadius: '4px',
                color: '#ffb300',
                padding: '8px 15px',
                fontSize: '1rem',
                fontFamily: "'Chewy', cursive",
                cursor: 'pointer',
                // Keep button size the same
                width: 'auto',
                minWidth: '120px'
              }}
            >
              Close Menu
            </button>
          </div>
          
          {/* Menu links - with increased font size and proper centering */}
          <div style={{ 
            marginTop: '25px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center the menu items
            width: '100%'
          }}>
            <Link to="/home" style={getLinkStyle('/home')} onClick={closeMenu}>Home</Link>
            <Link to="/nft-mint" style={getLinkStyle('/nft-mint')} onClick={closeMenu}>NFT Mint</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;