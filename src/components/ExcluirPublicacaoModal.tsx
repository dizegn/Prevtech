import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface ExcluirPublicacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicacaoTitle: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ExcluirPublicacaoModal({
  open,
  onOpenChange,
  publicacaoTitle,
  onConfirm,
  isLoading
}: ExcluirPublicacaoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle>Excluir Publicação</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Tem certeza que deseja excluir a publicação{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              "{publicacaoTitle}"
            </span>
            ? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}