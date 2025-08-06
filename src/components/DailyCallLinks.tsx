import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Video, ExternalLink, Calendar, Save, Link as LinkIcon, Clock, CalendarDays } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface DailyCallLink {
  id: number;
  call_date: string;
  meet_link: string;
}

export const DailyCallLinks = () => {
  const [links, setLinks] = useState<DailyCallLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<DailyCallLink | null>(null);
  const [editingDateId, setEditingDateId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ call_date: '', meet_link: '' });
  const [bulkLinks, setBulkLinks] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_call_links')
        .select('*')
        .order('call_date', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Erro ao carregar links",
        description: "Não foi possível carregar os links das chamadas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (link?: DailyCallLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({ call_date: link.call_date, meet_link: link.meet_link });
    } else {
      setEditingLink(null);
      setFormData({ call_date: '', meet_link: '' });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingLink(null);
    setFormData({ call_date: '', meet_link: '' });
  };

  const openBulkDialog = () => {
    setBulkLinks('');
    setBulkDialogOpen(true);
  };

  const closeBulkDialog = () => {
    setBulkDialogOpen(false);
    setBulkLinks('');
  };

  const saveBulkLinks = async () => {
    if (!bulkLinks.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, insira pelo menos um link.",
        variant: "destructive",
      });
      return;
    }

    const linksArray = bulkLinks.split('\n').filter(link => link.trim());
    if (linksArray.length === 0) {
      toast({
        title: "Nenhum link válido",
        description: "Por favor, insira pelo menos um link válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const linksToInsert = linksArray.map((link, index) => ({
        call_date: format(addDays(today, index), 'yyyy-MM-dd'),
        meet_link: link.trim()
      }));

      const { error } = await supabase
        .from('daily_call_links')
        .insert(linksToInsert);

      if (error) throw error;

      toast({
        title: "Links adicionados!",
        description: `${linksArray.length} link(s) foram adicionados com sucesso.`,
      });

      fetchLinks();
      closeBulkDialog();
    } catch (error: any) {
      console.error('Error saving bulk links:', error);
      
      let errorMessage = "Não foi possível salvar os links.";
      if (error.code === '23505') {
        errorMessage = "Algumas datas já possuem links cadastrados.";
      }
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditingDate = (link: DailyCallLink) => {
    setEditingDateId(link.id);
    setEditingDate(link.call_date);
  };

  const saveDateEdit = async (linkId: number) => {
    try {
      const { error } = await supabase
        .from('daily_call_links')
        .update({ call_date: editingDate })
        .eq('id', linkId);

      if (error) throw error;

      toast({
        title: "Data atualizada!",
        description: "A data foi atualizada com sucesso.",
      });

      fetchLinks();
      setEditingDateId(null);
      setEditingDate('');
    } catch (error: any) {
      console.error('Error updating date:', error);
      
      let errorMessage = "Não foi possível atualizar a data.";
      if (error.code === '23505') {
        errorMessage = "Já existe um link para esta data.";
      }
      
      toast({
        title: "Erro ao atualizar",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const cancelDateEdit = () => {
    setEditingDateId(null);
    setEditingDate('');
  };

  const handleDateKeyDown = (e: React.KeyboardEvent, linkId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveDateEdit(linkId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelDateEdit();
    }
  };

  const saveLink = async () => {
    try {
      if (editingLink) {
        // Update existing link
        const { error } = await supabase
          .from('daily_call_links')
          .update({
            call_date: formData.call_date,
            meet_link: formData.meet_link,
          })
          .eq('id', editingLink.id);

        if (error) throw error;
        
        toast({
          title: "Link atualizado!",
          description: "O link da chamada foi atualizado com sucesso.",
        });
      } else {
        // Create new link
        const { error } = await supabase
          .from('daily_call_links')
          .insert({
            call_date: formData.call_date,
            meet_link: formData.meet_link,
          });

        if (error) throw error;
        
        toast({
          title: "Link adicionado!",
          description: "Novo link de chamada foi criado com sucesso.",
        });
      }

      fetchLinks();
      closeDialog();
    } catch (error: any) {
      console.error('Error saving link:', error);
      
      let errorMessage = "Não foi possível salvar o link.";
      if (error.code === '23505') {
        errorMessage = "Já existe um link para esta data.";
      }
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteLink = async (id: number) => {
    try {
      const { error } = await supabase
        .from('daily_call_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Link removido!",
        description: "O link da chamada foi removido com sucesso.",
      });
      
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o link.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Links das Chamadas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando links...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Links das Chamadas Diárias
        </CardTitle>
        <CardDescription>
          Gerencie os links do Google Meet para as chamadas diárias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={openBulkDialog} className="w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Adicionar em Massa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Links em Massa</DialogTitle>
                  <DialogDescription>
                    Insira um link por linha. As datas serão geradas automaticamente começando de hoje.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk_links">Links do Google Meet</Label>
                    <Textarea
                      id="bulk_links"
                      value={bulkLinks}
                      onChange={(e) => setBulkLinks(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij&#10;https://meet.google.com/xyz-uvwx-rst&#10;https://meet.google.com/123-456-789"
                      className="min-h-[120px] bg-input"
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Exemplo: O primeiro link será para hoje, o segundo para amanhã, e assim por diante.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeBulkDialog}>
                    Cancelar
                  </Button>
                  <Button onClick={saveBulkLinks} disabled={!bulkLinks.trim() || loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar Links'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog()} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingLink ? 'Editar Link' : 'Adicionar Novo Link'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLink ? 'Atualize as informações do link' : 'Preencha os dados para criar um novo link'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="call_date">Data da Chamada</Label>
                    <Input
                      id="call_date"
                      type="date"
                      value={formData.call_date}
                      onChange={(e) => setFormData({ ...formData, call_date: e.target.value })}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meet_link">Link do Google Meet</Label>
                    <Input
                      id="meet_link"
                      type="url"
                      value={formData.meet_link}
                      onChange={(e) => setFormData({ ...formData, meet_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="bg-input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button onClick={saveLink} disabled={!formData.call_date || !formData.meet_link}>
                    {editingLink ? 'Atualizar' : 'Criar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Links Grid */}
          {links.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Nenhum link cadastrado</h3>
              <p className="text-sm text-muted-foreground mb-4">Clique em "Adicionar Link" para começar.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="group relative p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 hover:border-border transition-all duration-200 hover:shadow-md"
                >
                  {/* Date Section */}
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {editingDateId === link.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          onKeyDown={(e) => handleDateKeyDown(e, link.id)}
                          className="h-8 text-sm bg-input"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => saveDateEdit(link.id)}
                          className="h-8 px-2"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelDateEdit}
                          className="h-8 px-2"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingDate(link)}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        title="Clique para editar a data"
                      >
                        {format(new Date(link.call_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </button>
                    )}
                  </div>

                  {/* Link Section */}
                  <div className="space-y-3">
                    <a 
                      href={link.meet_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group/link"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm truncate">
                        {link.meet_link.replace('https://', '').replace('http://', '')}
                      </span>
                    </a>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(link)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o link para {format(new Date(link.call_date), 'dd/MM/yyyy', { locale: ptBR })}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLink(link.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};