import { apiFetch, getUser, clearAuth } from '../utils/api.js';

export function renderHome(app, router) {
  const user = getUser();

  // State
  let step = 1; // 1=City, 2=Brand, 3=Store/Address
  let cities = [];
  let allStores = [];
  let selectedCity = '';
  let selectedBrand = '';
  let selectedStore = null;
  let brands = [];
  let filteredStores = [];
  let loading = true;
  let showProfile = false;

  async function loadCities() {
    loading = true;
    render();
    try {
      const data = await apiFetch('/stores/cities');
      cities = data.cities || [];
    } catch (err) {
      console.error('Cities load error:', err);
    }
    loading = false;
    render();
  }

  async function loadStoresForCity(city) {
    loading = true;
    step = 2;
    selectedCity = city;
    render();
    try {
      const data = await apiFetch(`/stores?city=${encodeURIComponent(city)}`);
      allStores = data.stores || [];
      // Extract unique brands
      const brandSet = new Set();
      allStores.forEach(s => brandSet.add(s.brand));
      brands = Array.from(brandSet).sort();
    } catch (err) {
      console.error('Stores load error:', err);
    }
    loading = false;
    render();
  }

  function selectBrand(brand) {
    selectedBrand = brand;
    filteredStores = allStores.filter(s => s.brand === brand);
    step = 3;
    render();
  }

  function selectStore(store) {
    selectedStore = store;
    render();
  }

  function confirmAndGo() {
    if (!selectedStore) return;
    localStorage.setItem('sc_city', selectedCity);
    localStorage.setItem('sc_store', JSON.stringify(selectedStore));
    router.navigate('scanner');
  }

  function goBack() {
    if (step === 3) {
      step = 2;
      selectedBrand = '';
      selectedStore = null;
      filteredStores = [];
    } else if (step === 2) {
      step = 1;
      selectedCity = '';
      allStores = [];
      brands = [];
    }
    render();
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  function getCityIcon(city) {
    const icons = {
      'Delhi': '🏛️', 'Mumbai': '🌊', 'Kolkata': '🌉',
      'Bangalore': '💻', 'Hyderabad': '🕌', 'Chennai': '🛕',
      'Pune': '⛰️', 'Jaipur': '🏰', 'Ahmedabad': '🏗️',
    };
    return icons[city] || '📍';
  }

  function render() {
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    const greeting = getGreeting();

    // Step indicator
    const stepIndicator = `
      <div class="step-indicator">
        <div class="step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}">
          <span>${step > 1 ? '✓' : '1'}</span>
        </div>
        <div class="step-line ${step > 1 ? 'active' : ''}"></div>
        <div class="step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}">
          <span>${step > 2 ? '✓' : '2'}</span>
        </div>
        <div class="step-line ${step > 2 ? 'active' : ''}"></div>
        <div class="step-dot ${step >= 3 ? 'active' : ''}">
          <span>3</span>
        </div>
      </div>
      <div class="step-labels">
        <span class="${step >= 1 ? 'active' : ''}">City</span>
        <span class="${step >= 2 ? 'active' : ''}">Brand</span>
        <span class="${step >= 3 ? 'active' : ''}">Store</span>
      </div>
    `;

    // Step content
    let stepContent = '';

    if (loading) {
      stepContent = `<div class="loading-spinner" style="margin-top:40px;"></div>`;
    } else if (step === 1) {
      // ── Step 1: Select City ──
      stepContent = `
        <div class="step-section animate-fade">
          <div class="step-title">
            <span class="material-icons-round" style="color:var(--accent-secondary)">location_on</span>
            <h3>Select Your City</h3>
          </div>
          <p class="step-desc">Choose a city to find stores near you</p>
          ${cities.length === 0 ? `
            <div class="empty-state-box">
              <span class="material-icons-round">location_off</span>
              <p>No cities available yet.</p>
            </div>
          ` : `
            <div class="selection-grid stagger-children">
              ${cities.map(c => `
                <button class="selection-card" data-city="${c}">
                  <div class="selection-icon">${getCityIcon(c)}</div>
                  <div class="selection-label">${c}</div>
                  <span class="material-icons-round selection-arrow">arrow_forward</span>
                </button>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (step === 2) {
      // ── Step 2: Select Brand ──
      stepContent = `
        <div class="step-section animate-fade">
          <div class="step-title">
            <span class="material-icons-round" style="color:var(--accent-secondary)">storefront</span>
            <h3>Select a Brand</h3>
          </div>
          <p class="step-desc">Stores in <strong>${selectedCity}</strong></p>
          ${brands.length === 0 ? `
            <div class="empty-state-box">
              <span class="material-icons-round">store</span>
              <p>No stores found in ${selectedCity}.</p>
            </div>
          ` : `
            <div class="selection-grid stagger-children">
              ${brands.map(b => {
                const count = allStores.filter(s => s.brand === b).length;
                return `
                  <button class="selection-card" data-brand="${b}">
                    <div class="selection-icon brand-icon">
                      <span class="material-icons-round">store</span>
                    </div>
                    <div class="selection-info">
                      <div class="selection-label">${b}</div>
                      <div class="selection-meta">${count} store${count > 1 ? 's' : ''}</div>
                    </div>
                    <span class="material-icons-round selection-arrow">arrow_forward</span>
                  </button>
                `;
              }).join('')}
            </div>
          `}
        </div>
      `;
    } else if (step === 3) {
      // ── Step 3: Select Store (Address) ──
      stepContent = `
        <div class="step-section animate-fade">
          <div class="step-title">
            <span class="material-icons-round" style="color:var(--accent-secondary)">place</span>
            <h3>Select a Store</h3>
          </div>
          <p class="step-desc"><strong>${selectedBrand}</strong> in <strong>${selectedCity}</strong></p>
          <div class="store-list stagger-children">
            ${filteredStores.map(s => `
              <div class="store-select-card ${selectedStore?.id === s.id ? 'selected' : ''}" data-store-id="${s.id}">
                <div class="store-select-radio">
                  <div class="radio-dot"></div>
                </div>
                <div class="store-select-body">
                  <div class="store-select-name">${s.name}</div>
                  <div class="store-select-address">
                    <span class="material-icons-round" style="font-size:14px">location_on</span>
                    ${s.address || s.location || 'Address not available'}
                  </div>
                  <div class="store-select-meta">
                    <span class="store-select-rating">
                      <span class="material-icons-round" style="font-size:14px">star</span>
                      ${s.rating?.toFixed(1) || '4.0'}
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          ${selectedStore ? `
            <div class="confirm-bar animate-slide">
              <div class="confirm-info">
                <span class="material-icons-round" style="color:var(--success)">check_circle</span>
                <span>${selectedStore.name}</span>
              </div>
              <button class="btn btn-primary" id="start-shopping-btn">
                <span class="material-icons-round" style="font-size:18px">qr_code_scanner</span>
                Start Shopping
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    app.innerHTML = `
      <div class="page">
        <div class="home-header">
          <div style="display:flex;align-items:center;gap:12px;">
            ${step > 1 ? `
              <button class="back-btn" id="step-back-btn" style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border-color);color:var(--text-primary);display:flex;align-items:center;justify-content:center;cursor:pointer;">
                <span class="material-icons-round">arrow_back</span>
              </button>
            ` : ''}
            <div class="home-greeting">
              <h2>${greeting}, ${user?.name?.split(' ')[0] || 'User'} 👋</h2>
              <p>${step === 1 ? 'Where are you shopping today?' : step === 2 ? 'Pick your favorite brand' : 'Choose a store location'}</p>
            </div>
          </div>
          <div class="home-avatar" id="avatar-btn">${initials}</div>
        </div>

        ${showProfile ? `
          <div class="profile-dropdown" id="profile-dropdown">
            <button class="profile-dropdown-item" id="profile-orders">
              <span class="material-icons-round">receipt_long</span>
              My Orders
            </button>
            <button class="profile-dropdown-item danger" id="profile-logout">
              <span class="material-icons-round">logout</span>
              Log Out
            </button>
          </div>
        ` : ''}

        ${stepIndicator}
        ${stepContent}
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Avatar / profile
    document.getElementById('avatar-btn')?.addEventListener('click', () => {
      showProfile = !showProfile;
      render();
    });

    document.getElementById('profile-logout')?.addEventListener('click', () => {
      clearAuth();
      localStorage.removeItem('sc_city');
      localStorage.removeItem('sc_store');
      router.navigate('signup');
    });

    document.getElementById('profile-orders')?.addEventListener('click', () => {
      showProfile = false;
      router.navigate('orders');
    });

    // Back button
    document.getElementById('step-back-btn')?.addEventListener('click', goBack);

    // Step 1: City selection
    document.querySelectorAll('[data-city]').forEach(btn => {
      btn.addEventListener('click', () => loadStoresForCity(btn.dataset.city));
    });

    // Step 2: Brand selection
    document.querySelectorAll('[data-brand]').forEach(btn => {
      btn.addEventListener('click', () => selectBrand(btn.dataset.brand));
    });

    // Step 3: Store selection
    document.querySelectorAll('[data-store-id]').forEach(card => {
      card.addEventListener('click', () => {
        const store = filteredStores.find(s => s.id == card.dataset.storeId);
        if (store) selectStore(store);
      });
    });

    // Start shopping
    document.getElementById('start-shopping-btn')?.addEventListener('click', confirmAndGo);

    // Close profile dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (showProfile && !e.target.closest('#avatar-btn') && !e.target.closest('#profile-dropdown')) {
        showProfile = false;
        render();
      }
    }, { once: true });
  }

  // Initialize
  loadCities();
}
