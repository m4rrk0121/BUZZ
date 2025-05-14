import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Reset scroll position when the path changes
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null; // This component doesn't render anything
}

export default ScrollToTop;
