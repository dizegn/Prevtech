import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Calendar, User, Flag, CheckCircle2, Circle, Clock, Tag, Layers, ListChecks } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { Breadcrumb } from "./Breadcrumb";
import { VisualizarTarefaModal } from "./VisualizarTarefaModal";
import { EditarTarefaModal } from "./EditarTarefaModal";
import { ExcluirTarefaModal } from "./ExcluirTarefaModal";
import { FIXED_TAGS } from "./constants/tags";
import { Progress } from "./ui/progress";

type SubTask = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  dueOffset: number;
  isRequired: boolean;
  order: number;
  completed: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  tags: string[];
  subtasks?: SubTask[];
  hasSubtasks?: boolean;
  templateId?: string;
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Revisar contrato empresa XYZ",
    description: "Análise completa das cláusulas contratuais",
    status: "todo",
    priority: "high",
    assignee: "Ana Silva",
    dueDate: "2025-10-10",
    tags: ["Contratos", "Urgente"],
    hasSubtasks: false
  },
  {
    id: "2",
    title: "Onboarding Cliente Novo - Maria Souza",
    description: "Processo completo de integração de novo cliente com workflow estruturado",
    status: "in-progress",
    priority: "high",
    assignee: "Carlos Santos",
    dueDate: "2025-11-05",
    tags: ["Clientes", "Onboarding"],
    hasSubtasks: true,
    templateId: "onboarding-cliente",
    subtasks: [
      {
        id: "st1",
        title: "Cadastro inicial e coleta de documentos",
        description: "Coletar CPF, RG, comprovante de residência e documentos específicos do caso",
        assignee: "Ana Silva",
        dueDate: "2025-10-26",
        dueOffset: 2,
        isRequired: true,
        order: 1,
        completed: true
      },
      {
        id: "st2",
        title: "Análise preliminar do caso",
        description: "Revisar documentação e identificar viabilidade jurídica",
        assignee: "Carlos Santos",
        dueDate: "2025-10-29",
        dueOffset: 5,
        isRequired: true,
        order: 2,
        completed: true
      },
      {
        id: "st3",
        title: "Elaboração de proposta comercial",
        description: "Criar proposta de honorários e cronograma de trabalho",
        assignee: "Beatriz Lima",
        dueDate: "2025-10-31",
        dueOffset: 7,
        isRequired: true,
        order: 3,
        completed: false
      },
      {
        id: "st4",
        title: "Assinatura de contrato",
        description: "Enviar contrato para assinatura digital e arquivar",
        assignee: "Ana Silva",
        dueDate: "2025-11-03",
        dueOffset: 10,
        isRequired: true,
        order: 4,
        completed: false
      }
    ]
  },
  {
    id: "3",
    title: "Processo Previdenciário - João Santos",
    description: "Gestão completa de aposentadoria por tempo de contribuição",
    status: "in-progress",
    priority: "high",
    assignee: "Beatriz Lima",
    dueDate: "2025-11-15",
    tags: ["Previdenciário", "INSS"],
    hasSubtasks: true,
    templateId: "processo-previdenciario",
    subtasks: [
      {
        id: "st1",
        title: "Busca automática via GOV.BR",
        description: "Acessar sistema GOV.BR e extrair dados previdenciários do cliente",
        assignee: "Ana Silva",
        dueDate: "2025-10-25",
        dueOffset: 1,
        isRequired: true,
        order: 1,
        completed: true
      },
      {
        id: "st2",
        title: "Análise de contagem M07",
        description: "Realizar contagem de tempo de contribuição usando módulo M07",
        assignee: "Carlos Santos",
        dueDate: "2025-10-27",
        dueOffset: 3,
        isRequired: true,
        order: 2,
        completed: false
      },
      {
        id: "st3",
        title: "Elaboração de peça inicial",
        description: "Redigir petição inicial com base nos dados coletados",
        assignee: "Beatriz Lima",
        dueDate: "2025-11-01",
        dueOffset: 7,
        isRequired: true,
        order: 3,
        completed: false
      },
      {
        id: "st4",
        title: "Protocolo judicial",
        description: "Protocolar ação no sistema e-Proc ou PJe",
        assignee: "Ana Silva",
        dueDate: "2025-11-04",
        dueOffset: 10,
        isRequired: true,
        order: 4,
        completed: false
      },
      {
        id: "st5",
        title: "Notificação ao cliente",
        description: "Informar cliente sobre protocolo e próximos passos",
        assignee: "Ana Silva",
        dueDate: "2025-11-05",
        dueOffset: 11,
        isRequired: false,
        order: 5,
        completed: false
      }
    ]
  },
  {
    id: "4",
    title: "Atualizar documentação de processos",
    description: "Incluir novos fluxos de aprovação",
    status: "in-progress",
    priority: "low",
    assignee: "Beatriz Lima",
    dueDate: "2025-10-15",
    tags: ["Documentação"],
    hasSubtasks: false
  },
  {
    id: "5",
    title: "Follow-up cliente ABC",
    description: "Verificar pendências do contrato",
    status: "done",
    priority: "medium",
    assignee: "Ana Silva",
    dueDate: "2025-10-05",
    tags: ["Clientes"],
    hasSubtasks: false
  }
];

