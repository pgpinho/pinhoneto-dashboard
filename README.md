# 🏠 PINHO-NETO · Painel de Serviços

> Dashboard moderno com design Apple para acesso rápido a todos os serviços auto-hospedados do servidor doméstico PINHO-NETO.

🌐 **[pinhoneto.duckdns.org](https://pinhoneto.duckdns.org/)**

---

## 📋 Descrição

O PINHO-NETO Dashboard é uma página web estática (HTML + CSS + JS, sem dependências) que serve como painel central de acesso a todos os serviços que correm no servidor doméstico. O design segue a linguagem visual da Apple — SF Pro, frosted glass, dark mode estilo macOS Sonoma — com layout adaptativo:

- **Desktop:** grelha de cards com efeito glassmorphism, header com frosted glass
- **Mobile:** app-style iOS com bottom tab bar (Início, Serviços, Acerca), cards em lista single-column com chevron right

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🕐 **Relógio ao vivo** | Atualizado a cada segundo, em PT-PT (Sábado, 25 jul 2026 · 14:30:05) |
| 🔍 **Pesquisa em tempo real** | Filtra serviços por nome, descrição ou categoria |
| 💡 **Indicadores de estado** | Verde (online), vermelho (offline), laranja (lento), cinza (desconhecido) — via fetch CORS-tolerant + fallback image probe |
| 📱 **Bottom tab bar (mobile)** | 3 tabs: Início, Serviços, Acerca — estilo iOS com frosted glass |
| 💀 **Loading skeleton** | Skeleton animado enquanto os serviços carregam |
| 🎨 **Design Apple** | SF Pro Display/Text, backdrop-filter blur, cantos 20px, spring animations |
| 📲 **PWA-ready** | Meta tags apple-mobile-web-app-capable, theme-color, viewport-fit=cover |
| 🔒 **SSL** | Let's Encrypt via DNS-01 (DuckDNS plugin) |

## 🖥️ Serviços Incluídos

### 📺 Media & Entertainment
| Serviço | URL | Descrição |
|---|---|---|
| Plex Media Server | `http://pinhoneto.duckdns.org:32400/web` | Streaming de filmes, séries e música |
| qBittorrent | `http://pinhoneto.duckdns.org:9080` | Gestão de descarregamentos BitTorrent |
| Jackett | `http://pinhoneto.duckdns.org:9117` | Indexadores de torrents como API |

### ☁️ Nuvem & Produtividade
| Serviço | URL | Descrição |
|---|---|---|
| Nextcloud | `https://papaai.duckdns.org` | Nuvem pessoal: ficheiros, calendário e contactos |
| Vaultwarden | `https://papaai.duckdns.org:8443` | Gestor de palavras-passe compatível com Bitwarden |
| Portfolio | `https://pgpinho.duckdns.org` | Site pessoal e portfólio de Paulo Pinho |

### 📊 Monitorização
| Serviço | URL | Descrição |
|---|---|---|
| Uptime Kuma | `https://pgpinho.duckdns.org:9443` | Monitorização de disponibilidade de serviços |
| Hermes Dashboard | `https://pgpinho.duckdns.org/hermes/` | Painel do agente Hermes — automação e IA |

### 🧠 Inteligência Artificial
| Serviço | URL | Descrição |
|---|---|---|
| Open WebUI | `https://pgpinho.duckdns.org/openwebui/` | Interface web para modelos de IA locais |

### 📁 Ficheiros
| Serviço | URL | Descrição |
|---|---|---|
| Samba / SMB | `smb://pinhoneto.duckdns.org` | Partilha de ficheiros na rede local |

## 🚀 Como Usar

### Opção 1: Docker (recomendado)

```bash
docker build -t pinhoneto-dashboard .
docker run -d -p 8080:80 --name pinhoneto-dashboard pinhoneto-dashboard
```

Acede em `http://localhost:8080`

### Opção 2: Servidor estático local

```bash
python3 -m http.server 8080
# ou
npx serve .
```

Acede em `http://localhost:8080`

### Opção 3: nginx (produção)

O dashboard está integrado no nginx Docker do servidor, servido em `https://pinhoneto.duckdns.org` com SSL Let's Encrypt.

## 📁 Estrutura do Projeto

```
pinhoneto-dashboard/
├── index.html        # HTML principal (header, search, grid, tab bar, about)
├── css/
│   └── style.css     # Design system Apple (dark mode, frosted glass, responsive)
├── js/
│   └── app.js        # Lógica: serviços, relógio, tabs, status, pesquisa, skeleton
├── Dockerfile        # nginx:alpine com gzip + cache headers + SPA fallback
├── README.md         # Este ficheiro
└── AGENTS.md         # Guia para agentes IA
```

## 🎨 Design System

### Cores (Apple Dark Mode)
| Token | Valor | Uso |
|---|---|---|
| `--bg-0` | `#000000` | Background base |
| `--bg-1` | `#1c1c1e` | Superfícies |
| `--bg-2` | `#2c2c2e` | Superfícies elevadas |
| `--text` | `#f5f5f7` | Texto principal |
| `--text-dim` | `#98989d` | Texto secundário |
| `--text-faint` | `#6e6e73` | Texto terciário |
| `--accent` | `#0a84ff` | Apple blue (links, tabs ativas) |
| `--accent-warm` | `#ff9f0a` | Apple orange (logo PINHO) |
| `--ok` | `#30d158` | Online (verde Apple) |
| `--bad` | `#ff453a` | Offline (vermelho Apple) |
| `--warn` | `#ff9f0a` | Lento (laranja Apple) |

### Tipografia
```
-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
'Helvetica Neue', system-ui, sans-serif
```

### Breakpoints
- **Desktop:** `min-width: 768px` → grid com `auto-fill minmax(300px, 1fr)`
- **Mobile:** `max-width: 767px` → single-column, bottom tab bar visível

## 🔧 Adicionar um Novo Serviço

Edita o array `CATEGORIES` em `js/app.js`:

```javascript
{
    name: 'Nome do Serviço',
    desc: 'Descrição em PT-PT.',
    url: 'https://exemplo.duckdns.org',
    accent: '#0a84ff',   // Cor de destaque (Apple palette)
    icon: '🚀'            // Emoji ou SVG
}
```

## 🔒 SSL / Certificado

O certificado SSL é gerado via Let's Encrypt usando DNS-01 challenge (DuckDNS plugin):

```bash
certbot certonly \
  --authenticator dns-duckdns \
  --dns-duckdns-credentials /root/duckdns-creds.ini \
  --dns-duckdns-propagation-seconds 30 \
  -d pinhoneto.duckdns.org \
  --non-interactive --agree-tos \
  --email pgpinho@gmail.com --no-eff-email
```

Renovação automática configurada pelo Certbot.

## 🛠️ Tecnologias

- **HTML5** — sem frameworks, sem build step
- **CSS3** — CSS Grid, backdrop-filter, custom properties, env(safe-area-inset)
- **JavaScript ES5/ES6** — vanilla, sem dependências, IIFE pattern
- **Docker** — nginx:alpine para servir ficheiros estáticos
- **nginx** — reverse proxy no servidor, SSL termination, gzip
- **Let's Encrypt** — SSL via DNS-01 (DuckDNS)

## 📄 Licença

Projeto pessoal de Paulo Pinho. Uso privado.

## 👤 Autor

**Paulo Pinho** — Porto, Portugal
- GitHub: [@pgpinho](https://github.com/pgpinho)
- Email: pgpinho@gmail.com

## 🤖 Powered by

[Hermes Agent](https://hermes-agent.nousresearch.com) — Automatização e IA por Nous Research

---

© 2026 PINHO-NETO · Powered by Hermes Agent