import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  QrCode, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Trash2, 
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface InstanceStatus {
  instance: {
    instanceName: string;
    status: 'open' | 'connecting' | 'close' | 'qrcode';
    qrcode?: string;
    phone?: string;
    webhook?: string;
    webhookByEvents?: boolean;
    events?: string[];
    apikey?: string;
    number?: string;
    token?: string;
    integration?: string;
  };
  connection?: {
    state: string;
    status: string;
  };
}

interface InstanceInfo {
  instanceName: string;
  status: string;
  qrcode?: string;
  phone?: string;
  number?: string;
}

export const WhatsAppInstance = () => {
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const INSTANCE_NAME = 'agent';
  const API_BASE_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://api.evolution.com.br';
  const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || 'FFFFDCD5ACCAB4FDBB997191E2C7D';

  useEffect(() => {
    fetchInstanceStatus();
    // Polling para atualizar status a cada 5 segundos
    const interval = setInterval(fetchInstanceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchInstanceStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar status da instância');
      }

      const data = await response.json();
      const instance = data.find((inst: any) => inst.instance.instanceName === INSTANCE_NAME);
      
      if (instance) {
        setInstanceStatus(instance);
      } else {
        // Se a instância não existe, apenas mostrar como não encontrada
        setInstanceStatus(null);
      }
    } catch (error) {
      console.error('Error fetching instance status:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar com a Evolution API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const connectInstance = async () => {
    setActionLoading('connect');
    try {
      const response = await fetch(`${API_BASE_URL}/instance/connect/${INSTANCE_NAME}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar instância');
      }

      toast({
        title: "Conectando...",
        description: "A instância está sendo conectada. Aguarde o QR Code.",
      });

      // Aguarda um pouco e busca o status novamente para pegar o QR Code
      setTimeout(() => {
        fetchInstanceStatus();
      }, 2000);
    } catch (error) {
      console.error('Error connecting instance:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const disconnectInstance = async () => {
    setActionLoading('disconnect');
    try {
      const response = await fetch(`${API_BASE_URL}/instance/logout/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao desconectar instância');
      }

      toast({
        title: "Desconectado!",
        description: "A instância foi desconectada. Clique em 'Conectar' para gerar um novo QR Code.",
      });

      // Aguarda um pouco e busca o status novamente
      setTimeout(() => {
        fetchInstanceStatus();
      }, 1000);
    } catch (error) {
      console.error('Error disconnecting instance:', error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteInstance = async () => {
    setActionLoading('delete');
    try {
      const response = await fetch(`${API_BASE_URL}/instance/delete/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao deletar instância');
      }

      toast({
        title: "Instância deletada!",
        description: "A instância foi removida com sucesso.",
      });

      setInstanceStatus(null);
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusInfo = () => {
    if (!instanceStatus) {
      return {
        status: 'not_found',
        label: 'Não Encontrada',
        color: 'destructive',
        icon: WifiOff,
        description: 'Instância "agent" não encontrada na Evolution API'
      };
    }

    const status = instanceStatus.instance.status;
    
    switch (status) {
      case 'open':
        return {
          status: 'connected',
          label: 'Conectado',
          color: 'default',
          icon: CheckCircle,
          description: `WhatsApp conectado${instanceStatus.instance.phone ? ` - ${instanceStatus.instance.phone}` : ''}`
        };
      case 'connecting':
        return {
          status: 'connecting',
          label: 'Conectando...',
          color: 'secondary',
          icon: Loader2,
          description: 'Aguardando conexão'
        };
      case 'qrcode':
        return {
          status: 'qrcode',
          label: 'QR Code Disponível',
          color: 'default',
          icon: QrCode,
          description: 'Escaneie o QR Code para conectar'
        };
      case 'close':
      default:
        return {
          status: 'disconnected',
          label: 'Desconectado',
          color: 'destructive',
          icon: WifiOff,
          description: 'Instância desconectada - Clique em "Conectar" para gerar QR Code'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Status do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Status do WhatsApp
        </CardTitle>
        <CardDescription>
          Monitore e gerencie a conexão da instância "agent" do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Instância */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-background">
              <StatusIcon className={`h-5 w-5 ${
                statusInfo.status === 'connected' ? 'text-green-600' :
                statusInfo.status === 'connecting' ? 'text-yellow-600' :
                statusInfo.status === 'qrcode' ? 'text-blue-600' :
                statusInfo.status === 'not_found' ? 'text-red-600' :
                'text-red-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Instância: {INSTANCE_NAME}</h3>
                <Badge variant={statusInfo.color as any}>
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInstanceStatus}
            disabled={actionLoading !== null}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* QR Code */}
        {instanceStatus?.instance.qrcode && (
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code para Conexão
              </h4>
              <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Ver QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>QR Code do WhatsApp</DialogTitle>
                    <DialogDescription>
                      Escaneie este QR Code com seu WhatsApp para conectar a instância
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <img 
                      src={instanceStatus.instance.qrcode} 
                      alt="QR Code WhatsApp"
                      className="max-w-48 h-auto"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setQrDialogOpen(false)}>
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground">
              Abra o WhatsApp no seu celular e escaneie o QR Code para conectar
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          {instanceStatus && instanceStatus.instance.status === 'close' && (
            <Button 
              onClick={connectInstance}
              disabled={actionLoading !== null}
              className="flex-1"
            >
              {actionLoading === 'connect' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4 mr-2" />
              )}
              Conectar
            </Button>
          )}

          {instanceStatus && instanceStatus.instance.status === 'open' && (
            <Button 
              variant="outline"
              onClick={disconnectInstance}
              disabled={actionLoading !== null}
              className="flex-1"
            >
              {actionLoading === 'disconnect' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <WifiOff className="h-4 w-4 mr-2" />
              )}
              Desconectar
            </Button>
          )}

          {instanceStatus && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  disabled={actionLoading !== null}
                  className="flex-1"
                >
                  {actionLoading === 'delete' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Deletar Instância
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja deletar a instância "{INSTANCE_NAME}"? 
                    Esta ação não pode ser desfeita e você perderá a conexão do WhatsApp.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteInstance}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {!instanceStatus && (
            <div className="w-full text-center py-4">
              <p className="text-sm text-muted-foreground">
                Instância "{INSTANCE_NAME}" não encontrada na Evolution API.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Certifique-se de que a instância existe e está configurada corretamente.
              </p>
            </div>
          )}
        </div>

        {/* Informações Adicionais */}
        {instanceStatus && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Status atual: {instanceStatus.instance.status}</p>
            {instanceStatus.instance.phone && (
              <p>• Telefone: {instanceStatus.instance.phone}</p>
            )}
            {instanceStatus.instance.number && (
              <p>• Número: {instanceStatus.instance.number}</p>
            )}
            <p>• Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 