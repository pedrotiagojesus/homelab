# Homelab

Homepage do homelab (React + Vite + Bootstrap 5, tema escuro): relógio, alertas e informação do servidor em tempo real (via [Glances](https://github.com/nicolargo/glances)), controlo de dispositivos Shelly e atalhos para os serviços.

## Configuração

Links e Shellys estão em `config/config.json` (criado a partir de [config/config.example.json](config/config.example.json) no primeiro deploy). O ficheiro é montado no container: edita-o no servidor e faz refresh — não é preciso rebuild. O ficheiro não está no git.

```jsonc
{
  "links": [
    // `port`: mesmo host pelo qual a página foi aberta; ou `url` absoluto.
    // "check": false desativa o indicador online/offline (ex.: HTTPS self-signed).
    { "name": "Terminal", "icon": "bi-terminal", "description": "ttyd", "port": 7681 }
  ],
  "shellys": [
    // gen 1: Shelly 1, Plug S, ...; gen 2: Plus/Pro/Gen3/Gen4. IP tem de ser privado.
    { "name": "Candeeiro da sala", "ip": "192.168.1.50", "gen": 2, "icon": "bi-lightbulb" }
  ]
}
```

Ícones: https://icons.getbootstrap.com/

## Deploy

```bash
./deploy.sh   # git pull + cria config/config.json se faltar + docker compose up -d --build
```

A página fica em `http://<servidor>` (porta 80). Os dois containers usam a rede do host: o Glances só escuta em `127.0.0.1:61208` (não fica exposto à LAN) e o nginx encaminha `/api/` para ele e `/shelly/<ip>/...` para os Shelly (só IPs privados).

## Desenvolvimento

```bash
npm install
GLANCES_URL=http://<servidor>:61208 npm run dev
```

Sem `GLANCES_URL`, o proxy usa `http://localhost:61208` (ex.: `glances -w` a correr localmente). Como o Glances do servidor só escuta em 127.0.0.1, para usar o do servidor faz um túnel: `ssh -L 61208:127.0.0.1:61208 <servidor>`. A secção Shelly só funciona no container (precisa do proxy do nginx).
