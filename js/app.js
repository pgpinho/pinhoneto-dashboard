/* ============================================
   PINHO-NETO Dashboard — app.js
   v6.0 · iCloud-inspired · Official SVG icons
   ============================================ */

(function () {
    'use strict';

    /* ---------- SVG icon paths (official brand icons) ---------- */
    var ICONS = {
        plex: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.987 8.409c-.96 0-1.587.28-2.12.933v-.72H0v8.88s.038.018.127.037c.138.03.821.187 1.331-.249.441-.377.542-.814.542-1.318v-1.283c.533.573 1.147.813 2 .813 1.84 0 3.253-1.493 3.253-3.48 0-2.12-1.36-3.613-3.266-3.613Zm16.748 5.595.406.591c.391.614.894.906 1.492.908.621-.012 1.064-.562 1.226-.755 0 0-.307-.27-.686-.72-.517-.614-1.214-1.755-1.24-1.803l-1.198 1.779Zm-3.205-1.955c0-2.08-1.52-3.64-3.52-3.64s-3.467 1.587-3.467 3.573a3.48 3.48 0 0 0 3.507 3.52c1.413 0 2.626-.84 3.253-2.293h-2.04l-.093.093c-.427.4-.72.533-1.227.533-.787 0-1.373-.506-1.453-1.266h4.986c.04-.214.054-.307.054-.52Zm-7.671-.219c0 .769.11 1.701.868 2.722l.056.069c-.306.526-.742.88-1.248.88-.399 0-.814-.211-1.138-.579a2.177 2.177 0 0 1-.538-1.441V6.409H9.86l-.001 5.421Zm9.283 3.46h-2.39l2.247-3.332-2.247-3.335h2.39l2.248 3.335-2.248 3.332Zm1.593-1.286Zm-17.162-.342c-.933 0-1.68-.773-1.68-1.72s.76-1.666 1.68-1.666c.92 0 1.68.733 1.68 1.68 0 .946-.733 1.706-1.68 1.706Zm18.361-1.974L24 8.622h-2.391l-.87 1.293 1.195 1.773Zm-9.404-.466c.16-.706.72-1.133 1.493-1.133.773 0 1.373.467 1.507 1.133h-3Z"/></svg>',
        qbittorrent: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.911 23.994c-1.31 0-2.605-.232-3.831-.705-3.4-1.024-6.2-3.865-7.433-7.58-1.23-3.708-.685-7.654 1.459-10.554C4.062 2.038 7.677.094 11.742.008c4.064-.079 7.758 1.703 9.882 4.785a12.066 12.066 0 0 1 2.369 7.145c.138 3.733-1.75 7.368-5.052 9.728-2.147 1.535-4.61 2.328-7.03 2.328zm.11-22.314c-.081 0-.162 0-.244.002-3.5.074-6.599 1.725-8.29 4.415-1.856 2.516-2.31 5.893-1.25 9.086 1.06 3.197 3.448 5.636 6.386 6.523 3.025 1.165 6.496.633 9.345-1.402 2.847-2.035 4.473-5.144 4.351-8.318v-.032c0-2.214-.73-4.41-2.055-6.185-1.78-2.58-4.84-4.09-8.243-4.09zM9.406 20.246v-4.578a2.663 2.663 0 0 1-.952.863 2.573 2.573 0 0 1-1.29.344c-1.016 0-1.893-.444-2.63-1.33-.731-.887-1.097-2.102-1.097-3.646 0-.939.148-1.781.444-2.527.301-.746.734-1.309 1.299-1.69A3.26 3.26 0 0 1 7.052 7.1c1.058 0 1.891.487 2.5 1.46v-1.25h1.306v12.935H9.406zm-4.477-8.285c0 1.203.232 2.108.694 2.711.463.6 1.016.9 1.662.9.619 0 1.15-.286 1.597-.855.446-.576.67-1.447.67-2.615 0-1.245-.237-2.18-.71-2.81-.468-.627-1.02-.941-1.654-.941-.63 0-1.164.293-1.605.88-.435.581-.654 1.491-.654 2.73m9.55 4.702h-1.346V3.755h1.452v4.604c.613-.84 1.395-1.258 2.347-1.258.526 0 1.024.117 1.492.351.464.222.864.558 1.161.978.307.416.546.922.718 1.514.172.593.258 1.227.258 1.902 0 1.603-.363 2.841-1.088 3.716-.727.874-1.598 1.312-2.614 1.312-1.011 0-1.804-.46-2.379-1.382v1.17m-.016-4.746c0 1.122.14 1.932.42 2.432.456.815 1.074 1.223 1.854 1.223.635 0 1.183-.3 1.646-.898.462-.604.693-1.503.693-2.695 0-1.22-.224-2.122-.67-2.703-.44-.58-.975-.872-1.605-.872-.634 0-1.182.303-1.645.907-.463.6-.694 1.468-.694 2.607"/></svg>',
        nextcloud: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.018 6.537c-2.5 0-4.6 1.712-5.241 4.015-.56-1.232-1.793-2.105-3.225-2.105A3.569 3.569 0 0 0 0 12a3.569 3.569 0 0 0 3.552 3.553c1.432 0 2.664-.874 3.224-2.106.641 2.304 2.742 4.016 5.242 4.016 2.487 0 4.576-1.693 5.231-3.977.569 1.21 1.783 2.067 3.198 2.067A3.568 3.568 0 0 0 24 12a3.569 3.569 0 0 0-3.553-3.553c-1.416 0-2.63.858-3.199 2.067-.654-2.284-2.743-3.978-5.23-3.977zm0 2.085c1.878 0 3.378 1.5 3.378 3.378 0 1.878-1.5 3.378-3.378 3.378A3.362 3.362 0 0 1 8.641 12c0-1.878 1.5-3.378 3.377-3.378zm-8.466 1.91c.822 0 1.467.645 1.467 1.468s-.644 1.467-1.467 1.468A1.452 1.452 0 0 1 2.085 12c0-.823.644-1.467 1.467-1.467zm16.895 0c.823 0 1.468.645 1.468 1.468s-.645 1.468-1.468 1.468A1.452 1.452 0 0 1 18.98 12c0-.823.644-1.467 1.467-1.467z"/></svg>',
        bitwarden: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.722.296A.964.964 0 0 0 21.018 0H2.982a.959.959 0 0 0-.703.296.96.96 0 0 0-.297.702v12c0 .895.174 1.783.523 2.665.349.88.783 1.66 1.3 2.345.517.68 1.132 1.346 1.848 1.993a21.807 21.807 0 0 0 1.98 1.609c.605.427 1.235.83 1.893 1.212.657.381 1.125.638 1.4.772.276.134.5.241.664.311a.916.916 0 0 0 .814 0c.168-.073.389-.177.667-.311.275-.134.743-.394 1.401-.772a25.305 25.305 0 0 0 1.894-1.212A21.891 21.891 0 0 0 18.348 20c.716-.647 1.33-1.31 1.847-1.993s.949-1.463 1.3-2.345c.35-.879.524-1.767.524-2.665V1.001a.95.95 0 0 0-.297-.705zm-2.325 12.815c0 4.344-7.397 8.087-7.397 8.087V2.57h7.397v10.54z"/></svg>',
        uptimekuma: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.759.955c-4.071 0-7.93 2.265-10.06 5.774l-.16.263-.116.284c-1.81 4.44-2.188 9.118.621 12.459 2.67 3.174 6.221 3.328 9.477 3.308 3.256-.02 6.323-.482 8.995-2.032C22.75 19.714 24 16.917 24 14.53c0-2.388-.724-4.698-1.882-7.343l-.112-.257-.148-.238C19.683 3.2 15.83.955 11.758.955Zm0 3.868c2.919 0 5.19 1.305 6.816 3.914 2.076 4.747 2.076 7.724 0 8.929-3.116 1.808-11.234 2.359-13.57-.42-1.558-1.853-1.558-4.69 0-8.51 1.584-2.608 3.835-3.913 6.754-3.913z"/></svg>',
        // Custom SVGs for services without Simple Icons
        jackett: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a6 6 0 0 1 6 6h-2a4 4 0 0 0-8 0H6a6 6 0 0 1 6-6zm0 4a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2zm-6 6h12v2H6v-2z"/></svg>',
        openwebui: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-3.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.5 5c2.5 0 4.5 2 4.5 4.5h-9c0-2.5 2-4.5 4.5-4.5z"/></svg>',
        portfolio: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        hermes: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4zm-7 8a7 7 0 0 0 5 6.7V20h4v-3.3A7 7 0 0 0 19 10h-2a5 5 0 0 1-10 0H5z"/></svg>',
        samba: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 6a3 3 0 0 1 3-3h4l2 3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6zm3 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm9 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/></svg>'
    };

    /* ---------- Service catalogue ---------- */
    var CATEGORIES = [
        {
            name: 'Media',
            services: [
                {
                    name: 'Plex Media Server',
                    desc: 'Streaming de filmes, séries e música.',
                    url: 'http://pinhoneto.duckdns.org:32400/web',
                    icon: ICONS.plex,
                    iconBg: 'linear-gradient(135deg, #E5A00D, #CC8A00)',
                    iconColor: '#1a1a1a',
                    iconShadow: 'rgba(229, 160, 13, 0.3)'
                },
                {
                    name: 'qBittorrent',
                    desc: 'Gestão de descarregamentos BitTorrent.',
                    url: 'http://pinhoneto.duckdns.org:9080',
                    icon: ICONS.qbittorrent,
                    iconBg: 'linear-gradient(135deg, #2F67BA, #1A4A8E)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(47, 103, 186, 0.3)'
                },
                {
                    name: 'Jackett',
                    desc: 'Indexadores de torrents como API.',
                    url: 'http://pinhoneto.duckdns.org:9117',
                    icon: ICONS.jackett,
                    iconBg: 'linear-gradient(135deg, #F97316, #EA580C)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(249, 115, 22, 0.3)'
                }
            ]
        },
        {
            name: 'Nuvem & Produtividade',
            services: [
                {
                    name: 'Nextcloud',
                    desc: 'Nuvem pessoal: ficheiros, calendário e contactos.',
                    url: 'https://pinhoneto.duckdns.org/Nextcloud',
                    icon: ICONS.nextcloud,
                    iconBg: 'linear-gradient(135deg, #0082C9, #005A91)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(0, 130, 201, 0.3)'
                },
                {
                    name: 'Vaultwarden',
                    desc: 'Gestor de palavras-passe compatível com Bitwarden.',
                    url: 'https://pinhoneto.duckdns.org/Vaultwarden',
                    icon: ICONS.bitwarden,
                    iconBg: 'linear-gradient(135deg, #175DDC, #0E40A8)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(23, 93, 220, 0.3)'
                },
                {
                    name: 'Portfolio',
                    desc: 'Site pessoal e portfólio de Paulo Pinho.',
                    url: 'https://pgpinho.duckdns.org',
                    icon: ICONS.portfolio,
                    iconBg: 'linear-gradient(135deg, #f0506e, #D63E5C)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(240, 80, 110, 0.3)'
                }
            ]
        },
        {
            name: 'Monitorização',
            services: [
                {
                    name: 'Uptime Kuma',
                    desc: 'Monitorização de disponibilidade de serviços.',
                    url: 'https://pgpinho.duckdns.org:9443',
                    icon: ICONS.uptimekuma,
                    iconBg: 'linear-gradient(135deg, #5CDD8B, #3AB96A)',
                    iconColor: '#1a1a1a',
                    iconShadow: 'rgba(92, 221, 139, 0.3)'
                },
                {
                    name: 'Hermes Dashboard',
                    desc: 'Painel do agente Hermes — automação e IA.',
                    url: 'https://pgpinho.duckdns.org/hermes/',
                    icon: ICONS.hermes,
                    iconBg: 'linear-gradient(135deg, #f0a050, #D88838)',
                    iconColor: '#1a1a1a',
                    iconShadow: 'rgba(240, 160, 80, 0.3)'
                }
            ]
        },
        {
            name: 'Inteligência Artificial',
            services: [
                {
                    name: 'Open WebUI',
                    desc: 'Interface web para modelos de IA locais.',
                    url: 'https://papaai.duckdns.org',
                    icon: ICONS.openwebui,
                    iconBg: 'linear-gradient(135deg, #64d2ff, #0a84ff)',
                    iconColor: '#ffffff',
                    iconShadow: 'rgba(100, 210, 255, 0.3)'
                }
            ]
        },
        {
            name: 'Ficheiros',
            services: [
                {
                    name: 'Samba / SMB',
                    desc: 'Partilha de ficheiros na rede local.',
                    url: 'smb://pinhoneto.duckdns.org',
                    icon: ICONS.samba,
                    iconBg: 'linear-gradient(135deg, #f0c040, #D9A82C)',
                    iconColor: '#1a1a1a',
                    iconShadow: 'rgba(240, 192, 64, 0.3)',
                    noCheck: true
                }
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

    /* ---------- Card factory — iCloud app tile ---------- */
    function card(s, i) {
        var el = document.createElement('a');
        el.className = 'card';
        el.style.animationDelay = (i * 25) + 'ms';
        el.setAttribute('data-name', s.name.toLowerCase());
        el.setAttribute('href', s.url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');

        el.innerHTML =
            '<div class="card-icon" style="--icon-bg:' + (s.iconBg || 'var(--surface-2)') + ';--icon-color:' + (s.iconColor || '#fff') + ';--icon-shadow:' + (s.iconShadow || 'rgba(0,0,0,0.15)') + '">' +
                s.icon +
                '<span class="card-status">' + dotHTML(s.url, s.noCheck) + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<h3 class="card-name">' + s.name + '</h3>' +
            '</div>';
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
                    '<label class="svc-check"><input type="checkbox" id="' + id + '" data-svc="' + escapeHtml(s.name) + '"' + (checked ? ' checked' : '') + '><span>' + escapeHtml(s.name) + '</span></label>';
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
                '<label class="svc-check"><input type="checkbox" data-svc="' + escapeHtml(s.name) + '" checked><span>' + escapeHtml(s.name) + '</span></label>';
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