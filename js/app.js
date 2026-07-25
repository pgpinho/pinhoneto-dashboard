/* ============================================
   PINHO-NETO Dashboard — app.js
   v4.0 · Full-viewport Web App
   Filter chips · Search · Status checks ·
   Bottom tab bar (mobile) · About modal
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

    /* ---------- Flatten ---------- */
    var ALL = CATEGORIES.reduce(function (acc, cat) {
        cat.services.forEach(function (s) { s._cat = cat.name; acc.push(s); });
        return acc;
    }, []);

    /* ---------- State ---------- */
    var isMobile = window.innerWidth < 600;
    var currentTab = 'inicio';
    var searchQuery = '';
    var activeFilter = 'all';
    var statusCache = {};

    /* ---------- DOM refs ---------- */
    var grid = document.getElementById('services');
    var noResults = document.getElementById('no-results');
    var searchInput = document.getElementById('search');
    var clockTime = document.getElementById('clock-time');
    var clockDate = document.getElementById('clock-date');
    var tabBar = document.getElementById('tabBar');
    var filterChips = document.getElementById('filterChips');
    var aboutSection = document.getElementById('aboutSection');
    var aboutClose = document.getElementById('aboutClose');

    /* ---------- Icon helpers ---------- */
    function chevronSVG() {
        return '<svg class="card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"></polyline></svg>';
    }

    function dotHTML(url, noCheck) {
        if (noCheck) {
            return '<span class="dot unknown"></span><span class="dot-text">—</span>';
        }
        if (statusCache[url]) {
            var c = statusCache[url];
            return '<span class="dot ' + c.cls + ' pulse" data-url="' + url + '"></span><span class="dot-text">' + c.label + '</span>';
        }
        return '<span class="dot" data-url="' + url + '"></span><span class="dot-text">…</span>';
    }

    /* ---------- Filter chips ---------- */
    filterChips.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            filterChips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-filter');
            render();
        });
    });

    /* ---------- Tab bar (mobile) ---------- */
    tabBar.querySelectorAll('.tab-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    function switchTab(tab) {
        currentTab = tab;
        tabBar.querySelectorAll('.tab-item').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-tab') === tab);
        });

        if (tab === 'acerca') {
            aboutSection.classList.add('show');
            return;
        }
        aboutSection.classList.remove('show');
        render();
    }

    /* About close */
    aboutClose.addEventListener('click', function () {
        aboutSection.classList.remove('show');
        // Reset to inicio tab
        currentTab = 'inicio';
        tabBar.querySelectorAll('.tab-item').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-tab') === 'inicio');
        });
    });

    /* Click outside closes about */
    aboutSection.addEventListener('click', function (e) {
        if (e.target === aboutSection) {
            aboutSection.classList.remove('show');
            currentTab = 'inicio';
            tabBar.querySelectorAll('.tab-item').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-tab') === 'inicio');
            });
        }
    });

    /* Escape closes about */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && aboutSection.classList.contains('show')) {
            aboutSection.classList.remove('show');
            currentTab = 'inicio';
            tabBar.querySelectorAll('.tab-item').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-tab') === 'inicio');
            });
        }
    });

    /* ---------- Get visible services ---------- */
    function getVisible() {
        var q = searchQuery;
        return ALL.filter(function (s) {
            // Category filter
            if (activeFilter !== 'all' && s._cat !== activeFilter) return false;
            // Search
            if (q && (s.name + ' ' + s.desc + ' ' + s._cat).toLowerCase().indexOf(q) === -1) return false;
            return true;
        });
    }

    /* ---------- Main render ---------- */
    function render() {
        grid.innerHTML = '';
        var visible = getVisible();
        noResults.hidden = visible.length > 0;

        visible.forEach(function (s, i) {
            grid.appendChild(card(s, i));
        });

        checkStatuses();
    }

    /* ---------- Card factory ---------- */
    function card(s, i) {
        var el = document.createElement('a');
        el.className = 'card';
        el.style.animationDelay = (i * 30) + 'ms';
        el.style.setProperty('--accent', s.accent);
        el.setAttribute('data-name', s.name.toLowerCase());
        el.setAttribute('href', s.url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');

        var statusHTML = dotHTML(s.url, s.noCheck);

        el.innerHTML =
            '<div class="card-top">' +
                '<div class="card-icon">' + s.icon + '</div>' +
                '<span class="card-status">' + statusHTML + '</span>' +
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
            if (statusCache[url]) {
                applyStatus(dot, statusCache[url]);
                return;
            }
            checkOne(dot, url);
        });
    }

    function checkOne(dot, url) {
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;

        fetch(url, { mode: 'no-cors', signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
            .then(function () {
                var r = { cls: 'ok', label: 'online' };
                statusCache[url] = r;
                applyStatus(dot, r);
            })
            .catch(function (err) {
                if (err && err.name === 'AbortError') {
                    var rW = { cls: 'warn', label: 'lento' };
                    statusCache[url] = rW;
                    applyStatus(dot, rW);
                } else {
                    imgProbe(url).then(
                        function () {
                            var rO = { cls: 'ok', label: 'online' };
                            statusCache[url] = rO;
                            applyStatus(dot, rO);
                        },
                        function () {
                            var rB = { cls: 'bad', label: 'offline' };
                            statusCache[url] = rB;
                            applyStatus(dot, rB);
                        }
                    );
                }
            })
            .then(function () { if (timer) clearTimeout(timer); });
    }

    function imgProbe(url) {
        return new Promise(function (resolve, reject) {
            try {
                var img = new Image();
                var done = false;
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

    /* ---------- Clock ---------- */
    var WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
        var now = new Date();
        clockTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        clockDate.textContent = WEEKDAYS[now.getDay()] + ', ' + now.getDate() + ' ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear();
        if (isMobile) clockTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
    }

    /* ---------- Responsive ---------- */
    function handleResize() {
        isMobile = window.innerWidth < 600;
    }
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

    /* ---------- Init ---------- */
    function init() {
        isMobile = window.innerWidth < 600;
        tick();
        setInterval(tick, 1000);
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();