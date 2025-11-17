import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Loader2, Search, CheckCircle2, AlertCircle, Newspaper } from "lucide-react";

interface CriarViaPublicacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

// Simulação de dados que viriam da API de publicações
const MOCK_API_DATA = {
  "DJE-2024-001234": {
    number: "0001234-56.2024.8.26.0100",
    title: "Ação Declaratória de Inexistência de Débito",
    court: "TJSP",
    courtName: "TJSP - Tribunal de Justiça de SP",
    publicationDate: "2024-10-15",
    parties: "Empresa ABC Ltda vs. Fazenda Nacional",
    summary: "Trata-se de ação declaratória onde a empresa ABC contesta débitos fiscais não reconhecidos."
  },
  "DJE-2024-005678": {
    number: "0005678-90.2024.8.26.0100",
    title: "Recurso de Apelação Cível",
    court: "TJSP",
    courtName: "TJSP - Tribunal de Justiça de SP",
    publicationDate: "2024-10-18",
    parties: "João da Silva vs. Construtora XYZ S/A",
    summary: "Recurso interposto contra sentença que julgou improcedente ação de indenização por danos materiais."
  },
  "DJE-2024-009012": {
    number: "0009012-34.2024.8.26.0100",
    title: "Execução de Título Extrajudicial",
    court: "TJSP",
    courtName: "TJSP - Tribunal de Justiça de SP",
    publicationDate: "2024-10-20",
    parties: "Banco Delta S/A vs. Comércio Beta ME",
    summary: "Execução de nota promissória vencida e não paga no valor de R$ 85.000,00."
  }
};

export function CriarViaPublicacaoModal({
  open,
  onOpenChange,
  onSave,
  isLoading
}: CriarViaPublicacaoModalProps) {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [foundData, setFoundData] = useState<any>(null);
  
  // Campos editáveis após a busca
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [court, setCourt] = useState("");
  const [value, setValue] = useState("");
  const [responsible, setResponsible] = useState("");
  const [description, setDescription] = useState("");

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError("");
    setFoundData(null);

    // Simular chamada à API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = MOCK_API_DATA[searchNumber as keyof typeof MOCK_API_DATA];
    
    if (data) {
      setFoundData(data);
      // Preencher campos com dados da API
      setNumber(data.number);
      setTitle(data.title);
      setCourt(data.court);
      setDescription(data.summary);
      setSearchError("");
    } else {
      setSearchError("Publicação não encontrada. Verifique o número e tente novamente.");
      setFoundData(null);
    }
    
    setIsSearching(false);
  };

  const handleSave = () => {
    onSave({
      number,
      title,
      client,
      court,
      value,
      responsible,
      description,
      source: "publicacao",
      publicationNumber: searchNumber
    });
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSearchNumber("");
    setFoundData(null);
    setSearchError("");
    setNumber("");
    setTitle("");
    setClient("");
    setCourt("");
    setValue("");
    setResponsible("");
    setDescription("");
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
            <Newspaper className="w-5 h-5" />
            Criar Processo via Publicação
          </DialogTitle>
          <DialogDescription>
            Busque a publicação do processo no sistema do tribunal para importar os dados automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Passo 1: Busca de Publicação */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm">
                1
              </div>
              <h3 className="text-gray-900 dark:text-white">Buscar Publicação</h3>
            </div>
            
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <strong>Exemplos de números de publicação para teste:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• DJE-2024-001234 (Ação Declaratória)</li>
                  <li>• DJE-2024-005678 (Recurso de Apelação)</li>
                  <li>• DJE-2024-009012 (Execução)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Ex: DJE-2024-001234"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value.toUpperCase())}
                  disabled={isSearching || !!foundData}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchNumber || isSearching || !!foundData}
                className="bg-black hover:bg-black/90 text-white"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
              {foundData && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFoundData(null);
                    setSearchNumber("");
                    setNumber("");
                    setTitle("");
                    setCourt("");
                    setDescription("");
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
                  <strong>Publicação encontrada!</strong> Os dados foram importados automaticamente. 
                  Revise e complete as informações abaixo antes de salvar.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Passo 2: Validação e Complementação */}
          {foundData && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm">
                  2
                </div>
                <h3 className="text-gray-900 dark:text-white">Validar e Complementar Dados</h3>
              </div>

              {/* Dados importados automaticamente */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Dados importados da publicação:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Número do Processo:</span>
                    <p className="text-gray-900 dark:text-white font-mono">{foundData.number}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tribunal:</span>
                    <p className="text-gray-900 dark:text-white">{foundData.courtName}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Partes:</span>
                    <p className="text-gray-900 dark:text-white">{foundData.parties}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Data da Publicação:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(foundData.publicationDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Pré-cadastrado
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Campos para complementação */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Título/Assunto * (Pré-preenchido)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Ação de Cobrança"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Cliente * (Complementar)</Label>
                  <Input
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor da Causa</Label>
                  <Input
                    id="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="responsible">Responsável *</Label>
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

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Observações (Pré-preenchido)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Informações adicionais sobre o processo"
                    rows={4}
                  />
                </div>
              </div>
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
            disabled={isLoading || !foundData || !client || !responsible}
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
