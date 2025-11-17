import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

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

interface ExcluirEventoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evento: Event | null;
  onConfirmar?: (eventoId: string) => void;
}

export function ExcluirEventoModal({ open, onOpenChange, evento, onConfirmar }: ExcluirEventoModalProps) {
  const handleConfirmar = () => {
    if (evento && onConfirmar) {
      onConfirmar(evento.id);
      onOpenChange(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "audiencia": return "Audiência";
      case "reuniao": return "Reunião";
      case "prazo": return "Prazo";
      case "compromisso": return "Compromisso";
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle>Confirmar Exclusão de Evento</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </p>
            
            {evento && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                  <p className="text-gray-900 dark:text-white">{getTypeLabel(evento.type)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Título:</span>
                  <p className="text-gray-900 dark:text-white">{evento.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(evento.date)} às {evento.time}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Local:</span>
                  <p className="text-gray-900 dark:text-white">{evento.location}</p>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
