# Configuração da Evolution API

## Variáveis de Ambiente

Para que o componente WhatsApp funcione corretamente, você precisa configurar as seguintes variáveis de ambiente:

### 1. Crie um arquivo `.env` na raiz do projeto:

```env
# Evolution API Configuration
VITE_EVOLUTION_API_URL=https://api.evolution.com.br
VITE_EVOLUTION_API_KEY=FFFFDCD5ACCAB4FDBB997191E2C7D

# Supabase Configuration (já configurado)
VITE_SUPABASE_URL=https://kaiqqoiymtbwixjyship.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthaXFxb2l5bXRid2l4anlzaGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MjIyMjgsImV4cCI6MjA2OTk5ODIyOH0.Qb1zrQdAh7-lR0NNrbf2Mt1fpGkZlAlbAWa0PZVpJhY
```

### 2. Configurações da sua Evolution API:

Baseado nas suas variáveis de ambiente, a configuração está assim:

- **URL da API**: `https://$(PRIMARY_DOMAIN)`
- **API Key**: `FFFFDCD5ACCAB4FDBB997191E2C7D`
- **Nome da Instância**: `agent`
- **Webhooks habilitados**: `connection.update` e `qrcode.update`

## Funcionalidades Implementadas

### ✅ Status da Conexão
- Exibe o status atual da instância (conectado, desconectado, QR Code disponível)
- Atualização automática a cada 5 segundos
- Indicadores visuais com cores e ícones

### ✅ Geração de QR Code
- Botão para gerar QR Code quando necessário
- Popup com QR Code em tamanho adequado
- Instruções claras para o usuário

### ✅ Gerenciamento de Instância
- **Criar**: Cria nova instância se não existir
- **Conectar**: Inicia o processo de conexão
- **Desconectar**: Desconecta a instância atual
- **Deletar**: Remove a instância completamente

### ✅ Interface Intuitiva
- Design responsivo e moderno
- Estados de loading para todas as ações
- Feedback visual com toasts
- Confirmações para ações destrutivas

## Como Usar

1. **Configure as variáveis de ambiente** no arquivo `.env`
2. **Reinicie a aplicação** para carregar as configurações
3. **Acesse a seção WhatsApp** na aplicação
4. **Siga os passos**:
   - Se não há instância: Clique em "Criar Instância"
   - Para conectar: Clique em "Conectar" e escaneie o QR Code
   - Para desconectar: Clique em "Desconectar"
   - Para deletar: Clique em "Deletar Instância"

## Endpoints Utilizados

- `GET /instance/fetchInstances` - Buscar status das instâncias
- `POST /instance/create` - Criar nova instância
- `GET /instance/connect/{instanceName}` - Conectar instância
- `DELETE /instance/logout/{instanceName}` - Desconectar instância
- `DELETE /instance/delete/{instanceName}` - Deletar instância

## Tratamento de Erros

- Conexão com API indisponível
- Instância não encontrada
- Falha na criação/conexão/desconexão
- Datas duplicadas
- Timeout de operações

## Segurança

- API Key configurada via variáveis de ambiente
- Validação de respostas da API
- Confirmações para ações destrutivas
- Tratamento seguro de erros 