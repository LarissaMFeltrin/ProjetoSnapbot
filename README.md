# Snapbot - Gerenciamento de Dispositivos Celulares

Aplicação web para gerenciamento de dispositivos celulares desenvolvida com Laravel (backend) e Angular (frontend).

## 📋 Requisitos

- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js 18+ (para o frontend)
- npm ou yarn

## 🚀 Instalação

### Instalação Inicial

#### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

#### Frontend (Angular)

```bash
cd frontend
npm install
```

### Iniciando a Aplicação

**Opção 1: Script único (Recomendado) 🎯**

Inicie backend e frontend com um único comando:

```bash
# Na raiz do projeto
./start.sh

# Ou usando npm
npm start
```

Isso iniciará:
- ✅ Backend Laravel em `http://localhost:8000`
- ✅ Frontend Angular em `http://localhost:4200`

**Opção 2: Comandos separados**

Se preferir iniciar separadamente:

```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm start
```

A aplicação estará disponível em: `http://localhost:4200`

## 📦 Repositório GitHub

- **URL:** https://github.com/LarissaMFeltrin/ProjetoSnapbot
- Para fazer push do código, siga as instruções em `GUIA_ENTREGA.md`

## 🌐 Deploy Online

### Deploy no Render

O projeto está configurado para deploy completo no Render. Consulte o guia detalhado em [`DEPLOY_RENDER.md`](DEPLOY_RENDER.md).

**Deploy rápido:**
1. Conecte seu repositório Git no Render
2. Use o arquivo `render.yaml` para criar todos os serviços automaticamente
3. O Render criará automaticamente:
   - ✅ Backend Laravel (Web Service)
   - ✅ Frontend Angular (Static Site)
   - ✅ Banco de dados PostgreSQL

Para informações detalhadas sobre deploy, consulte `DEPLOY_RENDER.md`.

**Aplicação online:** _(Configure após deploy)_
- Frontend: _(URL do frontend em produção)_
- Backend: _(URL da API em produção)_

## 🔐 Credenciais de Teste

- **Email:** admin@snapbot.com
- **Senha:** password123

## 📚 Documentação da API

A documentação completa da API está disponível em:
- Postman Collection: `/docs/postman_collection.json`
- Guia de Instruções: Veja o arquivo `GUIA_COMPLETO.md`

## 🧪 Testes

### Backend

```bash
cd backend
php artisan test
```

### Frontend

```bash
cd frontend
ng test
```

## 📁 Estrutura do Projeto

```
snapbot/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/        # Controllers da API
│   │   │   └── Requests/       # Form Requests (validações)
│   │   └── Models/             # Models (Device, User)
│   ├── database/
│   │   ├── migrations/         # Migrations
│   │   └── seeders/            # Seeders
│   ├── routes/
│   │   └── api.php            # Rotas da API
│   └── tests/                  # Testes PHPUnit
├── frontend/                   # Angular App
├── docs/                       # Documentação
│   └── postman_collection.json # Collection do Postman
└── README.md
```

## 🛠️ Tecnologias

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** Angular 17, Angular Material
- **Autenticação:** Laravel Sanctum
- **Banco de Dados:** MySQL 8.0
- **Testes:** PHPUnit, Jasmine/Karma

## 📝 Funcionalidades Implementadas

### Backend
- ✅ CRUD completo de dispositivos usando Query Builder (sem Eloquent ORM)
- ✅ Autenticação com Laravel Sanctum (login/registro)
- ✅ Validações (name e location obrigatórios, purchase_date não pode ser futura)
- ✅ Soft Delete para dispositivos
- ✅ Filtros por: in_use, location, purchase_date (faixa de datas)
- ✅ Ordenação por: name, location, purchase_date, in_use, created_at
- ✅ Paginação de resultados
- ✅ Isolamento de dados por usuário (apenas dispositivos do usuário autenticado)
- ✅ Testes unitários completos (PHPUnit)

### Frontend
- ✅ CRUD completo de dispositivos com Angular Material
- ✅ Componentes: DeviceListComponent, DeviceFormComponent
- ✅ Autenticação (Login/Registro)
- ✅ Reactive Forms com validação
- ✅ Guards de autenticação
- ✅ Filtros combináveis com persistência no localStorage
- ✅ Paginação de resultados
- ✅ Estados de loading e mensagens de feedback
- ✅ Interceptors HTTP para autenticação e tratamento de erros
- ✅ Interface moderna e responsiva

## 🔌 Endpoints da API

### Autenticação
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Fazer login
- `GET /api/user` - Obter informações do usuário autenticado

### Dispositivos
- `GET /api/devices` - Listar dispositivos (com paginação e filtros)
- `POST /api/devices` - Criar novo dispositivo
- `GET /api/devices/{id}` - Obter dispositivo específico
- `PUT /api/devices/{id}` - Atualizar dispositivo
- `DELETE /api/devices/{id}` - Excluir dispositivo (Soft Delete)
- `PATCH /api/devices/{id}/use` - Alternar status "em uso"

### Parâmetros de Filtro (GET /api/devices)
- `page` - Número da página (padrão: 1)
- `per_page` - Itens por página (padrão: 15)
- `in_use` - Filtrar por status (0 ou 1)
- `location` - Filtrar por localização (busca parcial)
- `purchase_date_from` - Data inicial (formato: YYYY-MM-DD)
- `purchase_date_to` - Data final (formato: YYYY-MM-DD)
- `sort_by` - Campo para ordenação (name, location, purchase_date, in_use, created_at)
- `sort_order` - Ordem (asc ou desc)

## 👥 Desenvolvido por

Larissa Feltrin - Projeto p/ Snapbot Gestão e Comunicação LTDA.

