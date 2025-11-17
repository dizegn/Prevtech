import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Calculator, 
  FileText, 
  Calendar, 
  Building2, 
  User, 
  DollarSign, 
  Scale, 
  Shield, 
  Clock,
  CheckCircle2,
  Circle,
  Paperclip,
  Download,
  Upload
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { ModuloContagemM07Modal } from "./ModuloContagemM07Modal";

interface ProcessoData {
  id?: string;
  number: string;
  title: string;
  client: string;
  court: string;
  status: string;
  phase: string;
  value: number;
  lastUpdate: string;
  nextHearing?: string;
  responsible: string;
}

interface DetalhesProcessoPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processo: ProcessoData | null;
  onEditar?: () => void;
  onExcluir?: () => void;
  onCriarTarefa?: () => void;
}

// Mock de dados para demonstração
const mockAtendimentos = [
  {
    id: "1",
    data: "2024-10-25",
    tipo: "Reunião",
    descricao: "Atendimento inicial - Análise de documentação",
    responsavel: "Dr. Carlos Silva"
  },
  {
    id: "2",
    data: "2024-10-20",
    tipo: "Telefone",
    descricao: "Cliente solicitou atualização sobre o andamento",
    responsavel: "Maria Santos"
  },
  {
    id: "3",
    data: "2024-10-15",
    tipo: "E-mail",
    descricao: "Envio de petição intermediária",
    responsavel: "Dr. Carlos Silva"
  }
];

const mockDocumentos = [
  {
    id: "1",
    nome: "Petição Inicial.pdf",
    tipo: "PDF",
    tamanho: "2.4 MB",
    dataUpload: "2024-10-10",
    uploadPor: "Dr. Carlos Silva"
  },
  {
    id: "2",
    nome: "Documentos Pessoais - Cliente.pdf",
    tipo: "PDF",
    tamanho: "1.8 MB",
    dataUpload: "2024-10-10",
    uploadPor: "Maria Santos"
  },
  {
    id: "3",
    nome: "Contestação.pdf",
    tipo: "PDF",
    tamanho: "3.1 MB",
    dataUpload: "2024-10-18",
    uploadPor: "Dr. Carlos Silva"
  }
];

const mockTarefas = [
  {
    id: "1",
    titulo: "Preparar contestação",
    responsavel: "Dr. Carlos Silva",
    prazo: "2024-11-05",
    status: "concluida",
    subtarefas: 0,
    subtarefasConcluidas: 0
  },
  {
    id: "2",
    titulo: "Solicitar documentos complementares ao cliente",
    responsavel: "Maria Santos",
    prazo: "2024-11-01",
    status: "em_andamento",
    subtarefas: 3,
    subtarefasConcluidas: 2
  },
  {
    id: "3",
    titulo: "Preparar audiência",
    responsavel: "Dr. Carlos Silva",
    prazo: "2024-11-10",
    status: "pendente",
    subtarefas: 5,
    subtarefasConcluidas: 0
  }
];

