// ============================================
// СПИСОК ФАЙЛОВ (ключ = точное имя файла в папке files/)
// ============================================
const files = {
  "1074-cleo-4-gta-san-andreas.zip": {
    name: "CLEO 4 для GTA SA",
    size: "1 MB",
    icon: "🧩",
    desc: "Установщик CLEO 4. Нужен для работы скриптов, читов и модов. Запустить установщик и указать папку с GTA San Andreas."
  },
  "140690-widescreen-fix-gtasa_manual.zip": {
    name: "Widescreen Fix GTA SA",
    size: "35 KB",
    icon: "🖥️",
    desc: "Фикс широкоформатного разрешения. Убирает растянутую картинку на 16:9 и выше. Распаковать в папку с игрой."
  },
  "sl-2-00-install.exe": {
    name: "Русификатор GTA SA",
    size: "5.5 MB",
    icon: "🇷🇺",
    desc: "Полный русификатор для GTA San Andreas. Перевод интерфейса, миссий и диалогов. Запустить установщик и следовать инструкциям."
  },
};

// ============================================
// Иконки (запасные, если нет icon у файла)
// ============================================
function guessIcon(filename) {
  const n = filename.toLowerCase();
  if (n.includes('car') || n.includes('машин') || n.includes('bmw')) return '🚗';
  if (n.includes('weapon') || n.includes('оруж')) return '🔫';
  if (n.includes('skin') || n.includes('скин')) return '🧍';
  if (n.includes('map') || n.includes('карт')) return '🗺️';
  if (n.includes('cleo')) return '🧩';
  if (n.includes('sound') || n.includes('звук')) return '🔊';
  if (n.includes('widescreen') || n.includes('fix')) return '🖥️';
  if (n.includes('russ') || n.includes('рус') || n.includes('sl-2')) return '🇷🇺';
  if (n.includes('txd') || n.includes('dff')) return '🎨';
  return '📄';
}

// ============================================
// АККАУНТЫ
// ============================================
function getUsers() { return JSON.parse(localStorage.getItem('users') || '{}'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getCurrentUser() { return localStorage.getItem('currentUser'); }
function setCurrentUser(l) { localStorage.setItem('currentUser', l); }
function logout() { localStorage.removeItem('currentUser'); location.reload(); }

// ============================================
// РЕНДЕР КАРТОЧЕК
// ============================================
const grid = document.getElementById('filesGrid');
const emptyMsg = document.getElementById('empty');

function renderFiles(filter = '') {
  grid.innerHTML = '';
  const entries = Object.entries(files).filter(([filename, meta]) =>
    (meta.name + filename).toLowerCase().includes(filter.toLowerCase())
  );

  if (entries.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  const logged = !!getCurrentUser();

  entries.forEach(([filename, meta]) => {
    const card = document.createElement('div');
    card.className = 'file-card';

    const icon = meta.icon || guessIcon(filename);
    const desc = meta.desc || 'Без описания';

    card.innerHTML = `
      <div class="file-icon">${icon}</div>
      <div class="file-name">${meta.name}</div>
      <div class="file-desc">${desc}</div>
      <div class="file-meta">
        <span>${meta.size || ''}</span>
        <span class="file-download">${logged ? '⬇ Скачать' : '🔒 Войти'}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!getCurrentUser()) {
        openAuthModal();
      } else {
        const a = document.createElement('a');
        a.href = `files/${encodeURIComponent(filename)}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });

    grid.appendChild(card);
  });
}

// ============================================
// ШАПКА — вход / имя юзера
// ============================================
function renderAuthBox() {
  const box = document.getElementById('authBox');
  const user = getCurrentUser();
  if (user) {
    box.innerHTML = `
      <div class="user-pill">
        <span class="user-avatar">${user[0].toUpperCase()}</span>
        <span>${user}</span>
        <button id="logoutBtn">Выйти</button>
      </div>
    `;
    document.getElementById('logoutBtn').onclick = logout;
  } else {
    box.innerHTML = `<button class="login-btn" id="loginBtn">Войти</button>`;
    document.getElementById('loginBtn').onclick = () => openAuthModal();
  }
}

// ============================================
// МОДАЛКА ВХОДА / РЕГИСТРАЦИИ
// ============================================
function openAuthModal(mode = 'login') {
  if (document.getElementById('authModal')) return;

  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="modalClose">✕</button>
      <div class="modal-icon">🔒</div>
      <h2 class="modal-title" id="modalTitle">${mode === 'login' ? 'Вход в аккаунт' : 'Регистрация обязательна'}</h2>
      <p class="modal-text">Создайте аккаунт или войдите, чтобы скачивать моды.</p>

      <div class="auth-tabs">
        <button class="auth-tab ${mode === 'login' ? 'active' : ''}" data-mode="login">Вход</button>
        <button class="auth-tab ${mode === 'register' ? 'active' : ''}" data-mode="register">Регистрация</button>
      </div>

      <form id="authForm">
        <input type="text" id="authLogin" placeholder="Логин" required minlength="3">
        <input type="password" id="authPassword" placeholder="Пароль" required minlength="4">
        <div class="auth-error" id="authError"></div>
        <button type="submit" class="auth-submit" id="authSubmit">${mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  let currentMode = mode;
  const close = () => modal.remove();
  document.getElementById('modalClose').onclick = close;
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  modal.querySelectorAll('.auth-tab').forEach(tab => {
    tab.onclick = () => {
      currentMode = tab.dataset.mode;
      modal.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.getElementById('authSubmit').textContent = currentMode === 'login' ? 'Войти' : 'Зарегистрироваться';
      document.getElementById('modalTitle').textContent = currentMode === 'login' ? 'Вход в аккаунт' : 'Регистрация обязательна';
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
      setCurrentUser(login);
      close();
      renderAuthBox();
      renderFiles(document.getElementById('search').value);
    } else {
      if (!users[login]) { errEl.textContent = 'Аккаунт не найден'; return; }
      if (users[login] !== password) { errEl.textContent = 'Неверный пароль'; return; }
      setCurrentUser(login);
      close();
      renderAuthBox();
      renderFiles(document.getElementById('search').value);
    }
  };
}

// ============================================
// СТАРТ
// ============================================
document.getElementById('search').addEventListener('input', (e) => renderFiles(e.target.value));
renderAuthBox();
renderFiles();