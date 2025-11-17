import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Loader2, Search, CheckCircle2, AlertCircle, Shield } from "lucide-react";

interface CriarViaINSSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

// Simulação de dados que viriam da API GOV.BR/INSS
const MOCK_INSS_DATA = {
  "12345678900": {
    nome: "Maria da Silva Santos",
    cpf: "123.456.789-00",
    numeroProcesso: "0012345-67.2024.4.03.6100",
    tipoBeneficio: "Aposentadoria por Tempo de Contribuição",
    dataSolicitacao: "2024-09-15",
    situacao: "Em Análise",
    valorEstimado: 3500.00,
    tempoContribuicao: "35 anos e 4 meses",
    hasCNIS: true
  },
  "98765432100": {
    nome: "João Santos Oliveira",
    cpf: "987.654.321-00",
    numeroProcesso: "0098765-43.2024.4.03.6100",
    tipoBeneficio: "Aposentadoria por Idade",
    dataSolicitacao: "2024-08-22",
    situacao: "Aguardando Perícia",
    valorEstimado: 2800.00,
    tempoContribuicao: "28 anos e 7 meses",
    hasCNIS: true
  }
};

export function CriarViaINSSModal({
  open,
  onOpenChange,
  onSave,
  isLoading
}: CriarViaINSSModalProps) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [foundData, setFoundData] = useState<any>(null);
  
  // Campos editáveis após a busca
  const [responsible, setResponsible] = useState("");
  const [observations, setObservations] = useState("");

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError("");
    setFoundData(null);

    // Simular chamada à API GOV.BR/INSS
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cpfLimpo = cpfBusca.replace(/\D/g, '');
    const data = MOCK_INSS_DATA[cpfLimpo as keyof typeof MOCK_INSS_DATA];
    
    if (data) {
      setFoundData(data);
      setSearchError("");
    } else {
      setSearchError("Nenhum processo previdenciário encontrado para este CPF. Verifique se o cliente possui credenciais GOV.BR cadastradas e 2FA desabilitado.");
      setFoundData(null);
    }
    
    setIsSearching(false);
  };

  const handleSave = () => {
    onSave({
      ...foundData,
      responsible,
      observations,
      source: "inss-govbr"
    });
    resetForm();
  };

  const resetForm = () => {
    setCpfBusca("");
    setFoundData(null);
    setSearchError("");
    setResponsible("");
    setObservations("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Criar Processo via INSS/GOV.BR
          </DialogTitle>
          <DialogDescription>
            Busque automaticamente processos previdenciários através da integração com GOV.BR
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Passo 1: Busca por CPF */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm">
                1
              </div>
              <h3 className="text-gray-900 dark:text-white">Buscar Processo Previdenciário</h3>
            </div>
            
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <strong>CPFs de teste disponíveis:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• 123.456.789-00 (Maria da Silva - Aposentadoria por Tempo)</li>
                  <li>• 987.654.321-00 (João Santos - Aposentadoria por Idade)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Digite o CPF do cliente (000.000.000-00)"
                  value={cpfBusca}
                  onChange={(e) => setCpfBusca(e.target.value)}
                  disabled={isSearching || !!foundData}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!cpfBusca || isSearching || !!foundData}
                className="bg-black hover:bg-black/90 text-white flex-shrink-0"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar no INSS
                  </>
                )}
              </Button>
              {foundData && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFoundData(null);
                    setCpfBusca("");
                  }}
                >
                  Nova Busca
                </Button>
              )}
            </div>

            {searchError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}

            {foundData && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  <strong>Processo encontrado!</strong> Os dados foram importados automaticamente via GOV.BR. 
                  Complete as informações abaixo e salve o processo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Passo 2: Dados Importados */}
          {foundData && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm">
                  2
                </div>
                <h3 className="text-gray-900 dark:text-white">Dados Importados do INSS</h3>
              </div>

              {/* Dados do beneficiário */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dados obtidos via integração com GOV.BR
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Nome do Beneficiário:</span>
                    <p className="text-gray-900 dark:text-white">{foundData.nome}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">CPF:</span>
                    <p className="text-gray-900 dark:text-white font-mono">{foundData.cpf}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Número do Processo:</span>
                    <p className="text-gray-900 dark:text-white font-mono">{foundData.numeroProcesso}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tipo de Benefício:</span>
                    <p className="text-gray-900 dark:text-white">{foundData.tipoBeneficio}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Situação:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {foundData.situacao}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Data de Solicitação:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(foundData.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Valor Estimado:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(foundData.valorEstimado)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tempo de Contribuição:</span>
                    <p className="text-gray-900 dark:text-white">{foundData.tempoContribuicao}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">CNIS Disponível:</span>
                    {foundData.hasCNIS ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Sim - Acessível via M07
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        Não disponível
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Complementação de dados */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm text-gray-900 dark:text-white">
                  Complementar Informações
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="responsible">Advogado Responsável *</Label>
                  <Select value={responsible} onValueChange={setResponsible}>
                    <SelectTrigger id="responsible">
                      <SelectValue placeholder="Selecione o advogado responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                      <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                      <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                      <SelectItem value="Dr. Pedro Oliveira">Dr. Pedro Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observações Iniciais</Label>
                  <Input
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ex: Cliente solicita acompanhamento quinzenal"
                  />
                </div>
              </div>

              {/* Info sobre M07 */}
              {foundData.hasCNIS && (
                <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertDescription className="text-purple-900 dark:text-purple-100 text-sm">
                    <strong>Módulo de Contagem (M07):</strong> Este processo possui CNIS disponível. 
                    Após salvar, você poderá acessar o Módulo de Contagem de Aposentadoria diretamente 
                    da tela de detalhes do processo.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !foundData || !responsible}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Processo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
