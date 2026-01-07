# 🚀 Guia de Entrega - Projeto Snapbot

## ✅ Parte 1: Subir Projeto no GitHub

O repositório Git foi configurado e o commit inicial foi criado. Agora você precisa fazer o push manualmente.

### Opções para fazer o Push:

#### **Opção 1: Usando Token de Acesso Pessoal (Recomendado)**

1. **Gerar um token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token (classic)"
   - Dê um nome: "Snapbot Project"
   - Selecione as permissões: `repo` (tudo)
   - Clique em "Generate token"
   - **Copie o token** (você só verá uma vez!)

2. **Fazer o push usando o token:**
   ```bash
   cd /opt/Lari/snapbot
   git push -u origin main
   ```
   
   Quando pedir:
   - **Username:** Seu usuário do GitHub (LarissaMFeltrin)
   - **Password:** Cole o token gerado (não a senha!)

#### **Opção 2: Usando SSH**

1. **Gerar chave SSH (se ainda não tiver):**
   ```bash
   ssh-keygen -t ed25519 -C "dev@snapbot.com.br"
   # Pressione Enter para aceitar o local padrão
   # Digite uma senha (ou deixe vazio)
   ```

2. **Adicionar chave SSH ao GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copie o conteúdo e adicione em: https://github.com/settings/keys
   ```

3. **Alterar o remote para SSH:**
   ```bash
   cd /opt/Lari/snapbot
   git remote set-url origin git@github.com:LarissaMFeltrin/ProjetoSnapbot.git
   git push -u origin main
   ```

#### **Opção 3: GitHub CLI (gh)**

Se você tem o GitHub CLI instalado:
```bash
cd /opt/Lari/snapbot
gh auth login
git push -u origin main
```

---

## 🌐 Parte 2: Deploy Online da Aplicação

Você precisa deixar a aplicação funcional online. Aqui estão as opções:

### **Opção A: Deploy Separado (Backend + Frontend)**

#### **Backend (Laravel) - Opções:**

1. **Heroku** (Gratuito com limitações)
   - Documentação: https://devcenter.heroku.com/articles/getting-started-with-php
   - Configure PostgreSQL ou MySQL (addon)

2. **Railway** (Gratuito com créditos)
   - https://railway.app
   - Suporta PHP/Laravel nativamente
   - Conecta ao repositório GitHub

3. **Render** (Gratuito com limitações)
   - https://render.com
   - Suporta PHP/Laravel
   - Conecta ao repositório GitHub

4. **DigitalOcean App Platform**
   - https://www.digitalocean.com/products/app-platform

#### **Frontend (Angular) - Opções:**

1. **Vercel** (Recomendado - Gratuito)
   - https://vercel.com
   - Conecta direto ao GitHub
   - Deploy automático
   - Passos:
     - Faça login no Vercel
     - "Add New Project"
     - Selecione o repositório `ProjetoSnapbot`
     - Configure:
       - **Root Directory:** `frontend`
       - **Build Command:** `npm install && npm run build`
       - **Output Directory:** `dist/snapbot-frontend`
       - **Environment Variables:** (se necessário)
     - Deploy!

2. **Netlify** (Gratuito)
   - https://netlify.com
   - Similar ao Vercel

3. **GitHub Pages** (Gratuito)
   - Requer configuração adicional no Angular
   - Usa `angular-cli-ghpages`

### **Opção B: Deploy Completo em Servidor (VPS)**

Se você tem acesso a um servidor VPS (DigitalOcean, AWS EC2, etc.):

1. **Instalar dependências:**
   ```bash
   # PHP 8.2, Composer, MySQL, Node.js, Nginx
   ```

2. **Clonar repositório:**
   ```bash
   git clone https://github.com/LarissaMFeltrin/ProjetoSnapbot.git
   cd ProjetoSnapbot
   ```

3. **Configurar Backend:**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   # Editar .env com credenciais do banco
   php artisan key:generate
   php artisan migrate --seed
   ```

4. **Configurar Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run build
   # Configurar Nginx para servir dist/snapbot-frontend
   ```

5. **Configurar Nginx/PHP-FPM**

---

## 📝 Configurações Importantes para Deploy

### **Backend (.env para produção):**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-backend.com

DB_CONNECTION=mysql
DB_HOST=seu-host
DB_PORT=3306
DB_DATABASE=snapbot
DB_USERNAME=usuario
DB_PASSWORD=senha

SANCTUM_STATEFUL_DOMAINS=seu-frontend.com
SESSION_DOMAIN=.seu-frontend.com
```

### **Frontend (environment.prod.ts):**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-backend.com/api'
};
```

### **CORS no Laravel (config/cors.php):**

Certifique-se de que está configurado para aceitar requisições do frontend:

```php
'allowed_origins' => ['https://seu-frontend.com'],
'supports_credentials' => true,
```

---

## 📧 Compartilhar Acesso ao Repositório

1. Acesse: https://github.com/LarissaMFeltrin/ProjetoSnapbot/settings/access
2. Clique em "Invite a collaborator"
3. Adicione: `dev@snapbot.com.br`
4. Selecione permissão: "Write" ou "Admin"
5. Envie o convite

---

## ✅ Checklist Final de Entrega

- [x] Repositório Git configurado
- [x] Commit inicial feito (f94219b)
- [ ] **Push para GitHub** (você precisa fazer manualmente)
- [ ] **Deploy online funcionando** (backend + frontend)
- [ ] **Credenciais de teste compartilhadas** no README
- [ ] **Acesso ao repositório compartilhado** com dev@snapbot.com.br

---

## 🔐 Credenciais de Teste para Documentar

Adicione no README.md principal:

```markdown
## 🔐 Credenciais de Teste

### Usuário Padrão (criado pelo seeder):
- **Email:** admin@snapbot.com
- **Senha:** password123
```

---

## 📚 Links Úteis

- **Repositório:** https://github.com/LarissaMFeltrin/ProjetoSnapbot
- **Documentação Laravel Deploy:** https://laravel.com/docs/deployment
- **Documentação Angular Deploy:** https://angular.io/guide/deployment

---

## 🆘 Troubleshooting

### Erro ao fazer push:
- Verifique se o token SSH/token está correto
- Certifique-se de ter permissão de escrita no repositório

### Erro no deploy:
- Verifique logs do servidor
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique CORS no backend

### Frontend não conecta ao backend:
- Verifique a URL da API no `environment.prod.ts`
- Verifique CORS no backend
- Confirme que o backend está acessível publicamente

---

**Boa sorte com a entrega! 🚀**

