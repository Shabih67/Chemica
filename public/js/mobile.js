// ChemCore Mobile Interactions - Optimized for phone app experience
class MobileController {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.sidebarOpen = false;
    
    this.init();
  }

  init() {
    if (this.isMobile()) {
      this.setupMobileGestures();
      this.setupMobileNavigation();
      this.setupPullToRefresh();
      this.optimizeTouchTargets();
    }
    
    // Setup hamburger menu regardless of device
    this.setupHamburgerMenu();
  }

  // Check if mobile device
  isMobile() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Setup mobile gestures (swipe, etc.)
  setupMobileGestures() {
    const appShell = document.getElementById('app-shell');
    if (!appShell) return;

    // Touch start
    appShell.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    // Touch end
    appShell.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    }, { passive: true });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    appShell.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }

  // Handle swipe gestures
  handleSwipe() {
    const swipeDistanceX = this.touchEndX - this.touchStartX;
    const swipeDistanceY = this.touchEndY - this.touchStartY;

    // Horizontal swipe (sidebar toggle)
    if (Math.abs(swipeDistanceX) > this.minSwipeDistance && 
        Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
      
      if (swipeDistanceX > 0 && this.touchStartX < 50) {
        // Swipe right from edge - open sidebar
        this.openSidebar();
      } else if (swipeDistanceX < 0 && this.sidebarOpen) {
        // Swipe left - close sidebar
        this.closeSidebar();
      }
    }
  }

  // Setup mobile navigation
  setupMobileNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;

    // Add touch feedback
    const navItems = bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('touchstart', () => {
        item.style.transform = 'scale(0.95)';
      }, { passive: true });

      item.addEventListener('touchend', () => {
        item.style.transform = 'scale(1)';
      }, { passive: true });
    });

    // Hide bottom nav on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            bottomNav.style.transform = 'translateY(100%)';
          } else {
            // Scrolling up
            bottomNav.style.transform = 'translateY(0)';
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Setup pull to refresh
  setupPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    const refreshThreshold = 100;
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) return;

    mainContent.addEventListener('touchstart', (e) => {
      if (mainContent.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });

    mainContent.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 0 && pullDistance < refreshThreshold) {
        // Visual feedback for pull
        mainContent.style.transform = `translateY(${pullDistance * 0.4}px)`;
      }
    }, { passive: true });

    mainContent.addEventListener('touchend', () => {
      if (!isPulling) return;
      
      const currentY = event.changedTouches[0].clientY;
      const pullDistance = currentY - startY;
      
      mainContent.style.transform = 'translateY(0)';
      mainContent.style.transition = 'transform 0.3s ease';
      
      if (pullDistance > refreshThreshold) {
        // Trigger refresh
        location.reload();
      }
      
      setTimeout(() => {
        mainContent.style.transition = '';
      }, 300);
      
      isPulling = false;
    }, { passive: true });
  }

  // Optimize touch targets for mobile
  optimizeTouchTargets() {
    // Ensure all interactive elements are at least 44px
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, .nav-item, .chat-fab, .hamburger'
    );

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        el.style.minWidth = '44px';
        el.style.minHeight = '44px';
      }
    });
  }

  // Setup hamburger menu
  setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('open');
      
      if (overlay) {
        overlay.classList.toggle('show');
      }
      
      this.sidebarOpen = sidebar.classList.contains('open');
    });

    // Close sidebar when clicking overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeSidebar();
      });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (this.sidebarOpen && 
          !sidebar.contains(e.target) && 
          !hamburger.contains(e.target)) {
        this.closeSidebar();
      }
    });
  }

  // Open sidebar
  openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.add('open');
      if (hamburger) hamburger.classList.add('active');
      if (overlay) overlay.classList.add('show');
      this.sidebarOpen = true;
    }
  }

  // Close sidebar
  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
      if (overlay) overlay.classList.remove('show');
      this.sidebarOpen = false;
    }
  }
}

// Initialize mobile controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.mobileController = new MobileController();
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.mobileController) {
      window.mobileController.optimizeTouchTargets();
    }
  }, 250);
});
