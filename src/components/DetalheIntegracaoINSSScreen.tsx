import { useState } from "react";
import { Shield, Key, Webhook, Activity, Clock, CheckCircle2, AlertCircle, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Breadcrumb } from "./Breadcrumb";
import { toast } from "sonner@2.0.3";

interface DetalheIntegracaoINSSScreenProps {
  onNavigateBack: () => void;
}

type SyncLog = {
  id: string;
  timestamp: string;
  type: "success" | "error" | "warning";
  message: string;
  details?: string;
};

const mockSyncLogs: SyncLog[] = [
  {
    id: "1",
    timestamp: "20/10/2025 15:45:32",
    type: "success",
    message: "Sincronização de CNIS concluída",
    details: "3 processos atualizados com sucesso"
  },
  {
    id: "2",
    timestamp: "20/10/2025 14:30:18",
    type: "success",
    message: "Busca automática INSS executada",
    details: "2 novos processos importados"
  },
  {
    id: "3",
    timestamp: "20/10/2025 12:15:07",
    type: "warning",
    message: "Credencial GOV.BR com 2FA ativo",
    details: "Cliente: Maria Silva (CPF: ***789.123-45) - Desabilitar 2FA"
  },
  {
    id: "4",
    timestamp: "20/10/2025 10:05:42",
    type: "success",
    message: "Webhook processado com sucesso",
    details: "Atualização de benefício recebida"
  },
  {
    id: "5",
    timestamp: "19/10/2025 16:22:11",
    type: "error",
    message: "Falha na autenticação GOV.BR",
    details: "Cliente: João Santos - Senha incorreta ou expirada"
  }
];

export function DetalheIntegracaoINSSScreen({ onNavigateBack }: DetalheIntegracaoINSSScreenProps) {
  const [apiKey, setApiKey] = useState("pk_live_••••••••••••••••••••••••••••3f5a");
  const [webhookUrl, setWebhookUrl] = useState("https://seu-sistema.com.br/webhook/inss");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Configurações salvas com sucesso!");
    setIsLoading(false);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Conexão testada com sucesso! API respondeu corretamente.");
    setIsLoading(false);
  };

  const getLogIcon = (type: SyncLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getLogBadge = (type: SyncLog["type"]) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Sucesso</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Atenção</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Erro</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Integrações", onClick: onNavigateBack },
            { label: "API Previdenciária" }
          ]}
        />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center text-2xl">
                🏛️
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-white">API Previdenciária</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Busca automática INSS e dados previdenciários GOV.BR
                </p>
              </div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Conectado
          </Badge>
        </div>

        {/* Diferencial MVP Alert */}
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong>Diferencial do Sistema:</strong> Esta integração permite busca processual automática do INSS 
            e acesso ao Módulo de Contagem de Aposentadoria (M07), recursos exclusivos para processos previdenciários.
          </AlertDescription>
        </Alert>

        {/* Configuração de API */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              <CardTitle>Chave da API</CardTitle>
            </div>
            <CardDescription>
              Configure a chave de acesso fornecida pelo provedor da API Previdenciária
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave de API (API Key)</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="flex-shrink-0"
                >
                  {isLoading ? "Testando..." : "Testar Conexão"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A chave de API é criptografada e armazenada com segurança
              </p>
            </div>

            <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-900 dark:text-yellow-100 text-sm">
                <strong>Importante:</strong> Nunca compartilhe sua chave de API. 
                Caso suspeite de comprometimento, regenere imediatamente no painel do provedor.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Configuração de Webhook */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              <CardTitle>Webhook</CardTitle>
            </div>
            <CardDescription>
              URL para receber notificações automáticas de atualizações do INSS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-sistema.com.br/webhook/inss"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                O sistema receberá notificações sobre atualizações de benefícios e processos
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveConfig}
                disabled={isLoading}
                className="gap-2 bg-black hover:bg-black/90 text-white"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Log de Sincronizações */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <CardTitle>Log de Sincronizações Recentes</CardTitle>
            </div>
            <CardDescription>
              Histórico das últimas 50 sincronizações com a API Previdenciária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSyncLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {log.message}
                      </p>
                      {getLogBadge(log.type)}
                    </div>
                    {log.details && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {log.details}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full">
                Ver Histórico Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança e Criptografia */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Segurança e Criptografia</CardTitle>
            </div>
            <CardDescription>
              Informações sobre proteção de dados sensíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>Criptografia AES-256:</strong> Todas as credenciais GOV.BR (login e senha) 
                    são criptografadas antes do armazenamento usando padrão AES-256.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>Comunicação HTTPS:</strong> Todas as requisições à API Previdenciária 
                    utilizam protocolo HTTPS com certificado SSL/TLS válido.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 dark:text-green-100">
                    <strong>Auditoria de Acesso:</strong> Todos os acessos aos dados GOV.BR 
                    são registrados em log de auditoria com timestamp e usuário responsável.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
