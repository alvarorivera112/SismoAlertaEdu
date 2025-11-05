/* =======================================================
   SismoAlerta EDU – Demo educativa de autenticación
   Manejador de login/registro con localStorage
   ======================================================= */

const LS_USERS_KEY = 'sa_users';
const LS_CURRENT_USER_KEY = 'sa_current_user';

// Obtener usuarios guardados
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

// Guardar usuarios en localStorage
function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

// Guardar usuario actual (sesión)
function setCurrentUser(username) {
  localStorage.setItem(LS_CURRENT_USER_KEY, username);
}

// Obtener usuario actual
function getCurrentUser() {
  return localStorage.getItem(LS_CURRENT_USER_KEY);
}

// Cerrar sesión
function logout() {
  localStorage.removeItem(LS_CURRENT_USER_KEY);
}

// =======================================================
// 🟢 REGISTRO
// =======================================================
function attachRegisterHandler() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim();
    const usuario = document.getElementById('usuario')?.value.trim();
    const correo = document.getElementById('correo')?.value.trim();
    const clave = document.getElementById('clave')?.value;
    const clave2 = document.getElementById('clave2')?.value;

    if (!nombre || !usuario || !correo || !clave || !clave2) {
      alert('⚠️ Completa todos los campos.');
      return;
    }

    if (clave !== clave2) {
      alert('❌ Las contraseñas no coinciden.');
      return;
    }

    const users = getUsers();
    const exists = users.some(
      (u) =>
        u.usuario.toLowerCase() === usuario.toLowerCase() ||
        u.correo.toLowerCase() === correo.toLowerCase()
    );

    if (exists) {
      alert('⚠️ El usuario o correo ya existe. Intenta con otros.');
      return;
    }

    // Guardado simple (educativo)
    users.push({ nombre, usuario, correo, clave });
    saveUsers(users);

    alert('✅ Usuario creado con éxito. Ahora puedes iniciar sesión.');
    // Redirige automáticamente al login
    location.href = 'index.html';
  });
}

// =======================================================
// 🟠 LOGIN
// =======================================================
function attachLoginHandler() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario')?.value.trim();
    const clave = document.getElementById('clave')?.value;

    if (!usuario || !clave) {
      alert('⚠️ Ingresa usuario y contraseña.');
      return;
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.usuario.toLowerCase() === usuario.toLowerCase() && u.clave === clave
    );

    if (!found) {
      alert('❌ Credenciales inválidas. Intenta nuevamente.');
      return;
    }

    setCurrentUser(found.usuario);
    alert(`👋 Bienvenido, ${found.nombre || found.usuario}`);

    // Redirigir al panel
    location.href = 'app.html';
  });
}

// =======================================================
// 🔵 PANTALLA DEL PANEL
// =======================================================
function hydrateAppScreen() {
  const nameEl = document.getElementById('welcomeName');
  const btnLogout = document.getElementById('btnLogout');
  if (!nameEl && !btnLogout) return;

  const current = getCurrentUser();
  if (!current) {
    // Si no hay sesión activa, vuelve al login
    location.href = 'index.html';
    return;
  }

  if (nameEl) nameEl.textContent = current;

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout();
      location.href = 'index.html';
    });
  }
}

// =======================================================
// 🧩 Inicialización automática
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
  attachRegisterHandler();
  attachLoginHandler();
  hydrateAppScreen();
});
