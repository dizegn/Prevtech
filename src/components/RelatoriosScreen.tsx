import { useState } from "react";
import { FileText, Filter, FileSpreadsheet } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Breadcrumb } from "./Breadcrumb";

interface RelatoriosScreenProps {
  onGenerateReport: (format: "pdf" | "excel", filters: ReportFilters) => void;
  onNavigateHome?: () => void;
}

export interface ReportFilters {
  reportType: string;
  period: string;
  team?: string;
  collaborator?: string;
  tag?: string;
  billingStatus?: string;
}

const reportTypes = [
  { id: "contratos", name: "Relatório de Contratos", description: "Análise completa de contratos ativos e inativos" },
  { id: "processos", name: "Relatório de Processos", description: "Acompanhamento de processos jurídicos" },
  { id: "financeiro", name: "Relatório Financeiro", description: "Faturamento, inadimplência e projeções" },
  { id: "produtividade", name: "Relatório de Produtividade", description: "Análise de desempenho por equipe e colaborador" },
  { id: "kpis", name: "Relatório de KPIs", description: "Dashboard executivo consolidado" },
];

export function RelatoriosScreen({ onGenerateReport, onNavigateHome }: RelatoriosScreenProps) {
  const [selectedReport, setSelectedReport] = useState("contratos");
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: "contratos",
    period: "last-30-days",
    team: "todas",
    collaborator: "todos",
    tag: "todas",
    billingStatus: "todos",
  });

  const handleGeneratePDF = () => {
    onGenerateReport("pdf", { ...filters, reportType: selectedReport });
  };

  const handleGenerateExcel = () => {
    onGenerateReport("excel", { ...filters, reportType: selectedReport });
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Relatórios", onClick: onNavigateHome }
          ]}
        />

        <div>
          <h1 className="text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gere relatórios customizados com filtros avançados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg text-gray-900 dark:text-white">Catálogo de Relatórios</h2>
            {reportTypes.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all ${
                  selectedReport === report.id
                    ? "border-black dark:border-gray-400 shadow-md"
                    : "hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-black dark:text-gray-300 mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Filters Panel */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Filtros Avançados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Period Filter */}
                <div>
                  <Label>Período</Label>
                  <Select
                    value={filters.period}
                    onValueChange={(value) => setFilters({ ...filters, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                      <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                      <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
                      <SelectItem value="this-year">Este ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Filter */}
                <div>
                  <Label>Equipe</Label>
                  <Select
                    value={filters.team}
                    onValueChange={(value) => setFilters({ ...filters, team: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as equipes</SelectItem>
                      <SelectItem value="juridico">Jurídico</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collaborator Filter */}
                <div>
                  <Label>Colaborador</Label>
                  <Select
                    value={filters.collaborator}
                    onValueChange={(value) => setFilters({ ...filters, collaborator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="maria-silva">Maria Silva</SelectItem>
                      <SelectItem value="joao-santos">João Santos</SelectItem>
                      <SelectItem value="ana-costa">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag Filter */}
                <div>
                  <Label>Etiqueta</Label>
                  <Select
                    value={filters.tag}
                    onValueChange={(value) => setFilters({ ...filters, tag: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="prioritario">Prioritário</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Billing Status Filter */}
                <div>
                  <Label>Status de Cobrança</Label>
                  <Select
                    value={filters.billingStatus}
                    onValueChange={(value) => setFilters({ ...filters, billingStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button onClick={handleGeneratePDF} className="w-full bg-black hover:bg-black/90 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar PDF
                  </Button>
                  <Button onClick={handleGenerateExcel} variant="outline" className="w-full">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Gerar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
