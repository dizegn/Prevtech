import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface NovoProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function NovoProcessoModal({
  open,
  onOpenChange,
  onSave,
  isLoading
}: NovoProcessoModalProps) {
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [court, setCourt] = useState("");
  const [value, setValue] = useState("");
  const [responsible, setResponsible] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave({
      number,
      title,
      client,
      court,
      value,
      responsible,
      description,
      source: "manual"
    });
    // Reset form
    setNumber("");
    setTitle("");
    setClient("");
    setCourt("");
    setValue("");
    setResponsible("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro Manual de Processo</DialogTitle>
          <DialogDescription>
            Preencha manualmente os dados do processo jurídico
          </DialogDescription>
        </DialogHeader>

        <Alert className="my-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-900 dark:text-yellow-100">
            <strong>Cadastro Manual:</strong> Utilize esta opção para processos em segredo de justiça 
            ou casos onde não há publicação disponível no sistema do tribunal.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número do Processo *</Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="0000000-00.0000.0.00.0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Tribunal *</Label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger id="court">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TJSP">TJSP - Tribunal de Justiça de SP</SelectItem>
                  <SelectItem value="TJRJ">TJRJ - Tribunal de Justiça do RJ</SelectItem>
                  <SelectItem value="TJMG">TJMG - Tribunal de Justiça de MG</SelectItem>
                  <SelectItem value="STJ">STJ - Superior Tribunal de Justiça</SelectItem>
                  <SelectItem value="STF">STF - Supremo Tribunal Federal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger id="responsible">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observações</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informações adicionais sobre o processo"
              rows={4}
            />
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
            disabled={isLoading || !number || !title || !client || !court || !responsible}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Criando..." : "Criar Processo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}