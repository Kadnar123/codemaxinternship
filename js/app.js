/**
 * ============================================================================
 * BLOGCRAFT - SHARED APPLICATION LOGIC
 * ============================================================================
 * Handles:
 * - Dynamic Navbar State (Logged-in vs Guest)
 * - Mobile Navigation Menu Toggling
 * - Theme Switcher (Dark / Light Mode)
 * - Toast Notification Helper
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  updateAuthNav();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
  const currentTheme = window.blogStorage.getTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    updateThemeIcon(themeToggle, currentTheme);
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      window.blogStorage.setTheme(newTheme);
      updateThemeIcon(themeToggle, newTheme);
      showToast(`Switched to ${newTheme} mode!`, 'info');
    });
  }
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
}

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   Authentication & Navigation State Synchronization
   ========================================================================== */
function updateAuthNav() {
  const user = window.blogStorage.getCurrentUser();
  const authContainer = document.getElementById('nav-auth-actions');
  const userLinks = document.getElementById('nav-user-links');

  if (!authContainer) return;

  if (user) {
    // Show user-specific links
    if (userLinks) {
      userLinks.innerHTML = `
        <a href="dashboard.html" class="nav-link">Dashboard</a>
        <a href="create-blog.html" class="nav-link">+ New Post</a>
      `;
    }

    // Render avatar/logout buttons
    authContainer.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span style="font-weight:600; font-size:0.9rem;">Hi, ${escapeHtml(user.name.split(' ')[0])}</span>
        <button id="logout-btn" class="btn btn-outline btn-sm">Log Out</button>
      </div>
    `;

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      window.blogStorage.logoutUser();
      showToast('You have been logged out.', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  } else {
    // Guest view
    if (userLinks) {
      userLinks.innerHTML = '';
    }

    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Log In</a>
      <a href="register.html" class="btn btn-primary btn-sm">Register</a>
    `;
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Security Helper: Basic HTML Entity Escaping
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format relative date or standard date
function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
