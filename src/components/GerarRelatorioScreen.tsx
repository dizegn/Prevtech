import { useState, useEffect } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import type { ReportFilters } from "./RelatoriosScreen";

interface GerarRelatorioScreenProps {
  format: "pdf" | "excel";
  filters: ReportFilters;
  onComplete: () => void;
  onCancel: () => void;
}

export function GerarRelatorioScreen({
  format,
  filters,
  onComplete,
  onCancel,
}: GerarRelatorioScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Preparando dados...");

  useEffect(() => {
    const steps = [
      { progress: 20, step: "Coletando dados..." },
      { progress: 40, step: "Aplicando filtros..." },
      { progress: 60, step: "Processando informações..." },
      { progress: 80, step: "Gerando documento..." },
      { progress: 100, step: "Finalizando..." },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < steps.length) {
        setProgress(steps[currentIndex].progress);
        setCurrentStep(steps[currentIndex].step);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003366] dark:bg-[#004080] rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl text-gray-900 dark:text-white mb-2">
              Gerando Relatório
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Formato: {format.toUpperCase()} • {currentStep}
            </p>
          </div>

          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {progress}% concluído
            </p>
          </div>

          {/* Preview Section */}
          {progress > 60 && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Preview</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Tipo:</span> {filters.reportType}</p>
                <p><span className="font-medium">Período:</span> {filters.period}</p>
                <p><span className="font-medium">Equipe:</span> {filters.team}</p>
                <p><span className="font-medium">Status:</span> {filters.billingStatus}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6">
            Data de geração: {new Date().toLocaleString("pt-BR")} • Filtros aplicados: {Object.keys(filters).length}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={progress === 100}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={onComplete}
              className="flex-1 bg-[#003366] hover:bg-[#004080]"
              disabled={progress < 100}
            >
              <FileText className="w-4 h-4 mr-2" />
              Concluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
