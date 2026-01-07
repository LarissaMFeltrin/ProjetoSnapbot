# 📖 Guia Completo de Uso - Snapbot

Este guia contém todas as instruções necessárias para instalar, configurar e usar o projeto Snapbot.

---

## 📋 Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação Inicial](#instalação-inicial)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Iniciando o Backend](#iniciando-o-backend)
5. [Testando a API](#testando-a-api)
6. [Status do Frontend](#status-do-frontend)
7. [Troubleshooting](#troubleshooting)

---

## 📋 Requisitos do Sistema

### Obrigatórios
- **PHP 8.2 ou superior**
- **Composer** (gerenciador de dependências PHP)
- **MySQL 8.0 ou superior**
- **Git** (para clonar o repositório)

### Opcionais (para testar a API)
- **Postman** (recomendado para testar a API)
- **cURL** (alternativa para testar via terminal)

### Para o Frontend (quando implementado)
- **Node.js 18+**
- **npm ou yarn**

---

## 🚀 Instalação Inicial

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd snapbot
```

### Passo 2: Instalar Dependências do Backend

```bash
cd backend
composer install
```

### Passo 3: Configurar o Arquivo .env

```bash
cp .env.example .env
php artisan key:generate
```

Isso criará o arquivo `.env` com as configurações básicas.

---

## 🗄️ Configuração do Banco de Dados

### Opção 1: Criar Banco Manualmente (Recomendado)

1. **Acesse o MySQL:**
```bash
mysql -u root -p
```

2. **Crie o banco de dados:**
```sql
CREATE DATABASE snapbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

3. **Configure o arquivo `.env`:**

Abra o arquivo `backend/.env` e configure:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=snapbot
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql_aqui
```

**Substitua `sua_senha_mysql_aqui` pela sua senha do MySQL.**

### Opção 2: Usar Usuário Dedicado (Opcional)

Se preferir criar um usuário específico:

```sql
CREATE DATABASE snapbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'snapbot'@'localhost' IDENTIFIED BY 'snapbot123';
GRANT ALL PRIVILEGES ON snapbot.* TO 'snapbot'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

E no `.env`:
```env
DB_USERNAME=snapbot
DB_PASSWORD=snapbot123
```

### Passo 4: Executar Migrations e Seeders

```bash
cd backend
php artisan migrate --seed
```

Isso irá:
- ✅ Criar todas as tabelas necessárias
- ✅ Criar um usuário de teste: `admin@snapbot.com` / `password123`
- ✅ Criar 3 dispositivos de exemplo

---

## 🚀 Iniciando o Backend

### Iniciar o Servidor

```bash
cd backend
php artisan serve
```

Você verá uma mensagem como:
```
INFO  Server running on [http://127.0.0.1:8000]
```

**⚠️ IMPORTANTE:** Deixe esse terminal aberto! O servidor precisa ficar rodando.

### Verificar se Está Funcionando

Abra o navegador em: `http://localhost:8000`

Você verá a página de boas-vindas do Laravel. **Isso é normal!** A API está em `/api/...`

---

## 🧪 Testando a API

### Método 1: Usando Postman (Recomendado)

#### Passo 1: Importar a Collection

1. Abra o Postman
2. Clique em **"Import"** (canto superior esquerdo)
3. Selecione o arquivo: `docs/postman_collection.json`
4. Clique em **"Import"**

#### Passo 2: Configurar Variáveis

1. No Postman, clique em **"Environments"** (canto superior direito)
2. Clique no **"+"** para criar novo ambiente
3. Nome: `Snapbot Local`
4. Adicione as variáveis:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000` | `http://localhost:8000` |
| `token` | (deixe vazio) | (deixe vazio) |

5. Clique em **"Save"**
6. Selecione o ambiente `Snapbot Local` no dropdown

#### Passo 3: Fazer Login

1. Vá em: **"Snapbot API" > "Autenticação" > "Login"**
2. Verifique:
   - URL: `{{base_url}}/api/login`
   - Método: **POST**
   - Body (aba "Body" > raw > JSON):
   ```json
   {
     "email": "admin@snapbot.com",
     "password": "password123"
   }
   ```
3. Clique em **"Send"**

4. **Copie o token** da resposta:
   ```json
   {
     "token": "1|abc123...",
     "user": {...}
   }
   ```

5. Vá em **"Environments"** > **"Snapbot Local"**
6. Cole o token no campo **"Current Value"** da variável `token`
7. Clique em **"Save"**

#### Passo 4: Testar Endpoints

Agora você pode testar todos os endpoints:

**Listar Dispositivos:**
- Vá em: **"Dispositivos" > "Listar Dispositivos"**
- Clique em **"Send"**
- Você deve ver 3 dispositivos

**Criar Dispositivo:**
- Vá em: **"Dispositivos" > "Criar Dispositivo"**
- Body:
  ```json
  {
    "name": "iPhone 15",
    "location": "Escritório",
    "purchase_date": "2024-01-15"
  }
  ```
- Clique em **"Send"**

**Atualizar Dispositivo:**
- Vá em: **"Dispositivos" > "Atualizar Dispositivo"**
- Altere o ID na URL se necessário (ex: `/api/devices/1`)
- Body:
  ```json
  {
    "name": "iPhone 15 Pro",
    "location": "Filial São Paulo"
  }
  ```
- Clique em **"Send"**

**Marcar como "em uso":**
- Vá em: **"Dispositivos" > "Marcar como em uso"**
- Altere o ID na URL se necessário
- Clique em **"Send"**

**Excluir Dispositivo:**
- Vá em: **"Dispositivos" > "Excluir Dispositivo"**
- Altere o ID na URL se necessário
- Clique em **"Send"**

### Método 2: Usando cURL (Terminal)

#### Fazer Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@snapbot.com","password":"password123"}'
```

**Copie o token** da resposta.

#### Listar Dispositivos

```bash
curl -X GET http://localhost:8000/api/devices \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Accept: application/json"
```

**Substitua `SEU_TOKEN_AQUI` pelo token obtido no login.**

#### Criar Dispositivo

```bash
curl -X POST http://localhost:8000/api/devices \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "iPhone 15",
    "location": "Escritório",
    "purchase_date": "2024-01-15"
  }'
```

### Método 3: Console do Navegador (F12)

Abra o console do navegador (F12) e execute:

```javascript
// 1. Fazer login
fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@snapbot.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Token:', data.token);
  // 2. Listar dispositivos
  return fetch('http://localhost:8000/api/devices', {
    headers: {
      'Authorization': 'Bearer ' + data.token,
      'Accept': 'application/json'
    }
  });
})
.then(res => res.json())
.then(data => console.log('Dispositivos:', data));
```

---

## 📱 Status do Frontend

### ⚠️ Frontend Não Implementado

O frontend (Angular) **ainda não está implementado**. Apenas a estrutura básica foi criada:

- ✅ `package.json` configurado
- ✅ `.gitignore` configurado
- ❌ Componentes não implementados
- ❌ Serviços não implementados
- ❌ Rotas não configuradas

### Quando o Frontend Estiver Pronto

Para rodar o frontend (quando implementado):

```bash
cd frontend
npm install
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

