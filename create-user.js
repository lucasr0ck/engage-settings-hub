const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (usando as mesmas credenciais do projeto)
const SUPABASE_URL = "https://kaiqqoiymtbwixjyship.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; // Você precisará da service role key

// Credenciais do usuário
const USER_EMAIL = "agente@maciel.com";
const USER_PASSWORD = "Maciel321*";

async function createUser() {
  try {
    // Criar cliente Supabase com service role key para admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('Criando usuário...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: USER_EMAIL,
      password: USER_PASSWORD,
      email_confirm: true, // Confirma o email automaticamente
      user_metadata: {
        name: 'Agente Maciel',
        role: 'admin'
      }
    });
    
    if (error) {
      console.error('Erro ao criar usuário:', error);
      return;
    }
    
    console.log('Usuário criado com sucesso!');
    console.log('ID do usuário:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Credenciais de login:');
    console.log('Email:', USER_EMAIL);
    console.log('Senha:', USER_PASSWORD);
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

createUser(); 