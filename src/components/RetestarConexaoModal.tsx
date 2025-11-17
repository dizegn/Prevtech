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

interface RetestarConexaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RetestarConexaoModal({
  open,
  onOpenChange,
  integrationName,
  onConfirm,
  isLoading = false,
}: RetestarConexaoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retestar Conexão</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja retestar a conexão com {integrationName}? Este processo verificará
            a conectividade, autenticação e disponibilidade do serviço.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-[#003366] hover:bg-[#004080]"
          >
            {isLoading ? "Testando..." : "Retestar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}