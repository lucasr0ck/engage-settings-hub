# Configuração do Usuário - Engage Settings Hub

## Credenciais do Usuário

As seguintes credenciais foram configuradas para acesso à aplicação:

- **Email:** `agente@maciel.com`
- **Senha:** `Maciel321*`

## Como Criar o Usuário no Supabase

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** > **Users**
4. Clique em **"Add user"**
5. Preencha os dados:
   - **Email:** `agente@maciel.com`
   - **Password:** `Maciel321*`
   - **Email confirm:** ✅ (marcar para confirmar automaticamente)
6. Clique em **"Create user"**

### Opção 2: Via Script (Requer Service Role Key)

1. Obtenha sua **Service Role Key** no dashboard do Supabase:
   - Vá para **Settings** > **API**
   - Copie a **service_role** key (não a anon key)

2. Instale as dependências se necessário:
   ```bash
   npm install @supabase/supabase-js
   ```

3. Edite o arquivo `create-user.js` e substitua `YOUR_SERVICE_ROLE_KEY` pela sua chave real

4. Execute o script:
   ```bash
   node create-user.js
   ```

## Configuração da Aplicação

A aplicação já foi configurada para aceitar as novas credenciais. O email padrão no formulário de login foi alterado para `agente@maciel.com`.

## Testando o Login

1. Inicie a aplicação:
   ```bash
   npm run dev
   ```

2. Acesse a página de login
3. Use as credenciais:
   - Email: `agente@maciel.com`
   - Senha: `Maciel321*`

## Notas Importantes

- Esta é uma aplicação de uso interno com poucos usuários
- As credenciais estão hardcoded na aplicação como fallback
- Para produção, recomenda-se usar apenas autenticação via Supabase
- Mantenha as credenciais seguras e não as compartilhe publicamente 