**Por enquanto, use o Postman ou cURL para testar a API!**

---

## 🔌 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Registrar novo usuário |
| POST | `/api/login` | Fazer login |
| GET | `/api/user` | Obter informações do usuário autenticado |

### Dispositivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/devices` | Listar dispositivos (com paginação e filtros) |
| POST | `/api/devices` | Criar novo dispositivo |
| GET | `/api/devices/{id}` | Obter dispositivo específico |
| PUT | `/api/devices/{id}` | Atualizar dispositivo |
| DELETE | `/api/devices/{id}` | Excluir dispositivo (Soft Delete) |
| PATCH | `/api/devices/{id}/use` | Alternar status "em uso" |

### Parâmetros de Filtro (GET /api/devices)

- `page` - Número da página (padrão: 1)
- `per_page` - Itens por página (padrão: 15)
- `in_use` - Filtrar por status (0 ou 1)
- `location` - Filtrar por localização (busca parcial)
- `purchase_date_from` - Data inicial (formato: YYYY-MM-DD)
- `purchase_date_to` - Data final (formato: YYYY-MM-DD)
- `sort_by` - Campo para ordenação (name, location, purchase_date, in_use, created_at)
- `sort_order` - Ordem (asc ou desc)

### Exemplos de URLs com Filtros

```
# Filtrar por localização
http://localhost:8000/api/devices?location=São Paulo

# Filtrar por status "em uso"
http://localhost:8000/api/devices?in_use=1

# Filtrar por data
http://localhost:8000/api/devices?purchase_date_from=2023-01-01&purchase_date_to=2023-12-31

# Combinar filtros e ordenação
http://localhost:8000/api/devices?location=Escritório&in_use=1&sort_by=name&sort_order=asc
```

