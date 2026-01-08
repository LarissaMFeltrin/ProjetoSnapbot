#!/bin/bash
set -e

# Script de start para o Render
# Garante que o processo fique rodando em foreground

echo "🚀 Iniciando Laravel Backend no Render..."

cd /opt/render/project/src/backend || cd backend

# Executar servidor PHP em foreground (não em background)
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}

