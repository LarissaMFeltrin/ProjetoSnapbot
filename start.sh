#!/bin/bash

# Script para iniciar Backend (Laravel) e Frontend (Angular) simultaneamente
# Uso: ./start.sh

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando Snapbot - Backend e Frontend${NC}"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo -e "${YELLOW}⏹️  Encerrando servidores...${NC}"
    pkill -f "php artisan serve" 2>/dev/null
    pkill -f "ng serve" 2>/dev/null
    pkill -f "npm start" 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Carregar nvm se existir
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 18 2>/dev/null || nvm use --lts 2>/dev/null || true
fi

# Verificar se o backend existe
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}⚠️  Diretório backend não encontrado!${NC}"
    exit 1
fi

# Verificar se o frontend existe
if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  Diretório frontend não encontrado!${NC}"
    exit 1
fi

# Iniciar Backend (Laravel)
echo -e "${GREEN}📦 Iniciando Backend (Laravel) na porta 8000...${NC}"
cd backend
php artisan serve > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend iniciar
sleep 2

# Iniciar Frontend (Angular)
echo -e "${GREEN}🎨 Iniciando Frontend (Angular) na porta 4200...${NC}"
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${BLUE}✅ Servidores iniciados!${NC}"
echo ""
echo -e "${GREEN}📍 Backend:${NC}  http://localhost:8000"
echo -e "${GREEN}📍 Frontend:${NC} http://localhost:4200"
echo ""
echo -e "${YELLOW}💡 Dica: Pressione Ctrl+C para encerrar ambos os servidores${NC}"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo "   - Backend:  tail -f backend.log"
echo "   - Frontend: tail -f frontend.log"
echo ""

# Aguardar processos
wait

