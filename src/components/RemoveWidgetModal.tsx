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

interface RemoveWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RemoveWidgetModal({
  open,
  onOpenChange,
  widgetName,
  onConfirm,
  isLoading = false,
}: RemoveWidgetModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Widget</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o widget "{widgetName}" do dashboard?
            Esta ação pode ser revertida adicionando o widget novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
