import { apiFetch } from '../utils/api.js';

export function renderScanner(app, router) {
  const store = JSON.parse(localStorage.getItem('sc_store') || '{}');
  let scannerInstance = null;
  let scannedProduct = null;
  let quantity = 1;
  let manualMode = false;

  function render() {
    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 class="page-title">Scan Products</h1>
            <p class="page-subtitle">${store.name || 'Select a store first'}</p>
          </div>
        </div>

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

        <div class="mt-16">
          <div class="section-title">
            <span class="material-icons-round">inventory_2</span>
            Quick Add — Sample Barcodes
          </div>
          <div class="city-chips" style="flex-wrap:wrap;">
            <button class="city-chip" data-barcode="8901030793912">Aashirvaad Atta</button>
            <button class="city-chip" data-barcode="8901725183004">Tata Salt</button>
            <button class="city-chip" data-barcode="8901063024144">Maggi Noodles</button>
            <button class="city-chip" data-barcode="8902080700202">Coca-Cola</button>
            <button class="city-chip" data-barcode="8901491101769">Lay's Chips</button>
            <button class="city-chip" data-barcode="8901063157002">KitKat</button>
            <button class="city-chip" data-barcode="0012345678905">Echo Dot</button>
            <button class="city-chip" data-barcode="0012345678929">Kindle</button>
          </div>
        </div>
      </div>

      ${scannedProduct ? renderProductPopup() : ''}
    `;

    bindEvents();
    if (!manualMode) initScanner();
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
            Add to Cart
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

    // Quick-add barcode chips
    document.querySelectorAll('[data-barcode]').forEach(btn => {
      btn.addEventListener('click', () => lookupBarcode(btn.dataset.barcode));
    });

    // Product popup events
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        document.getElementById('qty-display').textContent = quantity;
      }
    });

    document.getElementById('qty-plus')?.addEventListener('click', () => {
      quantity++;
      document.getElementById('qty-display').textContent = quantity;
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
      // Camera might not be available — that's ok, manual mode works
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
