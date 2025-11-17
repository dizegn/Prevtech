import { FileText, Clock, CheckCircle2, XCircle, AlertTriangle, Calendar } from "lucide-react";
import { KPICard } from "./KPICard";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardScreenProps {
  onEditClick: () => void;
  onDrillDown?: (title: string, filters: Record<string, string>) => void;
}

const chartData = [
  { month: "Jan", value: 120 },
  { month: "Fev", value: 150 },
  { month: "Mar", value: 180 },
  { month: "Abr", value: 160 },
  { month: "Mai", value: 200 },
  { month: "Jun", value: 220 },
];

// Dados de produtividade por departamento - flexível para expansão futura
const departmentProductivity = [
  { name: "Jurídico", productivity: 85, color: "#003366" },
  { name: "Financeiro", productivity: 72, color: "#00bc7d" },
  { name: "Operacional", productivity: 91, color: "#2b7fff" },
  { name: "Administrativo", productivity: 78, color: "#fe9a00" },
];

const recentActivities = [
  {
    id: 1,
    title: "Processo #2024-001 aprovado",
    time: "Há 2 horas",
    status: "approved",
    icon: CheckCircle2,
    iconBg: "bg-green-500",
  },
  {
    id: 2,
    title: "Processo #2024-002 em análise",
    time: "Há 4 horas",
    status: "analysis",
    icon: Clock,
    iconBg: "bg-orange-500",
  },
  {
    id: 3,
    title: "Alerta de penalidade - Contrato #C789",
    time: "Há 6 horas",
    status: "urgent",
    icon: AlertTriangle,
    iconBg: "bg-red-500",
  },
];

export function DashboardScreen({ onEditClick, onDrillDown }: DashboardScreenProps) {
  const handleKPIClick = (title: string) => {
    onDrillDown?.(title, { period: "last-30-days", status: "ativo" });
  };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Dashboard de Processos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do sistema de gestão de contratos e suprimentos
          </p>
        </div>
        <Button onClick={onEditClick} className="bg-[#003366] hover:bg-[#004080]">
          Editar Dashboard
        </Button>
      </div>

      {/* KPI Cards Grid - 12 column grid, 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => handleKPIClick("Total de Processos")} className="cursor-pointer">
          <KPICard
            title="Total de Processos"
            value="1,247"
            subtitle="+12% desde o mês passado"
            icon={FileText}
            iconBgColor="bg-[#003366]"
          />
        </div>
        <div onClick={() => handleKPIClick("Processos em Análise")} className="cursor-pointer">
          <KPICard
            title="Processos em Análise"
            value="186"
            subtitle="23 aguardando documentação"
            icon={Clock}
            iconBgColor="bg-[#fe9a00]"
          />
        </div>
        <div onClick={() => handleKPIClick("Processos Aprovados")} className="cursor-pointer">
          <KPICard
            title="Processos Aprovados"
            value="892"
            subtitle="+8% este mês"
            icon={CheckCircle2}
            iconBgColor="bg-[#00bc7d]"
          />
        </div>
        <div onClick={() => handleKPIClick("Processos Rejeitados")} className="cursor-pointer">
          <KPICard
            title="Processos Rejeitados"
            value="94"
            subtitle="45 em recurso"
            icon={XCircle}
            iconBgColor="bg-[#fb2c36]"
          />
        </div>
        <div onClick={() => handleKPIClick("Alertas de Penalidades")} className="cursor-pointer">
          <KPICard
            title="Alertas de Penalidades"
            value="12"
            subtitle="Requer atenção imediata"
            icon={AlertTriangle}
            iconBgColor="bg-[#ff6900]"
          />
        </div>
        <div onClick={() => handleKPIClick("Prorrogações de Contrato")} className="cursor-pointer">
          <KPICard
            title="Prorrogações de Contrato"
            value="28"
            subtitle="15 vencendo em 30 dias"
            icon={Calendar}
            iconBgColor="bg-[#2b7fff]"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl mb-4">Tendência de Processos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#003366"
                fill="#003366"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl mb-4">Produtividade por Departamento</h3>
          <div className="space-y-4">
            {departmentProductivity.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{dept.name}</span>
                  <span className="text-sm font-medium">{dept.productivity}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.productivity}%`, backgroundColor: dept.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6">
        <h3 className="text-xl mb-6">Atividades Recentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className={`${activity.iconBg} rounded-lg w-8 h-8 flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "approved"
                      ? "default"
                      : activity.status === "analysis"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    activity.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : activity.status === "analysis"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      : ""
                  }
                >
                  {activity.status === "approved"
                    ? "Aprovado"
                    : activity.status === "analysis"
                    ? "Em Análise"
                    : "Urgente"}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}