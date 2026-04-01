import { apiFetch, setAuth } from '../utils/api.js';

export function renderSignup(app, router) {
  let isLogin = false;

  function render() {
    app.innerHTML = `
      <div class="auth-page">
        <div class="auth-container">
          <div class="auth-logo">
            <div class="logo-icon">
              <span class="material-icons-round">qr_code_scanner</span>
            </div>
            <h1>ScanCart</h1>
            <p>Skip the queue. Scan & Pay.</p>
          </div>

          <div class="auth-card">
            <div class="auth-tabs">
              <button class="auth-tab ${!isLogin ? 'active' : ''}" id="tab-signup">Sign Up</button>
              <button class="auth-tab ${isLogin ? 'active' : ''}" id="tab-login">Log In</button>
            </div>

            <form id="auth-form">
              ${!isLogin ? `
                <div class="form-group animate-fade">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" id="input-name" placeholder="John Doe" required />
                </div>
              ` : ''}

              <div class="form-group animate-fade">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="input-email" placeholder="you@example.com" required />
              </div>

              ${!isLogin ? `
                <div class="form-group animate-fade">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-input" id="input-phone" placeholder="+91 98765 43210" />
                </div>
              ` : ''}

              <div class="form-group animate-fade">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" id="input-password" placeholder="Min 6 characters" required minlength="6" />
              </div>

              <button type="submit" class="btn btn-primary btn-block mt-8" id="auth-submit-btn">
                ${isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>

            <p class="auth-footer">
              ${isLogin ? "Don't have an account? " : 'Already have an account? '}
              <a href="#" id="auth-switch" class="text-accent">${isLogin ? 'Sign Up' : 'Log In'}</a>
            </p>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('tab-signup')?.addEventListener('click', () => { isLogin = false; render(); });
    document.getElementById('tab-login')?.addEventListener('click', () => { isLogin = true; render(); });
    document.getElementById('auth-switch')?.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      render();
    });

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('auth-submit-btn');
      const originalText = btn.textContent;
      btn.innerHTML = '<div class="spinner"></div>';
      btn.disabled = true;

      try {
        const email = document.getElementById('input-email').value;
        const password = document.getElementById('input-password').value;

        let data;
        if (isLogin) {
          data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
        } else {
          const name = document.getElementById('input-name').value;
          const phone = document.getElementById('input-phone')?.value;
          data = await apiFetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password }),
          });
        }

        setAuth(data.token, data.user);
        router.showToast(data.message || 'Welcome!', 'success');
        router.navigate('home');
      } catch (err) {
        router.showToast(err.message, 'error');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  render();
}
