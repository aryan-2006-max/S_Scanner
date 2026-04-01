export function renderCart(app, router) {
  function getCart() {
    return JSON.parse(localStorage.getItem('sc_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('sc_cart', JSON.stringify(cart));
    router.updateCartBadge();
  }

  function render() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const gstRate = 0.18;
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const gstTotal = subtotal * gstRate;
    const grandTotal = subtotal + gstTotal;

    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 class="page-title">Your Cart</h1>
            <p class="page-subtitle">${cart.length} item${cart.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        ${cart.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">shopping_cart</span>
            <h3>Your cart is empty</h3>
            <p>Scan products to add them to your cart</p>
            <button class="btn btn-primary" id="go-scan">
              <span class="material-icons-round" style="font-size:18px">qr_code_scanner</span>
              Start Scanning
            </button>
          </div>
        ` : `
          <div class="stagger-children">
            ${cart.map((item, i) => `
              <div class="cart-item" data-index="${i}">
                <img class="cart-item-img" src="${item.product.image_url || ''}" 
                     alt="${item.product.name}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22100%22/><text fill=%22%236c5ce7%22 x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2230%22>📦</text></svg>'" />
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.product.name}</div>
                  <div class="cart-item-price">₹${(item.product.price * item.quantity).toFixed(2)}</div>
                  <div class="quantity-selector" style="margin-top:6px;display:inline-flex">
                    <button class="cart-qty-btn" data-index="${i}" data-action="minus">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" data-index="${i}" data-action="plus">+</button>
                  </div>
                </div>
                <button class="cart-item-remove" data-index="${i}" title="Remove item">
                  <span class="material-icons-round">delete_outline</span>
                </button>
              </div>
            `).join('')}
          </div>

          <div class="cart-summary animate-fade">
            <div class="section-title mb-8">
              <span class="material-icons-round">receipt</span>
              Price Details
            </div>
            <div class="summary-row">
              <span class="summary-label">Subtotal (${cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span class="summary-value">₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">CGST (9%)</span>
              <span class="summary-value">₹${cgst.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">SGST (9%)</span>
              <span class="summary-value">₹${sgst.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Grand Total</span>
              <span class="summary-value">₹${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-top:20px">
            <button class="btn btn-secondary" id="continue-scan" style="flex:1">
              <span class="material-icons-round" style="font-size:18px">qr_code_scanner</span>
              Add More
            </button>
            <button class="btn btn-primary" id="proceed-pay" style="flex:1">
              <span class="material-icons-round" style="font-size:18px">payment</span>
              Pay ₹${grandTotal.toFixed(2)}
            </button>
          </div>
        `}
      </div>
    `;

    // Events
    document.getElementById('back-btn')?.addEventListener('click', () => router.navigate('home'));
    document.getElementById('go-scan')?.addEventListener('click', () => router.navigate('scanner'));
    document.getElementById('continue-scan')?.addEventListener('click', () => router.navigate('scanner'));
    document.getElementById('proceed-pay')?.addEventListener('click', () => router.navigate('payment'));

    // Quantity buttons
    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart();
        const idx = parseInt(btn.dataset.index);
        if (btn.dataset.action === 'plus') {
          cart[idx].quantity++;
        } else if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        }
        saveCart(cart);
        render();
      });
    });

    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = getCart();
        const idx = parseInt(btn.dataset.index);
        const itemName = cart[idx].product.name;
        cart.splice(idx, 1);
        saveCart(cart);
        router.showToast(`${itemName} removed`, 'success');
        render();
      });
    });
  }

  render();
}
