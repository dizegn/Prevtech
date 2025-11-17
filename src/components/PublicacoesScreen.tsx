import { useState } from "react";
import { Search, Filter, FileText, Calendar, AlertCircle, Eye, Download, Bell, MoreVertical, Pencil, Trash2, MapPin, Archive, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Breadcrumb } from "./Breadcrumb";
import { VisualizarPublicacaoModal } from "./VisualizarPublicacaoModal";
import { EditarPublicacaoModal } from "./EditarPublicacaoModal";
import { ExcluirPublicacaoModal } from "./ExcluirPublicacaoModal";
import { ConfigurarAlertaModal } from "./ConfigurarAlertaModal";
import { VincularProcessoModal } from "./VincularProcessoModal";
import { NovaTarefaModal } from "./NovaTarefaModal";
import { toast } from "sonner@2.0.3";

export type Publication = {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  processNumber?: string;
  category: "intimacao" | "citacao" | "sentenca" | "despacho" | "edicao";
  status: "nao-lida" | "lida" | "processada";
  priority: "alta" | "media" | "baixa";
  deadline?: string;
};

const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Intimação - Processo 0001234-56.2024.8.26.0100",
    description: "Intimação para apresentação de memoriais no prazo de 10 dias",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-08",
    processNumber: "0001234-56.2024.8.26.0100",
    category: "intimacao",
    status: "nao-lida",
    priority: "alta",
    deadline: "2025-10-18"
  },
  {
    id: "2",
    title: "Sentença - Processo 0007890-12.2024.8.26.0100",
    description: "Publicação de sentença de procedência parcial",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-07",
    processNumber: "0007890-12.2024.8.26.0100",
    category: "sentenca",
    status: "lida",
    priority: "alta"
  },
  {
    id: "3",
    title: "Despacho - Processo 0003456-78.2023.8.26.0100",
    description: "Deferimento de suspensão do processo por 60 dias",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-06",
    processNumber: "0003456-78.2023.8.26.0100",
    category: "despacho",
    status: "processada",
    priority: "media"
  },
  {
    id: "4",
    title: "Citação - Processo 0009012-34.2025.8.26.0100",
    description: "Citação do réu para apresentar contestação em 15 dias",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-05",
    processNumber: "0009012-34.2025.8.26.0100",
    category: "citacao",
    status: "processada",
    priority: "alta",
    deadline: "2025-10-20"
  },
  {
    id: "5",
    title: "Edição 2847 - Caderno Judicial",
    description: "Publicação do caderno judicial do TJSP de 05/10/2025",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-05",
    category: "edicao",
    status: "lida",
    priority: "baixa"
  },
  {
    id: "6",
    title: "Intimação - Processo 0005678-90.2024.8.26.0100",
    description: "Intimação para audiência de conciliação designada para 15/10/2025",
    source: "Diário de Justiça Eletrônico - TJSP",
    date: "2025-10-04",
    processNumber: "0005678-90.2024.8.26.0100",
    category: "intimacao",
    status: "processada",
    priority: "media",
    deadline: "2025-10-15"
  },
];

interface PublicacoesScreenProps {
  onNavigateHome?: () => void;
  onNavigateToTraduzirIA?: (publicacao: Publication) => void;
}

