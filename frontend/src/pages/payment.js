import { apiFetch } from '../utils/api.js';

export function renderPayment(app, router) {
  let offers = [];
  let selectedOffer = null;
  let couponCode = '';
  let discount = 0;
  let paymentMethod = 'upi';
  let processing = false;

  function getCart() { return JSON.parse(localStorage.getItem('sc_cart') || '[]'); }

  async function loadOffers() {
    try {
      const data = await apiFetch('/offers');
      offers = data.offers || [];
    } catch (err) { console.error('Offers error:', err); }
    render();
  }

  function render() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const taxableAmount = subtotal - discount;
    const gst = taxableAmount * 0.18;
    const grandTotal = taxableAmount + gst;

    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 class="page-title">Checkout</h1>
            <p class="page-subtitle">${cart.length} items • ₹${grandTotal.toFixed(2)}</p>
          </div>
        </div>

        <!-- ═══ OFFERS SECTION ═══ -->
        <div class="offers-section animate-fade">
          <h3 class="section-title">
            <span class="material-icons-round">local_offer</span>
            Available Offers
          </h3>
          
          ${offers.length > 0 ? `
            <div class="offers-scroll">
              ${offers.map(o => `
                <div class="offer-card ${selectedOffer?.id === o.id ? 'selected' : ''}" data-offer-id="${o.id}">
                  <div class="offer-title">${o.title}</div>
                  <div class="offer-desc">${o.description}</div>
                  <div class="offer-code">${o.code}</div>
                  ${o.min_order > 0 ? `<div class="offer-min">Min order: ₹${o.min_order}</div>` : `<div class="offer-min">No minimum order</div>`}
                  ${selectedOffer?.id === o.id ? `<div class="applied-badge mt-8"><span class="material-icons-round" style="font-size:14px">check_circle</span> Applied</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : '<p class="text-muted" style="font-size:13px">Loading offers...</p>'}

          <div class="coupon-input-group">
            <input type="text" class="form-input" id="coupon-input" placeholder="Enter coupon code" value="${couponCode}" />
            <button class="btn btn-secondary btn-sm" id="apply-coupon">Apply</button>
          </div>

          ${discount > 0 ? `
            <div class="applied-badge mt-8" style="font-size:13px">
              <span class="material-icons-round" style="font-size:16px">celebration</span>
              You save ₹${discount.toFixed(2)}!
            </div>
          ` : ''}
        </div>

        <!-- ═══ PAYMENT METHODS ═══ -->
        <div class="payment-methods">
          <h3 class="section-title">
            <span class="material-icons-round">payment</span>
            Payment Method
          </h3>

          <div class="method-tabs">
            <button class="method-tab ${paymentMethod === 'upi' ? 'active' : ''}" data-method="upi">
              <span class="material-icons-round">account_balance</span>
              UPI
            </button>
            <button class="method-tab ${paymentMethod === 'card' ? 'active' : ''}" data-method="card">
              <span class="material-icons-round">credit_card</span>
              Card
            </button>
            <button class="method-tab ${paymentMethod === 'wallet' ? 'active' : ''}" data-method="wallet">
              <span class="material-icons-round">account_balance_wallet</span>
              Wallet
            </button>
          </div>

          <div class="payment-form-area">
            ${renderPaymentForm()}
          </div>
        </div>

        <!-- ═══ ORDER SUMMARY ═══ -->
        <div class="cart-summary">
          <div class="section-title mb-8">
            <span class="material-icons-round">receipt</span>
            Order Summary
          </div>
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">₹${subtotal.toFixed(2)}</span>
          </div>
          ${discount > 0 ? `
            <div class="summary-row discount">
              <span class="summary-label">Discount (${selectedOffer?.discount_percent || ''}%)</span>
              <span class="summary-value">-₹${discount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="summary-row">
            <span class="summary-label">GST (18%)</span>
            <span class="summary-value">₹${gst.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">Total</span>
            <span class="summary-value">₹${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button class="btn btn-success btn-block mt-24" id="pay-now-btn" style="font-size:16px;padding:16px">
          <span class="material-icons-round">lock</span>
          Pay ₹${grandTotal.toFixed(2)}
        </button>
      </div>

      ${processing ? `
        <div class="processing-overlay">
          <div class="spinner-large"></div>
          <p>Processing Payment...</p>
        </div>
      ` : ''}
    `;

    bindEvents();
  }

  function renderPaymentForm() {
    if (paymentMethod === 'upi') {
      return `
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">UPI ID</label>
          <input type="text" class="form-input" id="upi-id" placeholder="yourname@upi" value="demo@upi" />
        </div>
      `;
    }
    if (paymentMethod === 'card') {
      return `
        <div class="form-group">
          <label class="form-label">Card Number</label>
          <input type="text" class="form-input" id="card-number" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" maxlength="19" />
        </div>
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1;margin-bottom:0">
            <label class="form-label">Expiry</label>
            <input type="text" class="form-input" placeholder="MM/YY" value="12/28" maxlength="5" />
          </div>
          <div class="form-group" style="flex:1;margin-bottom:0">
            <label class="form-label">CVV</label>
            <input type="password" class="form-input" placeholder="•••" value="123" maxlength="3" />
          </div>
        </div>
      `;
    }
    return `
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Select Wallet</label>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-secondary btn-sm" style="flex:1">Paytm</button>
          <button class="btn btn-secondary btn-sm" style="flex:1">PhonePe</button>
          <button class="btn btn-secondary btn-sm" style="flex:1">GPay</button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.getElementById('back-btn')?.addEventListener('click', () => router.navigate('cart'));

    // Offer cards
    document.querySelectorAll('.offer-card').forEach(card => {
      card.addEventListener('click', () => {
        const offerId = parseInt(card.dataset.offerId);
        const offer = offers.find(o => o.id === offerId);
        if (!offer) return;

        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        if (subtotal < (offer.min_order || 0)) {
          router.showToast(`Min order ₹${offer.min_order} required`, 'error');
          return;
        }

        if (selectedOffer?.id === offerId) {
          selectedOffer = null;
          discount = 0;
          couponCode = '';
        } else {
          selectedOffer = offer;
          discount = Math.round((subtotal * offer.discount_percent) / 100 * 100) / 100;
          couponCode = offer.code;
        }
        render();
      });
    });

    // Coupon apply
    document.getElementById('apply-coupon')?.addEventListener('click', async () => {
      const code = document.getElementById('coupon-input')?.value?.trim();
      if (!code) return;

      const cart = getCart();
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      try {
        const data = await apiFetch('/offers/validate', {
          method: 'POST',
          body: JSON.stringify({ code, order_total: subtotal }),
        });
        selectedOffer = data.offer;
        discount = data.discount;
        couponCode = code;
        router.showToast(data.message, 'success');
        render();
      } catch (err) {
        router.showToast(err.message, 'error');
      }
    });

    // Payment method tabs
    document.querySelectorAll('.method-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        paymentMethod = tab.dataset.method;
        render();
      });
    });

    // Pay button
    document.getElementById('pay-now-btn')?.addEventListener('click', () => placeOrder());
  }

  async function placeOrder() {
    processing = true;
    render();

    const cart = getCart();
    const store = JSON.parse(localStorage.getItem('sc_store') || '{}');

    try {
      // Simulate payment delay
      await new Promise(r => setTimeout(r, 2000));

      const data = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          store_id: store.id || null,
          payment_method: paymentMethod,
          offer_code: couponCode || null,
        }),
      });

      // Clear cart
      localStorage.removeItem('sc_cart');
      router.updateCartBadge();

      // Save last order for bill page
      localStorage.setItem('sc_last_order', JSON.stringify(data.order));

      router.showToast('Payment successful! 🎉', 'success');
      router.navigate('bill');
    } catch (err) {
      processing = false;
      render();
      router.showToast(err.message || 'Payment failed', 'error');
    }
  }

  loadOffers();
}
