import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface IntegracoesScreenProps {
  onSelectIntegration: (id: string, name: string) => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "warning" | "error";
  lastCheck: string;
  icon: string;
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Agenda",
    description: "Sincronização de calendário e compromissos",
    status: "connected",
    lastCheck: "08/10/2025 14:30",
    icon: "📅",
  },
  {
    id: "2",
    name: "Asaas",
    description: "Gateway de pagamento e cobranças",
    status: "connected",
    lastCheck: "08/10/2025 14:28",
    icon: "💳",
  },
  {
    id: "3",
    name: "API Previdenciária",
    description: "Busca automática INSS e dados previdenciários GOV.BR",
    status: "connected",
    lastCheck: "20/10/2025 15:45",
    icon: "🏛️",
  },
  {
    id: "4",
    name: "Publicações",
    description: "Sistema de publicações e comunicados",
    status: "warning",
    lastCheck: "08/10/2025 12:15",
    icon: "📢",
  },
];

export function IntegracoesScreen({ onSelectIntegration }: IntegracoesScreenProps) {
  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
    }
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Conectado</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Atenção</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Erro</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Integrações</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitore e gerencie conexões com sistemas externos
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectIntegration(integration.id, integration.name)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#003366] dark:bg-[#004080] rounded-lg flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="mt-1">{integration.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusIcon(integration.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Última verificação: {integration.lastCheck}</span>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
                {integration.status === "warning" && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Atenção necessária: verifique os logs para mais detalhes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-gray-200">
            <strong>Nota:</strong> As integrações são verificadas automaticamente a cada 15 minutos.
            Você pode testar manualmente a conexão acessando os detalhes de cada integração.
          </p>
        </div>
      </div>
    </div>
  );
}