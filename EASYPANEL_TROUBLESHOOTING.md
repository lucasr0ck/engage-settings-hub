# 🔧 Troubleshooting EasyPanel

## ❌ Erro: "No such image: easypanel/macielagent/front:latest"

### 🔍 Diagnóstico
Este erro indica que o EasyPanel não conseguiu fazer o build da imagem Docker. Isso pode acontecer por vários motivos:

### 🛠️ Soluções

#### 1. **Verificar Configuração do Projeto**

No EasyPanel, verifique se:

- ✅ **Repository URL**: `https://github.com/lucasr0ck/engage-settings-hub.git`
- ✅ **Branch**: `main`
- ✅ **Build Method**: `Dockerfile`
- ✅ **Dockerfile Path**: `Dockerfile` (ou deixe vazio para usar o padrão)

#### 2. **Usar Dockerfile Alternativo**

Se o problema persistir, tente usar o Dockerfile mais simples:

1. **Renomeie** o arquivo:
   ```bash
   mv Dockerfile Dockerfile.nginx
   mv Dockerfile.simple Dockerfile
   ```

2. **Atualize** a configuração no EasyPanel:
   - **Port**: `3000` (em vez de 80)
   - **Health Check**: `/` (em vez de `/health`)

#### 3. **Verificar Logs do Build**

No EasyPanel:
1. Vá para o projeto
2. Clique em **"Builds"**
3. Clique no build que falhou
4. Verifique os logs de erro

#### 4. **Configuração Manual**

Se o problema persistir, configure manualmente:

**Build Settings:**
- **Dockerfile**: `Dockerfile`
- **Context**: `.`
- **Build Args**: Deixe vazio

**Deploy Settings:**
- **Port**: `3000` (se usar Dockerfile.simple) ou `80` (se usar Dockerfile original)
- **Health Check**: `/` ou `/health`

### 🔄 Passos para Resolver

#### Opção 1: Usar Dockerfile Original (Recomendado)

1. **No EasyPanel:**
   - Repository: `https://github.com/lucasr0ck/engage-settings-hub.git`
   - Branch: `main`
   - Build Method: `Dockerfile`
   - Port: `80`

2. **Variáveis de Ambiente:**
   ```env
   VITE_EVOLUTION_API_URL=https://api.evolution.com.br
   VITE_EVOLUTION_API_KEY=FFFFDCD5ACCAB4FDBB997191E2C7D
   ```

#### Opção 2: Usar Dockerfile Simples

1. **Renomeie os arquivos:**
   ```bash
   git mv Dockerfile Dockerfile.nginx
   git mv Dockerfile.simple Dockerfile
   git add .
   git commit -m "Switch to simple Dockerfile"
   git push
   ```

2. **No EasyPanel:**
   - Repository: `https://github.com/lucasr0ck/engage-settings-hub.git`
   - Branch: `main`
   - Build Method: `Dockerfile`
   - Port: `3000`

### 🚨 Problemas Comuns

#### 1. **Build Falha por Dependências**
- **Sintoma**: Erro de módulos não encontrados
- **Solução**: Verificar se `package.json` está correto

#### 2. **Build Falha por Memória**
- **Sintoma**: Build para no meio
- **Solução**: Aumentar recursos no EasyPanel

#### 3. **Build Falha por Timeout**
- **Sintoma**: Build demora muito
- **Solução**: Usar Dockerfile.simple

### 📋 Checklist de Verificação

- [ ] Repositório está público
- [ ] Branch `main` existe
- [ ] Dockerfile está na raiz
- [ ] package.json está correto
- [ ] Variáveis de ambiente configuradas
- [ ] Porta configurada corretamente

### 🔍 Logs Importantes

**Verifique estes logs no EasyPanel:**

1. **Build Logs:**
   ```
   Step 1/10 : FROM node:18-alpine AS builder
   Step 2/10 : WORKDIR /app
   Step 3/10 : COPY package*.json ./
   Step 4/10 : RUN npm ci
   ```

2. **Deploy Logs:**
   ```
   Container starting...
   Health check passed
   Application running on port 80/3000
   ```

### 📞 Suporte

Se o problema persistir:

1. **Verifique os logs** completos no EasyPanel
2. **Teste localmente** com `docker build -t test .`
3. **Verifique** se o repositório está acessível
4. **Entre em contato** com o suporte do EasyPanel

### 🎯 Solução Rápida

Para resolver rapidamente:

1. **Use o Dockerfile.simple**
2. **Configure porta 3000**
3. **Configure health check como `/`**
4. **Reinicie o build**

Isso deve resolver o problema na maioria dos casos! 