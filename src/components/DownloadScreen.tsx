import { FileText, FileSpreadsheet, Download, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { ReportFilters } from "./RelatoriosScreen";

interface DownloadScreenProps {
  format: "pdf" | "excel";
  filters: ReportFilters;
  onBack: () => void;
}

export function DownloadScreen({ format, filters, onBack }: DownloadScreenProps) {
  const generatedAt = new Date().toLocaleString("pt-BR");
  const fileName = `relatorio_${filters.reportType}_${new Date().getTime()}`;

  const handleDownload = (fileFormat: string) => {
    // In a real app, this would trigger actual file download
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${fileName}.${fileFormat}`;
    link.click();
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h2 className="text-xl text-gray-900 dark:text-white mb-2">
              Relatório Gerado com Sucesso!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Seus arquivos estão prontos para download
            </p>
          </div>

          {/* Download Cards */}
          <div className="space-y-4 mb-8">
            {/* PDF */}
            <Card className="border-2 border-[#003366] dark:border-[#004080]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-1">
                        {fileName}.pdf
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        PDF • Pronto para visualização
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload("pdf")}
                    className="bg-[#003366] hover:bg-[#004080]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Excel */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-1">
                        {fileName}.xlsx
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Excel • Pronto para edição
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload("xlsx")}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
            <h3 className="text-sm text-gray-900 dark:text-white mb-3">Metadados do Relatório</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Data/Hora de Geração:</span> {generatedAt}</p>
              <p><span className="font-medium">Tipo de Relatório:</span> {filters.reportType}</p>
              <p><span className="font-medium">Período:</span> {filters.period}</p>
              <p><span className="font-medium">Equipe:</span> {filters.team}</p>
              <p><span className="font-medium">Colaborador:</span> {filters.collaborator}</p>
              <p><span className="font-medium">Status de Cobrança:</span> {filters.billingStatus}</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Relatórios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}