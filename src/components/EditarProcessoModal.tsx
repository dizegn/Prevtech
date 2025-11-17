import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface EditarProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processo: {
    id: string;
    number: string;
    title: string;
    client: string;
    court: string;
    status: string;
    phase: string;
    value: number;
    responsible: string;
  } | null;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function EditarProcessoModal({ 
  open, 
  onOpenChange, 
  processo, 
  onSave,
  isLoading 
}: EditarProcessoModalProps) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [court, setCourt] = useState("");
  const [status, setStatus] = useState("ativo");
  const [phase, setPhase] = useState("");
  const [value, setValue] = useState("");
  const [responsible, setResponsible] = useState("");

  useEffect(() => {
    if (processo) {
      setTitle(processo.title);
      setClient(processo.client);
      setCourt(processo.court);
      setStatus(processo.status);
      setPhase(processo.phase);
      setValue(processo.value.toString());
      setResponsible(processo.responsible);
    }
  }, [processo]);

  const handleSave = () => {
    onSave({
      id: processo?.id,
      title,
      client,
      court,
      status,
      phase,
      value: parseFloat(value),
      responsible
    });
  };

  if (!processo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Processo</DialogTitle>
          <DialogDescription>
            Modifique os campos necessários e salve as alterações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título/Assunto *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ação de Cobrança"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
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
                placeholder="0.00"
                type="number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="court">Tribunal *</Label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger id="court">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1ª Vara Cível - SP">1ª Vara Cível - SP</SelectItem>
                  <SelectItem value="2ª Vara do Trabalho - SP">2ª Vara do Trabalho - SP</SelectItem>
                  <SelectItem value="Fazenda Pública - SP">Fazenda Pública - SP</SelectItem>
                  <SelectItem value="3ª Vara Cível - SP">3ª Vara Cível - SP</SelectItem>
                  <SelectItem value="4ª Vara Cível - SP">4ª Vara Cível - SP</SelectItem>
                  <SelectItem value="Vara de Família - SP">Vara de Família - SP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="sentenciado">Sentenciado</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phase">Fase Processual *</Label>
              <Input
                id="phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                placeholder="Ex: Instrução Probatória"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável *</Label>
              <Select value={responsible} onValueChange={setResponsible}>
                <SelectTrigger id="responsible">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                  <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                  <SelectItem value="Dr. Pedro Oliveira">Dr. Pedro Oliveira</SelectItem>
                  <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            disabled={isLoading || !title || !client || !court || !phase || !responsible}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}