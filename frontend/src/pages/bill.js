export function renderBill(app, router) {
  const order = JSON.parse(localStorage.getItem('sc_last_order') || 'null');

  if (!order) {
    app.innerHTML = `
      <div class="page">
        <div class="empty-state">
          <span class="material-icons-round">receipt_long</span>
          <h3>No bill to display</h3>
          <p>Complete a purchase to see your digital bill</p>
          <button class="btn btn-primary" id="go-home">Go Home</button>
        </div>
      </div>
    `;
    document.getElementById('go-home')?.addEventListener('click', () => router.navigate('home'));
    return;
  }

  const items = order.items || [];
  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  });
  const formattedTime = date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', minute: '2-digit', hour12: true 
  });

  app.innerHTML = `
    <div class="page">
      <div class="page-header">
        <button class="back-btn" id="back-btn">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h1 class="page-title">Digital Bill</h1>
      </div>

      <div class="bill-container animate-scale">
        <div class="bill-success-icon">
          <span class="material-icons-round">check</span>
        </div>

        <div class="bill-header">
          <h2>Payment Successful!</h2>
          <p>${order.store_name || 'ScanCart Store'}</p>
          ${order.store_address ? `<p style="margin-top:2px">${order.store_address}</p>` : ''}
        </div>

        <!-- Items -->
        <div class="bill-items">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);padding-bottom:6px;border-bottom:1px solid var(--border-color);margin-bottom:6px">
            <span style="flex:1">ITEM</span>
            <span style="min-width:35px;text-align:center">QTY</span>
            <span style="min-width:70px;text-align:right">AMOUNT</span>
          </div>
          ${items.map(item => `
            <div class="bill-item">
              <span class="bill-item-name">${item.name}</span>
              <span class="bill-item-qty">×${item.quantity}</span>
              <span class="bill-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <hr class="bill-divider" />

        <!-- Totals -->
        <div class="summary-row">
          <span class="summary-label">Subtotal</span>
          <span class="summary-value">₹${order.subtotal?.toFixed(2)}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="summary-row discount">
            <span class="summary-label">Discount ${order.offer_code ? `(${order.offer_code})` : ''}</span>
            <span class="summary-value">-₹${order.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span class="summary-label">GST (18%)</span>
          <span class="summary-value">₹${order.gst_amount?.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span class="summary-label">Total Paid</span>
          <span class="summary-value">₹${order.grand_total?.toFixed(2)}</span>
        </div>

        <!-- Meta Info -->
        <div class="bill-meta">
          <div class="bill-meta-item">
            <div class="bill-meta-label">Transaction ID</div>
            <div class="bill-meta-value">${order.transaction_id || '—'}</div>
          </div>
          <div class="bill-meta-item">
            <div class="bill-meta-label">Payment Method</div>
            <div class="bill-meta-value">${(order.payment_method || '').toUpperCase()}</div>
          </div>
          <div class="bill-meta-item">
            <div class="bill-meta-label">Date</div>
            <div class="bill-meta-value">${formattedDate}</div>
          </div>
          <div class="bill-meta-item">
            <div class="bill-meta-label">Time</div>
            <div class="bill-meta-value">${formattedTime}</div>
          </div>
        </div>

        <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px dashed var(--border-color)">
          <p style="font-size:12px;color:var(--text-muted)">Show this bill at the store exit</p>
          <p style="font-size:11px;color:var(--text-muted);margin-top:4px">Thank you for shopping with ScanCart!</p>
        </div>
      </div>

      <div class="bill-actions mt-24">
        <button class="btn btn-secondary" id="continue-shopping" style="flex:1">
          <span class="material-icons-round" style="font-size:18px">storefront</span>
          Shop More
        </button>
        <button class="btn btn-primary" id="view-orders" style="flex:1">
          <span class="material-icons-round" style="font-size:18px">receipt_long</span>
          My Orders
        </button>
      </div>
    </div>
  `;

  document.getElementById('back-btn')?.addEventListener('click', () => router.navigate('home'));
  document.getElementById('continue-shopping')?.addEventListener('click', () => router.navigate('home'));
  document.getElementById('view-orders')?.addEventListener('click', () => router.navigate('orders'));
}
