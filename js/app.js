/* ============================================
   PINHO-NETO Dashboard — app.js
   Clock · Status checks · Search filter · Render
   ============================================ */

(function () {
    'use strict';

    /* ---------- Service catalogue ---------- */
    var CATEGORIES = [
        {
            name: 'Media & Entertainment',
            services: [
                {
                    name: 'Plex Media Server',
                    desc: 'Streaming de filmes, séries e música.',
                    url: 'http://pinhoneto.duckdns.org:32400/web',
                    accent: '#e5a00d',
                    icon: emoji('🎬')
                },
                {
                    name: 'qBittorrent',
                    desc: 'Gestão de descarregamentos BitTorrent.',
                    url: 'http://pinhoneto.duckdns.org:9080',
                    accent: '#2ec5e3',
                    icon: emoji('🧲')
                },
                {
                    name: 'Jackett',
                    desc: 'Indexadores de torrents como API.',
                    url: 'http://pinhoneto.duckdns.org:9117',
                    accent: '#f97316',
                    icon: emoji('🧥')
                }
            ]
        },
        {
            name: 'Cloud & Productivity',
            services: [
                {
                    name: 'Nextcloud',
                    desc: 'Nuvem pessoal: ficheiros, calendário e contactos.',
                    url: 'https://papaai.duckdns.org',
                    accent: '#38bdf8',
                    icon: svgCloud()
                },
                {
                    name: 'Vaultwarden',
                    desc: 'Gestor de palavras-passe compatível com Bitwarden.',
                    url: 'https://papaai.duckdns.org:8443',
                    accent: '#a78bfa',
                    icon: emoji('🔐')
                },
                {
                    name: 'Portfolio (pgpinho)',
                    desc: 'Site pessoal e portfólio de Paulo Pinho.',
                    url: 'https://pgpinho.duckdns.org',
                    accent: '#f472b6',
                    icon: emoji('🖌️')
                }
            ]
        },
        {
            name: 'Monitoring',
            services: [
                {
                    name: 'Uptime Kuma',
                    desc: 'Monitorização de disponibilidade de serviços.',
                    url: 'https://pgpinho.duckdns.org:9443',
                    accent: '#22d3ee',
                    icon: emoji('📊')
                },
                {
                    name: 'Hermes Dashboard',
                    desc: 'Painel do agente Hermes — automação e IA.',
                    url: 'https://pgpinho.duckdns.org/hermes/',
                    accent: '#fb923c',
                    icon: emoji('🤖')
                }
            ]
        },
        {
            name: 'AI',
            services: [
                {
                    name: 'Open WebUI',
                    desc: 'Interface web para modelos de IA locais.',
                    url: 'https://pgpinho.duckdns.org/openwebui/',
                    accent: '#34d399',
                    icon: emoji('🧠')
                }
            ]
        },
        {
            name: 'File Sharing',
            services: [
                {
                    name: 'Samba / SMB',
                    desc: 'Partilha de ficheiros na rede local.',
                    url: 'smb://pinhoneto.duckdns.org',
                    accent: '#fbbf24',
                    icon: emoji('📁'),
                    noCheck: true
                }
            ]
        }
    ];

    /* ---------- Icon helpers ---------- */
    function emoji(e) { return '<span>' + e + '</span>'; }

    function svgCloud() {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
               '<path d="M17.5 19a4.5 4.5 0 0 0 0-9h-1.8A7 7 0 1 0 4 15.3"></path>' +
               '</svg>';
    }

    function linkIcon() {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
               '<path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>';
    }

    /* ---------- Flatten for search ---------- */
    var ALL = CATEGORIES.reduce(function (acc, cat) {
        cat.services.forEach(function (s) { s._cat = cat.name; acc.push(s); });
        return acc;
    }, []);

    /* ---------- Render ---------- */
    var grid = document.getElementById('services');

    function render() {
        grid.innerHTML = '';
        var q = (document.getElementById('search').value || '').trim().toLowerCase();
        var visible = q ? ALL.filter(function (s) {
            return (s.name + ' ' + s.desc + ' ' + s._cat).toLowerCase().indexOf(q) > -1;
        }) : null;

        document.getElementById('no-results').hidden = !(q && visible.length === 0);

        if (q) {
            // Flat list when searching
            var frag = document.createDocumentFragment();
            visible.forEach(function (s, i) { frag.appendChild(card(s, i)); });
            grid.appendChild(frag);
        } else {
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

    function card(s, i) {
        var el = document.createElement('article');
        el.className = 'card';
        el.style.animationDelay = (i * 40) + 'ms';
        el.style.setProperty('--accent', s.accent);
        el.setAttribute('data-name', s.name.toLowerCase());

        var statusHTML = s.noCheck
            ? '<span class="card-status"><span class="dot unknown" title="Sem verificação"></span>—</span>'
            : '<span class="card-status"><span class="dot" data-url="' + s.url + '"></span><span class="dot-text">a verificar…</span></span>';

        el.innerHTML =
            '<div class="card-top">' +
                '<div class="card-icon">' + s.icon + '</div>' +
                statusHTML +
            '</div>' +
            '<div class="card-body">' +
                '<h3 class="card-name">' + s.name + '</h3>' +
                '<p class="card-desc">' + s.desc + '</p>' +
            '</div>' +
            '<a class="card-link" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' +
                'Abrir ' + linkIcon() +
            '</a>';
        return el;
    }

    /* ---------- Status checks (CORS-tolerant) ---------- */
    function checkStatuses() {
        var dots = grid.querySelectorAll('.dot[data-url]');
        dots.forEach(function (dot) {
            var url = dot.getAttribute('data-url');
            if (/^smb:/.test(url)) return;
            checkOne(dot, url);
        });
    }

    function checkOne(dot, url) {
        var txt = dot.nextElementSibling;
        // Try a no-cors fetch; we can't read the response, but a resolved
        // promise means the host responded (network reachable). A rejection
        // means unreachable. Timeouts handled via AbortController.
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 6000) : null;

        fetch(url, { mode: 'no-cors', signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
            .then(function () {
                setStatus(dot, 'ok', 'online');
            })
            .catch(function (err) {
                // no-cors fetch resolving => ok; if it rejects outright the
                // host is likely down OR CORS preflight failed. Distinguish
                // TypeError (network) from AbortError (timeout).
                if (err && err.name === 'AbortError') {
                    setStatus(dot, 'warn', 'lento');
                } else {
                    // Could be CORS/network — try a lightweight image probe
                    // as a secondary signal before declaring bad.
                    imgProbe(url).then(
                        function () { setStatus(dot, 'ok', 'online'); },
                        function () { setStatus(dot, 'bad', 'offline'); }
                    );
                }
            })
            .finally(function () { if (timer) clearTimeout(timer); });
    }

    function imgProbe(url) {
        return new Promise(function (resolve, reject) {
            try {
                var img = new Image();
                var done = false;
                img.onload = function () { if (!done) { done = true; resolve(); } };
                img.onerror = function () {
                    if (!done) { done = true; reject(); }
                };
                setTimeout(function () { if (!done) { done = true; reject(); } }, 5000);
                // Append a cache-buster; favicon path is a good reachability probe
                img.src = url.replace(/\/$/, '') + '/favicon.ico?_=' + Date.now();
            } catch (e) { reject(); }
        });
    }

    function setStatus(dot, cls, label) {
        dot.classList.remove('ok', 'warn', 'bad', 'unknown');
        dot.classList.add(cls, 'pulse');
        var txt = dot.nextElementSibling;
        if (txt && txt.classList.contains('dot-text')) txt.textContent = label;
    }

    /* ---------- Search ---------- */
    document.getElementById('search').addEventListener('input', render);

    /* ---------- Clock ---------- */
    function tick() {
        var now = new Date();
        var t = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        var d = weekday(now.getDay()) + ', ' + pad(now.getDate()) + ' ' + month(now.getMonth()) + ' ' + now.getFullYear();
        document.getElementById('clock-time').textContent = t;
        document.getElementById('clock-date').textContent = d;
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function weekday(i) {
        return ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][i];
    }
    function month(i) {
        return ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][i];
    }

    /* ---------- Init ---------- */
    tick();
    setInterval(tick, 1000);
    render();
})();