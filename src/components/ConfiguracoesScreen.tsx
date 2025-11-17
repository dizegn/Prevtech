import { useState } from "react";
import { User, Building2, Bell, Shield, Globe, Palette, Database, Mail, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { Breadcrumb } from "./Breadcrumb";

interface ConfiguracoesScreenProps {
  onNavigateHome?: () => void;
}

export function ConfiguracoesScreen({ onNavigateHome }: ConfiguracoesScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Profile settings
  const [profileName, setProfileName] = useState("João Silva");
  const [profileEmail, setProfileEmail] = useState("joao.silva@empresa.com");
  const [profilePhone, setProfilePhone] = useState("(11) 98765-4321");
  const [profileOAB, setProfileOAB] = useState("SP 123.456");

  // Company settings
  const [companyName, setCompanyName] = useState("Silva & Associados Advocacia");
  const [companyCNPJ, setCompanyCNPJ] = useState("12.345.678/0001-90");
  const [companyAddress, setCompanyAddress] = useState("Av. Paulista, 1000 - São Paulo/SP");
  const [companyPhone, setCompanyPhone] = useState("(11) 3456-7890");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [publicationAlerts, setPublicationAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [reportAlerts, setReportAlerts] = useState(false);

  // System settings
  const [language, setLanguage] = useState("pt-BR");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("BRL");

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  const handleSaveChanges = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      toast.success("Configurações salvas com sucesso!");
    }, 1500);
  };

  const handleChange = () => {
    if (!hasChanges) setHasChanges(true);
  };

  if (error) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading && !hasChanges) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Configurações", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Configurações</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas preferências e configurações do sistema
            </p>
          </div>
          {hasChanges && (
            <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-2">
              <Save className="w-4 h-4" />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="w-4 h-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Globe className="w-4 h-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Informações Pessoais</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-name">Nome Completo</Label>
                      <Input
                        id="profile-name"
                        value={profileName}
                        onChange={(e) => { setProfileName(e.target.value); handleChange(); }}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-email">E-mail</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileEmail}
                        onChange={(e) => { setProfileEmail(e.target.value); handleChange(); }}
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profile-phone">Telefone</Label>
                        <Input
                          id="profile-phone"
                          value={profilePhone}
                          onChange={(e) => { setProfilePhone(e.target.value); handleChange(); }}
                          placeholder="(11) 98765-4321"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-oab">OAB</Label>
                        <Input
                          id="profile-oab"
                          value={profileOAB}
                          onChange={(e) => { setProfileOAB(e.target.value); handleChange(); }}
                          placeholder="SP 123.456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Alterar Senha</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Digite a nova senha"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirme a nova senha"
                        />
                      </div>
                    </div>
                    <Button variant="outline">Atualizar Senha</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Informações da Empresa</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Razão Social</Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => { setCompanyName(e.target.value); handleChange(); }}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-cnpj">CNPJ</Label>
                      <Input
                        id="company-cnpj"
                        value={companyCNPJ}
                        onChange={(e) => { setCompanyCNPJ(e.target.value); handleChange(); }}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-address">Endereço</Label>
                      <Textarea
                        id="company-address"
                        value={companyAddress}
                        onChange={(e) => { setCompanyAddress(e.target.value); handleChange(); }}
                        placeholder="Endereço completo"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-phone">Telefone</Label>
                      <Input
                        id="company-phone"
                        value={companyPhone}
                        onChange={(e) => { setCompanyPhone(e.target.value); handleChange(); }}
                        placeholder="(11) 3456-7890"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Logo e Identidade Visual</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Logo da Empresa</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">Fazer Upload</Button>
                          <p className="text-gray-600 dark:text-gray-400">
                            PNG, JPG até 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Preferências de Notificação</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por E-mail</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Receber notificações importantes por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={(checked) => { setEmailNotifications(checked); handleChange(); }}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações Push</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Receber notificações no navegador
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={(checked) => { setPushNotifications(checked); handleChange(); }}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de Publicações</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Notificar sobre novas publicações do Diário Oficial
                        </p>
                      </div>
                      <Switch
                        checked={publicationAlerts}
                        onCheckedChange={(checked) => { setPublicationAlerts(checked); handleChange(); }}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de Prazos</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Notificar sobre prazos próximos e vencidos
                        </p>
                      </div>
                      <Switch
                        checked={deadlineAlerts}
                        onCheckedChange={(checked) => { setDeadlineAlerts(checked); handleChange(); }}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Relatórios Agendados</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Receber relatórios automáticos por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={reportAlerts}
                        onCheckedChange={(checked) => { setReportAlerts(checked); handleChange(); }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Resumo Diário</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="daily-summary-time">Horário do Resumo</Label>
                      <Select defaultValue="08:00">
                        <SelectTrigger id="daily-summary-time">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">06:00</SelectItem>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Preferências do Sistema</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={language} onValueChange={(value) => { setLanguage(value); handleChange(); }}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select value={timezone} onValueChange={(value) => { setTimezone(value); handleChange(); }}>
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                          <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                          <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date-format">Formato de Data</Label>
                        <Select value={dateFormat} onValueChange={(value) => { setDateFormat(value); handleChange(); }}>
                          <SelectTrigger id="date-format">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="currency">Moeda</Label>
                        <Select value={currency} onValueChange={(value) => { setCurrency(value); handleChange(); }}>
                          <SelectTrigger id="currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Real (R$)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Dados e Armazenamento</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-gray-900 dark:text-white">Uso de Armazenamento</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            2.4 GB de 10 GB utilizados
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      Exportar Todos os Dados
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Segurança da Conta</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticação de Dois Fatores</Label>
                        <p className="text-gray-600 dark:text-gray-400">
                          Adicione uma camada extra de segurança à sua conta
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorAuth}
                        onCheckedChange={(checked) => { setTwoFactorAuth(checked); handleChange(); }}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                      <Select value={sessionTimeout} onValueChange={(value) => { setSessionTimeout(value); handleChange(); }}>
                        <SelectTrigger id="session-timeout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="password-expiry">Expiração de Senha (dias)</Label>
                      <Select value={passwordExpiry} onValueChange={(value) => { setPasswordExpiry(value); handleChange(); }}>
                        <SelectTrigger id="password-expiry">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="never">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Sessões Ativas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-gray-900 dark:text-white">Windows - Chrome</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          São Paulo, Brasil • Sessão atual
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                        Ativo
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Encerrar Todas as Outras Sessões
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-gray-900 dark:text-white mb-4">Auditoria e Logs</h3>
                  <Button variant="outline" className="w-full">
                    Ver Histórico de Atividades
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
