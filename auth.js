const STORAGE_USERS = 'sa_users';
const STORAGE_SESSION = 'sa_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_SESSION)); }
  catch { return null; }
}
function setSession(user) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify({ email: user.email }));
}
function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.email === session.email) || null;
}

function showAlert(text, type='info') {
  const el = document.getElementById('alert');
  if (!el) return;
  el.textContent = text || '';
  el.className = 'alert ' + (type || 'info');
}

function protectRoute() {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
}

function logout() {
  clearSession();
  window.location.href = 'login.html';
}

function bindTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.tab;
      panels.forEach(p => p.classList.remove('show'));
      document.getElementById(target === 'login' ? 'loginForm' : 'registerForm').classList.add('show');
      showAlert('');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindTabs();

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    const btn = document.getElementById('loginBtn');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      btn.disabled = true;

      const data = new FormData(loginForm);
      const email = (data.get('email') || '').toString().trim().toLowerCase();
      const password = (data.get('password') || '').toString();

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        showAlert('Credenciales inválidas.', 'error');
        btn.disabled = false;
        return;
      }

      setSession(user);
      window.location.href = 'app.html';
    });
  }

  if (registerForm) {
    const btn = document.getElementById('registerBtn');
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      btn.disabled = true;

      const data = new FormData(registerForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim().toLowerCase();
      const password = (data.get('password') || '').toString();

      if (!name || !email || !password) {
        showAlert('Completa todos los campos.', 'error');
        btn.disabled = false;
        return;
      }

      const users = getUsers();
      if (users.some(u => u.email === email)) {
        showAlert('Ese correo ya está registrado.', 'error');
        btn.disabled = false;
        return;
      }

      users.push({ name, email, password });
      saveUsers(users);

      showAlert('Registro exitoso. Ahora inicia sesión.', 'success');
      document.querySelector('.tab[data-tab="login"]').click();
      registerForm.reset();
      btn.disabled = false;
    });
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get('from') === 'logout') {
    showAlert('Sesión cerrada.', 'info');
  }
});
