/* ============================================
   PINHO-NETO Dashboard — app.js
   Apple-inspired interactions
   Clock · Status checks · Search filter ·
   Bottom tab bar · Loading skeleton ·
   Responsive desktop/mobile rendering
   ============================================ */

(function () {
    'use strict';

    /* ---------- Service catalogue ---------- */
    var CATEGORIES = [
        {
            name: 'Media',
            services: [
                {
                    name: 'Plex Media Server',
                    desc: 'Streaming de filmes, séries e música.',
                    url: 'http://pinhoneto.duckdns.org:32400/web',
                    accent: '#e5a00d',
                    icon: '🎬'
                },
                {
                    name: 'qBittorrent',
                    desc: 'Gestão de descarregamentos BitTorrent.',
                    url: 'http://pinhoneto.duckdns.org:9080',
                    accent: '#2ec5e3',
                    icon: '🧲'
                },
                {
                    name: 'Jackett',
                    desc: 'Indexadores de torrents como API.',
                    url: 'http://pinhoneto.duckdns.org:9117',
                    accent: '#f97316',
                    icon: '🧥'
                }
            ]
        },
        {
            name: 'Nuvem & Produtividade',
            services: [
                {
                    name: 'Nextcloud',
                    desc: 'Nuvem pessoal: ficheiros, calendário e contactos.',
                    url: 'https://papaai.duckdns.org',
                    accent: '#0a84ff',
                    icon: '☁️'
                },
                {
                    name: 'Vaultwarden',
                    desc: 'Gestor de palavras-passe compatível com Bitwarden.',
                    url: 'https://papaai.duckdns.org:8443',
                    accent: '#bf5af2',
                    icon: '🔐'
                },
                {
                    name: 'Portfolio',
                    desc: 'Site pessoal e portfólio de Paulo Pinho.',
                    url: 'https://pgpinho.duckdns.org',
                    accent: '#ff375f',
                    icon: '🖌️'
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
                    accent: '#30d158',
                    icon: '📊'
                },
                {
                    name: 'Hermes Dashboard',
                    desc: 'Painel do agente Hermes — automação e IA.',
                    url: 'https://pgpinho.duckdns.org/hermes/',
                    accent: '#ff9f0a',
                    icon: '🤖'
                }
            ]
        },
        {
            name: 'Inteligência Artificial',
            services: [
                {
                    name: 'Open WebUI',
                    desc: 'Interface web para modelos de IA locais.',
                    url: 'https://pgpinho.duckdns.org/openwebui/',
                    accent: '#64d2ff',
                    icon: '🧠'
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
                    accent: '#ffd60a',
                    icon: '📁',
                    noCheck: true
                }
            ]
        }
    ];

    /* ---------- Flatten for search ---------- */
    var ALL = CATEGORIES.reduce(function (acc, cat) {
        cat.services.forEach(function (s) { s._cat = cat.name; acc.push(s); });
        return acc;
    }, []);

    /* ---------- State ---------- */
    var isMobile = window.innerWidth < 768;
    var currentTab = 'inicio';
    var searchQuery = '';
    var statusCache = {};

    /* ---------- DOM refs ---------- */
    var grid = document.getElementById('services');
    var noResults = document.getElementById('no-results');
    var searchInput = document.getElementById('search');
    var clockTime = document.getElementById('clock-time');
    var clockDate = document.getElementById('clock-date');
    var skeleton = document.getElementById('skeleton');
    var aboutSection = document.getElementById('aboutSection');
    var tabBar = document.getElementById('tabBar');
    var heroSection = document.querySelector('.hero');
    var searchSection = document.querySelector('.search-section');

    /* ---------- Icon helpers ---------- */
    function linkIcon() {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">' +
               '<path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>';
    }

    function chevronSVG() {
        return '<svg class="card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
               '<polyline points="9 6 15 12 9 18"></polyline></svg>';
    }

    function dotHTML(url, noCheck) {
        if (noCheck) {
            return '<span class="dot unknown"></span><span class="dot-text">—</span>';
        }
        if (statusCache[url]) {
            var c = statusCache[url];
            return '<span class="dot ' + c.cls + ' pulse" data-url="' + url + '"></span><span class="dot-text">' + c.label + '</span>';
        }
        return '<span class="dot" data-url="' + url + '"></span><span class="dot-text">a verificar…</span>';
    }

    /* ---------- Tab bar handling ---------- */
    tabBar.querySelectorAll('.tab-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    function switchTab(tab) {
        currentTab = tab;
        tabBar.querySelectorAll('.tab-item').forEach(function (b) {
            var active = b.getAttribute('data-tab') === tab;
            b.classList.toggle('active', active);
        });
        render();
    }

    /* ---------- Main render ---------- */
    function render() {
        // Hide skeleton once we're rendering real content
        if (skeleton) skeleton.hidden = true;

        // About tab
        if (currentTab === 'acerca') {
            grid.hidden = true;
            noResults.hidden = true;
            if (heroSection) heroSection.hidden = true;
            if (aboutSection) aboutSection.hidden = false;
            return;
        }

        if (aboutSection) aboutSection.hidden = true;
        grid.hidden = false;

        // Início tab on desktop shows hero; Serviços tab always shows services
        if (heroSection && !isMobile) {
            heroSection.hidden = (currentTab === 'servicos');
        }

        grid.innerHTML = '';

        // Determine visible services
        var q = searchQuery;
        var visible;
        if (q) {
            visible = ALL.filter(function (s) {
                return (s.name + ' ' + s.desc + ' ' + s._cat).toLowerCase().indexOf(q) > -1;
            });
            noResults.hidden = !(q && visible.length === 0);
        } else {
            noResults.hidden = true;
        }

        if (q) {
            // Flat list when searching
            var frag = document.createDocumentFragment();
            visible.forEach(function (s, i) { frag.appendChild(card(s, i)); });
            grid.appendChild(frag);
        } else {
            // Grouped by category
            CATEGORIES.forEach(function (cat) {
                var lbl = document.createElement('div');
                lbl.className = 'cat-label';
                lbl.textContent = cat.name;
                grid.appendChild(lbl);
                cat.services.forEach(function (s, i) { grid.appendChild(card(s, i)); });
            });
        }

        checkStatuses();
    }

    /* ---------- Card factory ---------- */
    function card(s, i) {
        var el = document.createElement('a');
        el.className = 'card';
        el.style.animationDelay = (i * 40) + 'ms';
        el.style.setProperty('--accent', s.accent);
        el.setAttribute('data-name', s.name.toLowerCase());
        el.setAttribute('href', s.url);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');

        var statusHTML = dotHTML(s.url, s.noCheck);

        // Desktop: icon + status on top, body below, link at bottom
        // Mobile (CSS handles layout): row layout with chevron
        el.innerHTML =
            '<div class="card-top">' +
                '<div class="card-icon">' + s.icon + '</div>' +
                '<span class="card-status">' + statusHTML + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<h3 class="card-name">' + s.name + '</h3>' +
                '<p class="card-desc">' + s.desc + '</p>' +
            '</div>' +
            '<span class="card-link">' +
                'Abrir ' + linkIcon() +
            '</span>' +
            chevronSVG();

        return el;
    }

    /* ---------- Status checks (CORS-tolerant) ---------- */
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
                var result = { cls: 'ok', label: 'online' };
                statusCache[url] = result;
                applyStatus(dot, result);
            })
            .catch(function (err) {
                if (err && err.name === 'AbortError') {
                    var resultW = { cls: 'warn', label: 'lento' };
                    statusCache[url] = resultW;
                    applyStatus(dot, resultW);
                } else {
                    imgProbe(url).then(
                        function () {
                            var resultO = { cls: 'ok', label: 'online' };
                            statusCache[url] = resultO;
                            applyStatus(dot, resultO);
                        },
                        function () {
                            var resultB = { cls: 'bad', label: 'offline' };
                            statusCache[url] = resultB;
                            applyStatus(dot, resultB);
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
    var WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
        var now = new Date();
        var h = pad(now.getHours());
        var m = pad(now.getMinutes());
        var s = pad(now.getSeconds());
        var wd = WEEKDAYS[now.getDay()];
        var d = now.getDate();
        var mo = MONTHS[now.getMonth()];
        var y = now.getFullYear();

        clockTime.textContent = h + ':' + m + ':' + s;
        clockDate.textContent = wd + ', ' + d + ' ' + mo + ' ' + y;

        // On mobile, show compact time
        if (isMobile) {
            clockTime.textContent = h + ':' + m;
        }
    }

    /* ---------- Responsive: detect breakpoint crossing ---------- */
    var prevMobile = isMobile;

    function handleResize() {
        var nowMobile = window.innerWidth < 768;
        if (nowMobile !== prevMobile) {
            prevMobile = nowMobile;
            isMobile = nowMobile;
            render();
        }
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

    /* ---------- Init ---------- */
    function init() {
        isMobile = window.innerWidth < 768;
        prevMobile = isMobile;
        tick();
        setInterval(tick, 1000);

        // Show skeleton initially, then render after brief delay
        setTimeout(function () {
            render();
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();