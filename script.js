// ============================================
// GOOGLE CLIENT ID
// ============================================
const GOOGLE_CLIENT_ID = "545857026324-nupajt623djcl8v6i9qjt9nhhr1gg4c6.apps.googleusercontent.com";

// ============================================
// СПИСОК МОДОВ (ключ = точное имя файла в папке files/)
// ============================================
const files = {
  "1074-cleo-4-gta-san-andreas.zip": {
    name: "CLEO 4 для GTA SA",
    size: "1 MB",
    icon: "🧩",
    category: "scripts",
    desc: "Установщик CLEO 4. Нужен для работы скриптов, читов и модов. Запустить установщик и указать папку с GTA San Andreas."
  },
  "140690-widescreen-fix-gtasa_manual.zip": {
    name: "Widescreen Fix GTA SA",
    size: "35 KB",
    icon: "🖥️",
    category: "fixes",
    desc: "Фикс широкоформатного разрешения. Убирает растянутую картинку на 16:9 и выше."
  },
  "261612-bmw-x3-m401-gtasa_manual.zip": {
    name: "BMW X3 M40i",
    size: "10.6 MB",
    icon: "🚗",
    category: "cars",
    desc: "Мод добавляет BMW X3 M40i в GTA SA. Установка через IMG Tool."
  },
  "28034-vaz-2170-dps.zip": {
    name: "ВАЗ 2170 DPS",
    size: "9.2 MB",
    icon: "🚓",
    category: "cars",
    desc: "Мод добавляет машину ВАЗ 2170 в раскраске ДПС. Установка через IMG Tool."
  },
  "sl-2-00-install.exe": {
    name: "Русификатор GTA SA",
    size: "5.5 MB",
    icon: "🇷🇺",
    category: "russian",
    desc: "Полный русификатор для GTA San Andreas. Перевод интерфейса, миссий, диалогов."
  },
};

// ============================================
// КАТЕГОРИИ
// ============================================
const categories = {
  all:     { name: "Все моды", icon: "📦" },
  cars:    { name: "Машины",   icon: "🚗" },
  scripts: { name: "Скрипты",  icon: "🧩" },
  fixes:   { name: "Фиксы",    icon: "🖥️" },
  russian: { name: "Русики",   icon: "🇷🇺" },
};

let currentCategory = 'all';

// ============================================
// АККАУНТЫ
// ============================================
function getUsers() { return JSON.parse(localStorage.getItem('users') || '{}'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(u) { localStorage.setItem('currentUser', JSON.stringify(u)); }
function logout() { localStorage.removeItem('currentUser'); location.reload(); }

// ============================================
// ПОКАЗ ЭКРАНОВ
// ============================================
function showAuthScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('site').style.display = 'none';
}

function showSite() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('site').style.display = 'block';
  renderAuthBox();
  renderStats();
  renderCategories();
  renderFiles();
}

// ============================================
// СТАТИСТИКА
// ============================================
function renderStats() {
  const total = Object.keys(files).length;
  const cats = new Set(Object.values(files).map(f => f.category)).size;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statCats').textContent = cats;
}

// ============================================
// КАТЕГОРИИ
// ============================================
function renderCategories() {
  const box = document.getElementById('categories');
  box.innerHTML = '';

  const counts = { all: Object.keys(files).length };
  Object.values(files).forEach(f => {
    counts[f.category] = (counts[f.category] || 0) + 1;
  });

  Object.entries(categories).forEach(([key, cat]) => {
    if (key !== 'all' && !counts[key]) return;
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (key === currentCategory ? ' active' : '');
    btn.innerHTML = `${cat.icon} ${cat.name} <span class="cat-count">${counts[key] || 0}</span>`;
    btn.onclick = () => {
      currentCategory = key;
      renderCategories();
      renderFiles(document.getElementById('search').value);
    };
    box.appendChild(btn);
  });
}

