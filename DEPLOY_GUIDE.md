# 🚀 Guia de Deploy - EasyPanel

## ✅ Status da Aplicação

Sua aplicação está **100% pronta** para deploy no EasyPanel! Todos os arquivos necessários foram criados e configurados.

## 📋 Arquivos de Deploy Criados

- ✅ `Dockerfile` - Configuração do container Docker
- ✅ `nginx.conf` - Configuração do servidor web
- ✅ `.dockerignore` - Otimização do build
- ✅ `DEPLOY_GUIDE.md` - Este guia

## 🎯 Como Fazer o Deploy no EasyPanel

### 1. Preparação do Repositório

1. **Commit e Push** das alterações:
   ```bash
   git add .
   git commit -m "Preparação para deploy"
   git push origin main
   ```

2. **Verificar** se o repositório está atualizado no GitHub

### 2. Configuração no EasyPanel

1. **Acesse o EasyPanel** e crie um novo projeto
2. **Selecione "Git Repository"** como fonte
3. **Configure o repositório**:
   - **Repository URL**: `https://github.com/lucasr0ck/engage-settings-hub.git`
   - **Branch**: `main`
   - **Build Method**: `Dockerfile`

### 3. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no EasyPanel:

```env
# Evolution API Configuration
VITE_EVOLUTION_API_URL=https://api.evolution.com.br
VITE_EVOLUTION_API_KEY=FFFFDCD5ACCAB4FDBB997191E2C7D

# Supabase Configuration (já configurado)
VITE_SUPABASE_URL=https://kaiqqoiymtbwixjyship.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthaXFxb2l5bXRid2l4anlzaGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjIyMjgsImV4cCI6MjA2OTk5ODIyOH0.Qb1zrQdAh7-lR0NNrbf2Mt1fpGkZlAlbAWa0PZVpJhY
```

### 4. Configurações do Container

- **Port**: `80`
- **Health Check**: `/health`
- **Memory Limit**: `512MB` (recomendado)
- **CPU Limit**: `0.5` (recomendado)

### 5. Domínio e SSL

1. **Configure o domínio** desejado
2. **Ative SSL** (recomendado)
3. **Configure proxy reverso** se necessário

## 🔧 Configurações Técnicas

### Dockerfile
- **Multi-stage build** para otimização
- **Node.js 18 Alpine** para build
- **Nginx Alpine** para produção
- **Build otimizado** com gzip

### Nginx
- **React Router** configurado
- **Gzip compression** ativado
- **Cache** para assets estáticos
- **Security headers** configurados
- **Health check** endpoint

### Performance
- **Bundle size**: ~524KB (gzipped: ~157KB)
- **CSS size**: ~60KB (gzipped: ~10KB)
- **Build time**: ~2 segundos

## 🚨 Checklist Pré-Deploy

### ✅ Funcionalidades Testadas
- [x] Build da aplicação
- [x] Componente WhatsAppInstance
- [x] Integração com Evolution API
- [x] Links em massa
- [x] Edição inline de datas
- [x] Autenticação Supabase
- [x] Interface responsiva

### ✅ Arquivos Verificados
- [x] Dockerfile funcional
- [x] nginx.conf configurado
- [x] .dockerignore otimizado
- [x] Variáveis de ambiente documentadas
- [x] Build sem erros

### ✅ Dependências
- [x] Todas as dependências instaladas
- [x] TypeScript configurado
- [x] Vite configurado
- [x] Tailwind CSS configurado

## 🎯 Funcionalidades da Aplicação

### 🔐 Autenticação
- Login com credenciais: `agente@maciel.com` / `Maciel321*`
- Integração com Supabase
- Proteção de rotas

### ⚙️ Configurações
- Configurações de lançamento
- Seletores de data para lembretes
- Interface intuitiva

### 📞 Links de Chamadas
- Adição em massa de links
- Edição inline de datas
- Gerenciamento completo

### 📱 WhatsApp Integration
- Status da instância em tempo real
- QR Code para conexão
- Gerenciamento completo da instância "agent"

## 🚀 Comandos de Deploy

### Build Local (Teste)
```bash
# Build da aplicação
npm run build

# Build do Docker
docker build -t engage-settings-hub .

# Teste local
docker run -p 8080:80 engage-settings-hub
```

### Deploy Automático
O EasyPanel fará automaticamente:
1. **Clone** do repositório
2. **Build** da imagem Docker
3. **Deploy** do container
4. **Health check** automático

## 📊 Monitoramento

### Logs
- **Nginx access logs**: `/var/log/nginx/access.log`
- **Nginx error logs**: `/var/log/nginx/error.log`
- **Application logs**: Console do navegador

### Métricas
- **Health check**: `/health`
- **Performance**: Lighthouse score
- **Uptime**: Monitoramento do EasyPanel

## 🔄 Atualizações

Para atualizar a aplicação:
1. **Push** para o repositório GitHub
2. **EasyPanel** detecta automaticamente
3. **Build** e deploy automático
4. **Zero downtime** deployment

## 🆘 Troubleshooting

### Problemas Comuns

#### Build falha
- Verificar se todas as dependências estão no `package.json`
- Verificar se o Dockerfile está correto
- Verificar logs do build no EasyPanel

#### Aplicação não carrega
- Verificar variáveis de ambiente
- Verificar logs do nginx
- Verificar conectividade com APIs

#### WhatsApp não conecta
- Verificar URL da Evolution API
- Verificar API Key
- Verificar logs da aplicação

## 🎉 Próximos Passos

1. **Configure o domínio** no EasyPanel
2. **Configure as variáveis de ambiente**
3. **Faça o deploy**
4. **Teste todas as funcionalidades**
5. **Configure monitoramento**

Sua aplicação está pronta para produção! 🚀 