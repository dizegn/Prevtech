import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FileText, Clock, CheckCircle2, XCircle, AlertTriangle, Calendar } from "lucide-react";
import { DraggableWidget } from "./DraggableWidget";
import { toast } from "sonner@2.0.3";

interface Widget {
  id: string;
  title: string;
  type: string;
  enabled: boolean;
  width: number;
  height: number;
}

interface EditDashboardScreenProps {
  onSave: () => void;
  onCancel: () => void;
  onRemoveWidget?: (widgetId: string, widgetName: string) => void;
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "w1", title: "Total de Processos", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w2", title: "Processos em Análise", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w3", title: "Processos Aprovados", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w4", title: "Processos Rejeitados", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w5", title: "Alertas de Penalidades", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w6", title: "Prorrogações de Contrato", type: "kpi", enabled: true, width: 400, height: 180 },
  { id: "w7", title: "Tendência de Processos", type: "chart", enabled: true, width: 600, height: 350 },
  { id: "w8", title: "Produtividade", type: "chart", enabled: true, width: 600, height: 350 },
  { id: "w9", title: "Atividades Recentes", type: "list", enabled: true, width: 800, height: 400 },
];

export function EditDashboardScreen({ onSave, onCancel, onRemoveWidget }: EditDashboardScreenProps) {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);

  // Carregar layout salvo do localStorage ao iniciar
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboardLayout");
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setWidgets(parsedLayout);
        toast.success("Layout personalizado carregado com sucesso");
      } catch (error) {
        console.error("Erro ao carregar layout salvo:", error);
        toast.error("Erro ao carregar layout personalizado");
      }
    }
  }, []);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const handleResize = (id: string, width: number, height: number) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, width, height } : w));
  };

  const handleSaveLayout = () => {
    try {
      localStorage.setItem("dashboardLayout", JSON.stringify(widgets));
      toast.success("Layout salvo com sucesso!");
      onSave();
    } catch (error) {
      console.error("Erro ao salvar layout:", error);
      toast.error("Erro ao salvar layout");
    }
  };

  const handleResetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem("dashboardLayout");
    toast.success("Layout resetado para o padrão");
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "kpi": return FileText;
      case "chart": return Clock;
      default: return CheckCircle2;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6 overflow-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl">Editar Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Selecione, arraste e redimensione os widgets do seu dashboard
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetLayout}>
              Resetar
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLayout} className="bg-[#003366] hover:bg-[#004080]">
              Salvar Layout
            </Button>
          </div>
        </div>

        {/* Widget Selection Panel */}
        <Card className="p-6">
          <h3 className="text-lg mb-4">Widgets Disponíveis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {widgets.map((widget) => {
              const Icon = getWidgetIcon(widget.type);
              return (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    widget.enabled
                      ? "border-[#003366] bg-[#003366]/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${widget.enabled ? "text-[#003366]" : "text-gray-400"}`} />
                  <p className="text-sm font-medium">{widget.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {widget.enabled ? "Ativo" : "Inativo"}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Widget Preview Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 min-h-[600px]">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Arraste e redimensione os widgets abaixo. As bordas tracejadas aparecem apenas no modo de edição.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.filter(w => w.enabled).map((widget) => (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                isEditing={true}
                width={widget.width}
                height={widget.height}
                onResize={(w, h) => handleResize(widget.id, w, h)}
                onRemove={() => onRemoveWidget?.(widget.id, widget.title)}
              >
                <Card className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-medium">{widget.title}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {widget.width}x{widget.height}px
                    </p>
                  </div>
                </Card>
              </DraggableWidget>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
            <div className="text-sm text-gray-800 dark:text-gray-200">
              <p className="font-medium mb-1">Dicas de Personalização:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Clique nos widgets acima para ativar/desativar</li>
                <li>Arraste os widgets para reorganizar a posição</li>
                <li>Use as bordas dos widgets para redimensionar</li>
                <li>Clique no botão X para remover um widget temporariamente</li>
                <li>Clique em "Salvar Layout" para manter suas alterações</li>
                <li>Clique em "Resetar" para voltar ao layout padrão</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DndProvider>
  );
}