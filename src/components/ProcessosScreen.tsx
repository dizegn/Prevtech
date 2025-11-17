import { useState } from "react";
import { Plus, Search, Filter, FileText, Calendar, Building2, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Breadcrumb } from "./Breadcrumb";
import { SelecionarTipoProcessoModal } from "./SelecionarTipoProcessoModal";
import { NovoProcessoModal } from "./NovoProcessoModal";
import { CriarViaPublicacaoModal } from "./CriarViaPublicacaoModal";
import { CriarViaINSSModal } from "./CriarViaINSSModal";
import { DetalhesProcessoPanel } from "./DetalhesProcessoPanel";
import { EditarProcessoModal } from "./EditarProcessoModal";
import { ExcluirProcessoModal } from "./ExcluirProcessoModal";
import { NovaTarefaModal } from "./NovaTarefaModal";
import { toast } from "sonner@2.0.3";

type Process = {
  id: string;
  number: string;
  title: string;
  client: string;
  court: string;
  status: "ativo" | "arquivado" | "suspenso" | "sentenciado";
  phase: string;
  value: number;
  lastUpdate: string;
  nextHearing?: string;
  responsible: string;
};

const mockProcesses: Process[] = [
  {
    id: "1",
    number: "0001234-56.2024.8.26.0100",
    title: "Ação de Cobrança",
    client: "Empresa ABC Ltda",
    court: "1ª Vara Cível - SP",
    status: "ativo",
    phase: "Instrução Probatória",
    value: 150000,
    lastUpdate: "2025-10-05",
    nextHearing: "2025-10-25",
    responsible: "Dr. João Silva"
  },
  {
    id: "2",
    number: "0007890-12.2024.8.26.0100",
    title: "Ação Trabalhista",
    client: "Construtora XYZ S/A",
    court: "2ª Vara do Trabalho - SP",
    status: "ativo",
    phase: "Contestação",
    value: 85000,
    lastUpdate: "2025-10-07",
    nextHearing: "2025-11-10",
    responsible: "Dra. Maria Santos"
  },
  {
    id: "3",
    number: "0003456-78.2023.8.26.0100",
    title: "Execução Fiscal",
    client: "Comércio Beta ME",
    court: "Fazenda Pública - SP",
    status: "suspenso",
    phase: "Suspensão",
    value: 45000,
    lastUpdate: "2025-09-20",
    responsible: "Dr. Pedro Oliveira"
  },
  {
    id: "4",
    number: "0009012-34.2022.8.26.0100",
    title: "Ação de Indenização",
    client: "Hotel Delta Ltda",
    court: "3ª Vara Cível - SP",
    status: "sentenciado",
    phase: "Sentenciado",
    value: 200000,
    lastUpdate: "2025-08-15",
    responsible: "Dra. Ana Costa"
  },
  {
    id: "5",
    number: "0005678-90.2024.8.26.0100",
    title: "Ação Revisional",
    client: "Indústria Gamma S/A",
    court: "4ª Vara Cível - SP",
    status: "ativo",
    phase: "Análise Inicial",
    value: 320000,
    lastUpdate: "2025-10-08",
    nextHearing: "2025-10-20",
    responsible: "Dr. João Silva"
  },
  {
    id: "6",
    number: "0002345-67.2023.8.26.0100",
    title: "Inventário",
    client: "Família Almeida",
    court: "Vara de Família - SP",
    status: "arquivado",
    phase: "Concluído",
    value: 500000,
    lastUpdate: "2025-07-30",
    responsible: "Dra. Maria Santos"
  },
];

interface ProcessosScreenProps {
  onNewProcess?: () => void;
  onNavigateHome?: () => void;
}

