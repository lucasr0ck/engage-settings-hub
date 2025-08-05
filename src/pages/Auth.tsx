import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Lock } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('trader@tradeflow.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple static authentication check
    if (email === 'trader@tradeflow.com' && password === 'TradeFlow2024!') {
      setLoading(true);
      
      // Create a mock session by signing in with Supabase (you'll need to create this user in Supabase)
      const { error } = await signIn(email, password);
      
      if (!error) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao TradeFlow.",
        });
        navigate('/');
      } else {
        // Fallback for demo purposes - in production, ensure the user exists in Supabase
        toast({
          title: "Erro de autenticação",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
      }
      setLoading(false);
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">TradeFlow</CardTitle>
            <CardDescription className="text-muted-foreground">
              Painel Administrativo - WhatsApp Engagement
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@tradeflow.com"
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="bg-input"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              <Lock className="h-4 w-4 mr-2" />
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Credenciais padrão:<br />
              <span className="font-mono">trader@tradeflow.com</span><br />
              <span className="font-mono">TradeFlow2024!</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;