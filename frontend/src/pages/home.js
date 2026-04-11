import { apiFetch, getUser, clearAuth } from '../utils/api.js';

// ─── Demo fallback data (works even without backend) ───
const DEMO_DATA = {
  'Delhi': {
    'Smart Bazaar': [
      { id: 'd1', name: 'Smart Bazaar Rajouri Garden', address: 'Main Najafgarh Road, Rajouri Garden, New Delhi - 110027', rating: 4.3 },
      { id: 'd2', name: 'Smart Bazaar Lajpat Nagar', address: 'Central Market, Lajpat Nagar II, New Delhi - 110024', rating: 4.1 },
      { id: 'd3', name: 'Smart Bazaar Dwarka', address: 'Sector 12, Dwarka, New Delhi - 110078', rating: 4.0 },
    ],
    'DMart': [
      { id: 'd4', name: 'DMart Netaji Subhash Place', address: 'NSP Complex, Pitampura, New Delhi - 110034', rating: 4.1 },
      { id: 'd5', name: 'DMart Vivek Vihar', address: 'Main Road, Vivek Vihar Phase I, Delhi - 110095', rating: 3.9 },
      { id: 'd6', name: 'DMart Janakpuri', address: 'C-Block Market, Janakpuri, New Delhi - 110058', rating: 4.2 },
    ],
    'Reliance Fresh': [
      { id: 'd7', name: 'Reliance Fresh Saket', address: 'Select Citywalk Mall, Saket, New Delhi - 110017', rating: 4.0 },
      { id: 'd8', name: 'Reliance Fresh Karol Bagh', address: 'Ajmal Khan Road, Karol Bagh, New Delhi - 110005', rating: 3.8 },
      { id: 'd9', name: 'Reliance Fresh Rohini', address: 'Sector 3, Rohini, New Delhi - 110085', rating: 4.1 },
    ],
    'Big Bazaar': [
      { id: 'd10', name: 'Big Bazaar Noida', address: 'Great India Place, Sector 38A, Noida - 201301', rating: 4.0 },
      { id: 'd11', name: 'Big Bazaar Connaught Place', address: 'Block A, Connaught Place, New Delhi - 110001', rating: 3.9 },
      { id: 'd12', name: 'Big Bazaar Vasant Kunj', address: 'Ambience Mall, Vasant Kunj, New Delhi - 110070', rating: 4.2 },
    ],
  },
  'Mumbai': {
    'Smart Bazaar': [
      { id: 'm1', name: 'Smart Bazaar Thane', address: 'Viviana Mall, Eastern Express Hwy, Thane West - 400601', rating: 4.4 },
      { id: 'm2', name: 'Smart Bazaar Borivali', address: 'IC Colony, Borivali West, Mumbai - 400103', rating: 4.1 },
      { id: 'm3', name: 'Smart Bazaar Kalyan', address: 'Metro Junction Mall, Kalyan West - 421301', rating: 4.0 },
    ],
    'DMart': [
      { id: 'm4', name: 'DMart Powai', address: 'Hiranandani Gardens, Powai, Mumbai - 400076', rating: 4.3 },
      { id: 'm5', name: 'DMart Malad', address: 'Infinity Mall, Link Road, Malad West - 400064', rating: 4.0 },
      { id: 'm6', name: 'DMart Ghatkopar', address: 'LBS Marg, Ghatkopar West, Mumbai - 400086', rating: 4.2 },
    ],
    'Reliance Fresh': [
      { id: 'm7', name: 'Reliance Fresh Andheri', address: 'Lokhandwala Complex, Andheri West, Mumbai - 400053', rating: 4.0 },
      { id: 'm8', name: 'Reliance Fresh Bandra', address: 'Hill Road, Bandra West, Mumbai - 400050', rating: 4.1 },
      { id: 'm9', name: 'Reliance Fresh Vashi', address: 'Raghuleela Mall, Vashi, Navi Mumbai - 400703', rating: 3.9 },
    ],
    'Star Bazaar': [
      { id: 'm10', name: 'Star Bazaar Matunga', address: 'King Circle, Matunga, Mumbai - 400019', rating: 4.0 },
      { id: 'm11', name: 'Star Bazaar Chembur', address: 'RK Studio Rd, Chembur, Mumbai - 400071', rating: 3.8 },
      { id: 'm12', name: 'Star Bazaar Mulund', address: 'LBS Road, Mulund West, Mumbai - 400080', rating: 4.1 },
    ],
    'Spencer\'s': [
      { id: 'm13', name: 'Spencer\'s Bandra', address: 'Turner Road, Bandra West, Mumbai - 400050', rating: 3.9 },
      { id: 'm14', name: 'Spencer\'s Lower Parel', address: 'Phoenix Mills, Lower Parel, Mumbai - 400013', rating: 4.2 },
      { id: 'm15', name: 'Spencer\'s Dadar', address: 'Prabhadevi, Dadar West, Mumbai - 400025', rating: 3.8 },
    ],
  },
  'Kolkata': {
    'Smart Bazaar': [
      { id: 'k1', name: 'Smart Bazaar Salt Lake', address: 'City Centre, Sector V, Salt Lake, Kolkata - 700091', rating: 4.2 },
      { id: 'k2', name: 'Smart Bazaar Howrah', address: 'Avani Riverside Mall, Howrah - 711101', rating: 4.0 },
      { id: 'k3', name: 'Smart Bazaar New Town', address: 'Axis Mall, New Town, Kolkata - 700156', rating: 4.3 },
    ],
    'Spencer\'s': [
      { id: 'k4', name: 'Spencer\'s Park Street', address: '14 Park Street, Kolkata - 700016', rating: 3.9 },
      { id: 'k5', name: 'Spencer\'s Gariahat', address: 'Dover Lane, Gariahat, Kolkata - 700029', rating: 4.0 },
      { id: 'k6', name: 'Spencer\'s EM Bypass', address: 'South City Mall, EM Bypass, Kolkata - 700078', rating: 4.1 },
    ],
    'Big Bazaar': [
      { id: 'k7', name: 'Big Bazaar Mani Square', address: 'EM Bypass, Mani Square Mall, Kolkata - 700107', rating: 4.0 },
      { id: 'k8', name: 'Big Bazaar Behala', address: 'Diamond Harbour Rd, Behala, Kolkata - 700034', rating: 3.8 },
      { id: 'k9', name: 'Big Bazaar Dumdum', address: 'Jessore Road, Dumdum, Kolkata - 700028', rating: 3.9 },
    ],
    'More Supermarket': [
      { id: 'k10', name: 'More Supermarket Ballygunge', address: 'Gariahat Road, Ballygunge, Kolkata - 700019', rating: 3.7 },
      { id: 'k11', name: 'More Supermarket Jadavpur', address: 'Raja SC Mallick Rd, Jadavpur, Kolkata - 700032', rating: 3.8 },
      { id: 'k12', name: 'More Supermarket Alipore', address: 'Alipore Rd, Alipore, Kolkata - 700027', rating: 4.0 },
    ],
  },
  'Bangalore': {
    'DMart': [
      { id: 'b1', name: 'DMart Koramangala', address: '80 Feet Road, Koramangala, Bangalore - 560034', rating: 4.3 },
      { id: 'b2', name: 'DMart HSR Layout', address: 'HSR Layout Sector 2, Bangalore - 560102', rating: 4.1 },
      { id: 'b3', name: 'DMart Electronic City', address: 'Hosur Road, Electronic City Phase 1 - 560100', rating: 4.0 },
    ],
    'Reliance Fresh': [
      { id: 'b4', name: 'Reliance Fresh Indiranagar', address: '100 Feet Road, Indiranagar, Bangalore - 560038', rating: 4.1 },
      { id: 'b5', name: 'Reliance Fresh JP Nagar', address: '15th Cross, JP Nagar Phase 6, Bangalore - 560078', rating: 3.9 },
      { id: 'b6', name: 'Reliance Fresh Whitefield', address: 'ITPL Main Road, Whitefield, Bangalore - 560066', rating: 4.0 },
    ],
    'More Supermarket': [
      { id: 'b7', name: 'More Supermarket Whitefield', address: 'ITPL Main Road, Whitefield, Bangalore - 560066', rating: 3.9 },
      { id: 'b8', name: 'More Supermarket BTM Layout', address: '1st Stage, BTM Layout, Bangalore - 560029', rating: 3.8 },
      { id: 'b9', name: 'More Supermarket Marathahalli', address: 'Outer Ring Road, Marathahalli, Bangalore - 560037', rating: 4.0 },
    ],
    'Big Bazaar': [
      { id: 'b10', name: 'Big Bazaar MG Road', address: 'MG Road Metro Station, Bangalore - 560001', rating: 4.0 },
      { id: 'b11', name: 'Big Bazaar Jayanagar', address: '11th Main, 4th Block, Jayanagar, Bangalore - 560011', rating: 4.1 },
      { id: 'b12', name: 'Big Bazaar Rajajinagar', address: 'Rajajinagar, Bangalore - 560010', rating: 3.9 },
    ],
    'Star Bazaar': [
      { id: 'b13', name: 'Star Bazaar Bannerghatta', address: 'Bannerghatta Road, Bangalore - 560076', rating: 4.1 },
      { id: 'b14', name: 'Star Bazaar Sarjapur Road', address: 'Sarjapur Road, Bangalore - 560035', rating: 4.0 },
      { id: 'b15', name: 'Star Bazaar Yelahanka', address: 'Main Road, Yelahanka, Bangalore - 560064', rating: 3.8 },
    ],
    'Spencer\'s': [
      { id: 'b16', name: 'Spencer\'s MG Road', address: 'MG Road, Bangalore - 560001', rating: 3.9 },
      { id: 'b17', name: 'Spencer\'s Malleshwaram', address: '8th Cross, Malleshwaram, Bangalore - 560003', rating: 4.0 },
      { id: 'b18', name: 'Spencer\'s Indiranagar', address: '12th Main, Indiranagar, Bangalore - 560038', rating: 4.1 },
    ],
  },
  'Hyderabad': {
    'Smart Bazaar': [
      { id: 'h1', name: 'Smart Bazaar Kukatpally', address: 'KPHB Colony, Kukatpally, Hyderabad - 500085', rating: 4.2 },
      { id: 'h2', name: 'Smart Bazaar Ameerpet', address: 'Ameerpet Main Road, Hyderabad - 500016', rating: 4.0 },
      { id: 'h3', name: 'Smart Bazaar Secunderabad', address: 'MG Road, Secunderabad, Hyderabad - 500003', rating: 4.1 },
    ],
    'DMart': [
      { id: 'h4', name: 'DMart Madhapur', address: 'Hitech City Road, Madhapur, Hyderabad - 500081', rating: 4.3 },
      { id: 'h5', name: 'DMart Dilsukhnagar', address: 'Moosarambagh, Dilsukhnagar, Hyderabad - 500036', rating: 4.0 },
      { id: 'h6', name: 'DMart Kondapur', address: 'Kothaguda Junction, Kondapur, Hyderabad - 500084', rating: 4.2 },
    ],
    'Reliance Fresh': [
      { id: 'h7', name: 'Reliance Fresh Banjara Hills', address: 'Road No 12, Banjara Hills, Hyderabad - 500034', rating: 4.1 },
      { id: 'h8', name: 'Reliance Fresh Jubilee Hills', address: 'Road No 36, Jubilee Hills, Hyderabad - 500033', rating: 4.0 },
      { id: 'h9', name: 'Reliance Fresh Begumpet', address: 'Greenlands, Begumpet, Hyderabad - 500016', rating: 3.9 },
    ],
    'Star Bazaar': [
      { id: 'h10', name: 'Star Bazaar Banjara Hills', address: 'Road No 12, Banjara Hills, Hyderabad - 500034', rating: 4.1 },
      { id: 'h11', name: 'Star Bazaar Gachibowli', address: 'DLF Cyber City, Gachibowli, Hyderabad - 500032', rating: 4.0 },
      { id: 'h12', name: 'Star Bazaar LB Nagar', address: 'LB Nagar Circle, Hyderabad - 500074', rating: 3.9 },
    ],
    'More Supermarket': [
      { id: 'h13', name: 'More Supermarket Miyapur', address: 'Miyapur X Roads, Hyderabad - 500049', rating: 3.8 },
      { id: 'h14', name: 'More Supermarket Tolichowki', address: 'Tolichowki, Hyderabad - 500008', rating: 3.7 },
      { id: 'h15', name: 'More Supermarket SR Nagar', address: 'SR Nagar, Hyderabad - 500038', rating: 3.9 },
    ],
    'Big Bazaar': [
      { id: 'h16', name: 'Big Bazaar Abids', address: 'Abids Circle, Hyderabad - 500001', rating: 4.0 },
      { id: 'h17', name: 'Big Bazaar Hitech City', address: 'Inorbit Mall, Hitech City, Hyderabad - 500081', rating: 4.2 },
      { id: 'h18', name: 'Big Bazaar Malakpet', address: 'Malakpet, Hyderabad - 500036', rating: 3.8 },
    ],
  },
};

