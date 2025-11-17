import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  type: "audiencia" | "reuniao" | "prazo" | "compromisso";
  color: string;
};

interface EditarEventoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evento: Event | null;
  onSalvar?: (evento: Event) => void;
}

export function EditarEventoModal({ open, onOpenChange, evento, onSalvar }: EditarEventoModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 0,
    location: "",
    type: "reuniao" as "audiencia" | "reuniao" | "prazo" | "compromisso"
  });

  // Preencher formulário quando o evento mudar
  useEffect(() => {
    if (evento) {
      setFormData({
        title: evento.title,
        description: evento.description,
        date: evento.date,
        time: evento.time,
        duration: evento.duration,
        location: evento.location,
        type: evento.type
      });
    }
  }, [evento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (evento && onSalvar) {
      const updatedEvento: Event = {
        ...evento,
        ...formData
      };
      onSalvar(updatedEvento);
      onOpenChange(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "audiencia": return "red";
      case "reuniao": return "gray";
      case "prazo": return "orange";
      case "compromisso": return "green";
      default: return "gray";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Atualize as informações do evento. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Audiência - Processo 0001234-56.2024"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os detalhes do evento"
                rows={3}
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tipo de Evento *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "audiencia" | "reuniao" | "prazo" | "compromisso") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audiencia">Audiência</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="prazo">Prazo</SelectItem>
                  <SelectItem value="compromisso">Compromisso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 60"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deixe em branco ou 0 para eventos sem duração específica (como prazos)
              </p>
            </div>

            {/* Local */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: 2ª Vara Cível - SP"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