export function PublicacoesScreen({ onNavigateHome, onNavigateToTraduzirIA }: PublicacoesScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "nao-lida" | "lida" | "processada">("all");
  
  // Modal states
  const [showVisualizarModal, setShowVisualizarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showExcluirModal, setShowExcluirModal] = useState(false);
  const [showAlertaModal, setShowAlertaModal] = useState(false);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [showNovaTarefaModal, setShowNovaTarefaModal] = useState(false);
  const [selectedPublicacao, setSelectedPublicacao] = useState<Publication | null>(null);
  const [publications, setPublications] = useState<Publication[]>(mockPublications);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pub.processNumber && pub.processNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = filterSource === "all" || pub.source === filterSource;
    const matchesTab = activeTab === "all" || pub.status === activeTab;
    
    return matchesSearch && matchesSource && matchesTab;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "intimacao": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "citacao": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "sentenca": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "despacho": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "edicao": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "intimacao": return "Intimação";
      case "citacao": return "Citação";
      case "sentenca": return "Sentença";
      case "despacho": return "Despacho";
      case "edicao": return "Edição";
      default: return category;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-600 dark:text-red-400";
      case "media": return "text-yellow-600 dark:text-yellow-400";
      case "baixa": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "nao-lida": return "Não Lida";
      case "lida": return "Lida";
      case "processada": return "Processada";
      default: return status;
    }
  };

  const unreadCount = publications.filter(p => p.status === "nao-lida").length;

  // Funções de ação
  const handleVisualizarPublicacao = (publicacao: Publication) => {
    setSelectedPublicacao(publicacao);
    setShowVisualizarModal(true);
  };

  const handleMarcarComoLida = (publicacaoId: string) => {
    setPublications(publications.map(p => 
      p.id === publicacaoId ? { ...p, status: "lida" as const } : p
    ));
    toast.success("Publicação marcada como lida");
  };

  const handleMarcarComoProcessada = (publicacaoId: string) => {
    setPublications(publications.map(p => 
      p.id === publicacaoId ? { ...p, status: "processada" as const } : p
    ));
    toast.success("Publicação marcada como processada");
  };

  const handleTraduzirComIA = (publicacao: Publication) => {
    if (onNavigateToTraduzirIA) {
      onNavigateToTraduzirIA(publicacao);
    } else {
      toast.error("Navegação não configurada");
    }
  };

  const handleVincularProcesso = (publicacao: Publication) => {
    setSelectedPublicacao(publicacao);
    setShowVincularModal(true);
  };

  const handleConfirmarVinculo = (processoId: string) => {
    toast.success("Publicação vinculada ao processo com sucesso!");
  };

  const handleCriarTarefa = (publicacao: Publication) => {
    setSelectedPublicacao(publicacao);
    setShowNovaTarefaModal(true);
  };

  const handleSalvarTarefa = (data: any) => {
    toast.success("Tarefa criada e vinculada à publicação com sucesso!");
    setShowNovaTarefaModal(false);
  };

  const handleBaixarPDF = (publicacao: Publication) => {
    // Simular download de PDF
    toast.success(`Baixando PDF: ${publicacao.title}`);
    // Em produção, aqui seria feito o download real do arquivo
  };

  const handleArquivar = (publicacaoId: string) => {
    setPublications(publications.filter(p => p.id !== publicacaoId));
    toast.success("Publicação arquivada com sucesso");
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

  const handleVisualizar = (pub: Publication) => {
    setSelectedPublicacao(pub);
    setShowVisualizarModal(true);
  };

  const handleEditar = (pub: Publication) => {
    setSelectedPublicacao(pub);
    setShowEditarModal(true);
  };

  const handleExcluir = (pub: Publication) => {
    setSelectedPublicacao(pub);
    setShowExcluirModal(true);
  };

  const handleSaveEdit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowEditarModal(false);
      toast.success("Publicação atualizada com sucesso!");
    }, 1500);
  };

  const handleConfirmExcluir = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowExcluirModal(false);
      toast.success("Publicação excluída com sucesso!");
    }, 1000);
  };

  const handleSaveAlerta = (channels: string[], keywords: string[]) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlertaModal(false);
      toast.success("Alertas configurados com sucesso!");
    }, 1000);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Publicações", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Publicações</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Acompanhe todas as publicações do Diário Oficial
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowAlertaModal(true)}>
              <Bell className="w-4 h-4" />
              Configurar Alertas
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Alert for unread publications */}
        {unreadCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você tem {unreadCount} {unreadCount === 1 ? 'publicação não lida' : 'publicações não lidas'} que {unreadCount === 1 ? 'requer' : 'requerem'} atenção.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span>Filtros de Pesquisa</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Buscador - Destaque principal */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar por título, número de processo, palavra-chave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              
              {/* Filtro de Fontes - Escalabilidade SaaS */}
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full md:w-[280px] h-11">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <SelectValue placeholder="Fonte / Jurisdição" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <strong>Todas as Fontes</strong>
                  </SelectItem>
                  
                  {/* Região Sudeste */}
                  <SelectItem value="header-sudeste" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── REGIÃO SUDESTE ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJSP">
                    DJE - TJSP (Tribunal de Justiça de São Paulo)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJRJ">
                    DJE - TJRJ (Tribunal de Justiça do Rio de Janeiro)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJMG">
                    DJE - TJMG (Tribunal de Justiça de Minas Gerais)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJES">
                    DJE - TJES (Tribunal de Justiça do Espírito Santo)
                  </SelectItem>
                  
                  {/* Região Sul */}
                  <SelectItem value="header-sul" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── REGIÃO SUL ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJPR">
                    DJE - TJPR (Tribunal de Justiça do Paraná)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJSC">
                    DJE - TJSC (Tribunal de Justiça de Santa Catarina)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJRS">
                    DJE - TJRS (Tribunal de Justiça do Rio Grande do Sul)
                  </SelectItem>
                  
                  {/* Região Centro-Oeste */}
                  <SelectItem value="header-centrooeste" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── REGIÃO CENTRO-OESTE ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJDF">
                    DJE - TJDF (Tribunal de Justiça do Distrito Federal)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJGO">
                    DJE - TJGO (Tribunal de Justiça de Goiás)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJMT">
                    DJE - TJMT (Tribunal de Justiça do Mato Grosso)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJMS">
                    DJE - TJMS (Tribunal de Justiça do Mato Grosso do Sul)
                  </SelectItem>
                  
                  {/* Região Nordeste */}
                  <SelectItem value="header-nordeste" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── REGIÃO NORDESTE ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJBA">
                    DJE - TJBA (Tribunal de Justiça da Bahia)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJPE">
                    DJE - TJPE (Tribunal de Justiça de Pernambuco)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJCE">
                    DJE - TJCE (Tribunal de Justiça do Ceará)
                  </SelectItem>
                  
                  {/* Região Norte */}
                  <SelectItem value="header-norte" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── REGIÃO NORTE ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJAM">
                    DJE - TJAM (Tribunal de Justiça do Amazonas)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TJPA">
                    DJE - TJPA (Tribunal de Justiça do Pará)
                  </SelectItem>
                  
                  {/* Tribunais Superiores */}
                  <SelectItem value="header-superiores" disabled className="bg-gray-100 dark:bg-gray-800">
                    <strong className="text-xs">── TRIBUNAIS SUPERIORES ──</strong>
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - STJ">
                    DJE - STJ (Superior Tribunal de Justiça)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - STF">
                    DJE - STF (Supremo Tribunal Federal)
                  </SelectItem>
                  <SelectItem value="Diário de Justiça Eletrônico - TST">
                    DJE - TST (Tribunal Superior do Trabalho)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Info sobre escalabilidade */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Sistema Escalável:</strong> O filtro de fontes suporta todos os tribunais do Brasil. 
                Selecione a jurisdição desejada para visualizar publicações específicas de cada região.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">
              Todas ({publications.length})
            </TabsTrigger>
            <TabsTrigger value="nao-lida" className="relative">
              Não Lidas ({publications.filter(p => p.status === "nao-lida").length})
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="lida">
              Lidas ({publications.filter(p => p.status === "lida").length})
            </TabsTrigger>
            <TabsTrigger value="processada">
              Processadas ({publications.filter(p => p.status === "processada").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {filteredPublications.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Nenhuma publicação encontrada</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Não há publicações que correspondam aos filtros aplicados
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setFilterSource("all");
                }}>
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              filteredPublications
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((publication) => (
                  <div
                    key={publication.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border transition-all ${
                      publication.status === "nao-lida"
                        ? "border-l-4 border-l-red-500 border-t border-r border-b border-gray-200 dark:border-t-gray-700 dark:border-r-gray-700 dark:border-b-gray-700"
                        : "border border-gray-200 dark:border-gray-700"
                    } hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(publication.category)}>
                            {getCategoryLabel(publication.category)}
                          </Badge>
                          {publication.status === "nao-lida" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                              Nova
                            </Badge>
                          )}
                          {publication.priority === "alta" && (
                            <div className={`flex items-center gap-1 ${getPriorityColor(publication.priority)}`}>
                              <AlertCircle className="w-4 h-4" />
                              <span>Alta Prioridade</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-gray-900 dark:text-white mb-1">
                          {publication.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {publication.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{publication.source}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(publication.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {publication.processNumber && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{publication.processNumber}</span>
                            </div>
                          )}
                          {publication.deadline && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                              <AlertCircle className="w-4 h-4" />
                              <span>
                                Prazo: {new Date(publication.deadline).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleVisualizarPublicacao(publication)}
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleMarcarComoLida(publication.id)}
                              disabled={publication.status === "lida" || publication.status === "processada"}
                            >
                              Marcar como lida
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleMarcarComoProcessada(publication.id)}
                              disabled={publication.status === "processada"}
                            >
                              Marcar como processada
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleTraduzirComIA(publication)}
                            >
                              <Languages className="w-4 h-4 mr-2" />
                              Traduzir com IA
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleVincularProcesso(publication)}>
                              Vincular ao processo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCriarTarefa(publication)}>
                              Criar tarefa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBaixarPDF(publication)}>
                              <Download className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleArquivar(publication.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais */}
      <VisualizarPublicacaoModal
        open={showVisualizarModal}
        onOpenChange={setShowVisualizarModal}
        publicacao={selectedPublicacao}
      />

      <EditarPublicacaoModal
        open={showEditarModal}
        onOpenChange={setShowEditarModal}
        publicacao={selectedPublicacao}
      />

      <ExcluirPublicacaoModal
        open={showExcluirModal}
        onOpenChange={setShowExcluirModal}
        publicacao={selectedPublicacao}
      />

      <ConfigurarAlertaModal
        open={showAlertaModal}
        onOpenChange={setShowAlertaModal}
      />

      <VincularProcessoModal
        open={showVincularModal}
        onOpenChange={setShowVincularModal}
        publicacaoTitulo={selectedPublicacao?.title || ""}
        onVincular={handleConfirmarVinculo}
      />

      <NovaTarefaModal
        open={showNovaTarefaModal}
        onOpenChange={setShowNovaTarefaModal}
        publicacaoVinculada={selectedPublicacao?.title}
        onSave={handleSalvarTarefa}
      />
    </div>
  );
}