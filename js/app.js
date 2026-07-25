/* ============================================
   PINHO-NETO Dashboard — app.js
   v5.0 · Auth + Permissions + Theme + Config
   ============================================ */

(function () {
    'use strict';

    /* ---------- Service catalogue ---------- */
    var CATEGORIES = [
        {
            name: 'Media',
            services: [
                { name: 'Plex Media Server', desc: 'Streaming de filmes, séries e música.', url: 'http://pinhoneto.duckdns.org:32400/web', accent: '#e5a00d', icon: '🎬' },
                { name: 'qBittorrent', desc: 'Gestão de descarregamentos BitTorrent.', url: 'http://pinhoneto.duckdns.org:9080', accent: '#2ec5e3', icon: '🧲' },
                { name: 'Jackett', desc: 'Indexadores de torrents como API.', url: 'http://pinhoneto.duckdns.org:9117', accent: '#f97316', icon: '🧥' }
            ]
        },
        {
            name: 'Nuvem & Produtividade',
            services: [
                { name: 'Nextcloud', desc: 'Nuvem pessoal: ficheiros, calendário e contactos.', url: 'https://pinhoneto.duckdns.org/Nextcloud', accent: '#3b82f6', icon: '☁️' },
                { name: 'Vaultwarden', desc: 'Gestor de palavras-passe compatível com Bitwarden.', url: 'https://pinhoneto.duckdns.org/Vaultwarden', accent: '#a78bfa', icon: '🔐' },
                { name: 'Portfolio', desc: 'Site pessoal e portfólio de Paulo Pinho.', url: 'https://pgpinho.duckdns.org', accent: '#f0506e', icon: '🖌️' }
            ]
        },
        {
            name: 'Monitorização',
            services: [
                { name: 'Uptime Kuma', desc: 'Monitorização de disponibilidade de serviços.', url: 'https://pgpinho.duckdns.org:9443', accent: '#4ec9b0', icon: '📊' },
                { name: 'Hermes Dashboard', desc: 'Painel do agente Hermes — automação e IA.', url: 'https://pgpinho.duckdns.org/hermes/', accent: '#f0a050', icon: '🤖' }
            ]
        },
        {
            name: 'Inteligência Artificial',
            services: [
                { name: 'Open WebUI', desc: 'Interface web para modelos de IA locais.', url: 'https://papaai.duckdns.org', accent: '#64d2ff', icon: '🧠' }
            ]
        },
        {
            name: 'Ficheiros',
            services: [
                { name: 'Samba / SMB', desc: 'Partilha de ficheiros na rede local.', url: 'smb://pinhoneto.duckdns.org', accent: '#f0c040', icon: '📁', noCheck: true }
            ]
        }
    ];

    /* Flatten all services */
    var ALL = CATEGORIES.reduce(function (acc, cat) {
        cat.services.forEach(function (s) { s._cat = cat.name; acc.push(s); });
        return acc;
    }, []);

    /* ---------- State ---------- */
    var isMobile = window.innerWidth < 600;
    var searchQuery = '';
    var activeFilter = 'all';
    var statusCache = {};

    /* ---------- DOM refs ---------- */
    var grid = document.getElementById('services');
    var noResults = document.getElementById('no-results');
    var searchInput = document.getElementById('search');
    var clockTime = document.getElementById('clock-time');
    var clockDate = document.getElementById('clock-date');
    var filterChips = document.getElementById('filterChips');
    var loginOverlay = document.getElementById('loginOverlay');
    var configDrawer = document.getElementById('configDrawer');
    var configOverlay = document.getElementById('configOverlay');
    var aboutSection = document.getElementById('aboutSection');
    var tabBar = document.getElementById('tabBar');

    /* ---------- Icon helpers ---------- */
    function chevronSVG() {
        return '<svg class="card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"></polyline></svg>';
    }

    function dotHTML(url, noCheck) {
        if (noCheck) return '<span class="dot unknown"></span><span class="dot-text">—</span>';
        if (statusCache[url]) {
            var c = statusCache[url];
            return '<span class="dot ' + c.cls + ' pulse" data-url="' + url + '"></span><span class="dot-text">' + c.label + '</span>';
        }
        return '<span class="dot" data-url="' + url + '"></span><span class="dot-text">…</span>';
    }

    /* ---------- Get visible services (auth-filtered) ---------- */
    function getVisible() {
        return ALL.filter(function (s) {
            // Auth filter
            if (!window.PNAuth.canSee(s.name)) return false;
            // Category filter
            if (activeFilter !== 'all' && s._cat !== activeFilter) return false;
            // Search
            if (searchQuery && (s.name + ' ' + s.desc + ' ' + s._cat).toLowerCase().indexOf(searchQuery) === -1) return false;
            return true;
        });
    }

    /* ---------- Build filter chips (only categories user can see) ---------- */
    function buildChips() {
        var visibleCats = {};
        ALL.forEach(function (s) {
            if (window.PNAuth.canSee(s.name)) visibleCats[s._cat] = true;
        });

        var chips = filterChips.querySelectorAll('.chip');
        chips.forEach(function (chip) {
            var f = chip.getAttribute('data-filter');
            if (f === 'all') return;
            chip.style.display = visibleCats[f] ? '' : 'none';
        });
    }

    /* ---------- Main render ---------- */
    function render() {
        grid.innerHTML = '';
        buildChips();

        var visible = getVisible();
        noResults.hidden = visible.length > 0;

        visible.forEach(function (s, i) {
            grid.appendChild(card(s, i));
        });

        // Update user info in header/config
        updateUserInfo();
        checkStatuses();
    }

    /* ---------- Card factory ---------- */
    function card(s, i) {
        var el = document.createElement('a');
        el.className = 'card';
        el.style.animationDelay = (i * 30) + 'ms';
        el.style.setProperty('--accent-color', s.accent);
        el.setAttribute('data-name', s.name.toLowerCase());
        el.setAttribute('href', s.url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');

        el.innerHTML =
            '<div class="card-top">' +
                '<div class="card-icon">' + s.icon + '</div>' +
                '<span class="card-status">' + dotHTML(s.url, s.noCheck) + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<h3 class="card-name">' + s.name + '</h3>' +
                '<p class="card-desc">' + s.desc + '</p>' +
                '<span class="card-cat">' + s._cat + '</span>' +
            '</div>' +
            chevronSVG();
        return el;
    }

    /* ---------- Status checks ---------- */
    function checkStatuses() {
        var dots = grid.querySelectorAll('.dot[data-url]');
        dots.forEach(function (dot) {
            var url = dot.getAttribute('data-url');
            if (/^smb:/.test(url)) return;
            if (statusCache[url]) { applyStatus(dot, statusCache[url]); return; }
            checkOne(dot, url);
        });
    }

    function checkOne(dot, url) {
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;

        fetch(url, { mode: 'no-cors', signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
            .then(function () {
                var r = { cls: 'ok', label: 'online' };
                statusCache[url] = r; applyStatus(dot, r);
            })
            .catch(function (err) {
                if (err && err.name === 'AbortError') {
                    var rW = { cls: 'warn', label: 'lento' };
                    statusCache[url] = rW; applyStatus(dot, rW);
                } else {
                    imgProbe(url).then(
                        function () { var r = { cls: 'ok', label: 'online' }; statusCache[url] = r; applyStatus(dot, r); },
                        function () { var r = { cls: 'bad', label: 'offline' }; statusCache[url] = r; applyStatus(dot, r); }
                    );
                }
            })
            .then(function () { if (timer) clearTimeout(timer); });
    }

    function imgProbe(url) {
        return new Promise(function (resolve, reject) {
            try {
                var img = new Image(); var done = false;
                img.onload = function () { if (!done) { done = true; resolve(); } };
                img.onerror = function () { if (!done) { done = true; reject(); } };
                setTimeout(function () { if (!done) { done = true; reject(); } }, 5000);
                img.src = url.replace(/\/$/, '') + '/favicon.ico?_=' + Date.now();
            } catch (e) { reject(); }
        });
    }

    function applyStatus(dot, status) {
        dot.classList.remove('ok', 'warn', 'bad', 'unknown');
        dot.classList.add(status.cls, 'pulse');
        var txt = dot.nextElementSibling;
        if (txt && txt.classList.contains('dot-text')) txt.textContent = status.label;
    }

    /* ---------- Search ---------- */
    searchInput.addEventListener('input', function () {
        searchQuery = (searchInput.value || '').trim().toLowerCase();
        render();
    });

    /* ---------- Filter chips ---------- */
    filterChips.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            filterChips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-filter');
            render();
        });
    });

    /* ---------- Clock ---------- */
    var WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
        var now = new Date();
        clockTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        clockDate.textContent = WEEKDAYS[now.getDay()] + ', ' + now.getDate() + ' ' + MONTHS[now.getMonth()];
        if (isMobile) clockTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    }

    /* ---------- Config drawer ---------- */
    var configBtn = document.getElementById('configBtn');
    var configClose = document.getElementById('configClose');

    function openConfig() {
        configDrawer.classList.add('open');
        configOverlay.classList.add('show');
        renderConfigContent();
    }

    function closeConfig() {
        configDrawer.classList.remove('open');
        configOverlay.classList.remove('show');
    }

    configBtn.addEventListener('click', openConfig);
    configClose.addEventListener('click', closeConfig);
    configOverlay.addEventListener('click', closeConfig);

    function updateUserInfo() {
        var user = window.PNAuth.current;
        if (!user) return;
        var nameEl = document.getElementById('userName');
        var roleEl = document.getElementById('userRole');
        var headerAvatar = document.getElementById('headerAvatar');
        var configAvatar = document.getElementById('configAvatar');
        if (nameEl) nameEl.textContent = user.displayName;
        if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Utilizador';
        if (headerAvatar) headerAvatar.textContent = user.displayName.charAt(0).toUpperCase();
        if (configAvatar) configAvatar.textContent = user.displayName.charAt(0).toUpperCase();
        // Hide admin section for non-admins
        var adminSec = document.getElementById('adminSection');
        if (adminSec) adminSec.style.display = user.role === 'admin' ? '' : 'none';
    }

    function renderConfigContent() {
        var user = window.PNAuth.current;
        if (!user) return;

        // Profile section
        var profileName = document.getElementById('profileName');
        if (profileName) profileName.value = user.displayName;

        // Theme toggle
        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.checked = (window.PNTheme.current === 'light');

        // Admin section
        var adminSection = document.getElementById('adminSection');
        if (adminSection) adminSection.style.display = user.role === 'admin' ? '' : 'none';

        if (user.role === 'admin') renderUserList();
    }

    function renderUserList() {
        var list = document.getElementById('userList');
        if (!list) return;
        var users = window.PNAuth.listUsers();
        list.innerHTML = '';

        users.forEach(function (u) {
            var row = document.createElement('div');
            row.className = 'user-row';

            var allowed = u.allowedServices;
            var allowedText = (u.role === 'admin') ? 'Todos os serviços' : (allowed && allowed.length ? allowed.length + ' serviços' : 'Nenhum');

            row.innerHTML =
                '<div class="user-row-info">' +
                    '<div class="user-row-name">' + escapeHtml(u.displayName) + ' <span class="user-row-badge">' + (u.role === 'admin' ? 'ADMIN' : 'USER') + '</span></div>' +
                    '<div class="user-row-detail">@' + escapeHtml(u.username) + ' · ' + allowedText + '</div>' +
                '</div>' +
                '<button class="user-row-edit" data-user="' + escapeHtml(u.username) + '">Editar</button>' +
                (u.username !== 'admin' ? '<button class="user-row-delete" data-user="' + escapeHtml(u.username) + '">Eliminar</button>' : '');

            list.appendChild(row);
        });

        // Attach handlers
        list.querySelectorAll('.user-row-edit').forEach(function (btn) {
            btn.addEventListener('click', function () { openUserEditor(btn.getAttribute('data-user')); });
        });
        list.querySelectorAll('.user-row-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (confirm('Eliminar este utilizador?')) {
                    try {
                        window.PNAuth.deleteUser(btn.getAttribute('data-user'));
                        renderUserList();
                    } catch (e) { alert(e.message); }
                }
            });
        });
    }

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    /* User editor modal */
    function openUserEditor(username) {
        var editor = document.getElementById('userEditor');
        var users = window.PNAuth.listUsers();
        var u = users.find(function (x) { return x.username === username; });
        if (!u) return;

        document.getElementById('editUsername').textContent = u.username;
        document.getElementById('editDisplayName').value = u.displayName;

        // Service checkboxes
        var container = document.getElementById('editServices');
        container.innerHTML = '';
        if (u.role === 'admin') {
            container.innerHTML = '<p class="edit-note">Administradores têm acesso a todos os serviços.</p>';
        } else {
            ALL.forEach(function (s) {
                var id = 'svc_' + s.name.replace(/\s+/g, '_');
                var checked = u.allowedServices && u.allowedServices.indexOf(s.name) > -1;
                container.innerHTML +=
                    '<label class="svc-check"><input type="checkbox" id="' + id + '" data-svc="' + escapeHtml(s.name) + '"' + (checked ? ' checked' : '') + '><span>' + s.icon + ' ' + escapeHtml(s.name) + '</span></label>';
            });
        }

        editor.classList.add('show');
    }

    document.getElementById('editSave').addEventListener('click', async function () {
        var username = document.getElementById('editUsername').textContent;
        var displayName = document.getElementById('editDisplayName').value;
        var newPass = document.getElementById('editNewPass').value;

        try {
            // Update display name
            var store = JSON.parse(localStorage.getItem('pn_auth_users'));
            if (store[username]) {
                store[username].displayName = displayName;
                localStorage.setItem('pn_auth_users', JSON.stringify(store));
            }

            // Update permissions
            if (store[username].role !== 'admin') {
                var allowed = [];
                document.querySelectorAll('#editServices input[type=checkbox]:checked').forEach(function (cb) {
                    allowed.push(cb.getAttribute('data-svc'));
                });
                window.PNAuth.updateUserPermissions(username, allowed);
            }

            // Update password if provided
            if (newPass) {
                await window.PNAuth.changeUserPassword(username, newPass);
            }

            document.getElementById('userEditor').classList.remove('show');
            renderConfigContent();
            render();
        } catch (e) {
            alert(e.message);
        }
    });

    document.getElementById('editCancel').addEventListener('click', function () {
        document.getElementById('userEditor').classList.remove('show');
    });

    /* Create new user */
    document.getElementById('createUserBtn').addEventListener('click', function () {
        document.getElementById('newUserForm').classList.add('show');
    });

    document.getElementById('newUserCancel').addEventListener('click', function () {
        document.getElementById('newUserForm').classList.remove('show');
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('newDisplayName').value = '';
        document.getElementById('newRole').value = 'user';
    });

    document.getElementById('newUserSave').addEventListener('click', async function () {
        var username = document.getElementById('newUsername').value;
        var password = document.getElementById('newPassword').value;
        var displayName = document.getElementById('newDisplayName').value;
        var role = document.getElementById('newRole').value;

        // Get selected services
        var allowed = [];
        document.querySelectorAll('#newUserServices input[type=checkbox]:checked').forEach(function (cb) {
            allowed.push(cb.getAttribute('data-svc'));
        });

        try {
            await window.PNAuth.createUser(username, password, displayName, role, role === 'admin' ? null : allowed);
            document.getElementById('newUserForm').classList.remove('show');
            document.getElementById('newUsername').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('newDisplayName').value = '';
            renderUserList();
        } catch (e) {
            alert(e.message);
        }
    });

    /* Build new user service checkboxes */
    function buildNewUserServices() {
        var container = document.getElementById('newUserServices');
        if (!container) return;
        container.innerHTML = '';
        ALL.forEach(function (s) {
            container.innerHTML +=
                '<label class="svc-check"><input type="checkbox" data-svc="' + escapeHtml(s.name) + '" checked><span>' + s.icon + ' ' + escapeHtml(s.name) + '</span></label>';
        });
    }

    /* Theme toggle handler */
    document.getElementById('themeToggle').addEventListener('change', function () {
        window.PNTheme.set(this.checked ? 'light' : 'dark');
    });

    /* Profile save */
    document.getElementById('profileSave').addEventListener('click', async function () {
        var name = document.getElementById('profileName').value;
        try {
            await window.PNAuth.updateProfile(name);
            updateUserInfo();
            alert('Perfil atualizado.');
        } catch (e) { alert(e.message); }
    });

    /* Change password */
    document.getElementById('passChangeBtn').addEventListener('click', async function () {
        var cur = document.getElementById('curPassword').value;
        var nw = document.getElementById('newMyPassword').value;
        try {
            await window.PNAuth.changeMyPassword(cur, nw);
            document.getElementById('curPassword').value = '';
            document.getElementById('newMyPassword').value = '';
            alert('Palavra-passe alterada.');
        } catch (e) { alert(e.message); }
    });

    /* Logout */
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.PNAuth.logout();
        closeConfig();
        showLogin();
    });

    /* ---------- About modal ---------- */
    var aboutBtn = document.getElementById('aboutBtn');
    var aboutClose = document.getElementById('aboutClose');

    if (aboutBtn) aboutBtn.addEventListener('click', function () { aboutSection.classList.add('show'); });
    if (aboutClose) aboutClose.addEventListener('click', function () { aboutSection.classList.remove('show'); });
    aboutSection.addEventListener('click', function (e) { if (e.target === aboutSection) aboutSection.classList.remove('show'); });

    /* ---------- Login ---------- */
    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');
    var loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        loginBtn.disabled = true;
        loginBtn.textContent = 'A entrar...';
        loginError.hidden = true;

        var username = document.getElementById('loginUser').value;
        var password = document.getElementById('loginPass').value;

        try {
            await window.PNAuth.login(username, password);
            loginOverlay.classList.remove('show');
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
            onLoggedIn();
        } catch (err) {
            loginError.textContent = err.message;
            loginError.hidden = false;
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
        }
    });

    /* ---------- Auth flow ---------- */
    function showLogin() {
        loginOverlay.classList.add('show');
        grid.innerHTML = '';
    }

    function onLoggedIn() {
        render();
    }

    /* ---------- Mobile tab bar ---------- */
    tabBar.querySelectorAll('.tab-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-tab');
            tabBar.querySelectorAll('.tab-item').forEach(function (b) {
                b.classList.toggle('active', b === btn);
            });
            if (tab === 'acerca') { aboutSection.classList.add('show'); }
            else if (tab === 'config') { openConfig(); }
            else { closeConfig(); aboutSection.classList.remove('show'); }
        });
    });

    /* ---------- Responsive ---------- */
    function handleResize() { isMobile = window.innerWidth < 600; }
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(handleResize, 150); });

    /* ---------- Init ---------- */
    async function init() {
        isMobile = window.innerWidth < 600;

        window.PNTheme.init();
        tick();
        setInterval(tick, 1000);

        buildNewUserServices();

        // Init auth
        await window.PNAuth.init();

        if (window.PNAuth.isLoggedIn()) {
            onLoggedIn();
        } else {
            showLogin();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();