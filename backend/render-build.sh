#!/bin/bash
set -e

echo "🔨 Building Laravel Backend for Render..."

# Instalar dependências
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Gerar chave da aplicação se não existir
if [ ! -f .env ]; then
    cp .env.example .env
fi

php artisan key:generate --force

# Cache de configuração
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Executar migrations
php artisan migrate --force --no-interaction

echo "✅ Build concluído!"

