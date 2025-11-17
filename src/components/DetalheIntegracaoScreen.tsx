import { ArrowLeft, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface DetalheIntegracaoScreenProps {
  integrationName: string;
  onBack: () => void;
  onRetest: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  message: string;
  duration: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "08/10/2025 14:30:15",
    status: "success",
    message: "Sincronização concluída com sucesso",
    duration: "1.2s",
  },
  {
    id: "2",
    timestamp: "08/10/2025 14:15:10",
    status: "success",
    message: "Conexão verificada",
    duration: "0.8s",
  },
  {
    id: "3",
    timestamp: "08/10/2025 14:00:05",
    status: "warning",
    message: "Timeout na resposta (tentando novamente...)",
    duration: "5.0s",
  },
  {
    id: "4",
    timestamp: "08/10/2025 13:45:22",
    status: "success",
    message: "Dados sincronizados: 150 registros",
    duration: "2.3s",
  },
];

export function DetalheIntegracaoScreen({
  integrationName,
  onBack,
  onRetest,
}: DetalheIntegracaoScreenProps) {
  const getStatusIcon = (status: LogEntry["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />;
    }
  };

  const getStatusBadge = (status: LogEntry["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Sucesso</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Aviso</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Erro</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl text-gray-900 dark:text-white">{integrationName}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Detalhes e logs de integração
            </p>
          </div>
          <Button onClick={onRetest} className="bg-[#003366] hover:bg-[#004080]">
            Retestar Conexão
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Conexão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Endpoint</p>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block break-all">
                  https://api.{integrationName.toLowerCase()}.com/v1
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Método de Autenticação</p>
                <Badge variant="outline">API Key</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">API Key (somente leitura)</p>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block">
                  sk_live_****************************xyz
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Webhook URL</p>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded block break-all">
                  https://global.com.br/webhooks/{integrationName.toLowerCase()}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status da Integração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Status Atual</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Última Verificação</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">08/10/2025 14:30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Uptime (30 dias)</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total de Requisições</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Taxa de Sucesso</span>
                <span className="text-sm text-green-600 dark:text-green-500">98.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Logs Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead className="text-right">Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {log.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}