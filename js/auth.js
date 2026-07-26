/* ============================================
   PINHO-NETO Dashboard — auth.js
   v6.0 · Sistema de autenticação client-side
   PBKDF2-SHA256 (100k iterações) + HMAC-SHA256 sessions
   Dois níveis: admin / user
   Admins gerem users e definem serviços visíveis por user
   ============================================ */

(function () {
    'use strict';

    /* ---------- Web Crypto helpers ---------- */
    var enc = new TextEncoder();

    async function pbkdf2(password, salt, iterations) {
        var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
        var bits = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt: enc.encode(salt), iterations: iterations || 100000, hash: 'SHA-256' },
            keyMaterial, 256
        );
        return bufToHex(bits);
    }

    async function hmac(message, secret) {
        var key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        var sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
        return bufToHex(sig);
    }

    async function sha256(message) {
        var hash = await crypto.subtle.digest('SHA-256', enc.encode(message));
        return bufToHex(hash);
    }

    function bufToHex(buf) {
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    function randomHex(bytes) {
        var arr = new Uint8Array(bytes);
        crypto.getRandomValues(arr);
        return Array.from(arr).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    /* ---------- Storage keys ---------- */
    var STORE_KEY = 'pn_auth_users';
    var SESSION_KEY = 'pn_auth_session';
    var THEME_KEY = 'pn_theme';

    /* ---------- Secret for HMAC (generated per-install, stored in users store) ---------- */
    var SECRET_KEY = 'pn_auth_secret';

    /* ---------- User store ---------- */
    function getStore() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
        catch (e) { return {}; }
    }

    function saveStore(store) {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
    }

    function getSecret() {
        var store = getStore();
        if (!store[SECRET_KEY]) {
            store[SECRET_KEY] = randomHex(32);
            saveStore(store);
        }
        return store[SECRET_KEY];
    }

    /* ---------- Default admin bootstrap ---------- */
    /* Versioned: bumping _authVersion forces admin password reset on all browsers */
    var AUTH_VERSION = 2;  // v2 = password changed to 212929003

    async function ensureDefaultAdmin() {
        var store = getStore();
        if (store._initialized && store._authVersion === AUTH_VERSION) return;

        // Force recreate admin with current default password
        var salt = randomHex(16);
        var hash = await pbkdf2('212929003', salt, 100000);
        store['admin'] = {
            username: 'admin',
            passwordHash: hash,
            salt: salt,
            role: 'admin',
            displayName: 'Administrador',
            allowedServices: null,  // null = all
            createdAt: Date.now()
        };
        store._initialized = true;
        store._authVersion = AUTH_VERSION;
        saveStore(store);
    }

    /* ---------- Session management ---------- */
    async function createSession(username) {
        var token = randomHex(32);
        var expires = Date.now() + (24 * 60 * 60 * 1000); // 24h
        var payload = username + '|' + expires + '|' + token;
        var sig = await hmac(payload, getSecret());
        var session = { token: token, username: username, expires: expires, sig: sig };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    async function verifySession() {
        try {
            var session = JSON.parse(localStorage.getItem(SESSION_KEY));
            if (!session || !session.token || !session.sig) return null;
            if (Date.now() > session.expires) { clearSession(); return null; }

            var payload = session.username + '|' + session.expires + '|' + session.token;
            var expectedSig = await hmac(payload, getSecret());
            if (expectedSig !== session.sig) { clearSession(); return null; }

            var store = getStore();
            var user = store[session.username];
            if (!user) { clearSession(); return null; }

            return { username: session.username, role: user.role, displayName: user.displayName, allowedServices: user.allowedServices };
        } catch (e) { return null; }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    /* ---------- Auth API ---------- */
    var Auth = {
        /* Returns current user or null */
        current: null,

        async init() {
            await ensureDefaultAdmin();
            this.current = await verifySession();
            return this.current;
        },

        async login(username, password) {
            username = (username || '').trim().toLowerCase();
            var store = getStore();
            var user = store[username];
            if (!user) throw new Error('Utilizador não encontrado.');

            var hash = await pbkdf2(password, user.salt, 100000);
            if (hash !== user.passwordHash) throw new Error('Palavra-passe incorreta.');

            await createSession(username);
            this.current = { username: username, role: user.role, displayName: user.displayName, allowedServices: user.allowedServices };
            return this.current;
        },

        logout() {
            clearSession();
            this.current = null;
        },

        isLoggedIn() { return !!this.current; },
        isAdmin() { return this.current && this.current.role === 'admin'; },

        /* Admin: list all users */
        listUsers() {
            var store = getStore();
            return Object.keys(store)
                .filter(function (k) { return k !== SECRET_KEY && k !== '_initialized' && k !== '_authVersion'; })
                .map(function (k) {
                    var u = store[k];
                    return { username: k, role: u.role, displayName: u.displayName, allowedServices: u.allowedServices, createdAt: u.createdAt };
                });
        },

        /* Admin: create new user */
        async createUser(username, password, displayName, role, allowedServices) {
            if (!this.isAdmin()) throw new Error('Sem permissões de administrador.');
            username = (username || '').trim().toLowerCase();
            if (!username || !password) throw new Error('Utilizador e palavra-passe são obrigatórios.');
            if (role !== 'admin' && role !== 'user') role = 'user';

            var store = getStore();
            if (store[username]) throw new Error('Utilizador já existe.');

            var salt = randomHex(16);
            var hash = await pbkdf2(password, salt, 100000);
            store[username] = {
                username: username,
                passwordHash: hash,
                salt: salt,
                role: role,
                displayName: displayName || username,
                allowedServices: role === 'admin' ? null : (allowedServices || []),
                createdAt: Date.now()
            };
            saveStore(store);
            return store[username];
        },

        /* Admin: delete user */
        deleteUser(username) {
            if (!this.isAdmin()) throw new Error('Sem permissões de administrador.');
            username = (username || '').trim().toLowerCase();
            if (username === 'admin') throw new Error('Não é possível eliminar o administrador principal.');
            var store = getStore();
            if (!store[username]) throw new Error('Utilizador não encontrado.');
            delete store[username];
            saveStore(store);
        },

        /* Admin: update user permissions */
        updateUserPermissions(username, allowedServices) {
            if (!this.isAdmin()) throw new Error('Sem permissões de administrador.');
            username = (username || '').trim().toLowerCase();
            var store = getStore();
            if (!store[username]) throw new Error('Utilizador não encontrado.');
            store[username].allowedServices = allowedServices;
            saveStore(store);
        },

        /* Admin: change user password */
        async changeUserPassword(username, newPassword) {
            if (!this.isAdmin()) throw new Error('Sem permissões de administrador.');
            username = (username || '').trim().toLowerCase();
            var store = getStore();
            if (!store[username]) throw new Error('Utilizador não encontrado.');
            var salt = randomHex(16);
            var hash = await pbkdf2(newPassword, salt, 100000);
            store[username].passwordHash = hash;
            store[username].salt = salt;
            saveStore(store);
        },

        /* Update own profile */
        async updateProfile(displayName) {
            if (!this.current) throw new Error('Não autenticado.');
            var store = getStore();
            if (!store[this.current.username]) throw new Error('Utilizador não encontrado.');
            store[this.current.username].displayName = displayName;
            saveStore(store);
            this.current.displayName = displayName;
        },

        /* Change own password */
        async changeMyPassword(currentPassword, newPassword) {
            if (!this.current) throw new Error('Não autenticado.');
            var store = getStore();
            var user = store[this.current.username];
            var hash = await pbkdf2(currentPassword, user.salt, 100000);
            if (hash !== user.passwordHash) throw new Error('Palavra-passe atual incorreta.');
            var salt = randomHex(16);
            var newHash = await pbkdf2(newPassword, salt, 100000);
            user.passwordHash = newHash;
            user.salt = salt;
            saveStore(store);
        },

        /* Check if user can see a service */
        canSee(serviceName) {
            if (!this.current) return false;
            if (this.current.role === 'admin') return true;
            if (!this.current.allowedServices) return false;
            return this.current.allowedServices.indexOf(serviceName) > -1;
        }
    };

    /* ---------- Theme management ---------- */
    var Theme = {
        current: 'dark',

        init() {
            var saved = localStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark') {
                this.current = saved;
            }
            this.apply();
        },

        toggle() {
            this.current = this.current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, this.current);
            this.apply();
        },

        set(theme) {
            this.current = (theme === 'light') ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, this.current);
            this.apply();
        },

        apply() {
            document.documentElement.setAttribute('data-theme', this.current);
        }
    };

    /* ---------- Export ---------- */
    window.PNAuth = Auth;
    window.PNTheme = Theme;
})();