interface TarefasScreenProps {
  onNewTask?: () => void;
  onNavigateHome?: () => void;
}

export function TarefasScreen({ onNewTask, onNavigateHome }: TarefasScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "todo" | "in-progress" | "done">("all");
  
  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [excluirModalOpen, setExcluirModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee;
    const matchesTag = filterTag === "all" || task.tags.includes(filterTag);
    const matchesTab = activeTab === "all" || task.status === activeTab;
    
    return matchesSearch && matchesPriority && matchesAssignee && matchesTag && matchesTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  const handleVisualizar = (task: Task) => {
    setSelectedTask(task);
    setVisualizarModalOpen(true);
  };

  const handleEditar = (task: Task) => {
    setSelectedTask(task);
    setEditarModalOpen(true);
  };

  const handleExcluir = (task: Task) => {
    setSelectedTask(task);
    setExcluirModalOpen(true);
  };

  const handleSaveEdit = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Tarefa editada:", data);
    setModalLoading(false);
    setEditarModalOpen(false);
    setVisualizarModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Tarefa excluída:", selectedTask?.id);
    setModalLoading(false);
    setExcluirModalOpen(false);
    setSelectedTask(null);
  };

  if (error) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Tarefas", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Tarefas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas tarefas e acompanhe o progresso da equipe
            </p>
          </div>
          <Button className="gap-2 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black" onClick={onNewTask}>
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  <SelectValue placeholder="Prioridade" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <SelectValue placeholder="Responsável" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os responsáveis</SelectItem>
                <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                <SelectItem value="Beatriz Lima">Beatriz Lima</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <SelectValue placeholder="Etiqueta" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etiquetas</SelectItem>
                {FIXED_TAGS.map((tag) => (
                  <SelectItem key={tag.id} value={tag.label}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">
              Todas ({mockTasks.length})
            </TabsTrigger>
            <TabsTrigger value="todo">
              A Fazer ({mockTasks.filter(t => t.status === "todo").length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Em Andamento ({mockTasks.filter(t => t.status === "in-progress").length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Concluído ({mockTasks.filter(t => t.status === "done").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Não há tarefas que correspondam aos filtros aplicados
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setFilterPriority("all");
                  setFilterAssignee("all");
                  setFilterTag("all");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="pt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white mb-1">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          <Badge variant="outline">
                            {getStatusLabel(task.status)}
                          </Badge>
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Indicador de Subtarefas */}
                        {task.hasSubtasks && task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                  Workflow com Subtarefas
                                </span>
                              </div>
                              <span className="text-xs text-blue-700 dark:text-blue-300">
                                {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} concluídas
                              </span>
                            </div>
                            <Progress 
                              value={(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100} 
                              className="h-2"
                            />
                            <div className="mt-2 flex items-start gap-2">
                              <ListChecks className="w-3 h-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                {task.subtasks.filter(st => st.isRequired && !st.completed).length > 0 
                                  ? `${task.subtasks.filter(st => st.isRequired && !st.completed).length} subtarefa(s) obrigatória(s) pendente(s)`
                                  : "Todas as subtarefas obrigatórias concluídas"
                                }
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleVisualizar(task)}>
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditar(task)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 dark:text-red-400"
                          onClick={() => handleExcluir(task)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <VisualizarTarefaModal
          open={visualizarModalOpen}
          onOpenChange={setVisualizarModalOpen}
          tarefa={selectedTask}
        />
        
        <EditarTarefaModal
          open={editarModalOpen}
          onOpenChange={setEditarModalOpen}
          tarefa={selectedTask}
          onSave={handleSaveEdit}
          isLoading={modalLoading}
        />
        
        <ExcluirTarefaModal
          open={excluirModalOpen}
          onOpenChange={setExcluirModalOpen}
          tarefaTitle={selectedTask?.title || ""}
          onConfirm={handleConfirmDelete}
          isLoading={modalLoading}
        />
      </div>
    </div>
  );
}