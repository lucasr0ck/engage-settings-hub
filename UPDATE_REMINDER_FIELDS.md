# Atualização dos Campos de Lembrete

## Problema Resolvido

Os campos de data dos lembretes (`reminder_day_1` e `reminder_day_2`) não estavam sendo reconhecidos como campos de data pelo componente, pois não continham `_date` no nome.

## Solução Implementada

1. **Atualização do Componente**: O componente `LaunchSettings.tsx` foi atualizado para detectar campos de data
2. **Renomeação dos Campos**: Os campos foram renomeados para `reminder_date_1` e `reminder_date_2`
3. **Migração do Banco**: Script SQL criado para atualizar os dados existentes

## Como Aplicar as Mudanças

### 1. Atualizar o Banco de Dados

Execute o script SQL no dashboard do Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Cole e execute o conteúdo do arquivo `update_reminder_fields.sql`:

```sql
-- Atualizar os nomes dos campos para usar _date no final
UPDATE public.launch_settings 
SET setting_key = 'reminder_date_1' 
WHERE setting_key = 'reminder_day_1';

UPDATE public.launch_settings 
SET setting_key = 'reminder_date_2' 
WHERE setting_key = 'reminder_day_2';

-- Verificar se a atualização foi bem-sucedida
SELECT * FROM public.launch_settings ORDER BY id;
```

### 2. Verificar a Aplicação

Após executar o script SQL:

1. Recarregue a aplicação no navegador
2. Vá para a seção de configurações
3. Verifique se os campos "Data do primeiro lembrete" e "Data do segundo lembrete" agora mostram seletores de data

## Resultado Esperado

- ✅ Todos os campos de data agora terão seletores de data consistentes
- ✅ Os campos de lembrete funcionarão igual ao campo "Data que o carrinho abre"
- ✅ Interface mais intuitiva e consistente

## Campos Afetados

- `reminder_day_1` → `reminder_date_1`
- `reminder_day_2` → `reminder_date_2` 