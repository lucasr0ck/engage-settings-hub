import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    integrationToken?: string;
    integrationKey?: string;
    integrationUrl?: string;
    integrationUrlByEvents?: boolean;
    integrationEvents?: string[];
    integrationTokenByEvents?: boolean;
    integrationTokenEvents?: string[];
    integrationTokenWebhook?: string;
    integrationTokenWebhookByEvents?: boolean;
    integrationTokenWebhookEvents?: string[];
    integrationTokenWebhookMethod?: string;
    integrationTokenWebhookHeaders?: string;
    integrationTokenWebhookBody?: string;
    integrationTokenWebhookRetries?: number;
    integrationTokenWebhookRetryDelay?: number;
    integrationTokenWebhookRetryMax?: number;
    integrationTokenWebhookRetryStatus?: string;
    integrationTokenWebhookRetryStatusCodes?: string;
    integrationTokenWebhookRetryStatusCodesArray?: string[];
    integrationTokenWebhookRetryStatusCodesString?: string;
    integrationTokenWebhookRetryStatusCodesStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArray?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayString?: string[];
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringString?: string;
    integrationTokenWebhookRetryStatusCodesStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringArrayStringAgent?: string;
  };
}

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://api.evolution.com.br';
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || 'FFFFDCD5ACCAB4FDBB997191E2C7D';
const INSTANCE_NAME = 'agent';

export const WhatsAppInstance = () => {
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchInstanceStatus();
    // Polling para atualizar status a cada 5 segundos
    const interval = setInterval(fetchInstanceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchInstanceStatus = async () => {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao buscar status da instância');

      const data = await response.json();
      const agentInstance = data.find((instance: any) => instance.instance.instanceName === INSTANCE_NAME);
      
      if (agentInstance) {
        setInstanceStatus(agentInstance);
      }
    } catch (error) {
      console.error('Erro ao buscar status da instância:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInstance = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          token: API_KEY,
          qrcode: true,
          number: '',
          webhook: '',
          webhookByEvents: false,
          events: []
        })
      });

      if (!response.ok) throw new Error('Falha ao criar instância');

      toast({
        title: "Instância criada!",
        description: "A instância do WhatsApp foi criada com sucesso.",
      });

      fetchInstanceStatus();
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro ao criar instância",
        description: "Não foi possível criar a instância do WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const connectInstance = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${INSTANCE_NAME}`, {
        method: 'GET',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao conectar instância');

      toast({
        title: "Conectando...",
        description: "A instância está sendo conectada. Aguarde o QR Code aparecer.",
      });

      fetchInstanceStatus();
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const disconnectInstance = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/logout/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao desconectar instância');

      toast({
        title: "Desconectado!",
        description: "A instância foi desconectada com sucesso.",
      });

      fetchInstanceStatus();
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const deleteInstance = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/delete/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao deletar instância');

      toast({
        title: "Instância deletada!",
        description: "A instância foi removida com sucesso.",
      });

      setInstanceStatus(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a instância.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!instanceStatus) return { status: 'not_found', label: 'Não encontrada', color: 'secondary', icon: XCircle };
    
    const status = instanceStatus.instance.status;
    switch (status) {
      case 'open':
        return { status, label: 'Conectado', color: 'default', icon: CheckCircle };
      case 'connecting':
        return { status, label: 'Conectando...', color: 'secondary', icon: Loader2 };
      case 'qrcode':
        return { status, label: 'QR Code Disponível', color: 'outline', icon: QrCode };
      case 'close':
        return { status, label: 'Desconectado', color: 'destructive', icon: XCircle };
      default:
        return { status, label: 'Desconhecido', color: 'secondary', icon: AlertCircle };
    }
  };

  const statusInfo = getStatusInfo();

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
          <div className="text-center py-8">Carregando status...</div>
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
          Gerencie a conexão da instância do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!instanceStatus ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground mb-4">
                  Nenhuma instância encontrada. Crie uma nova instância para começar.
                </p>
                <Button onClick={createInstance} disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  Criar Instância
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Status Card */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <statusInfo.icon className={`h-5 w-5 ${
                    statusInfo.status === 'open' ? 'text-green-500' :
                    statusInfo.status === 'connecting' ? 'text-yellow-500' :
                    statusInfo.status === 'qrcode' ? 'text-blue-500' :
                    'text-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">Instância: {INSTANCE_NAME}</p>
                    <p className="text-sm text-muted-foreground">
                      {instanceStatus.instance.phone ? `Telefone: ${instanceStatus.instance.phone}` : 'Telefone não conectado'}
                    </p>
                  </div>
                </div>
                <Badge variant={statusInfo.color as any}>
                  {statusInfo.label}
                </Badge>
              </div>

              {/* QR Code Display */}
              {instanceStatus.instance.status === 'qrcode' && instanceStatus.instance.qrcode && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="h-4 w-4" />
                    <span className="font-medium">QR Code para Conexão</span>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src={instanceStatus.instance.qrcode} 
                      alt="QR Code WhatsApp" 
                      className="max-w-48 h-auto border rounded"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Escaneie este QR Code com seu WhatsApp para conectar
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {instanceStatus.instance.status === 'close' && (
                  <Button onClick={connectInstance} disabled={actionLoading}>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wifi className="h-4 w-4 mr-2" />
                    )}
                    Conectar
                  </Button>
                )}

                {instanceStatus.instance.status === 'open' && (
                  <Button variant="outline" onClick={disconnectInstance} disabled={actionLoading}>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <WifiOff className="h-4 w-4 mr-2" />
                    )}
                    Desconectar
                  </Button>
                )}

                <Button variant="outline" onClick={fetchInstanceStatus} disabled={actionLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar Instância
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja deletar a instância "{INSTANCE_NAME}"? 
                        Esta ação não pode ser desfeita e você precisará criar uma nova instância.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={deleteInstance}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Deletar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 