export function renderHome(app, router) {
  const user = getUser();

  // State
  let selectedCity = '';
  let selectedBrand = '';
  let selectedStore = null;
  let showProfile = false;
  let cityDropdownOpen = false;
  let brandDropdownOpen = false;
  let storeDropdownOpen = false;
  let locating = false;
  let locationError = '';

  // City coordinates for nearest-city detection
  const CITY_COORDS = {
    'Delhi':     { lat: 28.6139, lng: 77.2090 },
    'Mumbai':    { lat: 19.0760, lng: 72.8777 },
    'Kolkata':   { lat: 22.5726, lng: 88.3639 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  };

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      locationError = 'Geolocation not supported';
      render();
      return;
    }
    locating = true;
    locationError = '';
    render();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = cities[0];
        let minDist = Infinity;
        for (const [city, coords] of Object.entries(CITY_COORDS)) {
          const dist = haversineDistance(latitude, longitude, coords.lat, coords.lng);
          if (dist < minDist) {
            minDist = dist;
            nearest = city;
          }
        }
        selectedCity = nearest;
        selectedBrand = '';
        selectedStore = null;
        locating = false;
        locationError = '';
        router.showToast(`📍 Detected: ${nearest} (${Math.round(minDist)} km away)`, 'success');
        render();
      },
      (err) => {
        locating = false;
        locationError = err.code === 1 ? 'Location access denied' : 'Could not get location';
        render();
        router.showToast(locationError, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  // Derived data from demo
  const cities = Object.keys(DEMO_DATA);

  function getBrands() {
    if (!selectedCity || !DEMO_DATA[selectedCity]) return [];
    return Object.keys(DEMO_DATA[selectedCity]);
  }

  function getStores() {
    if (!selectedCity || !selectedBrand || !DEMO_DATA[selectedCity]?.[selectedBrand]) return [];
    return DEMO_DATA[selectedCity][selectedBrand];
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  function getCityIcon(city) {
    const icons = { 'Delhi': '🏛️', 'Mumbai': '🌊', 'Kolkata': '🌉', 'Bangalore': '💻', 'Hyderabad': '🕌' };
    return icons[city] || '📍';
  }

  function startShopping() {
    if (!selectedStore) return;
    localStorage.setItem('sc_city', selectedCity);
    localStorage.setItem('sc_store', JSON.stringify(selectedStore));
    router.navigate('scanner');
  }

  function render() {
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    const greeting = getGreeting();
    const brandsAvailable = getBrands();
    const storesAvailable = getStores();

    // Progress
    const progress = selectedStore ? 3 : selectedBrand ? 2 : selectedCity ? 1 : 0;

    app.innerHTML = `
      <div class="page">
        <!-- Header -->
        <div class="home-header">
          <div class="home-greeting">
            <h2>${greeting}, ${user?.name?.split(' ')[0] || 'User'}</h2>
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

        <!-- Progress Bar -->
        <div class="select-progress">
          <div class="select-progress-fill" style="width: ${(progress / 3) * 100}%"></div>
        </div>
        <div class="select-progress-label">${progress === 0 ? 'Start by selecting a city' : progress === 1 ? 'Now select a brand' : progress === 2 ? 'Choose your store' : '✓ Ready to shop!'}</div>

        <!-- Step 1: City Dropdown -->
        <div class="dropdown-section animate-fade" style="animation-delay:0.05s">
          <div class="dropdown-label-row">
            <label class="dropdown-label">
              <span class="material-icons-round" style="font-size:18px;color:var(--accent-secondary)">location_on</span>
              Select City
            </label>
            <button class="locate-btn ${locating ? 'locating' : ''}" id="locate-btn" ${locating ? 'disabled' : ''}>
              <span class="material-icons-round ${locating ? 'spin-icon' : ''}">${locating ? 'sync' : 'my_location'}</span>
              ${locating ? 'Detecting...' : 'Use My Location'}
            </button>
          </div>
          ${locationError ? `<div class="location-error"><span class="material-icons-round" style="font-size:14px">error_outline</span> ${locationError}</div>` : ''}
          <div class="custom-dropdown ${cityDropdownOpen ? 'open' : ''}" id="city-dropdown">
            <button class="dropdown-trigger" id="city-trigger">
              <span class="dropdown-value ${selectedCity ? '' : 'placeholder'}">
                ${selectedCity ? `${getCityIcon(selectedCity)} ${selectedCity}` : 'Choose your city...'}
              </span>
              <span class="material-icons-round dropdown-chevron">expand_more</span>
            </button>
            ${cityDropdownOpen ? `
              <div class="dropdown-menu" id="city-menu">
                ${cities.map(c => `
                  <button class="dropdown-item ${c === selectedCity ? 'selected' : ''}" data-city="${c}">
                    <span class="dropdown-item-icon">${getCityIcon(c)}</span>
                    <span>${c}</span>
                    ${c === selectedCity ? '<span class="material-icons-round" style="font-size:18px;color:var(--success);margin-left:auto">check_circle</span>' : ''}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Step 2: Brand Dropdown -->
        <div class="dropdown-section animate-fade ${!selectedCity ? 'disabled' : ''}" style="animation-delay:0.1s">
          <label class="dropdown-label">
            <span class="material-icons-round" style="font-size:18px;color:var(--accent-secondary)">storefront</span>
            Select Brand
          </label>
          <div class="custom-dropdown ${brandDropdownOpen ? 'open' : ''}" id="brand-dropdown">
            <button class="dropdown-trigger ${!selectedCity ? 'disabled' : ''}" id="brand-trigger" ${!selectedCity ? 'disabled' : ''}>
              <span class="dropdown-value ${selectedBrand ? '' : 'placeholder'}">
                ${selectedBrand ? `🏪 ${selectedBrand}` : selectedCity ? 'Choose a brand...' : 'Select city first...'}
              </span>
              <span class="material-icons-round dropdown-chevron">expand_more</span>
            </button>
            ${brandDropdownOpen && selectedCity ? `
              <div class="dropdown-menu" id="brand-menu">
                ${brandsAvailable.map(b => `
                  <button class="dropdown-item ${b === selectedBrand ? 'selected' : ''}" data-brand="${b}">
                    <span class="dropdown-item-icon">🏪</span>
                    <span>${b}</span>
                    <span class="dropdown-item-count">${DEMO_DATA[selectedCity][b].length} stores</span>
                    ${b === selectedBrand ? '<span class="material-icons-round" style="font-size:18px;color:var(--success)">check_circle</span>' : ''}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Step 3: Store Dropdown -->
        <div class="dropdown-section animate-fade ${!selectedBrand ? 'disabled' : ''}" style="animation-delay:0.15s">
          <label class="dropdown-label">
            <span class="material-icons-round" style="font-size:18px;color:var(--accent-secondary)">place</span>
            Select Store
          </label>
          <div class="custom-dropdown ${storeDropdownOpen ? 'open' : ''}" id="store-dropdown">
            <button class="dropdown-trigger ${!selectedBrand ? 'disabled' : ''}" id="store-trigger" ${!selectedBrand ? 'disabled' : ''}>
              <span class="dropdown-value ${selectedStore ? '' : 'placeholder'}">
                ${selectedStore ? `📍 ${selectedStore.name}` : selectedBrand ? 'Choose a store...' : 'Select brand first...'}
              </span>
              <span class="material-icons-round dropdown-chevron">expand_more</span>
            </button>
            ${storeDropdownOpen && selectedBrand ? `
              <div class="dropdown-menu" id="store-menu">
                ${storesAvailable.map(s => `
                  <button class="dropdown-item store-dropdown-item ${selectedStore?.id === s.id ? 'selected' : ''}" data-store-id="${s.id}">
                    <div class="store-item-info">
                      <div class="store-item-name">${s.name}</div>
                      <div class="store-item-address">${s.address}</div>
                      <div class="store-item-rating">
                        <span class="material-icons-round" style="font-size:13px">star</span>
                        ${s.rating?.toFixed(1) || '4.0'}
                      </div>
                    </div>
                    ${selectedStore?.id === s.id ? '<span class="material-icons-round" style="font-size:18px;color:var(--success);flex-shrink:0">check_circle</span>' : ''}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Selected Store Summary + Start Button -->
        ${selectedStore ? `
          <div class="store-summary animate-slide">
            <div class="store-summary-card">
              <div class="store-summary-icon">
                <span class="material-icons-round">store</span>
              </div>
              <div class="store-summary-details">
                <div class="store-summary-name">${selectedStore.name}</div>
                <div class="store-summary-addr">${selectedStore.address}</div>
                <div class="store-summary-meta">
                  <span>${selectedCity}</span>
                  <span>•</span>
                  <span>${selectedBrand}</span>
                  <span>•</span>
                  <span class="store-summary-rating">
                    <span class="material-icons-round" style="font-size:13px">star</span>
                    ${selectedStore.rating?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-block" id="start-shopping-btn" style="margin-top:16px;">
              <span class="material-icons-round" style="font-size:20px">qr_code_scanner</span>
              Start Shopping
            </button>
          </div>
        ` : ''}
      </div>
    `;

    bindEvents();
  }

  function closeAllDropdowns() {
    cityDropdownOpen = false;
    brandDropdownOpen = false;
    storeDropdownOpen = false;
  }

  function bindEvents() {
    // Avatar
    document.getElementById('avatar-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
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

    // Locate button
    document.getElementById('locate-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      detectLocation();
    });

    // City dropdown
    document.getElementById('city-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = cityDropdownOpen;
      closeAllDropdowns();
      cityDropdownOpen = !wasOpen;
      render();
    });

    // Brand dropdown
    document.getElementById('brand-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedCity) return;
      const wasOpen = brandDropdownOpen;
      closeAllDropdowns();
      brandDropdownOpen = !wasOpen;
      render();
    });

    // Store dropdown
    document.getElementById('store-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedBrand) return;
      const wasOpen = storeDropdownOpen;
      closeAllDropdowns();
      storeDropdownOpen = !wasOpen;
      render();
    });

    // City items
    document.querySelectorAll('[data-city]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedCity = btn.dataset.city;
        selectedBrand = '';
        selectedStore = null;
        closeAllDropdowns();
        render();
      });
    });

    // Brand items
    document.querySelectorAll('[data-brand]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedBrand = btn.dataset.brand;
        selectedStore = null;
        closeAllDropdowns();
        render();
      });
    });

    // Store items
    document.querySelectorAll('[data-store-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const stores = getStores();
        const store = stores.find(s => String(s.id) === btn.dataset.storeId);
        if (store) {
          selectedStore = store;
          closeAllDropdowns();
          render();
        }
      });
    });

    // Start shopping
    document.getElementById('start-shopping-btn')?.addEventListener('click', startShopping);

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      if (cityDropdownOpen || brandDropdownOpen || storeDropdownOpen || showProfile) {
        closeAllDropdowns();
        showProfile = false;
        render();
      }
    }, { once: true });
  }

  render();
}
