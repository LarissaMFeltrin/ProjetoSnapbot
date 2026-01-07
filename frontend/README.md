# Frontend Angular - Snapbot

Frontend desenvolvido em Angular 17 com Angular Material para gerenciamento de dispositivos celulares.

## 📋 Requisitos

- Node.js 18 ou superior
- npm ou yarn

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
# ou
ng serve
```

A aplicação estará disponível em: `http://localhost:4200`

## 🏗️ Estrutura

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/          # Componente de login
│   │   │   └── register/       # Componente de registro
│   │   └── device/
│   │       ├── device-list/    # Listagem com filtros e paginação
│   │       └── device-form/    # Formulário de criação/edição
│   ├── guards/
│   │   └── auth.guard.ts      # Guarda de autenticação
│   ├── interceptors/
│   │   ├── auth.interceptor.ts # Interceptor para adicionar token
│   │   └── error.interceptor.ts # Interceptor para tratamento de erros
│   ├── services/
│   │   ├── auth.service.ts    # Serviço de autenticação
│   │   └── device.service.ts   # Serviço de dispositivos
│   └── app.module.ts          # Módulo principal
└── environments/
    └── environment.ts         # Configurações de ambiente
```

## 🔧 Configuração

### API URL

Configure a URL da API no arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## ✨ Funcionalidades

- ✅ Login e Registro de usuários
- ✅ CRUD completo de dispositivos
- ✅ Listagem com paginação
- ✅ Filtros combináveis:
  - Por localização
  - Por status (em uso/disponível)
  - Por faixa de datas
  - Ordenação por múltiplos campos
- ✅ Persistência de filtros no localStorage
- ✅ Estados de loading
- ✅ Mensagens de sucesso e erro
- ✅ Validação de formulários reativos
- ✅ Proteção de rotas com guards
- ✅ Interface moderna com Angular Material

## 🧪 Testes

```bash
npm test
# ou
ng test
```

## 📦 Build para Produção

```bash
npm run build
# ou
ng build --configuration production
```

Os arquivos serão gerados em `dist/snapbot-frontend/`

## 🔐 Credenciais de Teste

- **Email:** admin@snapbot.com
- **Senha:** password123

## 📝 Notas

- O frontend consome a API do backend Laravel
- Certifique-se de que o backend está rodando em `http://localhost:8000`
- Os tokens de autenticação são armazenados no localStorage
- Os filtros são salvos automaticamente no localStorage
