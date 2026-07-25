# AGENTS.md — Guia para Agentes IA

> Instruções para agentes de IA (Hermes, Claude, Copilot, etc.) que trabalhem neste projeto.

## 📌 Visão Geral

Este é o **PINHO-NETO Dashboard** — uma página web estática que serve como painel de acesso aos serviços auto-hospedados do servidor doméstico. O site está online em **https://pinhoneto.duckdns.org** e o código está em **https://github.com/pgpinho/pinhoneto-dashboard**.

- **Stack:** HTML5 + CSS3 + JavaScript vanilla (sem frameworks, sem build step, sem npm)
- **Design:** Apple design language (SF Pro, frosted glass, dark mode macOS Sonoma)
- **Idioma:** Português de Portugal (PT-PT) em toda a UI e descrições
- **Deploy:** nginx Docker container (`pgpinho-nginx`) no servidor doméstico
- **SSL:** Let's Encrypt via DNS-01 (DuckDNS plugin), cert em `/etc/letsencrypt/live/pinhoneto.duckdns.org/`

## 🗂️ Estrutura de Ficheiros

```
pinhoneto-dashboard/
├── index.html          # HTML principal — estrutura da página
├── css/style.css       # Design system completo Apple (dark mode, responsive)
├── js/app.js           # Toda a lógica: catálogo de serviços, tabs, relógio, status, pesquisa
├── Dockerfile          # nginx:alpine para deploy containerizado
├── README.md           # Documentação do projeto
└── AGENTS.md           # Este ficheiro
```

## 🖥️ Ambiente do Servidor

### Caminhos
- **Código-fonte:** `/home/marie/www/pinhoneto-dashboard/`
- **Nginx config:** `/home/marie/www/pgpinho-design/nginx.conf` (partilhado com portfolio)
- **Docker compose:** `/home/marie/www/pgpinho-design/docker-compose.yml`
- **Cert SSL:** `/etc/letsencrypt/live/pinhoneto.duckdns.org/`

### Docker
O dashboard é servido pelo container `pgpinho-nginx` (nginx:alpine). A configuração está no `docker-compose.yml` do projeto `pgpinho-design`:

```yaml
volumes:
  - /home/marie/www/pinhoneto-dashboard:/usr/share/nginx/pinhoneto:ro
  - /etc/letsencrypt/live/pinhoneto.duckdns.org/fullchain.pem:/etc/nginx/ssl-pinhoneto/fullchain.pem:ro
  - /etc/letsencrypt/live/pinhoneto.duckdns.org/privkey.pem:/etc/nginx/ssl-pinhoneto/privkey.pem:ro
```

### Comandos Úteis

```bash
# Reiniciar nginx (após mudanças em nginx.conf ou docker-compose.yml)
cd /home/marie/www/pgpinho-design && docker compose up -d --force-recreate nginx

# Reload apenas config nginx
docker exec pgpinho-nginx nginx -s reload

# Testar localmente
curl -sk -H "Host: pinhoneto.duckdns.org" https://localhost:443/

# Testar externamente
curl -sk https://pinhoneto.duckdns.org/

# Renovar cert SSL
sudo /home/marie/.hermes/hermes-agent/venv/bin/certbot renew

# Ver logs do nginx
docker exec pgpinho-nginx tail -20 /var/log/nginx/error.log
```

### Credenciais e Tokens
- **DuckDNS token:** `4117d1d8-0381-4b8b-b285-a8cdb3a6a066` (em `~/.duckdns/token`)
- **GitHub:** conta `pgpinho`, PAT fine-grained com `Contents: Read and write`
- **Sudo:** pass `212929003` (via `subprocess.run(input="PASS\n")`)

## 🎨 Padrões de Design

### Regras Obrigatórias
1. **Sem frameworks.** HTML, CSS e JS vanilla. Sem npm, sem webpack, sem build.
2. **Sem dependências externas.** Sem CDN JS. Google Fonts é a única exceção (CSS apenas).
3. **PT-PT.** Toda a UI, descrições de serviços, nomes de categorias e comentários em português de Portugal.
4. **Apple design.** Seguir a paleta Apple dark mode, SF Pro, frosted glass, cantos 20px, spring animations.
5. **Mobile-first.** O mobile deve parecer uma app iOS nativa com bottom tab bar.
6. **Sem imagens externas.** Ícones são emoji ou SVG inline. Favicon é SVG inline no HTML.

