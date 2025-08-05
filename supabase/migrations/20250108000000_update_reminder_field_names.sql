-- Update reminder field names to be consistent with date naming convention
UPDATE public.launch_settings 
SET setting_key = 'reminder_date_1' 
WHERE setting_key = 'reminder_day_1';

UPDATE public.launch_settings 
SET setting_key = 'reminder_date_2' 
WHERE setting_key = 'reminder_day_2'; 