---

## 🔐 Credenciais de Teste

Após executar `php artisan migrate --seed`, você terá:

- **Email:** `admin@snapbot.com`
- **Senha:** `password123`

---

## 🧪 Executando Testes

### Testes do Backend

```bash
cd backend
php artisan test
```

Isso executará todos os testes PHPUnit, incluindo:
- Testes de autenticação
- Testes de CRUD de dispositivos
- Testes de validações
- Testes de filtros
- Testes de isolamento de dados

---

## ❌ Troubleshooting

### Erro: "Access denied for user"

**Causa:** Credenciais do banco de dados incorretas

**Solução:**
1. Verifique o arquivo `.env`
2. Confirme usuário e senha do MySQL
3. Teste a conexão:
   ```bash
   mysql -u root -p
   ```

### Erro: "Can't connect to MySQL server"

**Causa:** MySQL não está rodando

**Solução:**
```bash
# Linux
sudo systemctl start mysql
sudo systemctl status mysql

# macOS
brew services start mysql

# Windows
# Inicie o MySQL pelo painel de controle ou serviços
```

### Erro: "Unknown database 'snapbot'"

**Causa:** Banco de dados não foi criado

**Solução:**
```bash
mysql -u root -p
CREATE DATABASE snapbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Erro: "Unauthenticated" ou 401

**Causa:** Token inválido ou expirado

**Solução:**
1. Faça login novamente
2. Copie o novo token
3. Atualize no Postman (Environment > token)

### Erro: "Route not found" ou 404

**Causa:** URL incorreta ou servidor não está rodando

**Solução:**
1. Verifique se o servidor está rodando: `php artisan serve`
2. Verifique se a URL está correta: `http://localhost:8000/api/...`
3. Verifique se está usando `{{base_url}}` no Postman

### Erro: "Validation failed" ou 422

**Causa:** Dados inválidos no body

**Solução:**
1. Verifique se o JSON está correto
2. Campos obrigatórios:
   - `name` (obrigatório)
   - `location` (obrigatório)
   - `purchase_date` (obrigatório, não pode ser futura)

### Erro ao executar migrations

**Causa:** Banco de dados não existe ou sem permissões

**Solução:**
1. Crie o banco de dados manualmente
2. Verifique as permissões do usuário
3. Tente novamente: `php artisan migrate --seed`

### Página de boas-vindas do Laravel aparece

**Isso é normal!** A página em `http://localhost:8000/` é a rota web padrão.

A API está em:
- ✅ `http://localhost:8000/api/login`
- ✅ `http://localhost:8000/api/devices`
- ✅ etc.

---

## 📋 Checklist de Instalação

Use este checklist para garantir que tudo está configurado:

- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] MySQL instalado e rodando
- [ ] Repositório clonado
- [ ] Dependências do backend instaladas (`composer install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Chave da aplicação gerada (`php artisan key:generate`)
- [ ] Banco de dados `snapbot` criado
- [ ] Credenciais do banco configuradas no `.env`
- [ ] Migrations executadas (`php artisan migrate --seed`)
- [ ] Servidor iniciado (`php artisan serve`)
- [ ] Postman configurado (opcional)
- [ ] Login testado com sucesso
- [ ] Listagem de dispositivos funcionando

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a seção [Troubleshooting](#troubleshooting)
2. Verifique os logs do Laravel: `backend/storage/logs/laravel.log`
3. Execute os testes: `php artisan test`
4. Verifique se todas as dependências estão instaladas

---

## 📝 Notas Importantes

1. **Query Builder:** O projeto usa Query Builder em vez de Eloquent ORM (conforme requisitos)

2. **Soft Delete:** Dispositivos excluídos não são deletados permanentemente, apenas marcados com `deleted_at`

3. **Isolamento de Dados:** Cada usuário só vê e gerencia seus próprios dispositivos

4. **Validações:**
   - `name` e `location` são obrigatórios
   - `purchase_date` não pode ser uma data futura

5. **Filtros:** Podem ser combinados na listagem de dispositivos

6. **Paginação:** A listagem retorna 15 itens por página por padrão

---

## ✅ Próximos Passos

1. ✅ Backend está funcionando
2. ⚠️ Frontend precisa ser implementado
3. 📋 Teste a API usando Postman
4. 🧪 Execute os testes: `php artisan test`

---

**Desenvolvido por:** Snapbot Gestão e Comunicação LTDA.

