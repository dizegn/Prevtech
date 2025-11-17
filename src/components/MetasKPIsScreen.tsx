import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Breadcrumb } from "./Breadcrumb";

interface MetasKPIsScreenProps {
  onNewMeta: () => void;
  onEditMeta: (id: string) => void;
  onDeleteMeta: (id: string, name: string) => void;
  onNavigateHome?: () => void;
}

interface Meta {
  id: string;
  kpi: string;
  baseline: number;
  meta: number;
  current: number;
  prazo: string;
  fonte: string;
  progress: number;
}

const mockMetas: Meta[] = [
  {
    id: "1",
    kpi: "Contratos Ativos",
    baseline: 120,
    meta: 150,
    current: 138,
    prazo: "31/12/2025",
    fonte: "Sistema CRM",
    progress: 60,
  },
  {
    id: "2",
    kpi: "Taxa de Conversão",
    baseline: 25,
    meta: 35,
    current: 32,
    prazo: "30/06/2025",
    fonte: "Google Analytics",
    progress: 70,
  },
  {
    id: "3",
    kpi: "Receita Mensal (R$)",
    baseline: 500000,
    meta: 750000,
    current: 625000,
    prazo: "31/12/2025",
    fonte: "Sistema Financeiro",
    progress: 50,
  },
  {
    id: "4",
    kpi: "NPS (Net Promoter Score)",
    baseline: 65,
    meta: 80,
    current: 73,
    prazo: "30/09/2025",
    fonte: "Pesquisa de Satisfação",
    progress: 53,
  },
];

export function MetasKPIsScreen({ onNewMeta, onEditMeta, onDeleteMeta, onNavigateHome }: MetasKPIsScreenProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "text-green-600 dark:text-green-500";
    if (progress >= 50) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Metas e KPIs", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Metas e KPIs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Defina e acompanhe indicadores de desempenho
            </p>
          </div>
          <Button onClick={onNewMeta} className="bg-black hover:bg-black/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead>Baseline</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Atual</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMetas.map((meta) => (
                <TableRow key={meta.id}>
                  <TableCell>{meta.kpi}</TableCell>
                  <TableCell>{meta.baseline.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{meta.meta.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    <span className={getProgressColor(meta.progress)}>
                      {meta.current.toLocaleString("pt-BR")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <Progress value={meta.progress} className="flex-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                        {meta.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{meta.prazo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{meta.fonte}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditMeta(meta.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteMeta(meta.id, meta.kpi)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-gray-200">
            <strong>Nota:</strong> As metas definidas aqui são exibidas nos cards do Dashboard com acompanhamento
            em tempo real. Permissões RBAC são aplicadas por perfil de usuário.
          </p>
        </div>
      </div>
    </div>
  );
}