import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface EditarPublicacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicacao: {
    title: string;
    source: string;
    date: string;
    category: string;
    description: string;
  } | null;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function EditarPublicacaoModal({ 
  open, 
  onOpenChange, 
  publicacao, 
  onSave,
  isLoading 
}: EditarPublicacaoModalProps) {
  const [title, setTitle] = useState(publicacao?.title || "");
  const [description, setDescription] = useState(publicacao?.description || "");
  const [category, setCategory] = useState(publicacao?.category || "");

  const handleSave = () => {
    onSave({
      title,
      description,
      category
    });
  };

  if (!publicacao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Publicação</DialogTitle>
          <DialogDescription>
            Modifique os campos necessários e salve as alterações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da publicação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intimacao">Intimação</SelectItem>
                <SelectItem value="citacao">Citação</SelectItem>
                <SelectItem value="sentenca">Sentença</SelectItem>
                <SelectItem value="despacho">Despacho</SelectItem>
                <SelectItem value="edicao">Edição</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}