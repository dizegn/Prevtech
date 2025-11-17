import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Edit, Archive, FileText, FolderOpen, Lock, User, Phone, Mail, MapPin, Calendar, Tag, Shield } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface ClienteData {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  status: "ativo" | "prospect" | "arquivado";
  etiquetas: string[];
  dataCadastro: string;
  ultimoContato: string;
  temDadosINSS: boolean;
  endereco?: string;
  cep?: string;
  rg?: string;
  estadoCivil?: string;
  profissao?: string;
  nacionalidade?: string;
}

interface DetalhesClientePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteData | null;
  onEditarCadastro?: () => void;
  onInativarContato?: () => void;
  onGerarKitContratual?: () => void;
  onVisualizarProcessos?: () => void;
}

// Mock de processos vinculados
const mockProcessos = [
  {
    id: "1",
    numero: "0001234-56.2024.5.02.0001",
    tipo: "Aposentadoria por Tempo de Contribuição",
    status: "Em Andamento",
    dataInicio: "15/03/2024"
  },
  {
    id: "2",
    numero: "0007890-12.2024.5.02.0001",
    tipo: "Revisão de Benefício",
    status: "Aguardando Documentos",
    dataInicio: "22/08/2024"
  }
];

export function DetalhesClientePanel({
  open,
  onOpenChange,
  cliente,
  onEditarCadastro,
  onInativarContato,
  onGerarKitContratual,
  onVisualizarProcessos
}: DetalhesClientePanelProps) {
  const [activeTab, setActiveTab] = useState("dados-cadastrais");
  const [showSenhaGovBR, setShowSenhaGovBR] = useState(false);
  
  // Simular senha criptografada (em produção viria do backend)
  const senhaGovBRCriptografada = "••••••••••••";
  const loginGovBR = cliente?.cpfCnpj.replace(/\D/g, "") || "";

  // Reset tab quando abrir o painel
  useEffect(() => {
    if (open) {
      setActiveTab("dados-cadastrais");
      setShowSenhaGovBR(false);
    }
  }, [open]);

  if (!cliente) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ativo":
        return "default";
      case "prospect":
        return "secondary";
      case "arquivado":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "prospect":
        return "Prospect";
      case "arquivado":
        return "Arquivado";
      default:
        return status;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1400px] p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl mb-2">{cliente.nome}</SheetTitle>
              <SheetDescription className="sr-only">
                Painel centralizado com todas as informações e ações de gestão do cliente
              </SheetDescription>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getStatusBadgeVariant(cliente.status)}>
                  {getStatusLabel(cliente.status)}
                </Badge>
                {cliente.etiquetas.map((etiqueta, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {etiqueta}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Área de Ações - Botões de Destaque */}
        <div className="px-6 py-4 bg-white dark:bg-gray-950 border-b">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ações</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={onEditarCadastro}
              variant="default"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Cadastro
            </Button>
            <Button 
              onClick={onInativarContato}
              variant="outline"
              size="sm"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/20"
            >
              <Archive className="w-4 h-4 mr-2" />
              Inativar Contato
            </Button>
            <Button 
              onClick={onGerarKitContratual}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Gerar Kit Contratual
            </Button>
            <Button 
              onClick={onVisualizarProcessos}
              variant="outline"
              size="sm"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Visualizar Processos
            </Button>
          </div>
        </div>

        {/* Conteúdo com Tabs */}
        <div className="px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="dados-cadastrais">Dados Cadastrais</TabsTrigger>
              <TabsTrigger value="acesso-inss">Acesso INSS</TabsTrigger>
              <TabsTrigger value="processos">Processos</TabsTrigger>
            </TabsList>

            {/* Tab: Dados Cadastrais */}
            <TabsContent value="dados-cadastrais" className="space-y-4">
              <Card className="p-4">
                <h4 className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4" />
                  Informações Pessoais
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nome:</span>
                    <span className="col-span-2">{cliente.nome}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CPF/CNPJ:</span>
                    <span className="col-span-2 font-mono">{cliente.cpfCnpj}</span>
                  </div>
                  {cliente.rg && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">RG:</span>
                        <span className="col-span-2">{cliente.rg}</span>
                      </div>
                    </>
                  )}
                  {cliente.estadoCivil && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Estado Civil:</span>
                        <span className="col-span-2">{cliente.estadoCivil}</span>
                      </div>
                    </>
                  )}
                  {cliente.profissao && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Profissão:</span>
                        <span className="col-span-2">{cliente.profissao}</span>
                      </div>
                    </>
                  )}
                  {cliente.nacionalidade && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Nacionalidade:</span>
                        <span className="col-span-2">{cliente.nacionalidade}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="flex items-center gap-2 mb-4">
                  <Phone className="w-4 h-4" />
                  Contato
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email:
                    </span>
                    <span className="col-span-2">{cliente.email}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Telefone:
                    </span>
                    <span className="col-span-2">{cliente.telefone}</span>
                  </div>
                  {cliente.endereco && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Endereço:
                        </span>
                        <span className="col-span-2">{cliente.endereco}</span>
                      </div>
                    </>
                  )}
                  {cliente.cep && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">CEP:</span>
                        <span className="col-span-2">{cliente.cep}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4" />
                  Datas
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cadastro:</span>
                    <span className="col-span-2">{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Último Contato:</span>
                    <span className="col-span-2">{new Date(cliente.ultimoContato).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Dados de Acesso INSS */}
            <TabsContent value="acesso-inss" className="space-y-4">
              {cliente.temDadosINSS ? (
                <Card className="p-4 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-blue-900 dark:text-blue-100">Dados de Acesso GOV.BR</h4>
                  </div>
                  
                  <Alert className="mb-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900 dark:text-amber-100">
                      <strong>Segurança:</strong> Os dados abaixo são criptografados com AES-256 e armazenados de forma segura.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                        Login GOV.BR (CPF)
                      </label>
                      <div className="p-3 bg-white dark:bg-gray-900 border rounded-md font-mono">
                        {loginGovBR}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block flex items-center justify-between">
                        Senha GOV.BR
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSenhaGovBR(!showSenhaGovBR)}
                          className="h-7 text-xs"
                        >
                          {showSenhaGovBR ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Exibir
                            </>
                          )}
                        </Button>
                      </label>
                      <div className="p-3 bg-white dark:bg-gray-900 border rounded-md font-mono flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-400" />
                        {showSenhaGovBR ? "[Senha descriptografada seria exibida aqui]" : senhaGovBRCriptografada}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        A senha é mascarada permanentemente por segurança
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={onEditarCadastro}
                        variant="outline" 
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Substituir Credenciais
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2">Dados INSS não configurados</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configure as credenciais GOV.BR para habilitar funcionalidades de integração previdenciária.
                  </p>
                  <Button onClick={onEditarCadastro}>
                    <Lock className="w-4 h-4 mr-2" />
                    Configurar Acesso INSS
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Processos */}
            <TabsContent value="processos" className="space-y-4">
              {mockProcessos.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mockProcessos.length} processo(s) vinculado(s)
                    </p>
                    <Button onClick={onVisualizarProcessos} variant="outline" size="sm">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Ver Todos
                    </Button>
                  </div>
                  {mockProcessos.map((processo) => (
                    <Card key={processo.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-mono text-sm mb-1">{processo.numero}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{processo.tipo}</p>
                        </div>
                        <Badge variant="outline">{processo.status}</Badge>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Início: {processo.dataInicio}
                      </p>
                    </Card>
                  ))}
                </>
              ) : (
                <Card className="p-6 text-center">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="mb-2">Nenhum processo vinculado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Este cliente ainda não possui processos cadastrados no sistema.
                  </p>
                  <Button onClick={onVisualizarProcessos} variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Ir para Processos
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
