import { apiFetch, getUser, clearAuth } from '../utils/api.js';

export function renderHome(app, router) {
  const user = getUser();
  let cities = [];
  let selectedCity = localStorage.getItem('sc_city') || '';
  let stores = [];
  let showProfile = false;

  async function loadData() {
    try {
      const citiesData = await apiFetch('/stores/cities');
      cities = citiesData.cities || [];
      if (!selectedCity && cities.length) selectedCity = cities[0];
      localStorage.setItem('sc_city', selectedCity);

      const storesData = await apiFetch(`/stores?city=${encodeURIComponent(selectedCity)}`);
      stores = storesData.stores || [];
    } catch (err) {
      console.error('Load error:', err);
    }
    render();
  }

  function render() {
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    const greeting = getGreeting();

    app.innerHTML = `
      <div class="page">
        <div class="home-header">
          <div class="home-greeting">
            <h2>${greeting}, ${user?.name?.split(' ')[0] || 'User'} 👋</h2>
            <p>Select a store to start shopping</p>
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

        <div class="city-selector animate-fade">
          <div class="section-title">
            <span class="material-icons-round">location_on</span>
            Select City
          </div>
          <div class="city-chips">
            ${cities.map(c => `
              <button class="city-chip ${c === selectedCity ? 'active' : ''}" data-city="${c}">${c}</button>
            `).join('')}
          </div>
        </div>

        <div class="section-title mt-24">
          <span class="material-icons-round">storefront</span>
          Stores in ${selectedCity || '...'}
        </div>

        ${stores.length === 0 ? `
          <div class="loading-spinner"></div>
        ` : `
          <div class="stores-grid stagger-children">
            ${stores.map(s => `
              <div class="store-card" data-store-id="${s.id}">
                <div class="store-icon">
                  <span class="material-icons-round">store</span>
                </div>
                <div class="store-info">
                  <div class="store-name">${s.name}</div>
                  <div class="store-address">${s.address || s.location || ''}</div>
                </div>
                <div class="store-rating">
                  <span class="material-icons-round">star</span>
                  ${s.rating?.toFixed(1) || '4.0'}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // Event listeners
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

    document.querySelectorAll('.city-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        selectedCity = chip.dataset.city;
        localStorage.setItem('sc_city', selectedCity);
        stores = [];
        render();
        loadStores();
      });
    });

    document.querySelectorAll('.store-card').forEach(card => {
      card.addEventListener('click', () => {
        const storeId = card.dataset.storeId;
        const store = stores.find(s => s.id == storeId);
        if (store) {
          localStorage.setItem('sc_store', JSON.stringify(store));
          router.navigate('scanner');
        }
      });
    });

    // Close profile dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (showProfile && !e.target.closest('#avatar-btn') && !e.target.closest('#profile-dropdown')) {
        showProfile = false;
        render();
      }
    }, { once: true });
  }

  async function loadStores() {
    try {
      const data = await apiFetch(`/stores?city=${encodeURIComponent(selectedCity)}`);
      stores = data.stores || [];
    } catch (err) {
      console.error('Store load error:', err);
    }
    render();
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadData();
}
