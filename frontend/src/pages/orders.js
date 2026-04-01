import { apiFetch } from '../utils/api.js';

export function renderOrders(app, router) {
  let orders = [];
  let loading = true;
  let selectedOrder = null;

  async function loadOrders() {
    try {
      const data = await apiFetch('/orders');
      orders = data.orders || [];
    } catch (err) {
      console.error('Orders error:', err);
      if (err.message.includes('Access denied') || err.message.includes('token')) {
        router.showToast('Please log in to view orders', 'error');
        router.navigate('signup');
        return;
      }
    }
    loading = false;
    render();
  }

  async function loadOrderDetail(orderId) {
    try {
      const data = await apiFetch(`/orders/${orderId}`);
      selectedOrder = data.order;
    } catch (err) {
      router.showToast('Failed to load order details', 'error');
    }
    render();
  }

  function render() {
    if (selectedOrder) {
      renderOrderDetail();
      return;
    }

    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-btn">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 class="page-title">My Orders</h1>
            <p class="page-subtitle">${orders.length} order${orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        ${loading ? `
          <div class="loading-spinner"></div>
        ` : orders.length === 0 ? `
          <div class="empty-state">
            <span class="material-icons-round">receipt_long</span>
            <h3>No orders yet</h3>
            <p>Your purchase history will appear here</p>
            <button class="btn btn-primary" id="go-shop">
              <span class="material-icons-round" style="font-size:18px">storefront</span>
              Start Shopping
            </button>
          </div>
        ` : `
          <div class="orders-list stagger-children">
            ${orders.map(o => {
              const date = new Date(o.created_at);
              const formatted = date.toLocaleDateString('en-IN', { 
                day: '2-digit', month: 'short', year: 'numeric' 
              });
              return `
                <div class="order-card" data-order-id="${o.id}">
                  <div class="order-card-header">
                    <div>
                      <div class="order-id">#${o.transaction_id || o.id}</div>
                      <div class="order-store">${o.store_name || 'ScanCart Store'}</div>
                    </div>
                    <div class="order-date">${formatted}</div>
                  </div>
                  <div class="order-items-count">${o.item_count || '—'} item${(o.item_count || 0) !== 1 ? 's' : ''} • ${(o.payment_method || '').toUpperCase()}</div>
                  <div class="order-card-footer">
                    <div class="order-total">₹${o.grand_total?.toFixed(2)}</div>
                    <span class="order-status ${o.payment_status || 'completed'}">${o.payment_status || 'completed'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    document.getElementById('back-btn')?.addEventListener('click', () => router.navigate('home'));
    document.getElementById('go-shop')?.addEventListener('click', () => router.navigate('home'));

    document.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('click', () => {
        loadOrderDetail(card.dataset.orderId);
      });
    });
  }

  function renderOrderDetail() {
    const o = selectedOrder;
    const items = o.items || [];
    const date = new Date(o.created_at);
    const formatted = date.toLocaleDateString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    app.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="back-btn" id="back-to-orders">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 class="page-title">Order Detail</h1>
            <p class="page-subtitle">${formatted}</p>
          </div>
        </div>

        <div class="bill-container animate-fade">
          <div class="bill-header">
            <h2>${o.store_name || 'ScanCart Store'}</h2>
            ${o.store_address ? `<p>${o.store_address}</p>` : ''}
            <p style="margin-top:4px">
              <span class="order-status ${o.payment_status || 'completed'}">${o.payment_status || 'completed'}</span>
            </p>
          </div>

          <div class="bill-items">
            ${items.map(item => `
              <div class="bill-item">
                <span class="bill-item-name">${item.name}</span>
                <span class="bill-item-qty">×${item.quantity}</span>
                <span class="bill-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <hr class="bill-divider" />

          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">₹${o.subtotal?.toFixed(2)}</span>
          </div>
          ${o.discount > 0 ? `
            <div class="summary-row discount">
              <span class="summary-label">Discount${o.offer_code ? ` (${o.offer_code})` : ''}</span>
              <span class="summary-value">-₹${o.discount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="summary-row">
            <span class="summary-label">GST (18%)</span>
            <span class="summary-value">₹${o.gst_amount?.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">Grand Total</span>
            <span class="summary-value">₹${o.grand_total?.toFixed(2)}</span>
          </div>

          <div class="bill-meta">
            <div class="bill-meta-item">
              <div class="bill-meta-label">Transaction ID</div>
              <div class="bill-meta-value">${o.transaction_id || '—'}</div>
            </div>
            <div class="bill-meta-item">
              <div class="bill-meta-label">Payment</div>
              <div class="bill-meta-value">${(o.payment_method || '').toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('back-to-orders')?.addEventListener('click', () => {
      selectedOrder = null;
      render();
    });
  }

  loadOrders();
}
