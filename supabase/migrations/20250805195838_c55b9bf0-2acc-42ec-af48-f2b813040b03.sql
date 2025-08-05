-- Create LaunchSettings table for configuration management
CREATE TABLE public.launch_settings (
  id bigserial PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  description text NOT NULL,
  is_editable boolean NOT NULL DEFAULT true
);

-- Create DailyCallLinks table for managing meeting links
CREATE TABLE public.daily_call_links (
  id bigserial PRIMARY KEY,
  call_date date UNIQUE NOT NULL,
  meet_link text NOT NULL
);

-- Enable Row Level Security (since this is an internal admin tool, we'll allow all operations for authenticated users)
ALTER TABLE public.launch_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_call_links ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for authenticated users
CREATE POLICY "Allow all operations on launch_settings for authenticated users" 
ON public.launch_settings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on daily_call_links for authenticated users" 
ON public.daily_call_links 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Insert initial launch settings data
INSERT INTO public.launch_settings (setting_key, setting_value, description, is_editable) VALUES
('launch_date', '2024-01-15', 'Data que o carrinho abre (Formato AAAA-MM-DD)', true),
('launch_time', '09:00:00', 'Horário que o carrinho abre (Formato HH:MM:SS)', true),
('reminder_date_1', '2024-01-10', 'Data do primeiro lembrete (Formato AAAA-MM-DD)', true),
('reminder_date_2', '2024-01-12', 'Data do segundo lembrete (Formato AAAA-MM-DD)', true),
('closing_script_time', '18:00:00', 'Horário do script de fechamento (Formato HH:MM:SS)', true),
('is_active', 'true', 'Sistema ativo/inativo', true);

-- Insert sample daily call links
INSERT INTO public.daily_call_links (call_date, meet_link) VALUES
('2024-01-15', 'https://meet.google.com/abc-defg-hij'),
('2024-01-16', 'https://meet.google.com/xyz-uvwx-rst');