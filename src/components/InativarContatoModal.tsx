import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

interface InativarContatoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNome: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function InativarContatoModal({
  open,
  onOpenChange,
  clienteNome,
  onConfirm,
  isLoading = false
}: InativarContatoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-5 h-5" />
            Inativar Contato
          </DialogTitle>
          <DialogDescription>
            Esta ação mudará o status do contato para "Arquivado"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-900 dark:text-orange-100 text-sm">
              <strong>Tem certeza que deseja inativar "{clienteNome}"?</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Ao inativar este contato:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>O status será alterado para "Arquivado"</li>
              <li>Ele não poderá ser vinculado a novos processos</li>
              <li>Processos existentes não serão afetados</li>
              <li>Você poderá reativá-lo a qualquer momento</li>
            </ul>
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
              <strong>Nota:</strong> Conforme RF-001, não é permitido excluir contatos do sistema. 
              A inativação preserva todo o histórico e permite reativação futura.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? "Inativando..." : "Confirmar Inativação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
