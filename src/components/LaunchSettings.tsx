import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Save, Settings } from 'lucide-react';

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

  const renderInput = (setting: LaunchSetting) => {
    const value = setting.setting_value || '';

    if (setting.setting_key === 'is_active') {
      return (
        <Switch
          checked={value === 'true'}
          onCheckedChange={(checked) => updateSetting(setting.id, checked ? 'true' : 'false')}
          className="data-[state=checked]:bg-secondary"
        />
      );
    }

    if (setting.setting_key.includes('_date')) {
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => updateSetting(setting.id, e.target.value)}
          className="bg-input"
        />
      );
    }

    if (setting.setting_key.includes('_time')) {
      return (
        <Input
          type="time"
          value={value}
          onChange={(e) => updateSetting(setting.id, e.target.value)}
          step="1"
          className="bg-input"
        />
      );
    }

    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => updateSetting(setting.id, e.target.value)}
        className="bg-input"
      />
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Lançamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando configurações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
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
        {settings.map((setting) => (
          <div key={setting.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {setting.description}
            </Label>
            {renderInput(setting)}
          </div>
        ))}
        
        <div className="pt-4">
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};