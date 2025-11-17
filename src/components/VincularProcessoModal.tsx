import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, FileText, Link2, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface VincularProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicacaoTitulo: string;
  onVincular?: (processoId: string) => void;
}

// Mock de processos para seleção
const mockProcessos = [
  {
    id: "1",
    numero: "0001234-56.2024.8.26.0100",
    titulo: "Aposentadoria por Tempo de Contribuição",
    cliente: "João Silva",
    status: "ativo"
  },
  {
    id: "2",
    numero: "0007890-12.2024.8.26.0100",
    titulo: "Revisão de Benefício",
    cliente: "Maria Santos",
    status: "ativo"
  },
  {
    id: "3",
    numero: "0003456-78.2023.8.26.0100",
    titulo: "Auxílio-Doença",
    cliente: "Pedro Oliveira",
    status: "ativo"
  },
  {
    id: "4",
    numero: "0009012-34.2025.8.26.0100",
    titulo: "Pensão por Morte",
    cliente: "Ana Costa",
    status: "ativo"
  }
];

export function VincularProcessoModal({ open, onOpenChange, publicacaoTitulo, onVincular }: VincularProcessoModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState("");

  const filteredProcessos = mockProcessos.filter(p =>
    p.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVincular = () => {
    if (selectedProcesso && onVincular) {
      onVincular(selectedProcesso);
      onOpenChange(false);
      setSearchQuery("");
      setSelectedProcesso("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Vincular ao Processo
          </DialogTitle>
          <DialogDescription>
            Selecione o processo que deseja vincular a esta publicação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Publicação */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">Publicação:</Label>
            <p className="text-sm text-gray-900 dark:text-white">{publicacaoTitulo}</p>
          </div>

          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Processo</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o número do processo, título ou cliente"
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de Processos */}
          <div className="space-y-2">
            <Label>Selecionar Processo</Label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-[300px] overflow-y-auto">
              {filteredProcessos.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum processo encontrado</p>
                </div>
              ) : (
                filteredProcessos.map((processo) => (
                  <div
                    key={processo.id}
                    onClick={() => setSelectedProcesso(processo.id)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                      selectedProcesso === processo.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {processo.numero}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {processo.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                          {processo.titulo}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Cliente: {processo.cliente}
                        </p>
                      </div>
                      {selectedProcesso === processo.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSearchQuery("");
              setSelectedProcesso("");
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="button"
            onClick={handleVincular}
            disabled={!selectedProcesso}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Vincular Processo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
