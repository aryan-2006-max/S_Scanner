import { apiFetch } from '../utils/api.js';
import { lookupDemoProduct, getAllDemoProducts, searchDemoProducts } from '../utils/demoProducts.js';

export function renderScanner(app, router) {
  const store = JSON.parse(localStorage.getItem('sc_store') || '{}');
  let scannerInstance = null;
  let scannedProduct = null;
  let quantity = 1;

  // State
  let activeTab = 'search';     // 'search' | 'scan'
  let searchQuery = '';
  let searchResults = null;     // null = show browse, [] = no results, [...] = results
  let activeCategory = 'All';
  let manualMode = false;

  // Get unique categories
  const allProducts = getAllDemoProducts();
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  function getFilteredProducts() {
    if (activeCategory === 'All') return allProducts;
    return allProducts.filter(p => p.category === activeCategory);
  }

  function getStockLabel(stock) {
    if (stock === 'out_of_stock') return { text: 'Out of Stock', cls: 'stock-out' };
    if (stock === 'low_stock') return { text: 'Low Stock', cls: 'stock-low' };
    return { text: 'In Stock', cls: 'stock-in' };
  }

  function getCategoryIcon(cat) {
    const icons = {
      'All': '🛒', 'Staples': '🌾', 'Instant Food': '🍜', 'Beverages': '🥤',
      'Snacks': '🍿', 'Chocolates': '🍫', 'Electronics': '⚡', 'Biscuits': '🍪',
      'Dairy': '🧈', 'Household': '🏠', 'Personal Care': '🧴',
    };
    return icons[cat] || '📦';
  }

  // ═══ MAIN RENDER ═══
  function render() {
    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    app.innerHTML = `
      <div class="page">
        <!-- Header -->
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div style="flex:1">
            <h1 class="page-title">Products</h1>
            <p class="page-subtitle">${store.name || 'Demo Store'}</p>
          </div>
          ${cartCount > 0 ? `
            <button class="cart-floating-btn animate-scale" id="go-to-cart">
              <span class="material-icons-round">shopping_cart</span>
              <span class="cart-floating-badge">${cartCount}</span>
            </button>
          ` : ''}
        </div>

        <!-- ═══ MODE TABS: Search / Scan ═══ -->
        <div class="mode-tabs animate-fade">
          <button class="mode-tab ${activeTab === 'search' ? 'active' : ''}" data-tab="search">
            <span class="material-icons-round">search</span>
            Search
          </button>
          <button class="mode-tab ${activeTab === 'scan' ? 'active' : ''}" data-tab="scan">
            <span class="material-icons-round">qr_code_scanner</span>
            Scan
          </button>
        </div>

        ${activeTab === 'search' ? renderSearchTab(cart) : renderScanTab(cart)}
      </div>

      ${scannedProduct ? renderProductPopup() : ''}
    `;

    bindEvents();
    if (activeTab === 'scan' && !manualMode) initScanner();

    // Auto-focus search input
    if (activeTab === 'search') {
      const input = document.getElementById('product-search-input');
      if (input && searchQuery) {
        input.value = searchQuery;
      }
    }
  }

  // ═══ SEARCH TAB ═══
  function renderSearchTab(cart) {
    const displayProducts = searchResults !== null ? searchResults : getFilteredProducts();
    const isSearching = searchResults !== null;

    return `
      <!-- Search Bar -->
      <div class="search-bar-wrap animate-fade">
        <div class="search-bar">
          <span class="material-icons-round search-bar-icon">search</span>
          <input type="text" 
                 class="search-bar-input" 
                 id="product-search-input" 
                 placeholder="Search products by name, category..." 
                 value="${searchQuery}"
                 autocomplete="off" />
          ${searchQuery ? `
            <button class="search-clear-btn" id="search-clear">
              <span class="material-icons-round">close</span>
            </button>
          ` : ''}
        </div>
      </div>

      ${isSearching ? `
        <!-- Search Results -->
        <div class="search-results-header">
          <span class="material-icons-round" style="font-size:18px">filter_list</span>
          ${displayProducts.length} result${displayProducts.length !== 1 ? 's' : ''} for "${searchQuery}"
        </div>
      ` : `
        <!-- Category Filter Chips -->
        <div class="category-chips-scroll">
          <div class="category-chips">
            ${categories.map(cat => `
              <button class="category-chip ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
                <span class="category-chip-icon">${getCategoryIcon(cat)}</span>
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>
      `}

      ${displayProducts.length === 0 ? `
        <div class="empty-search animate-fade">
          <span class="material-icons-round">search_off</span>
          <h3>No products found</h3>
          <p>${isSearching ? `Try a different search term` : `No products in this category`}</p>
        </div>
      ` : `
        <!-- Product List -->
        <div class="product-list stagger-children">
          ${displayProducts.map(product => {
            const inCart = cart.find(i => i.product.id === product.id);
            const stockInfo = getStockLabel(product.stock);
            const isOutOfStock = product.stock === 'out_of_stock';
            return `
              <div class="product-list-item ${inCart ? 'in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}" data-barcode="${product.barcode}">
                <div class="product-list-img-wrap">
                  <img class="product-list-img" 
                       src="${product.image_url}" 
                       alt="${product.name}"
                       loading="lazy"
                       onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
                  ${inCart ? `<div class="product-list-cart-badge">×${inCart.quantity}</div>` : ''}
                </div>
                <div class="product-list-info">
                  <div class="product-list-top">
                    <span class="product-list-category">${product.category}</span>
                    <span class="stock-badge ${stockInfo.cls}">${stockInfo.text}</span>
                  </div>
                  <h4 class="product-list-name">${highlightMatch(product.name, searchQuery)}</h4>
                  <div class="product-list-meta">${product.weight || ''} ${product.description ? '• ' + product.description : ''}</div>
                  <div class="product-list-bottom">
                    <span class="product-list-price">₹${product.price.toFixed(0)}</span>
                    ${isOutOfStock ? `
                      <span class="out-of-stock-label">Unavailable</span>
                    ` : `
                      <button class="demo-add-btn" data-quick-add="${product.barcode}" title="Add to cart">
                        <span class="material-icons-round">${inCart ? 'add' : 'add_shopping_cart'}</span>
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }

  function highlightMatch(text, query) {
    if (!query || query.trim().length === 0) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // ═══ SCAN TAB ═══
  function renderScanTab(cart) {
    return `
      <div class="scanner-container animate-scale" id="scanner-region">
        <div class="scanner-overlay">
          <div class="scanner-frame"></div>
          <div class="scanner-hint">Point camera at barcode</div>
        </div>
      </div>

      <div class="scanner-manual text-center">
        <button class="btn btn-secondary btn-sm" id="toggle-manual">
          <span class="material-icons-round" style="font-size:16px">keyboard</span>
          ${manualMode ? 'Use Camera' : 'Enter Barcode Manually'}
        </button>

        ${manualMode ? `
          <div class="manual-input-group animate-fade">
            <input type="text" class="form-input" id="manual-barcode" placeholder="Enter barcode number..." />
            <button class="btn btn-primary btn-sm" id="manual-search">
              <span class="material-icons-round" style="font-size:18px">search</span>
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Quick-pick products below scanner -->
      <div class="demo-catalog mt-16 animate-fade">
        <div class="section-title" style="margin-bottom:4px">
          <span class="material-icons-round">touch_app</span>
          Quick Add
          <span class="demo-badge">DEMO</span>
        </div>
        <p class="demo-hint">Tap to instantly add to cart</p>
        <div class="demo-products-grid stagger-children">
          ${allProducts.slice(0, 8).map(product => {
            const inCart = cart.find(i => i.product.id === product.id);
            const isOutOfStock = product.stock === 'out_of_stock';
            return `
              <div class="demo-product-card ${inCart ? 'in-cart' : ''} ${isOutOfStock ? 'out-of-stock' : ''}" data-barcode="${product.barcode}">
                <div class="demo-product-img-wrap">
                  <img class="demo-product-img" 
                       src="${product.image_url}" 
                       alt="${product.name}"
                       loading="lazy"
                       onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
                  ${inCart ? `<div class="demo-product-in-cart-badge">×${inCart.quantity}</div>` : ''}
                  ${isOutOfStock ? `<div class="demo-product-oos-overlay">Out of Stock</div>` : ''}
                </div>
                <div class="demo-product-info">
                  <span class="demo-product-category">${product.category}</span>
                  <h4 class="demo-product-name">${product.name}</h4>
                  <div class="demo-product-bottom">
                    <span class="demo-product-price">₹${product.price.toFixed(0)}</span>
                    ${!isOutOfStock ? `
                      <button class="demo-add-btn" data-quick-add="${product.barcode}" title="Quick add">
                        <span class="material-icons-round">add</span>
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ═══ PRODUCT POPUP ═══
  function renderProductPopup() {
    const stockInfo = getStockLabel(scannedProduct.stock);
    const isOutOfStock = scannedProduct.stock === 'out_of_stock';

    return `
      <div class="product-popup" id="product-popup">
        <div class="product-popup-content">
          <img class="product-popup-img" src="${scannedProduct.image_url || ''}" 
               alt="${scannedProduct.name}" 
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
          <div class="product-popup-info">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div class="product-category">${scannedProduct.category || 'General'}</div>
              <span class="stock-badge ${stockInfo.cls}" style="font-size:10px">${stockInfo.text}</span>
            </div>
            <h3>${scannedProduct.name}</h3>
            ${scannedProduct.description ? `<p class="product-popup-desc">${scannedProduct.description}</p>` : ''}
            <div class="product-price">₹${scannedProduct.price?.toFixed(2)}</div>
          </div>
        </div>
        ${isOutOfStock ? `
          <div class="oos-popup-notice">
            <span class="material-icons-round">remove_shopping_cart</span>
            This product is currently out of stock
          </div>
        ` : `
          <div class="product-popup-actions">
            <div class="quantity-selector">
              <button id="qty-minus">−</button>
              <span id="qty-display">${quantity}</span>
              <button id="qty-plus">+</button>
            </div>
            <button class="btn btn-primary" style="flex:1" id="add-to-cart-btn">
              <span class="material-icons-round" style="font-size:18px">add_shopping_cart</span>
              Add ₹${(scannedProduct.price * quantity).toFixed(2)}
            </button>
          </div>
        `}
        <button class="btn btn-secondary btn-sm btn-block mt-8" id="close-popup">
          ${isOutOfStock ? 'Go Back' : 'Continue Shopping'}
        </button>
      </div>
    `;
  }

  // ═══ EVENT BINDINGS ═══
  function bindEvents() {
    // Header actions
    document.getElementById('back-btn')?.addEventListener('click', () => {
      stopScanner();
      router.navigate('home');
    });

    document.getElementById('go-to-cart')?.addEventListener('click', () => {
      stopScanner();
      router.navigate('cart');
    });

    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const newTab = tab.dataset.tab;
        if (newTab !== activeTab) {
          stopScanner();
          activeTab = newTab;
          render();
        }
      });
    });

    // ─── SEARCH TAB EVENTS ───
    const searchInput = document.getElementById('product-search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (searchQuery.trim().length > 0) {
            searchResults = searchDemoProducts(searchQuery);
          } else {
            searchResults = null;
          }
          render();
          // Restore focus and cursor position after re-render
          const newInput = document.getElementById('product-search-input');
          if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(searchQuery.length, searchQuery.length);
          }
        }, 250);
      });
    }

    document.getElementById('search-clear')?.addEventListener('click', () => {
      searchQuery = '';
      searchResults = null;
      render();
      document.getElementById('product-search-input')?.focus();
    });

    // Category chips
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        render();
      });
    });

    // Product list item click → popup
    document.querySelectorAll('.product-list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-quick-add]')) return;
        lookupBarcode(item.dataset.barcode);
      });
    });

    // ─── SCAN TAB EVENTS ───
    document.getElementById('toggle-manual')?.addEventListener('click', () => {
      manualMode = !manualMode;
      stopScanner();
      render();
    });

    document.getElementById('manual-search')?.addEventListener('click', () => {
      const code = document.getElementById('manual-barcode')?.value?.trim();
      if (code) lookupBarcode(code);
    });

    document.getElementById('manual-barcode')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const code = e.target.value.trim();
        if (code) lookupBarcode(code);
      }
    });

    // Product card click (scan tab quick-pick grid)
    document.querySelectorAll('.demo-product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-quick-add]')) return;
        lookupBarcode(card.dataset.barcode);
      });
    });

    // Quick-add buttons (both tabs)
    document.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const barcode = btn.dataset.quickAdd;
        const demoResult = lookupDemoProduct(barcode);
        if (demoResult) {
          if (demoResult.product.stock === 'out_of_stock') {
            router.showToast('This product is out of stock', 'error');
            return;
          }
          quickAddToCart(demoResult.product);
        }
      });
    });

    // ─── POPUP EVENTS ───
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        document.getElementById('qty-display').textContent = quantity;
        const btn = document.getElementById('add-to-cart-btn');
        if (btn && scannedProduct) {
          btn.innerHTML = `<span class="material-icons-round" style="font-size:18px">add_shopping_cart</span> Add ₹${(scannedProduct.price * quantity).toFixed(2)}`;
        }
      }
    });

    document.getElementById('qty-plus')?.addEventListener('click', () => {
      quantity++;
      document.getElementById('qty-display').textContent = quantity;
      const btn = document.getElementById('add-to-cart-btn');
      if (btn && scannedProduct) {
        btn.innerHTML = `<span class="material-icons-round" style="font-size:18px">add_shopping_cart</span> Add ₹${(scannedProduct.price * quantity).toFixed(2)}`;
      }
    });

    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => addToCart());

    document.getElementById('close-popup')?.addEventListener('click', () => {
      scannedProduct = null;
      quantity = 1;
      render();
    });
  }

  // ═══ PRODUCT LOGIC ═══
  async function lookupBarcode(code) {
    // Try demo products first (works offline)
    const demoResult = lookupDemoProduct(code);
    if (demoResult) {
      scannedProduct = demoResult.product;
      quantity = 1;
      stopScanner();
      render();
      return;
    }

    // Fallback to API
    try {
      const data = await apiFetch(`/products/barcode/${code}`);
      if (data.product) {
        scannedProduct = data.product;
        quantity = 1;
        stopScanner();
        render();
      }
    } catch (err) {
      router.showToast(err.message || 'Product not found', 'error');
    }
  }

  function quickAddToCart(product) {
    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const existing = cart.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    localStorage.setItem('sc_cart', JSON.stringify(cart));
    router.updateCartBadge();
    router.showToast(`${product.name} added!`, 'success');
    render();
  }

  function addToCart() {
    if (scannedProduct.stock === 'out_of_stock') {
      router.showToast('This product is out of stock', 'error');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const existing = cart.find(item => item.product.id === scannedProduct.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product: scannedProduct, quantity });
    }

    localStorage.setItem('sc_cart', JSON.stringify(cart));
    router.updateCartBadge();
    router.showToast(`${scannedProduct.name} added to cart!`, 'success');
    scannedProduct = null;
    quantity = 1;
    render();
  }

  async function initScanner() {
    const region = document.getElementById('scanner-region');
    if (!region) return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      scannerInstance = new Html5Qrcode('scanner-region');

      await scannerInstance.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.log('Camera not available, using manual mode:', err.message);
    }
  }

  function stopScanner() {
    if (scannerInstance) {
      try { scannerInstance.stop(); } catch (e) {}
      scannerInstance = null;
    }
  }

  render();
  return () => stopScanner();
}
