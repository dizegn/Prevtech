import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ExcluirMetaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metaName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ExcluirMetaModal({
  open,
  onOpenChange,
  metaName,
  onConfirm,
  isLoading = false,
}: ExcluirMetaModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Meta</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a meta "{metaName}"? Esta ação não pode ser desfeita
            e a meta será removida permanentemente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Excluindo..." : "Excluir Meta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}