import { apiFetch } from '../utils/api.js';
import { lookupDemoProduct, getAllDemoProducts } from '../utils/demoProducts.js';

export function renderScanner(app, router) {
  const store = JSON.parse(localStorage.getItem('sc_store') || '{}');
  let scannerInstance = null;
  let scannedProduct = null;
  let quantity = 1;
  let manualMode = false;
  let activeCategory = 'All';

  // Get unique categories from demo products
  const allProducts = getAllDemoProducts();
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  function getFilteredProducts() {
    if (activeCategory === 'All') return allProducts;
    return allProducts.filter(p => p.category === activeCategory);
  }

  function render() {
    const filteredProducts = getFilteredProducts();
    const cart = JSON.parse(localStorage.getItem('sc_cart') || '[]');
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div style="flex:1">
            <h1 class="page-title">Scan & Add</h1>
            <p class="page-subtitle">${store.name || 'Demo Store'}</p>
          </div>
          ${cartCount > 0 ? `
            <button class="cart-floating-btn animate-scale" id="go-to-cart">
              <span class="material-icons-round">shopping_cart</span>
              <span class="cart-floating-badge">${cartCount}</span>
            </button>
          ` : ''}
        </div>

        <!-- Scanner Section -->
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
              <input type="text" class="form-input" id="manual-barcode" placeholder="Enter barcode..." />
              <button class="btn btn-primary btn-sm" id="manual-search">
                <span class="material-icons-round" style="font-size:18px">search</span>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- ═══ DEMO PRODUCTS CATALOG ═══ -->
        <div class="demo-catalog mt-16 animate-fade">
          <div class="section-title" style="margin-bottom:4px">
            <span class="material-icons-round">inventory_2</span>
            Sample Products 
            <span class="demo-badge">DEMO</span>
          </div>
          <p class="demo-hint">Tap any product to add it to your cart for testing</p>

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

          <!-- Product Grid -->
          <div class="demo-products-grid stagger-children">
            ${filteredProducts.map(product => {
              const inCart = cart.find(i => i.product.id === product.id);
              return `
                <div class="demo-product-card ${inCart ? 'in-cart' : ''}" data-barcode="${product.barcode}">
                  <div class="demo-product-img-wrap">
                    <img class="demo-product-img" 
                         src="${product.image_url}" 
                         alt="${product.name}"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
                    ${inCart ? `<div class="demo-product-in-cart-badge">×${inCart.quantity}</div>` : ''}
                  </div>
                  <div class="demo-product-info">
                    <span class="demo-product-category">${product.category}</span>
                    <h4 class="demo-product-name">${product.name}</h4>
                    <div class="demo-product-weight">${product.weight || ''}</div>
                    <div class="demo-product-bottom">
                      <span class="demo-product-price">₹${product.price.toFixed(0)}</span>
                      <button class="demo-add-btn" data-quick-add="${product.barcode}" title="Quick add">
                        <span class="material-icons-round">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      ${scannedProduct ? renderProductPopup() : ''}
    `;

    bindEvents();
    if (!manualMode) initScanner();
  }

  function getCategoryIcon(cat) {
    const icons = {
      'All': '🛒', 'Staples': '🌾', 'Instant Food': '🍜', 'Beverages': '🥤',
      'Snacks': '🍿', 'Chocolates': '🍫', 'Electronics': '⚡', 'Biscuits': '🍪',
      'Dairy': '🧈', 'Household': '🏠', 'Personal Care': '🧴',
    };
    return icons[cat] || '📦';
  }

  function renderProductPopup() {
    return `
      <div class="product-popup" id="product-popup">
        <div class="product-popup-content">
          <img class="product-popup-img" src="${scannedProduct.image_url || ''}" 
               alt="${scannedProduct.name}" 
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
          <div class="product-popup-info">
            <div class="product-category">${scannedProduct.category || 'General'}</div>
            <h3>${scannedProduct.name}</h3>
            ${scannedProduct.description ? `<p class="product-popup-desc">${scannedProduct.description}</p>` : ''}
            <div class="product-price">₹${scannedProduct.price?.toFixed(2)}</div>
          </div>
        </div>
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
        <button class="btn btn-secondary btn-sm btn-block mt-8" id="close-popup">
          Continue Scanning
        </button>
      </div>
    `;
  }

  function bindEvents() {
    document.getElementById('back-btn')?.addEventListener('click', () => {
      stopScanner();
      router.navigate('home');
    });

    document.getElementById('go-to-cart')?.addEventListener('click', () => {
      stopScanner();
      router.navigate('cart');
    });

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

    // Category filter chips
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        render();
      });
    });

    // Product card click → show popup
    document.querySelectorAll('.demo-product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if quick-add button was clicked
        if (e.target.closest('[data-quick-add]')) return;
        lookupBarcode(card.dataset.barcode);
      });
    });

    // Quick-add buttons (add directly without popup)
    document.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const barcode = btn.dataset.quickAdd;
        const demoResult = lookupDemoProduct(barcode);
        if (demoResult) {
          quickAddToCart(demoResult.product);
        }
      });
    });

    // Product popup events
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        document.getElementById('qty-display').textContent = quantity;
        // Update the "Add ₹XX" text
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

    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      addToCart();
    });

    document.getElementById('close-popup')?.addEventListener('click', () => {
      scannedProduct = null;
      quantity = 1;
      render();
    });
  }

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
    render(); // Re-render to update in-cart badges
  }

  function addToCart() {
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
        () => {} // ignore errors during scanning
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

  // Cleanup on navigation
  return () => stopScanner();
}
