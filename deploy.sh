#!/bin/bash
git pull origin main
# Primeira instalação: cria a configuração a partir do exemplo
[ -f config/config.json ] || cp config/config.example.json config/config.json
docker compose up -d --build