export function DetalhesProcessoPanel({
  open,
  onOpenChange,
  processo,
  onEditar,
  onExcluir,
  onCriarTarefa
}: DetalhesProcessoPanelProps) {
  const [activeTab, setActiveTab] = useState("geral");
  const [showM07Modal, setShowM07Modal] = useState(false);

  // Reset tab quando abrir o painel
  useEffect(() => {
    if (open) {
      setActiveTab("geral");
    }
  }, [open]);

  if (!processo) return null;

  // Verificar se é processo previdenciário
  const isProcessoPrevidenciario = processo.title?.toLowerCase().includes("aposentadoria") || 
                                    processo.title?.toLowerCase().includes("inss") ||
                                    processo.title?.toLowerCase().includes("previdenciário") ||
                                    false;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "suspenso": return "Suspenso";
      case "sentenciado": return "Sentenciado";
      case "arquivado": return "Arquivado";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "suspenso": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "sentenciado": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "arquivado": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusTarefaBadge = (status: string) => {
    switch (status) {
      case "concluida":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Concluída</Badge>;
      case "em_andamento":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Em Andamento</Badge>;
      case "pendente":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1400px] p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl mb-2">{processo.title}</SheetTitle>
              <SheetDescription className="sr-only">
                Painel centralizado com todas as informações e ações de gestão do processo
              </SheetDescription>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(processo.status)}>
                  {getStatusLabel(processo.status)}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {processo.number}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Área de Ações - Botões de Destaque */}
        <div className="px-6 py-4 bg-white dark:bg-gray-950 border-b">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ações de Gestão</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={onEditar}
              variant="default"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Processo
            </Button>
            <Button 
              onClick={onExcluir}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Processo
            </Button>
            <Button 
              onClick={onCriarTarefa}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Tarefa
            </Button>
            {isProcessoPrevidenciario && (
              <Button 
                onClick={() => setShowM07Modal(true)}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/20"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Contagem (M07)
              </Button>
            )}
          </div>
        </div>

        {/* Conteúdo com Tabs */}
        <div className="px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
            </TabsList>

            {/* Tab: Geral */}
            <TabsContent value="geral" className="space-y-4">
              <Card className="p-4">
                <h4 className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4" />
                  Dados do Processo
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Número:</span>
                    <span className="col-span-2 font-mono">{processo.number}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Título:</span>
                    <span className="col-span-2">{processo.title}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cliente:</span>
                    <span className="col-span-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {processo.client}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Comarca:</span>
                    <span className="col-span-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {processo.court}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fase Processual:</span>
                    <span className="col-span-2 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gray-400" />
                      {processo.phase}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Responsável:</span>
                    <span className="col-span-2">{processo.responsible}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor da Causa:</span>
                    <span className="col-span-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {formatCurrency(processo.value)}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Última Atualização:</span>
                    <span className="col-span-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(processo.lastUpdate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {processo.nextHearing && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Próxima Audiência:</span>
                        <span className="col-span-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(processo.nextHearing).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {isProcessoPrevidenciario && (
                <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertDescription>
                    <strong>Processo Previdenciário:</strong> Este processo possui integração com o INSS. 
                    Utilize o botão "Contagem (M07)" acima para análise automatizada de tempo de contribuição.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Tab: Atendimentos */}
            <TabsContent value="atendimentos" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Histórico de Atendimentos
                </h4>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atendimento
                </Button>
              </div>

              <div className="space-y-3">
                {mockAtendimentos.map((atendimento) => (
                  <Card key={atendimento.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">{atendimento.tipo}</Badge>
                        <p className="text-sm">{atendimento.descricao}</p>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {atendimento.responsavel}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Documentos */}
            <TabsContent value="documentos" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Documentos e Anexos
                </h4>
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Data Upload</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocumentos.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm">{doc.nome}</p>
                            <p className="text-xs text-gray-500">por {doc.uploadPor}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.tamanho}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Tab: Tarefas Vinculadas */}
            <TabsContent value="tarefas" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Tarefas Vinculadas ao Processo
                </h4>
                <Button size="sm" variant="outline" onClick={onCriarTarefa}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>

              <div className="space-y-3">
                {mockTarefas.map((tarefa) => (
                  <Card key={tarefa.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {tarefa.status === "concluida" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <span>{tarefa.titulo}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 ml-6">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {tarefa.responsavel}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      {getStatusTarefaBadge(tarefa.status)}
                    </div>

                    {tarefa.subtarefas > 0 && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Subtarefas: {tarefa.subtarefasConcluidas}/{tarefa.subtarefas}</span>
                          <span>{Math.round((tarefa.subtarefasConcluidas / tarefa.subtarefas) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(tarefa.subtarefasConcluidas / tarefa.subtarefas) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>

      {/* Modal M07 */}
      <ModuloContagemM07Modal 
        open={showM07Modal} 
        onOpenChange={setShowM07Modal}
        processData={processo}
      />
    </Sheet>
  );
}
