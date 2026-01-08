#!/bin/bash
set -e

echo "🔨 Building Angular Frontend for Render..."

# Instalar dependências
npm ci

# Build para produção
npm run build -- --configuration production

# Injetar variáveis de ambiente no index.html
node inject-env.js

echo "✅ Build concluído!"
echo "📦 Arquivos de build em: dist/snapbot-frontend"

