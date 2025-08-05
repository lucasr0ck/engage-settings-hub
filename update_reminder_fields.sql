-- Script para atualizar os nomes dos campos de lembrete
-- Execute este script no SQL Editor do Supabase Dashboard

-- Atualizar os nomes dos campos para usar _date no final
UPDATE public.launch_settings 
SET setting_key = 'reminder_date_1' 
WHERE setting_key = 'reminder_day_1';

UPDATE public.launch_settings 
SET setting_key = 'reminder_date_2' 
WHERE setting_key = 'reminder_day_2';

-- Verificar se a atualização foi bem-sucedida
SELECT * FROM public.launch_settings ORDER BY id; 