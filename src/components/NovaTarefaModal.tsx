import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { X, Plus, Layers, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { FIXED_TAGS } from "./constants/tags";
import { WORKFLOW_TEMPLATES, WORKFLOW_CATEGORIES, WorkflowTemplate, SubTask } from "./constants/workflow-templates";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface NovaTarefaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
  isLoading?: boolean;
  publicacaoVinculada?: string;
  processoVinculado?: string;
}

export function NovaTarefaModal({
  open,
  onOpenChange,
  onSave,
  isLoading,
  publicacaoVinculada,
  processoVinculado
}: NovaTarefaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Template de subtarefas
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [isTemplateExpanded, setIsTemplateExpanded] = useState(true);

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

  const handleSelectTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubtasks(template.subtasks);
      setShowTemplateSelector(false);
    }
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
  };

  const handleClearTemplate = () => {
    setSelectedTemplate("");
    setSubtasks([]);
  };

  const calculateSubtaskDueDate = (offset: number): string => {
    if (!dueDate) return "";
    const mainDate = new Date(dueDate);
    const subtaskDate = new Date(mainDate);
    subtaskDate.setDate(mainDate.getDate() - offset);
    return subtaskDate.toISOString().split('T')[0];
  };

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(template => 
    filterCategory === "Todos" || template.category === filterCategory
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        description,
        priority,
        assignee,
        dueDate,
        tags: selectedTags,
        subtasks: subtasks.map(st => ({
          ...st,
          dueDate: calculateSubtaskDueDate(st.dueOffset)
        })),
        hasSubtasks: subtasks.length > 0,
        templateId: selectedTemplate,
        publicacaoVinculada,
        processoVinculado
      });
    }
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate("");
    setSelectedTags([]);
    setSubtasks([]);
    setSelectedTemplate("");
    setShowTemplateSelector(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova tarefa. Use templates para adicionar subtarefas pré-definidas com responsáveis automáticos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informação de vínculo */}
          {(publicacaoVinculada || processoVinculado) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                {publicacaoVinculada && (
                  <>
                    <strong>Vinculada à publicação:</strong> {publicacaoVinculada}
                  </>
                )}
                {processoVinculado && (
                  <>
                    <strong>Vinculada ao processo:</strong> {processoVinculado}
                  </>
                )}
              </p>
            </div>
          )}

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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável Principal *</Label>
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

          {/* Template de Subtarefas */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Atividades Pré-Definidas (Templates de Workflow)
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Adicione subtarefas com alocação automática de responsáveis
                  </p>
                </div>
                {!showTemplateSelector && subtasks.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateSelector(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Template
                  </Button>
                )}
              </div>

              {/* Seletor de Template */}
              {showTemplateSelector && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria de Template</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WORKFLOW_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleSelectTemplate(template.id)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {template.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {template.subtasks.length} subtarefas
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateSelector(false)}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              )}

              {/* Subtarefas Adicionadas */}
              {subtasks.length > 0 && (
                <div className="space-y-2">
                  <Collapsible open={isTemplateExpanded} onOpenChange={setIsTemplateExpanded}>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          Template: {WORKFLOW_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {subtasks.length} subtarefas
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearTemplate}
                          className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remover
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            {isTemplateExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="space-y-2 mt-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                        {subtasks.sort((a, b) => a.order - b.order).map((subtask, index) => (
                          <div
                            key={subtask.id}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mt-0.5">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {subtask.title}
                                    {subtask.isRequired && (
                                      <Badge variant="destructive" className="ml-2 text-xs">
                                        Obrigatória
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {subtask.description}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2 text-sm">
                                    <span className="text-gray-700 dark:text-gray-300">
                                      <strong>Responsável:</strong> {subtask.assignee}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      •
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      <strong>Prazo:</strong> {subtask.dueOffset} dias antes da conclusão
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSubtask(subtask.id)}
                                className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Atenção:</strong> A tarefa principal só poderá ser marcada como concluída após a finalização de todas as subtarefas obrigatórias pelos respectivos responsáveis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Etiquetas */}
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
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.label)}
                    onCheckedChange={() => handleToggleTag(tag.label)}
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
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
            {isLoading ? "Criando..." : "Criar Tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
