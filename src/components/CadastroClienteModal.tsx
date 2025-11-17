import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, Eye, EyeOff, AlertTriangle, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CadastroClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
  isLoading?: boolean;
}

export function CadastroClienteModal({
  open,
  onOpenChange,
  onSave,
  isLoading
}: CadastroClienteModalProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [rg, setRg] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [profissao, setProfissao] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  
  // Dados GOV.BR para integração INSS
  const [loginGovBR, setLoginGovBR] = useState("");
  const [senhaGovBR, setSenhaGovBR] = useState("");
  const [showSenhaGovBR, setShowSenhaGovBR] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave({
        nome,
        cpf,
        email,
        telefone,
        endereco,
        cep,
        rg,
        estadoCivil,
        profissao,
        nacionalidade,
        govBR: {
          login: loginGovBR,
          senha: senhaGovBR // Será criptografado no backend
        }
      });
    }
    
    // Reset form
    setNome("");
    setCpf("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setCep("");
    setRg("");
    setEstadoCivil("");
    setProfissao("");
    setNacionalidade("");
    setLoginGovBR("");
    setSenhaGovBR("");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente para associar ao processo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs">
                1
              </span>
              Dados Básicos
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
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-0"
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

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
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

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={estadoCivil} onValueChange={setEstadoCivil}>
                  <SelectTrigger id="estadoCivil">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Input
                  id="nacionalidade"
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                  placeholder="Ex: Brasileira"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  placeholder="Ex: Advogado"
                />
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Dados GOV.BR - Seção destacada */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs">
                2
              </span>
              <h3 className="text-sm text-gray-900 dark:text-white">
                Credenciais GOV.BR (Opcional)
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      <strong>Para usar a Busca Automática INSS:</strong><br/>
                      • Certifique-se que o cliente desabilitou a Autenticação de Dois Fatores (2FA) no GOV.BR<br/>
                      • As credenciais são criptografadas (AES-256) antes do armazenamento<br/>
                      • Utilizadas exclusivamente para consultas previdenciárias
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                <strong>Busca Automática INSS:</strong> Ao cadastrar as credenciais GOV.BR, 
                o sistema poderá realizar buscas automáticas de processos previdenciários e 
                acessar dados do CNIS para o Módulo de Contagem (M07).
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
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
                  placeholder="CPF do cliente (mesmo do campo acima)"
                />
              </div>

              <div className="space-y-2 col-span-2">
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
                    placeholder="Senha do GOV.BR do cliente"
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Senha armazenada com criptografia AES-256
                </p>
              </div>
            </div>

            {/* Alerta de 2FA */}
            <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-900 dark:text-yellow-100 text-sm">
                <strong>IMPORTANTE - Requisito de 2FA:</strong> Para que a busca automática funcione, 
                é necessário que o cliente <strong>desabilite temporariamente a Autenticação de Dois Fatores (2FA)</strong> em 
                sua conta GOV.BR. Sem isso, o sistema não conseguirá autenticar automaticamente.
              </AlertDescription>
            </Alert>
          </div>
        </div>

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
            disabled={isLoading || !nome || !cpf}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
