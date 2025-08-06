import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, CheckCircle, WifiOff, Wifi, Loader2, QrCode, RefreshCw, Smartphone, User, MessageSquare, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface InstanceStatus {
  id: string;
  name: string;
  connectionStatus: 'open' | 'connecting' | 'close' | 'qrcode';
  ownerJid?: string;
  profileName?: string;
  profilePicUrl?: string;
  integration?: string;
  number?: string;
  token?: string;
  clientName?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    Message: number;
    Contact: number;
    Chat: number;
  };
}

export const WhatsAppInstance = () => {
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const INSTANCE_NAME = 'agente';
  const API_BASE_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evolution.g116lp.easypanel.host';
  const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || 'FFFFDCD5ACCAB4FDBB997191E2C7D';

  useEffect(() => {
    fetchInstanceStatus();
    // Polling para atualizar status a cada 5 segundos
    const interval = setInterval(fetchInstanceStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Buscar QR Code quando o status for 'qrcode'
  useEffect(() => {
    if (instanceStatus?.connectionStatus === 'qrcode') {
      fetchQRCode();
    }
  }, [instanceStatus?.connectionStatus]);

  const fetchInstanceStatus = async () => {
    try {
      console.log('🔍 Buscando instâncias...');
      console.log('📡 URL:', `${API_BASE_URL}/instance/fetchInstances`);
      console.log('🔑 API Key:', API_KEY);
      
      const response = await fetch(`${API_BASE_URL}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(`Falha ao buscar status da instância: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Dados recebidos:', data);
      
      const instance = data.find((inst: any) => inst.name === INSTANCE_NAME);
      console.log('🎯 Instância encontrada:', instance);
      
      if (instance) {
        setInstanceStatus(instance);
        console.log('✅ Instância definida:', instance);
      } else {
        // Se a instância não existe, apenas mostrar como não encontrada
        setInstanceStatus(null);
        console.log('❌ Instância não encontrada');
      }
    } catch (error) {
      console.error('💥 Error fetching instance status:', error);
      toast({
        title: "Erro ao conectar",
        description: `Não foi possível conectar com a Evolution API: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCode = async () => {
    try {
      console.log('🔍 Buscando QR Code...');
      
      const response = await fetch(`${API_BASE_URL}/instance/connect/${INSTANCE_NAME}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar QR Code');
      }

      const data = await response.json();
      console.log('📦 QR Code recebido:', data);
      
      if (data.base64) {
        // Remove o prefixo "data:image/png;base64," se existir
        const base64Data = data.base64.replace('data:image/png;base64,', '');
        setQrCodeData(base64Data);
        console.log('✅ QR Code definido');
      }
    } catch (error) {
      console.error('💥 Error fetching QR Code:', error);
      toast({
        title: "Erro ao buscar QR Code",
        description: "Não foi possível obter o QR Code.",
        variant: "destructive",
      });
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

  const generateQRCode = async () => {
    setActionLoading('qrcode');
    try {
      toast({
        title: "Gerando QR Code...",
        description: "Aguarde enquanto o QR Code é gerado.",
      });

      // Busca o QR Code diretamente
      await fetchQRCode();
      
      // Abre automaticamente o popup do QR Code
      setQrCodeDialogOpen(true);
      toast({
        title: "QR Code gerado!",
        description: "QR Code disponível para escaneamento.",
      });
    } catch (error) {
      console.error('Error generating QR Code:', error);
      toast({
        title: "Erro ao gerar QR Code",
        description: "Não foi possível gerar o QR Code.",
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
        title: "Desconectando...",
        description: "A instância está sendo desconectada.",
      });

      fetchInstanceStatus();
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

  const getStatusInfo = () => {
    if (!instanceStatus) {
      return {
        status: 'not_found',
        label: 'Não Encontrada',
        color: 'destructive',
        icon: WifiOff,
        description: 'Instância "agente" não encontrada na Evolution API',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
      };
    }

    const status = instanceStatus.connectionStatus;
    
    switch (status) {
      case 'open':
        return {
          status: 'connected',
          label: 'Conectado',
          color: 'default',
          icon: CheckCircle,
          description: `WhatsApp conectado${instanceStatus.profileName ? ` - ${instanceStatus.profileName}` : ''}`,
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'connecting':
        return {
          status: 'connecting',
          label: 'Conectando...',
          color: 'secondary',
          icon: Loader2,
          description: 'Aguardando conexão',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        };
      case 'qrcode':
        return {
          status: 'qrcode',
          label: 'QR Code Disponível',
          color: 'default',
          icon: QrCode,
          description: 'Escaneie o QR Code para conectar',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'close':
      default:
        return {
          status: 'disconnected',
          label: 'Desconectado',
          color: 'destructive',
          icon: WifiOff,
          description: 'Instância desconectada - Clique em "Conectar" para gerar QR Code',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Status do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mr-3"></div>
            <span className="text-muted-foreground">Carregando status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Status do WhatsApp
        </CardTitle>
        <CardDescription>
          Monitore e gerencie a conexão da instância "agente" do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Instância */}
        <div className={`p-4 rounded-xl border ${statusInfo.borderColor} ${statusInfo.bgColor} transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-background/80 shadow-sm">
                <StatusIcon className={`h-5 w-5 ${
                  statusInfo.status === 'connected' ? 'text-green-600' :
                  statusInfo.status === 'connecting' ? 'text-yellow-600' :
                  statusInfo.status === 'qrcode' ? 'text-blue-600' :
                  statusInfo.status === 'not_found' ? 'text-red-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">Instância: {INSTANCE_NAME}</h3>
                  <Badge variant={statusInfo.color as any} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInstanceStatus}
              disabled={actionLoading !== null}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

                {/* Ações */}
        <div className="space-y-3">
          {instanceStatus && instanceStatus.connectionStatus === 'close' && (
            <div className="space-y-2">
              <Button 
                onClick={connectInstance}
                disabled={actionLoading !== null}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {actionLoading === 'connect' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wifi className="h-4 w-4 mr-2" />
                )}
                Conectar
              </Button>
              
              <Button 
                onClick={generateQRCode}
                disabled={actionLoading !== null}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'qrcode' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Gerar QR Code
              </Button>
            </div>
          )}

          {instanceStatus && instanceStatus.connectionStatus === 'open' && (
            <div className="space-y-2">
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  WhatsApp conectado
                </p>
                <p className="text-xs text-muted-foreground">
                  {instanceStatus.profileName ? `- ${instanceStatus.profileName}` : ''}
                </p>
              </div>
              
              <Button 
                onClick={disconnectInstance}
                disabled={actionLoading !== null}
                variant="destructive"
                className="w-full"
              >
                {actionLoading === 'disconnect' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <WifiOff className="h-4 w-4 mr-2" />
                )}
                Desconectar
              </Button>
              
              <Button 
                onClick={generateQRCode}
                disabled={actionLoading !== null}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'qrcode' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Gerar QR Code
              </Button>
            </div>
          )}

          {instanceStatus && instanceStatus.connectionStatus === 'qrcode' && qrCodeData && (
            <div className="space-y-2">
              <Button 
                onClick={generateQRCode}
                disabled={actionLoading !== null}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'qrcode' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Gerar Novo QR Code
              </Button>
            </div>
          )}

          {instanceStatus && instanceStatus.connectionStatus === 'connecting' && (
            <div className="space-y-2">
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                  <Loader2 className="h-6 w-6 text-yellow-600 animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Conectando instância...
                </p>
                <p className="text-xs text-muted-foreground">
                  Aguarde enquanto a conexão é estabelecida
                </p>
              </div>
              
              <Button 
                onClick={generateQRCode}
                disabled={actionLoading !== null}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'qrcode' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Forçar QR Code
              </Button>
            </div>
          )}

          {!instanceStatus && (
            <div className="space-y-2">
              <div className="text-center py-4">
                <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                  <WifiOff className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Instância "{INSTANCE_NAME}" não encontrada
                </p>
                <p className="text-xs text-muted-foreground">
                  Verifique se a instância existe na Evolution API
                </p>
              </div>
              
              <Button 
                onClick={generateQRCode}
                disabled={actionLoading !== null}
                variant="outline"
                className="w-full"
              >
                {actionLoading === 'qrcode' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Tentar Conectar
              </Button>
            </div>
          )}
        </div>

        {/* Informações Adicionais */}
        {instanceStatus && (
          <div className="space-y-2 pt-4 border-t border-border/30">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="h-3 w-3" />
                <span>Status: {instanceStatus.connectionStatus}</span>
              </div>
              {instanceStatus.profileName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Nome: {instanceStatus.profileName}</span>
                </div>
              )}
              {instanceStatus.ownerJid && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>WhatsApp: {instanceStatus.ownerJid}</span>
                </div>
              )}
              {instanceStatus._count && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>Mensagens: {instanceStatus._count.Message.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Atualizado: {new Date().toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Dialog do QR Code - Sempre disponível quando há QR Code */}
      {qrCodeData && (
        <Dialog open={qrCodeDialogOpen} onOpenChange={setQrCodeDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code para Conectar WhatsApp
              </DialogTitle>
              <DialogDescription>
                Escaneie este QR Code com seu WhatsApp para conectar a instância "agente".
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200">
                <img 
                  src={`data:image/png;base64,${qrCodeData}`} 
                  alt="QR Code WhatsApp"
                  className="w-40 h-40 sm:w-48 sm:h-48"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="text-center space-y-3 w-full">
                <p className="text-sm font-semibold text-primary">Como escanear:</p>
                <ol className="text-xs text-muted-foreground space-y-2 text-left max-w-xs mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Abra o WhatsApp no seu celular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Vá em Configurações {'>'} Aparelhos conectados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Toque em "Conectar um aparelho"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Aponte a câmera para o QR Code</span>
                  </li>
                </ol>
              </div>
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  O QR Code expira em alguns minutos. Se não conseguir escanear, gere um novo.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}; 