import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { LoginScreen } from "./components/LoginScreen";
import { NotificationPanel } from "./components/NotificationPanel";
import { DashboardScreen } from "./components/DashboardScreen";
import { EditDashboardScreen } from "./components/EditDashboardScreen";
import { SaveLayoutModal } from "./components/SaveLayoutModal";
import { RemoveWidgetModal } from "./components/RemoveWidgetModal";
import { DetailedListScreen } from "./components/DetailedListScreen";
import { TarefasScreen } from "./components/TarefasScreen";
import { ProcessosScreen } from "./components/ProcessosScreen";
import { AgendaScreen } from "./components/AgendaScreen";
import { PublicacoesScreen } from "./components/PublicacoesScreen";
import { RelatoriosScreen, type ReportFilters } from "./components/RelatoriosScreen";
import { GerarRelatorioScreen } from "./components/GerarRelatorioScreen";
import { CancelarGeracaoModal } from "./components/CancelarGeracaoModal";
import { DownloadScreen } from "./components/DownloadScreen";
import { MetasKPIsScreen } from "./components/MetasKPIsScreen";
import { FormMeta, type MetaFormData } from "./components/FormMeta";
import { ExcluirMetaModal } from "./components/ExcluirMetaModal";
import { PermissoesScreen } from "./components/PermissoesScreen";
import { MatrizPermissoesScreen, type PermissionChange } from "./components/MatrizPermissoesScreen";
import { ConfirmarAlteracoesModal } from "./components/ConfirmarAlteracoesModal";
import { LogsAlteracaoScreen } from "./components/LogsAlteracaoScreen";
import { IntegracoesScreen } from "./components/IntegracoesScreen";
import { DetalheIntegracaoScreen } from "./components/DetalheIntegracaoScreen";
import { RetestarConexaoModal } from "./components/RetestarConexaoModal";
import { ConfiguracoesScreen } from "./components/ConfiguracoesScreen";
import { ContatosScreen } from "./components/ContatosScreen";
import { TraduzirIAScreen } from "./components/TraduzirIAScreen";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { NovaTarefaModal } from "./components/NovaTarefaModal";
import { NovoProcessoModal } from "./components/NovoProcessoModal";
import { NovoEventoModal } from "./components/NovoEventoModal";

