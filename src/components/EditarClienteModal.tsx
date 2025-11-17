import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Shield, Eye, EyeOff, AlertTriangle, Lock, User, Settings, RefreshCw, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Card } from "./ui/card";

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
}

interface EditarClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteData;
  onSave?: (data: any) => void;
  isLoading?: boolean;
}

export function EditarClienteModal({
  open,
  onOpenChange,
  cliente,
  onSave,
  isLoading = false
}: EditarClienteModalProps) {
  const [activeTab, setActiveTab] = useState("dados-basicos");
  
  // Estados para dados básicos
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState<"ativo" | "prospect" | "arquivado">("prospect");
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [novaEtiqueta, setNovaEtiqueta] = useState("");

  // Estados para dados GOV.BR (sensíveis)
  const [loginGovBR, setLoginGovBR] = useState("");
  const [senhaGovBR, setSenhaGovBR] = useState("");
  const [showSenhaGovBR, setShowSenhaGovBR] = useState(false);
  const [dadosINSSConfigurados, setDadosINSSConfigurados] = useState(false);
  const [alterarCredenciais, setAlterarCredenciais] = useState(false);

  // Estados de controle
  const [isLoadingCredenciais, setIsLoadingCredenciais] = useState(false);
  const [showConfirmacaoExclusao, setShowConfirmacaoExclusao] = useState(false);

  // Inicializar campos com dados do cliente
  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setCpfCnpj(cliente.cpfCnpj);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
      setEndereco(cliente.endereco || "");
      setStatus(cliente.status);
      setEtiquetas(cliente.etiquetas);
      setDadosINSSConfigurados(cliente.temDadosINSS);
      setLoginGovBR(cliente.cpfCnpj.replace(/\D/g, "")); // CPF limpo como sugestão
    }
  }, [cliente]);

  const etiquetasDisponiveis = [
    "VIP", "Previdenciário", "Trabalhista", "Corporativo", 
    "Criminal", "Tributário", "Família", "Imobiliário", "Consumidor"
  ];

  const handleAdicionarEtiqueta = () => {
    if (novaEtiqueta && !etiquetas.includes(novaEtiqueta)) {
      setEtiquetas([...etiquetas, novaEtiqueta]);
      setNovaEtiqueta("");
    }
  };

  const handleRemoverEtiqueta = (etiquetaParaRemover: string) => {
    setEtiquetas(etiquetas.filter(e => e !== etiquetaParaRemover));
  };

  const handleSave = () => {
    if (onSave) {
      const dadosAtualizados = {
        id: cliente.id,
        nome,
        cpfCnpj,
        email,
        telefone,
        endereco,
        status,
        etiquetas,
        // Dados GOV.BR só são incluídos se foram alterados
        ...(alterarCredenciais && {
          govBR: {
            login: loginGovBR,
            senha: senhaGovBR // Será criptografado no backend
          }
        })
      };

      onSave(dadosAtualizados);
    }

    onOpenChange(false);
  };

  const handleTestarCredenciais = async () => {
    setIsLoadingCredenciais(true);
    
    // Simular teste de credenciais
    setTimeout(() => {
      setIsLoadingCredenciais(false);
      // Aqui seria feita a validação real das credenciais
    }, 2000);
  };

  const handleRemoverCredenciais = () => {
    setLoginGovBR("");
    setSenhaGovBR("");
    setDadosINSSConfigurados(false);
    setAlterarCredenciais(false);
    setShowConfirmacaoExclusao(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Editar Cliente
          </DialogTitle>
          <DialogDescription>
            Atualize as informações cadastrais e dados de acesso INSS do cliente.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
            <TabsTrigger value="dados-inss" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Dados INSS/GOV.BR
            </TabsTrigger>
          </TabsList>

          {/* Aba: Dados Básicos */}
          <TabsContent value="dados-basicos" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h3 className="text-sm text-gray-900 dark:text-white">
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria da Silva Santos"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                  <Input
                    id="cpfCnpj"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Textarea
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro, cidade - UF"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Status e Etiquetas */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-900 dark:text-white">
                Classificação
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="arquivado">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Adicionar Etiqueta</Label>
                  <div className="flex gap-2">
                    <Select value={novaEtiqueta} onValueChange={setNovaEtiqueta}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {etiquetasDisponiveis.filter(e => !etiquetas.includes(e)).map(etiqueta => (
                          <SelectItem key={etiqueta} value={etiqueta}>{etiqueta}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button"
                      onClick={handleAdicionarEtiqueta}
                      disabled={!novaEtiqueta}
                      size="sm"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Etiquetas Aplicadas */}
              {etiquetas.length > 0 && (
                <div className="space-y-2">
                  <Label>Etiquetas Aplicadas</Label>
                  <div className="flex flex-wrap gap-2">
                    {etiquetas.map((etiqueta) => (
                      <Badge 
                        key={etiqueta} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleRemoverEtiqueta(etiqueta)}
                      >
                        {etiqueta} ×
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Clique em uma etiqueta para removê-la
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba: Dados INSS/GOV.BR */}
          <TabsContent value="dados-inss" className="space-y-6 mt-4">
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                <strong>Área Sensível:</strong> Esta seção contém dados criptografados do cliente. 
                Use apenas para configurações relacionadas ao Módulo Previdenciário.
              </AlertDescription>
            </Alert>

            {/* Status atual das credenciais */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dadosINSSConfigurados ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="text-sm text-black dark:text-white">
                      {dadosINSSConfigurados ? 'Credenciais Configuradas' : 'Credenciais Não Configuradas'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dadosINSSConfigurados 
                        ? 'Cliente pode usar a Busca Automática INSS' 
                        : 'Configure as credenciais para habilitar funcionalidades previdenciárias'
                      }
                    </p>
                  </div>
                </div>

                {dadosINSSConfigurados && !alterarCredenciais && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAlterarCredenciais(true)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Alterar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmacaoExclusao(true)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Formulário de credenciais */}
            {(!dadosINSSConfigurados || alterarCredenciais) && (
              <div className="space-y-4">
                <h3 className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  {alterarCredenciais ? 'Alterar' : 'Configurar'} Credenciais GOV.BR
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          <strong>Segurança:</strong><br/>
                          • Dados criptografados com AES-256<br/>
                          • Acesso restrito a operadores autorizados<br/>
                          • Usados exclusivamente para consultas previdenciárias
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginGovBR" className="flex items-center gap-2">
                      Login GOV.BR (CPF)
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Lock className="w-3 h-3" />
                        <span>Criptografado</span>
                      </div>
                    </Label>
                    <Input
                      id="loginGovBR"
                      value={loginGovBR}
                      onChange={(e) => setLoginGovBR(e.target.value)}
                      placeholder="CPF do cliente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senhaGovBR" className="flex items-center gap-2">
                      Senha GOV.BR
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Lock className="w-3 h-3" />
                        <span>Criptografado</span>
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        id="senhaGovBR"
                        type={showSenhaGovBR ? "text" : "password"}
                        value={senhaGovBR}
                        onChange={(e) => setSenhaGovBR(e.target.value)}
                        placeholder={alterarCredenciais ? "Nova senha do GOV.BR" : "Senha do GOV.BR do cliente"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaGovBR(!showSenhaGovBR)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showSenhaGovBR ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleTestarCredenciais}
                    disabled={!loginGovBR || !senhaGovBR || isLoadingCredenciais}
                  >
                    {isLoadingCredenciais ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Testar Conexão
                      </>
                    )}
                  </Button>

                  {alterarCredenciais && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAlterarCredenciais(false);
                        setLoginGovBR(cpfCnpj.replace(/\D/g, ""));
                        setSenhaGovBR("");
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>

                {/* Alerta sobre 2FA */}
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-900 dark:text-yellow-100 text-sm">
                    <strong>Requisito 2FA:</strong> Para que a busca automática funcione, 
                    é necessário que o cliente desabilite temporariamente o 2FA na conta GOV.BR.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Modal de confirmação para exclusão de credenciais */}
            {showConfirmacaoExclusao && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-900 dark:text-red-100 text-sm">
                  <strong>Confirmar Remoção:</strong> Tem certeza que deseja remover as credenciais GOV.BR? 
                  Esta ação desabilitará a Busca Automática INSS para este cliente.
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoverCredenciais}
                    >
                      Confirmar Remoção
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConfirmacaoExclusao(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !nome || !cpfCnpj}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}