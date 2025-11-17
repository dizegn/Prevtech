import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { FileText, Calendar, Building2, User, DollarSign, Scale, Calculator, Shield } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { useState } from "react";
import { ModuloContagemM07Modal } from "./ModuloContagemM07Modal";

interface VisualizarProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processo: {
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
  } | null;
}

export function VisualizarProcessoModal({ open, onOpenChange, processo }: VisualizarProcessoModalProps) {
  const [showM07Modal, setShowM07Modal] = useState(false);
  
  if (!processo) return null;

  // Verificar se é processo previdenciário (simulação)
  const isProcessoPrevidenciario = processo.title.toLowerCase().includes("aposentadoria") || 
                                    processo.title.toLowerCase().includes("inss") ||
                                    processo.title.toLowerCase().includes("previdenciário");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{processo.title}</DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos deste processo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(processo.status)}>
                {getStatusLabel(processo.status)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Número do Processo
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {processo.number}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Cliente
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {processo.client}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Comarca
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {processo.court}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Responsável
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {processo.responsible}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor da Causa
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatCurrency(processo.value)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Fase Processual
                </label>
                <p className="text-gray-900 dark:text-white">
                  {processo.phase}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Última Atualização
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(processo.lastUpdate).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {processo.nextHearing && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Próxima Audiência
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(processo.nextHearing).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {isProcessoPrevidenciario && (
          <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <div>
                <strong>Processo Previdenciário Detectado:</strong> Este processo possui integração com o INSS. 
                Acesse o Módulo de Contagem (M07) para análise automatizada de tempo de contribuição.
              </div>
              <Button 
                variant="outline" 
                className="gap-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex-shrink-0"
                onClick={() => setShowM07Modal(true)}
              >
                <Calculator className="w-4 h-4" />
                Acessar M07
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>

      <ModuloContagemM07Modal 
        open={showM07Modal} 
        onOpenChange={setShowM07Modal}
        processData={processo}
      />
    </Dialog>
  );
}