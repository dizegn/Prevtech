import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { FIXED_TAGS } from "./constants/tags";

interface EditarTarefaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarefa: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
    tags?: string[];
  } | null;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function EditarTarefaModal({ 
  open, 
  onOpenChange, 
  tarefa, 
  onSave,
  isLoading 
}: EditarTarefaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (tarefa) {
      setTitle(tarefa.title);
      setDescription(tarefa.description);
      setPriority(tarefa.priority);
      setStatus(tarefa.status);
      setAssignee(tarefa.assignee);
      setDueDate(tarefa.dueDate);
      setSelectedTags(tarefa.tags || []);
    }
  }, [tarefa]);

  const handleToggleTag = (tagLabel: string) => {
    setSelectedTags(prev => 
      prev.includes(tagLabel) 
        ? prev.filter(t => t !== tagLabel)
        : [...prev, tagLabel]
    );
  };

  const handleRemoveTag = (tagLabel: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagLabel));
  };

  const handleSave = () => {
    onSave({
      id: tarefa?.id,
      title,
      description,
      priority,
      status,
      assignee,
      dueDate,
      tags: selectedTags
    });
  };

  if (!tarefa) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Modifique os campos necessários e salve as alterações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da tarefa"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável *</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                  <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                  <SelectItem value="Beatriz Lima">Beatriz Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Etiquetas</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecione as etiquetas pré-definidas que se aplicam a esta tarefa
            </p>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="pl-2 pr-1 py-1 gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="grid grid-cols-2 gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg max-h-[200px] overflow-y-auto">
              {FIXED_TAGS.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-edit-${tag.id}`}
                    checked={selectedTags.includes(tag.label)}
                    onCheckedChange={() => handleToggleTag(tag.label)}
                  />
                  <label
                    htmlFor={`tag-edit-${tag.id}`}
                    className="text-sm cursor-pointer select-none"
                  >
                    {tag.label}
                  </label>
                </div>
              ))}
            </div>
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
            disabled={isLoading || !title || !assignee || !dueDate}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}