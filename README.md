# Homelab

Homepage do homelab (React + Vite + Bootstrap 5, tema escuro): relógio, informação do servidor em tempo real (via [Glances](https://github.com/nicolargo/glances)) e atalhos para os serviços.

## Desenvolvimento

```bash
npm install
GLANCES_URL=http://<servidor>:61208 npm run dev
```

Sem `GLANCES_URL`, o proxy usa `http://localhost:61208` (ex.: `glances -w` a correr localmente).

## Deploy

```bash
./deploy.sh   # git pull + docker compose up -d --build
```

A página fica em `http://<servidor>:8080`. O nginx encaminha `/api/` para o container `glances`.

## Links dos serviços

Edita [src/config/links.ts](src/config/links.ts). Cada entrada usa `port` (mesmo host da página) ou `url` absoluto.

## Shelly (secção "Casa")

Adiciona os dispositivos em [src/config/shellys.ts](src/config/shellys.ts) (nome, IP, `gen: 1` ou `2`). A página fala com a API local de cada Shelly através do nginx (`/shelly/<ip>/...`, só IPs privados), por isso esta secção só funciona no container, não com `npm run dev`.