// ============================================
// РЕНДЕР КАРТОЧЕК
// ============================================
const grid = document.getElementById('filesGrid');
const emptyMsg = document.getElementById('empty');

function renderFiles(filter = '') {
  if (!grid) return;
  grid.innerHTML = '';

  let entries = Object.entries(files);

  if (currentCategory !== 'all') {
    entries = entries.filter(([, meta]) => meta.category === currentCategory);
  }

  if (filter) {
    entries = entries.filter(([filename, meta]) =>
      (meta.name + filename).toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (entries.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  entries.forEach(([filename, meta], i) => {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.style.animationDelay = (i * 0.06) + 's';

    card.innerHTML = `
      <div class="file-icon">${meta.icon || '📄'}</div>
      <div class="file-name">${meta.name}</div>
      <div class="file-desc">${meta.desc || ''}</div>
      <div class="file-meta">
        <span class="file-size">${meta.size || ''}</span>
        <span class="file-download">⬇ Скачать</span>
      </div>
    `;

    card.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = `files/${encodeURIComponent(filename)}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    grid.appendChild(card);
  });
}

// ============================================
// ШАПКА — ЮЗЕР + ВЫЙТИ
// ============================================
function renderAuthBox() {
  const box = document.getElementById('authBox');
  const user = getCurrentUser();
  if (!user) return;

  const initial = user.name ? user.name[0].toUpperCase() : '?';
  const avatar = user.picture
    ? `<img src="${user.picture}" class="user-avatar-img" alt="">`
    : `<span class="user-avatar">${initial}</span>`;

  box.innerHTML = `
    <div class="user-pill">
      ${avatar}
      <span>${user.name || 'User'}</span>
      <button id="logoutBtn">Выйти</button>
    </div>
  `;
  document.getElementById('logoutBtn').onclick = logout;
}

// ============================================
// GOOGLE АВТОРИЗАЦИЯ
// ============================================
function decodeJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(base64))));
}

window.handleCredentialResponse = (response) => {
  const g = decodeJwt(response.credential);
  setCurrentUser({ name: g.name, email: g.email, picture: g.picture, via: 'google' });
  showSite();
};

// ============================================
// ФОРМА
// ============================================
let currentMode = 'register';

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.onclick = () => {
    currentMode = tab.dataset.mode;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.getElementById('authSubmit').textContent =
      currentMode === 'login' ? 'Войти' : 'Зарегистрироваться';
    document.getElementById('authError').textContent = '';
  };
});

document.getElementById('authForm').onsubmit = (e) => {
  e.preventDefault();
  const login = document.getElementById('authLogin').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  const errEl = document.getElementById('authError');

  if (login.length < 3) { errEl.textContent = 'Логин минимум 3 символа'; return; }
  if (password.length < 4) { errEl.textContent = 'Пароль минимум 4 символа'; return; }

  const users = getUsers();

  if (currentMode === 'register') {
    if (users[login]) { errEl.textContent = 'Такой логин уже занят'; return; }
    users[login] = password;
    saveUsers(users);
    setCurrentUser({ name: login, via: 'local' });
    showSite();
  } else {
    if (!users[login]) { errEl.textContent = 'Аккаунт не найден'; return; }
    if (users[login] !== password) { errEl.textContent = 'Неверный пароль'; return; }
    setCurrentUser({ name: login, via: 'local' });
    showSite();
  }
};

// ============================================
// СТАРТ
// ============================================
window.addEventListener('load', () => {
  if (getCurrentUser()) {
    showSite();
    return;
  }

  showAuthScreen();

  if (window.google && GOOGLE_CLIENT_ID) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'filled_black', size: 'large', text: 'continue_with', shape: 'pill', width: 320 }
    );
  } else {
    document.getElementById('googleBtn').style.display = 'none';
    document.querySelector('.auth-divider').style.display = 'none';
  }
});

document.getElementById('search')?.addEventListener('input', (e) => renderFiles(e.target.value));
