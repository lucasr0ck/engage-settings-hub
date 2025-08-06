import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save, Settings, Calendar, Clock, Power, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LaunchSetting {
  id: number;
  setting_key: string;
  setting_value: string | null;
  description: string;
  is_editable: boolean;
}

export const LaunchSettings = () => {
  const [settings, setSettings] = useState<LaunchSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('launch_settings')
        .select('*')
        .order('id');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (id: number, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, setting_value: value } : setting
      )
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = settings.map(setting => ({
        id: setting.id,
        setting_value: setting.setting_value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('launch_settings')
          .update({ setting_value: update.setting_value })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Configurações salvas!",
        description: "Todas as configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    if (key.includes('launch_date')) return <Rocket className="h-4 w-4" />;
    if (key.includes('_date')) return <Calendar className="h-4 w-4" />;
    if (key.includes('_time')) return <Clock className="h-4 w-4" />;
    if (key === 'is_active') return <Power className="h-4 w-4" />;
    return <Settings className="h-4 w-4" />;
  };

  const renderInput = (setting: LaunchSetting) => {
    const value = setting.setting_value || '';

    if (setting.setting_key === 'is_active') {
      return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
          <div className="flex items-center gap-2">
            <Power className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Sistema Ativo</span>
          </div>
          <Switch
            checked={value === 'true'}
            onCheckedChange={(checked) => updateSetting(setting.id, checked ? 'true' : 'false')}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      );
    }

    if (setting.setting_key.includes('_date')) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getSettingIcon(setting.setting_key)}
            <Label className="text-sm font-medium">
              {setting.description}
            </Label>
          </div>
          <Input
            type="date"
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-input border-border/50 focus:border-primary"
          />
        </div>
      );
    }

    if (setting.setting_key.includes('_time')) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getSettingIcon(setting.setting_key)}
            <Label className="text-sm font-medium">
              {setting.description}
            </Label>
          </div>
          <Input
            type="time"
            value={value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            step="1"
            className="bg-input border-border/50 focus:border-primary"
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getSettingIcon(setting.setting_key)}
          <Label className="text-sm font-medium">
            {setting.description}
          </Label>
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => updateSetting(setting.id, e.target.value)}
          className="bg-input border-border/50 focus:border-primary"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Lançamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Configurações de Lançamento
        </CardTitle>
        <CardDescription>
          Configure os parâmetros principais do sistema de engajamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.id} className="space-y-3">
              {renderInput(setting)}
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-border/30">
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};