### Paleta Apple (CSS Custom Properties)
```css
--bg-0: #000000;      /* Background base */
--bg-1: #1c1c1e;      /* Superfícies */
--bg-2: #2c2c2e;      /* Superfícies elevadas */
--text: #f5f5f7;      /* Texto principal */
--text-dim: #98989d;  /* Texto secundário */
--accent: #0a84ff;    /* Apple blue */
--ok: #30d158;        /* Online */
--bad: #ff453a;       /* Offline */
--warn: #ff9f0a;      /* Lento */
```

### Tipografia
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
```

## ➕ Adicionar um Novo Serviço

Edita o array `CATEGORIES` no início de `js/app.js`:

```javascript
{
    name: 'Novo Serviço',
    desc: 'Descrição curta em PT-PT.',
    url: 'https://exemplo.duckdns.org',
    accent: '#0a84ff',    // Cor Apple palette
    icon: '🚀'              // Emoji
}
```

Coloca o serviço na categoria apropriada ou cria uma nova categoria:

```javascript
{
    name: 'Nova Categoria',
    services: [ ... ]
}
```

Após editar, corrigir permissões e testar:

```bash
chmod 644 /home/marie/www/pinhoneto-dashboard/js/app.js
curl -sk https://pinhoneto.duckdns.org/js/app.js | grep "Novo Serviço"
```

## 🔄 Workflow de Deploy

1. **Editar ficheiros** em `/home/marie/www/pinhoneto-dashboard/`
2. **Corrigir permissões:** `chmod 644` em todos os ficheiros (nginx precisa de ler como user não-root)
3. **Testar localmente:** `curl -sk -H "Host: pinhoneto.duckdns.org" https://localhost:443/`
4. **Testar externamente:** `curl -sk https://pinhoneto.duckdns.org/`
5. **Commit + push para GitHub:**
   ```bash
   cd /home/marie/www/pinhoneto-dashboard
   git add -A
   git commit -m "descrição da mudança"
   git push origin main
   ```
6. **Não é necessário reiniciar o nginx** — os ficheiros são montados como volume, mudanças são imediatas.

## ⚠️ Armadilhas Conhecidas

1. **Permissões:** Os ficheiros criados por subagentes ficam com `-rw-------` (600). O nginx dentro do container não consegue ler. Sempre fazer `chmod 644` após criar/editar ficheiros.

2. **Cache do navegador:** O CSS tem `expires 7d` e JS tem cache. Para testar mudanças, usar `?v=timestamp` ou limpar cache. O nginx config tem `Cache-Control: no-cache` apenas para `index.html`.

3. **CORS nos status checks:** O `fetch` com `mode: 'no-cors'` não consegue ler a resposta, mas uma promise resolvida indica que o host respondeu. Serviços em HTTP (como Plex, qBittorrent) podem aparecer como "offline" quando acedidos de HTTPS devido a mixed content blocking.

4. **nginx.conf partilhado:** O `nginx.conf` é partilhado com o portfolio `pgpinho-design`. Ter cuidado ao editar para não quebrar os outros sites (pgpinho.duckdns.org, papaai.duckdns.org).

5. **Docker Compose partilhado:** O `docker-compose.yml` está em `~/www/pgpinho-design/`, não em `~/www/pinhoneto-dashboard/`. Os volumes do pinhoneto são adicionados lá.

## 📊 Serviços Atuais (10)

| Categoria | Serviço | Porta | URL |
|---|---|---|---|
| Media | Plex Media Server | 32400 | `http://pinhoneto.duckdns.org:32400/web` |
| Media | qBittorrent | 9080 | `http://pinhoneto.duckdns.org:9080` |
| Media | Jackett | 9117 | `http://pinhoneto.duckdns.org:9117` |
| Nuvem | Nextcloud | 443 | `https://papaai.duckdns.org` |
| Nuvem | Vaultwarden | 8443 | `https://papaai.duckdns.org:8443` |
| Nuvem | Portfolio | 443 | `https://pgpinho.duckdns.org` |
| Monitorização | Uptime Kuma | 9443 | `https://pgpinho.duckdns.org:9443` |
| Monitorização | Hermes Dashboard | 443 | `https://pgpinho.duckdns.org/hermes/` |
| IA | Open WebUI | 443 | `https://pgpinho.duckdns.org/openwebui/` |
| Ficheiros | Samba / SMB | 445 | `smb://pinhoneto.duckdns.org` |

## 🔗 Links

- **Site:** https://pinhoneto.duckdns.org
- **GitHub:** https://github.com/pgpinho/pinhoneto-dashboard
- **Portfólio:** https://pgpinho.duckdns.org
- **Hermes Agent:** https://hermes-agent.nousresearch.com

---

© 2026 PINHO-NETO · Powered by Hermes Agent