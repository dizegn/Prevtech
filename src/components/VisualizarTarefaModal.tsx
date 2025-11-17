import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar, User, Flag, Tag, CheckCircle2, Layers, ListChecks, Circle, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";

interface SubTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  dueOffset: number;
  isRequired: boolean;
  order: number;
  completed: boolean;
}

interface VisualizarTarefaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarefa: {
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
    tags: string[];
    subtasks?: SubTask[];
    hasSubtasks?: boolean;
    templateId?: string;
  } | null;
}

export function VisualizarTarefaModal({ open, onOpenChange, tarefa }: VisualizarTarefaModalProps) {
  if (!tarefa) return null;

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return "A Fazer";
      case "in-progress": return "Em Andamento";
      case "done": return "Concluído";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getSubtaskProgress = () => {
    if (!tarefa.subtasks || tarefa.subtasks.length === 0) return 0;
    const completed = tarefa.subtasks.filter(st => st.completed).length;
    return (completed / tarefa.subtasks.length) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tarefa.title}</DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos desta tarefa e acompanhe o progresso das subtarefas
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={getPriorityColor(tarefa.priority)}>
                <Flag className="w-3 h-3 mr-1" />
                {getPriorityLabel(tarefa.priority)}
              </Badge>
              <Badge variant="outline">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {getStatusLabel(tarefa.status)}
              </Badge>
              {tarefa.hasSubtasks && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <Layers className="w-3 h-3 mr-1" />
                  Workflow Estruturado
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Descrição
                </label>
                <p className="text-gray-900 dark:text-white">
                  {tarefa.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Responsável Principal
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {tarefa.assignee}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data de Vencimento
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(tarefa.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {tarefa.tags.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tarefa.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtarefas */}
              {tarefa.hasSubtasks && tarefa.subtasks && tarefa.subtasks.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Subtarefas do Workflow ({tarefa.subtasks.filter(st => st.completed).length}/{tarefa.subtasks.length})
                      </label>
                      
                      {/* Barra de Progresso */}
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Progresso Geral
                          </span>
                          <span className="text-sm text-blue-700 dark:text-blue-300">
                            {Math.round(getSubtaskProgress())}%
                          </span>
                        </div>
                        <Progress value={getSubtaskProgress()} className="h-2" />
                        {tarefa.subtasks.filter(st => st.isRequired && !st.completed).length > 0 && (
                          <p className="text-xs text-blue-800 dark:text-blue-200 mt-2 flex items-start gap-2">
                            <ListChecks className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {tarefa.subtasks.filter(st => st.isRequired && !st.completed).length} subtarefa(s) obrigatória(s) pendente(s) - A tarefa principal não pode ser concluída até que todas sejam finalizadas
                          </p>
                        )}
                      </div>

                      {/* Lista de Subtarefas */}
                      <div className="space-y-3">
                        {tarefa.subtasks.sort((a, b) => a.order - b.order).map((subtask, index) => (
                          <div
                            key={subtask.id}
                            className={`p-4 rounded-lg border transition-all ${
                              subtask.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                                subtask.completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              }`}>
                                {subtask.completed ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`font-medium ${
                                      subtask.completed
                                        ? 'text-green-900 dark:text-green-100 line-through'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {subtask.title}
                                    </h4>
                                    {subtask.isRequired && (
                                      <Badge variant="destructive" className="text-xs">
                                        Obrigatória
                                      </Badge>
                                    )}
                                  </div>
                                  {subtask.completed ? (
                                    <Badge className="bg-green-600 text-white hover:bg-green-700 text-xs">
                                      Concluída
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      Pendente
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className={`text-sm mb-3 ${
                                  subtask.completed
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {subtask.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                    <span className={subtask.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}>
                                      {subtask.assignee}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                    <span className={subtask.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}>
                                      {new Date(subtask.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aviso de Conclusão */}
                    {tarefa.status !== 'done' && tarefa.subtasks.filter(st => st.isRequired).every(st => st.completed) && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                              Todas as subtarefas obrigatórias foram concluídas!
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                              A tarefa principal agora pode ser marcada como concluída.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
