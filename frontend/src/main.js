import './styles/main.css';
import { renderSignup } from './pages/signup.js';
import { renderHome } from './pages/home.js';
import { renderScanner } from './pages/scanner.js';
import { renderCart } from './pages/cart.js';
import { renderPayment } from './pages/payment.js';
import { renderBill } from './pages/bill.js';
import { renderOrders } from './pages/orders.js';
import { getToken } from './utils/api.js';

// ─── Router ───
const app = document.getElementById('app');
const nav = document.getElementById('bottom-nav');
const cartBadge = document.getElementById('cart-badge');

let currentCleanup = null;

const routes = {
  signup: { render: renderSignup, showNav: false },
  home: { render: renderHome, showNav: true },
  scanner: { render: renderScanner, showNav: true },
  cart: { render: renderCart, showNav: true },
  payment: { render: renderPayment, showNav: true },
  bill: { render: renderBill, showNav: true },
  orders: { render: renderOrders, showNav: true },
};

const router = {
  navigate(page) {
    // Cleanup previous page
    if (typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    window.location.hash = page;
  },

  showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const icon = type === 'success' ? 'check_circle' : 'error';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-icons-round">${icon}</span>${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.classList.toggle('hidden', count === 0);
    }
  },
};

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  
  // Auth guard
  if (!getToken() && hash !== 'signup') {
    window.location.hash = 'signup';
    return;
  }

  // If logged in and trying to access signup, redirect to home
  if (getToken() && hash === 'signup') {
    window.location.hash = 'home';
    return;
  }

  const route = routes[hash];
  if (!route) {
    window.location.hash = getToken() ? 'home' : 'signup';
    return;
  }

  // Cleanup previous page
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // Show/hide nav
  if (route.showNav) {
    nav.classList.remove('hidden');
  } else {
    nav.classList.add('hidden');
  }

  // Update active nav button
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === hash);
  });

  // Render page
  const cleanup = route.render(app, router);
  if (typeof cleanup === 'function') {
    currentCleanup = cleanup;
  }

  // Update cart badge
  router.updateCartBadge();

  // Scroll to top
  window.scrollTo(0, 0);
}

// Nav button clicks
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    router.navigate(btn.dataset.page);
  });
});

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Initial route
handleRoute();
