import React, { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Archive, MoreHorizontal, Users, UserCheck, UserPlus, Tag, FileText, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { CadastroClienteModal } from "./CadastroClienteModal";
import { EditarClienteModal } from "./EditarClienteModal";
import { InativarContatoModal } from "./InativarContatoModal";
import { GerarKitContratualModal } from "./GerarKitContratualModal";
import { DetalhesClientePanel } from "./DetalhesClientePanel";
import { Breadcrumb } from "./Breadcrumb";
import { toast } from "sonner@2.0.3";

// Dados mockados para demonstração
const mockClientes = [
  {
    id: "1",
    nome: "João Silva Santos",
    cpfCnpj: "123.456.789-00",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    status: "ativo" as const,
    etiquetas: ["VIP", "Previdenciário"],
    dataCadastro: "2024-01-15",
    ultimoContato: "2024-10-18",
    temDadosINSS: true
  },
  {
    id: "2", 
    nome: "Maria Oliveira Costa",
    cpfCnpj: "987.654.321-00",
    email: "maria.oliveira@email.com",
    telefone: "(11) 91234-5678",
    status: "prospect" as const,
    etiquetas: ["Trabalhista"],
    dataCadastro: "2024-10-10",
    ultimoContato: "2024-10-15",
    temDadosINSS: false
  },
  {
    id: "3",
    nome: "Empresa ABC Ltda",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@empresaabc.com.br",
    telefone: "(11) 3456-7890",
    status: "ativo" as const,
    etiquetas: ["Corporativo", "Tributário"],
    dataCadastro: "2024-02-20",
    ultimoContato: "2024-10-20",
    temDadosINSS: false
  },
  {
    id: "4",
    nome: "Pedro Henrique Lima",
    cpfCnpj: "456.789.123-45",
    email: "pedro.lima@email.com",
    telefone: "(11) 97777-8888",
    status: "arquivado" as const,
    etiquetas: ["Criminal"],
    dataCadastro: "2024-03-05",
    ultimoContato: "2024-08-10",
    temDadosINSS: false
  }
];

type ClienteStatus = "ativo" | "prospect" | "arquivado";

interface ContatosScreenProps {
  onNavigate?: (screen: string) => void;
}

export function ContatosScreen({ onNavigate }: ContatosScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [etiquetaFilter, setEtiquetaFilter] = useState<string>("todas");
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [showEditarClienteModal, setShowEditarClienteModal] = useState(false);
  const [showInativarModal, setShowInativarModal] = useState(false);
  const [showKitContratualModal, setShowKitContratualModal] = useState(false);
  const [showDetalhesPanel, setShowDetalhesPanel] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<typeof mockClientes[0] | null>(null);
  const [clienteParaInativar, setClienteParaInativar] = useState<{ id: string; nome: string } | null>(null);
  const [clienteParaKitContratual, setClienteParaKitContratual] = useState<typeof mockClientes[0] | null>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState<typeof mockClientes[0] | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Filtrar clientes baseado nos filtros aplicados
  const clientesFiltrados = mockClientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cpfCnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter;
    
    const matchesEtiqueta = etiquetaFilter === "todas" || 
                           cliente.etiquetas.some(etiqueta => 
                             etiqueta.toLowerCase().includes(etiquetaFilter.toLowerCase())
                           );
    
    return matchesSearch && matchesStatus && matchesEtiqueta;
  });

  // Estatísticas dos contatos
  const estatisticas = {
    total: mockClientes.length,
    ativos: mockClientes.filter(c => c.status === "ativo").length,
    prospects: mockClientes.filter(c => c.status === "prospect").length,
    comDadosINSS: mockClientes.filter(c => c.temDadosINSS).length
  };

  const getStatusBadge = (status: ClienteStatus) => {
    const configs = {
      ativo: { label: "Ativo", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
      prospect: { label: "Prospect", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
      arquivado: { label: "Arquivado", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300" }
    };
    
    const config = configs[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleVerDetalhes = (cliente: typeof mockClientes[0]) => {
    setClienteSelecionado(cliente);
    setShowDetalhesPanel(true);
  };

  const handleEditarCliente = (cliente: typeof mockClientes[0]) => {
    setClienteParaEditar(cliente);
    setShowEditarClienteModal(true);
  };

  const handleEditarCadastroFromPanel = () => {
    if (clienteSelecionado) {
      setClienteParaEditar(clienteSelecionado);
      setShowEditarClienteModal(true);
      setShowDetalhesPanel(false);
    }
  };

  const handleInativarContatoFromPanel = () => {
    if (clienteSelecionado) {
      setClienteParaInativar({ id: clienteSelecionado.id, nome: clienteSelecionado.nome });
      setShowInativarModal(true);
      setShowDetalhesPanel(false);
    }
  };

  const handleGerarKitContratualFromPanel = () => {
    if (clienteSelecionado) {
      setClienteParaKitContratual(clienteSelecionado);
      setShowKitContratualModal(true);
      setShowDetalhesPanel(false);
    }
  };

  const handleVisualizarProcessosFromPanel = () => {
    if (clienteSelecionado) {
      handleVisualizarProcessos(clienteSelecionado);
      setShowDetalhesPanel(false);
    }
  };

  const handleInativarCliente = (cliente: typeof mockClientes[0]) => {
    setClienteParaInativar({ id: cliente.id, nome: cliente.nome });
    setShowInativarModal(true);
  };

  const handleConfirmarInativacao = () => {
    setIsProcessingAction(true);
    
    // Simular processamento
    setTimeout(() => {
      setIsProcessingAction(false);
      setShowInativarModal(false);
      toast.success(`Cliente "${clienteParaInativar?.nome}" foi inativado com sucesso`);
      setClienteParaInativar(null);
    }, 1500);
  };

  const handleGerarKitContratual = (cliente: typeof mockClientes[0]) => {
    setClienteParaKitContratual(cliente);
    setShowKitContratualModal(true);
  };

  const handleConfirmarGeracaoKit = (data: any) => {
    setIsProcessingAction(true);
    
    // Simular processamento
    setTimeout(() => {
      setIsProcessingAction(false);
      setShowKitContratualModal(false);
      toast.success(`Kit contratual gerado e enviado para ${data.emailDestinatario}`);
      setClienteParaKitContratual(null);
    }, 2000);
  };

  const handleVisualizarProcessos = (cliente: typeof mockClientes[0]) => {
    // Navegar para tela de processos com filtro do cliente
    toast.info(`Navegando para processos do cliente: ${cliente.nome}`);
    
    // Se a prop onNavigate estiver disponível, usar para navegar
    if (onNavigate) {
      onNavigate("processos");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header e Breadcrumb */}
      <div className="space-y-4">
        <Breadcrumb
          items={[
            { label: "Clientes", href: "#" }
          ]}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl text-black dark:text-white">Clientes</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus clientes e prospects
            </p>
          </div>
          
          <Button 
            onClick={() => setShowNovoClienteModal(true)}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl text-black dark:text-white">{estatisticas.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativos</p>
              <p className="text-2xl text-black dark:text-white">{estatisticas.ativos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <UserPlus className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prospects</p>
              <p className="text-2xl text-black dark:text-white">{estatisticas.prospects}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Com Dados INSS</p>
              <p className="text-2xl text-black dark:text-white">{estatisticas.comDadosINSS}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
              <SelectItem value="arquivado">Arquivados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={etiquetaFilter} onValueChange={setEtiquetaFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Etiquetas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Etiquetas</SelectItem>
              <SelectItem value="previdenciário">Previdenciário</SelectItem>
              <SelectItem value="trabalhista">Trabalhista</SelectItem>
              <SelectItem value="corporativo">Corporativo</SelectItem>
              <SelectItem value="criminal">Criminal</SelectItem>
              <SelectItem value="tributário">Tributário</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabela de Contatos */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Etiquetas</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Dados INSS</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Nenhum cliente encontrado
                      </p>
                      {(searchTerm || statusFilter !== "todos" || etiquetaFilter !== "todas") && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("todos");
                            setEtiquetaFilter("todas");
                          }}
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <TableCell>
                      <div>
                        <p className="text-black dark:text-white">{cliente.nome}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.cpfCnpj}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{cliente.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(cliente.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cliente.etiquetas.map((etiqueta) => (
                          <Badge key={etiqueta} variant="outline" className="text-xs">
                            {etiqueta}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                      </p>
                    </TableCell>
                    <TableCell>
                      {cliente.temDadosINSS ? (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs">
                          Configurado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Não configurado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        type="button"
                        variant="ghost" 
                        className="h-8 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleVerDetalhes(cliente)}
                        aria-label="Ver detalhes do cliente"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span>Ver Detalhes</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modals */}
      <CadastroClienteModal
        open={showNovoClienteModal}
        onOpenChange={setShowNovoClienteModal}
      />

      {clienteParaEditar && (
        <EditarClienteModal
          open={showEditarClienteModal}
          onOpenChange={setShowEditarClienteModal}
          cliente={clienteParaEditar}
        />
      )}

      {clienteParaInativar && (
        <InativarContatoModal
          open={showInativarModal}
          onOpenChange={setShowInativarModal}
          clienteNome={clienteParaInativar.nome}
          onConfirm={handleConfirmarInativacao}
          isLoading={isProcessingAction}
        />
      )}

      {clienteParaKitContratual && (
        <GerarKitContratualModal
          open={showKitContratualModal}
          onOpenChange={setShowKitContratualModal}
          clienteNome={clienteParaKitContratual.nome}
          clienteEmail={clienteParaKitContratual.email}
          onGerar={handleConfirmarGeracaoKit}
          isLoading={isProcessingAction}
        />
      )}

      {/* Painel de Detalhes do Cliente */}
      <DetalhesClientePanel
        open={showDetalhesPanel}
        onOpenChange={setShowDetalhesPanel}
        cliente={clienteSelecionado}
        onEditarCadastro={handleEditarCadastroFromPanel}
        onInativarContato={handleInativarContatoFromPanel}
        onGerarKitContratual={handleGerarKitContratualFromPanel}
        onVisualizarProcessos={handleVisualizarProcessosFromPanel}
      />
      </div>
    </div>
  );
}