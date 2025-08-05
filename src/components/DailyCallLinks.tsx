import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Video, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyCallLink {
  id: number;
  call_date: string;
  meet_link: string;
}

export const DailyCallLinks = () => {
  const [links, setLinks] = useState<DailyCallLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<DailyCallLink | null>(null);
  const [formData, setFormData] = useState({ call_date: '', meet_link: '' });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_call_links')
        .select('*')
        .order('call_date', { ascending: false });

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Links das Chamadas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando links...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
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
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog()}>
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

          {links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum link cadastrado. Clique em "Adicionar Link" para começar.
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        {format(new Date(link.call_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={link.meet_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {link.meet_link.length > 40 
                            ? `${link.meet_link.substring(0, 40)}...` 
                            : link.meet_link
                          }
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(link)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};