// Authentication JavaScript
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      this.showLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setAuth(data.token, data.user);
        this.showApp();
        this.showToast('Login successful!', 'success');
      } else {
        this.showToast(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      this.showToast('Network error. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
      this.showLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setAuth(data.token, data.user);
        this.showApp();
        this.showToast('Registration successful!', 'success');
      } else {
        this.showToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      this.showToast('Network error. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.showLandingPage();
    this.showToast('Logged out successfully', 'success');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getAuthHeader() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  showApp() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('app-page').classList.remove('hidden');
    
    // Update user name in header
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && this.user) {
      userNameElement.textContent = this.user.name;
    }

    // Load dashboard
    if (window.app) {
      window.app.loadDashboard();
    }
  }

  showLandingPage() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('app-page').classList.add('hidden');
  }
}

// Page navigation functions
function showAuthPage(tab = 'login') {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  document.getElementById('app-page').classList.add('hidden');
  
  switchAuthTab(tab);
}

function switchAuthTab(tab) {
  const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
  const signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (tab === 'login') {
    loginTab?.classList.add('active');
    signupTab?.classList.remove('active');
    loginForm?.classList.remove('hidden');
    signupForm?.classList.add('hidden');
  } else {
    loginTab?.classList.remove('active');
    signupTab?.classList.add('active');
    loginForm?.classList.add('hidden');
    signupForm?.classList.remove('hidden');
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
  }
}

function scrollToFeatures() {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function googleSignIn() {
  // Placeholder for Google OAuth
  showToast('Google sign-in coming soon!', 'warning');
}

function logout() {
  if (window.auth) {
    window.auth.logout();
  }
}

// Initialize auth manager
window.auth = new AuthManager();

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.auth.isAuthenticated()) {
    window.auth.showApp();
  }
});
