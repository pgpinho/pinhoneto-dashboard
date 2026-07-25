# PINHO-NETO · Painel de Serviços

Painel web estático (HTML/CSS/JS — sem dependências) que serve como ponto central de acesso a todos os serviços auto-hospedados do servidor doméstico **PINHO-NETO**.

## ✨ Características

- **Tema escuro moderno** com fundo de gradiente animado e estilo *glassmorphism*.
- **Gradientes de marca** — laranja/âmbar para "PINHO", azul/ciano para "NETO".
- **Cartões de serviço** com ícone, descrição, botão de acesso e indicador de estado.
- **Verificação de estado** em tempo real (online / lento / offline / desconhecido), tolerante a bloqueios CORS.
- **Relógio ao vivo** no cabeçalho (atualização por segundo, em português europeu).
- **Pesquisa/filtro** instantânea por nome ou descrição.
- **Layout responsivo** com CSS Grid — funciona em telemóvel, tablet e desktop.
- **Sem dependências externas** além do Google Fonts (Inter). Sem frameworks, sem build.

## 📁 Estrutura

```
pinhoneto-dashboard/
├── index.html          # Página principal
├── css/style.css       # Estilos (tema, glassmorphism, animações)
├── js/app.js           # Lógica (relógio, estado, pesquisa, render)
├── README.md           # Este ficheiro
└── Dockerfile          # Imagem nginx:alpine para servir
```

## 🚀 Serviços listados

| Categoria            | Serviço             | URL                                    |
|----------------------|---------------------|----------------------------------------|
| Media & Entertainment| Plex Media Server   | http://pinhoneto.duckdns.org:32400/web |
| Media & Entertainment| qBittorrent         | http://pinhoneto.duckdns.org:9080      |
| Media & Entertainment| Jackett             | http://pinhoneto.duckdns.org:9117      |
| Cloud & Productivity | Nextcloud           | https://papaai.duckdns.org             |
| Cloud & Productivity | Vaultwarden         | https://papaai.duckdns.org:8443        |
| Cloud & Productivity | Portfolio (pgpinho) | https://pgpinho.duckdns.org            |
| Monitoring           | Uptime Kuma         | https://pgpinho.duckdns.org:9443       |
| Monitoring           | Hermes Dashboard    | https://pgpinho.duckdns.org/hermes/    |
| AI                   | Open WebUI          | https://pgpinho.duckdns.org/openwebui/ |
| File Sharing         | Samba / SMB         | smb://pinhoneto.duckdns.org            |

## ▶️ Como executar localmente

```bash
cd pinhoneto-dashboard
python3 -m http.server 8080
# Abrir http://localhost:8080
```

## 🐳 Docker

```bash
docker build -t pinhoneto-dashboard .
docker run -d -p 8080:80 --name pinhoneto-dashboard pinhoneto-dashboard
# Abrir http://localhost:8080
```

## 🔧 Notas

- A verificação de estado usa `fetch` no modo `no-cors`; quando o CORS bloqueia a leitura, faz um *fallback* com sonda de imagem (`favicon.ico`) antes de marcar como offline.
- O serviço Samba/SMB (`smb://`) não é verificado (protocolo não-HTTP) — aparece sempre como "—".
- Textos em **português europeu (PT-PT)**.

---

© 2026 PINHO-NETO · Powered by Hermes Agent