type Screen = 
  | "dashboard" 
  | "edit-dashboard"
  | "detailed-list"
  | "tarefas"
  | "processos"
  | "agenda"
  | "publicacoes"
  | "traduzir-ia"
  | "relatorios"
  | "gerar-relatorio"
  | "download"
  | "metas-kpis"
  | "form-meta"
  | "permissoes"
  | "matriz-permissoes"
  | "logs-alteracao"
  | "integracoes"
  | "detalhe-integracao"
  | "contatos"
  | "configuracoes";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRemoveWidgetModal, setShowRemoveWidgetModal] = useState(false);
  const [showCancelarGeracaoModal, setShowCancelarGeracaoModal] = useState(false);
  const [showExcluirMetaModal, setShowExcluirMetaModal] = useState(false);
  const [showConfirmarAlteracoesModal, setShowConfirmarAlteracoesModal] = useState(false);
  const [showRetestarModal, setShowRetestarModal] = useState(false);
  const [showNovaTarefaModal, setShowNovaTarefaModal] = useState(false);
  const [showNovoProcessoModal, setShowNovoProcessoModal] = useState(false);
  const [showNovoEventoModal, setShowNovoEventoModal] = useState(false);
  
  // Data states
  const [widgetToRemove, setWidgetToRemove] = useState({ id: "", name: "" });
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel">("pdf");
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    reportType: "contratos",
    period: "last-30-days",
  });
  const [detailedListTitle, setDetailedListTitle] = useState("");
  const [detailedListFilters, setDetailedListFilters] = useState<Record<string, string>>({});
  const [metaToEdit, setMetaToEdit] = useState<string | undefined>();
  const [metaToDelete, setMetaToDelete] = useState({ id: "", name: "" });
  const [permissionChanges, setPermissionChanges] = useState<PermissionChange[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState({ id: "", name: "" });
  const [selectedPublicacaoForIA, setSelectedPublicacaoForIA] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleNotificationsClick = () => {
    setShowNotifications(prev => !prev);
  };

  // Auth flows
  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Usuário ou senha inválidos");
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("dashboard");
    setActiveMenuItem("dashboard");
    toast.info("Logout realizado com sucesso");
  };

  // Dashboard flows
  const handleEditDashboard = () => {
    setCurrentScreen("edit-dashboard");
  };

  const handleCancelEdit = () => {
    setCurrentScreen("dashboard");
    toast.info("Edição cancelada");
  };

  const handleSaveLayout = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = (layoutName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSaveModal(false);
      setCurrentScreen("dashboard");
      toast.success(`Layout "${layoutName}" salvo com sucesso!`);
    }, 1500);
  };

  const handleRemoveWidget = (widgetId: string, widgetName: string) => {
    setWidgetToRemove({ id: widgetId, name: widgetName });
    setShowRemoveWidgetModal(true);
  };

  const handleConfirmRemoveWidget = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRemoveWidgetModal(false);
      toast.success(`Widget "${widgetToRemove.name}" removido`);
    }, 1000);
  };

  const handleDrillDown = (title: string, filters: Record<string, string>) => {
    setDetailedListTitle(title);
    setDetailedListFilters(filters);
    setCurrentScreen("detailed-list");
  };

  // Reports flows
  const handleGenerateReport = (format: "pdf" | "excel", filters: ReportFilters) => {
    setReportFormat(format);
    setReportFilters(filters);
    setCurrentScreen("gerar-relatorio");
  };

  const handleCompleteReport = () => {
    setCurrentScreen("download");
  };

  const handleCancelReport = () => {
    setShowCancelarGeracaoModal(true);
  };

  const handleConfirmCancelReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCancelarGeracaoModal(false);
      setCurrentScreen("relatorios");
      toast.info("Geração de relatório cancelada");
    }, 1000);
  };

  const handleBackToRelatorios = () => {
    setCurrentScreen("relatorios");
  };

  // Metas/KPIs flows
  const handleNewMeta = () => {
    setMetaToEdit(undefined);
    setCurrentScreen("form-meta");
  };

  const handleEditMeta = (metaId: string) => {
    setMetaToEdit(metaId);
    setCurrentScreen("form-meta");
  };

  const handleDeleteMeta = (metaId: string, metaName: string) => {
    setMetaToDelete({ id: metaId, name: metaName });
    setShowExcluirMetaModal(true);
  };

  const handleConfirmDeleteMeta = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowExcluirMetaModal(false);
      toast.success(`Meta "${metaToDelete.name}" excluída com sucesso`);
    }, 1000);
  };

  const handleSaveMeta = (data: MetaFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen("metas-kpis");
      toast.success(metaToEdit ? "Meta atualizada com sucesso!" : "Meta criada com sucesso!");
    }, 1500);
  };

  const handleCancelMeta = () => {
    setCurrentScreen("metas-kpis");
    toast.info("Operação cancelada");
  };

  // Permissoes flows
  const handleEditMatrix = () => {
    setCurrentScreen("matriz-permissoes");
  };

  const handleViewLogs = () => {
    setCurrentScreen("logs-alteracao");
  };

  const handleSavePermissions = (changes: PermissionChange[]) => {
    setPermissionChanges(changes);
    setShowConfirmarAlteracoesModal(true);
  };

  const handleConfirmPermissions = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmarAlteracoesModal(false);
      setCurrentScreen("permissoes");
      toast.success("Permissões atualizadas com sucesso!");
    }, 1500);
  };

  const handleCancelPermissions = () => {
    setCurrentScreen("permissoes");
    toast.info("Edição de permissões cancelada");
  };

  // Integracoes flows
  const handleSelectIntegration = (id: string, name: string) => {
    setSelectedIntegration({ id, name });
    setCurrentScreen("detalhe-integracao");
  };

  const handleRetestConnection = () => {
    setShowRetestarModal(true);
  };

  const handleConfirmRetest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRetestarModal(false);
      setCurrentScreen("integracoes");
      toast.success("Conexão testada com sucesso!");
    }, 2000);
  };

  // Tarefas flows
  const handleNewTask = () => {
    setShowNovaTarefaModal(true);
  };

  const handleSaveTask = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowNovaTarefaModal(false);
      toast.success("Tarefa criada com sucesso!");
    }, 1500);
  };

  // Processos flows
  const handleNewProcess = () => {
    setShowNovoProcessoModal(true);
  };

  const handleSaveProcess = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowNovoProcessoModal(false);
      toast.success("Processo criado com sucesso!");
    }, 1500);
  };

  // Agenda flows
  const handleNewEvent = () => {
    setShowNovoEventoModal(true);
  };

  const handleSaveEvent = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowNovoEventoModal(false);
      toast.success("Evento criado com sucesso!");
    }, 1500);
  };

  // Publicacoes / Traduzir IA flows
  const handleNavigateToTraduzirIA = (publicacao: any) => {
    setSelectedPublicacaoForIA(publicacao);
    setCurrentScreen("traduzir-ia");
  };

  const handleBackFromTraduzirIA = () => {
    setCurrentScreen("publicacoes");
    setSelectedPublicacaoForIA(null);
  };

  // Menu navigation
  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    
    switch (item) {
      case "dashboard":
        setCurrentScreen("dashboard");
        break;
      case "tarefas":
        setCurrentScreen("tarefas");
        break;
      case "processos":
        setCurrentScreen("processos");
        break;
      case "agenda":
        setCurrentScreen("agenda");
        break;
      case "publicacoes":
        setCurrentScreen("publicacoes");
        break;
      case "relatorios":
        setCurrentScreen("relatorios");
        break;
      case "metas":
        setCurrentScreen("metas-kpis");
        break;
      case "permissoes":
        setCurrentScreen("permissoes");
        break;
      case "integracoes":
        setCurrentScreen("integracoes");
        break;
      case "contatos":
        setCurrentScreen("contatos");
        break;
      case "configuracoes":
        setCurrentScreen("configuracoes");
        break;
      default:
        toast.info(`Navegando para ${item}`);
    }
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeItem={activeMenuItem} 
        onItemClick={handleMenuItemClick}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          theme={theme} 
          onThemeToggle={handleThemeToggle}
          onNotificationsClick={handleNotificationsClick}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-hidden">
          {/* Dashboard */}
          {currentScreen === "dashboard" && (
            <DashboardScreen 
              onEditClick={handleEditDashboard}
              onDrillDown={handleDrillDown}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}
          
          {currentScreen === "edit-dashboard" && (
            <EditDashboardScreen 
              onSave={handleSaveLayout}
              onCancel={handleCancelEdit}
              onRemoveWidget={handleRemoveWidget}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "detailed-list" && (
            <DetailedListScreen
              title={detailedListTitle}
              filters={detailedListFilters}
              onBack={() => setCurrentScreen("dashboard")}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Tarefas */}
          {currentScreen === "tarefas" && (
            <TarefasScreen 
              onNewTask={handleNewTask}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Processos */}
          {currentScreen === "processos" && (
            <ProcessosScreen 
              onNewProcess={handleNewProcess}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Agenda */}
          {currentScreen === "agenda" && (
            <AgendaScreen 
              onNewEvent={handleNewEvent}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Publicacoes */}
          {currentScreen === "publicacoes" && (
            <PublicacoesScreen 
              onNavigateHome={() => setCurrentScreen("dashboard")}
              onNavigateToTraduzirIA={handleNavigateToTraduzirIA}
            />
          )}

          {/* Traduzir com IA */}
          {currentScreen === "traduzir-ia" && (
            <TraduzirIAScreen
              publicacao={selectedPublicacaoForIA}
              onNavigateBack={handleBackFromTraduzirIA}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Relatorios */}
          {currentScreen === "relatorios" && (
            <RelatoriosScreen 
              onGenerateReport={handleGenerateReport}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "gerar-relatorio" && (
            <GerarRelatorioScreen
              format={reportFormat}
              filters={reportFilters}
              onComplete={handleCompleteReport}
              onCancel={handleCancelReport}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "download" && (
            <DownloadScreen
              format={reportFormat}
              filters={reportFilters}
              onBack={handleBackToRelatorios}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Metas/KPIs */}
          {currentScreen === "metas-kpis" && (
            <MetasKPIsScreen
              onNewMeta={handleNewMeta}
              onEditMeta={handleEditMeta}
              onDeleteMeta={handleDeleteMeta}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "form-meta" && (
            <FormMeta
              metaId={metaToEdit}
              onSave={handleSaveMeta}
              onCancel={handleCancelMeta}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Permissoes */}
          {currentScreen === "permissoes" && (
            <PermissoesScreen
              onEditMatrix={handleEditMatrix}
              onViewLogs={handleViewLogs}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "matriz-permissoes" && (
            <MatrizPermissoesScreen
              onSave={handleSavePermissions}
              onCancel={handleCancelPermissions}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "logs-alteracao" && (
            <LogsAlteracaoScreen
              onBack={() => setCurrentScreen("permissoes")}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Integracoes */}
          {currentScreen === "integracoes" && (
            <IntegracoesScreen
              onSelectIntegration={handleSelectIntegration}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {currentScreen === "detalhe-integracao" && (
            <DetalheIntegracaoScreen
              integrationName={selectedIntegration.name}
              onBack={() => setCurrentScreen("integracoes")}
              onRetest={handleRetestConnection}
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}

          {/* Contatos */}
          {currentScreen === "contatos" && (
            <ContatosScreen 
              onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            />
          )}

          {/* Configuracoes */}
          {currentScreen === "configuracoes" && (
            <ConfiguracoesScreen 
              onNavigateHome={() => setCurrentScreen("dashboard")}
            />
          )}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Modals */}
      <SaveLayoutModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleConfirmSave}
        isLoading={isLoading}
      />

      <RemoveWidgetModal
        open={showRemoveWidgetModal}
        onOpenChange={setShowRemoveWidgetModal}
        widgetName={widgetToRemove.name}
        onConfirm={handleConfirmRemoveWidget}
        isLoading={isLoading}
      />

      <CancelarGeracaoModal
        open={showCancelarGeracaoModal}
        onOpenChange={setShowCancelarGeracaoModal}
        onConfirm={handleConfirmCancelReport}
        isLoading={isLoading}
      />

      <ExcluirMetaModal
        open={showExcluirMetaModal}
        onOpenChange={setShowExcluirMetaModal}
        metaName={metaToDelete.name}
        onConfirm={handleConfirmDeleteMeta}
        isLoading={isLoading}
      />

      <ConfirmarAlteracoesModal
        open={showConfirmarAlteracoesModal}
        onOpenChange={setShowConfirmarAlteracoesModal}
        changes={permissionChanges}
        onConfirm={handleConfirmPermissions}
        isLoading={isLoading}
      />

      <RetestarConexaoModal
        open={showRetestarModal}
        onOpenChange={setShowRetestarModal}
        integrationName={selectedIntegration.name}
        onConfirm={handleConfirmRetest}
        isLoading={isLoading}
      />

      <NovaTarefaModal
        open={showNovaTarefaModal}
        onOpenChange={setShowNovaTarefaModal}
        onSave={handleSaveTask}
        isLoading={isLoading}
      />

      <NovoProcessoModal
        open={showNovoProcessoModal}
        onOpenChange={setShowNovoProcessoModal}
        onSave={handleSaveProcess}
        isLoading={isLoading}
      />

      <NovoEventoModal
        open={showNovoEventoModal}
        onOpenChange={setShowNovoEventoModal}
        onSave={handleSaveEvent}
        isLoading={isLoading}
      />

      <Toaster />
    </div>
  );
}