export function ProcessosScreen({ onNewProcess, onNavigateHome }: ProcessosScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCourt, setFilterCourt] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "ativo" | "suspenso" | "sentenciado" | "arquivado">("all");
  
  // Modal states - Novo fluxo híbrido
  const [selecionarTipoModalOpen, setSelecionarTipoModalOpen] = useState(false);
  const [novoProcessoManualOpen, setNovoProcessoManualOpen] = useState(false);
  const [criarViaPublicacaoOpen, setCriarViaPublicacaoOpen] = useState(false);
  const [criarViaINSSOpen, setCriarViaINSSOpen] = useState(false);
  
  // Modal states - Visualização/Edição/Exclusão
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [detalhesPanelOpen, setDetalhesPanelOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [excluirModalOpen, setExcluirModalOpen] = useState(false);
  const [novaTarefaModalOpen, setNovaTarefaModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Handlers para criação de processo
  const handleNovoProcessoClick = () => {
    setSelecionarTipoModalOpen(true);
  };

  const handleSelectManual = () => {
    setSelecionarTipoModalOpen(false);
    setNovoProcessoManualOpen(true);
  };

  const handleSelectPublicacao = () => {
    setSelecionarTipoModalOpen(false);
    setCriarViaPublicacaoOpen(true);
  };

  const handleSelectINSS = () => {
    setSelecionarTipoModalOpen(false);
    setCriarViaINSSOpen(true);
  };

  const handleSaveManualProcess = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Processo manual criado:", data);
    toast.success(`Processo ${data.number} cadastrado manualmente com sucesso!`);
    setModalLoading(false);
    setNovoProcessoManualOpen(false);
  };

  const handleSavePublicacaoProcess = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Processo via publicação criado:", data);
    toast.success(`Processo ${data.number} importado da publicação com sucesso!`);
    setModalLoading(false);
    setCriarViaPublicacaoOpen(false);
  };

  const handleSaveINSSProcess = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Processo via INSS criado:", data);
    toast.success(`Processo ${data.number} importado da INSS com sucesso!`);
    setModalLoading(false);
    setCriarViaINSSOpen(false);
  };

  const filteredProcesses = mockProcesses.filter(process => {
    const matchesSearch = process.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         process.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         process.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || process.status === filterStatus;
    const matchesCourt = filterCourt === "all" || process.court === filterCourt;
    const matchesTab = activeTab === "all" || process.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesCourt && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "suspenso": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "sentenciado": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "arquivado": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "suspenso": return "Suspenso";
      case "sentenciado": return "Sentenciado";
      case "arquivado": return "Arquivado";
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalValue = filteredProcesses.reduce((sum, p) => sum + p.value, 0);
  const activeProcesses = mockProcesses.filter(p => p.status === "ativo").length;

  const handleVerDetalhes = (process: Process) => {
    setSelectedProcess(process);
    setDetalhesPanelOpen(true);
  };

  const handleEditarFromPanel = () => {
    setDetalhesPanelOpen(false);
    setEditarModalOpen(true);
  };

  const handleExcluirFromPanel = () => {
    setDetalhesPanelOpen(false);
    setExcluirModalOpen(true);
  };

  const handleCriarTarefaFromPanel = () => {
    setNovaTarefaModalOpen(true);
  };

  const handleSaveEdit = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Processo editado:", data);
    toast.success("Processo atualizado com sucesso!");
    setModalLoading(false);
    setEditarModalOpen(false);
    setDetalhesPanelOpen(true);
  };

  const handleConfirmArchive = async () => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Processo arquivado:", selectedProcess?.id);
    toast.success("Processo excluído com sucesso!");
    setModalLoading(false);
    setExcluirModalOpen(false);
    setSelectedProcess(null);
  };

  const handleSaveTarefa = async (data: any) => {
    setModalLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Tarefa criada:", data);
    toast.success("Tarefa vinculada ao processo com sucesso!");
    setModalLoading(false);
    setNovaTarefaModalOpen(false);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
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
            { label: "Processos", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Processos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Acompanhe e gerencie todos os processos jurídicos
            </p>
          </div>
          <Button 
            className="gap-2 bg-black hover:bg-black/90 text-white"
            onClick={handleNovoProcessoClick}
          >
            <Plus className="w-4 h-4" />
            Novo Processo
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400">Total de Processos</p>
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <p className="text-gray-900 dark:text-white">{mockProcesses.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400">Processos Ativos</p>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-900 dark:text-white">{activeProcesses}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400">Valor Total</p>
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, título ou cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="sentenciado">Sentenciado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCourt} onValueChange={setFilterCourt}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Comarca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as comarcas</SelectItem>
                <SelectItem value="1ª Vara Cível - SP">1ª Vara Cível - SP</SelectItem>
                <SelectItem value="2ª Vara do Trabalho - SP">2ª Vara do Trabalho - SP</SelectItem>
                <SelectItem value="Fazenda Pública - SP">Fazenda Pública - SP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">
              Todos ({mockProcesses.length})
            </TabsTrigger>
            <TabsTrigger value="ativo">
              Ativos ({mockProcesses.filter(p => p.status === "ativo").length})
            </TabsTrigger>
            <TabsTrigger value="suspenso">
              Suspensos ({mockProcesses.filter(p => p.status === "suspenso").length})
            </TabsTrigger>
            <TabsTrigger value="sentenciado">
              Sentenciados ({mockProcesses.filter(p => p.status === "sentenciado").length})
            </TabsTrigger>
            <TabsTrigger value="arquivado">
              Arquivados ({mockProcesses.filter(p => p.status === "arquivado").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredProcesses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Nenhum processo encontrado</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Não há processos que correspondam aos filtros aplicados
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterCourt("all");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número do Processo</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Comarca</TableHead>
                      <TableHead>Fase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Próxima Audiência</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcesses.map((process) => (
                      <TableRow key={process.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{process.number}</span>
                          </div>
                        </TableCell>
                        <TableCell>{process.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {process.client}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {process.court}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {process.phase}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(process.status)}>
                            {getStatusLabel(process.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(process.value)}</TableCell>
                        <TableCell>
                          {process.nextHearing ? (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(process.nextHearing).toLocaleDateString('pt-BR')}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerDetalhes(process)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <SelecionarTipoProcessoModal
          open={selecionarTipoModalOpen}
          onOpenChange={setSelecionarTipoModalOpen}
          onSelectManual={handleSelectManual}
          onSelectPublicacao={handleSelectPublicacao}
          onSelectINSS={handleSelectINSS}
        />
        
        <NovoProcessoModal
          open={novoProcessoManualOpen}
          onOpenChange={setNovoProcessoManualOpen}
          onSave={handleSaveManualProcess}
          isLoading={modalLoading}
        />
        
        <CriarViaPublicacaoModal
          open={criarViaPublicacaoOpen}
          onOpenChange={setCriarViaPublicacaoOpen}
          onSave={handleSavePublicacaoProcess}
          isLoading={modalLoading}
        />
        
        <CriarViaINSSModal
          open={criarViaINSSOpen}
          onOpenChange={setCriarViaINSSOpen}
          onSave={handleSaveINSSProcess}
          isLoading={modalLoading}
        />
        
        <DetalhesProcessoPanel
          open={detalhesPanelOpen}
          onOpenChange={setDetalhesPanelOpen}
          processo={selectedProcess}
          onEditar={handleEditarFromPanel}
          onExcluir={handleExcluirFromPanel}
          onCriarTarefa={handleCriarTarefaFromPanel}
        />
        
        <EditarProcessoModal
          open={editarModalOpen}
          onOpenChange={setEditarModalOpen}
          processo={selectedProcess}
          onSave={handleSaveEdit}
          isLoading={modalLoading}
        />
        
        <ExcluirProcessoModal
          open={excluirModalOpen}
          onOpenChange={setExcluirModalOpen}
          processoTitle={selectedProcess?.title || ""}
          onConfirm={handleConfirmArchive}
          isLoading={modalLoading}
        />

        <NovaTarefaModal
          open={novaTarefaModalOpen}
          onOpenChange={setNovaTarefaModalOpen}
          onSave={handleSaveTarefa}
          isLoading={modalLoading}
          processoVinculado={selectedProcess ? `${selectedProcess.number} - ${selectedProcess.title}` : undefined}
        />
      </div>
    </div>
  );
}