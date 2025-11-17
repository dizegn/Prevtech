import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface ExcluirProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processoTitle: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ExcluirProcessoModal({
  open,
  onOpenChange,
  processoTitle,
  onConfirm,
  isLoading
}: ExcluirProcessoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle>Arquivar Processo</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Tem certeza que deseja arquivar o processo <strong>"{processoTitle}"</strong>?
            <br /><br />
            O processo será movido para a seção de arquivados e poderá ser restaurado posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Arquivando..." : "Arquivar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}