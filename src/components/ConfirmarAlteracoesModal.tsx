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
import { Badge } from "./ui/badge";
import type { PermissionChange } from "./MatrizPermissoesScreen";

interface ConfirmarAlteracoesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: PermissionChange[];
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmarAlteracoesModal({
  open,
  onOpenChange,
  changes,
  onConfirm,
  isLoading = false,
}: ConfirmarAlteracoesModalProps) {
  // Mock changes for display
  const mockChanges = [
    { profile: "Gestor", resource: "Relatórios", permission: "Criar", from: false, to: true },
    { profile: "Colaborador", resource: "Dashboard", permission: "Atualizar", from: false, to: true },
    { profile: "Diretor", resource: "Metas/KPIs", permission: "Deletar", from: true, to: false },
  ];

  const displayChanges = changes.length > 0 ? changes.map(c => ({
    profile: c.profile,
    resource: c.resource,
    permission: c.permission,
    from: c.oldValue,
    to: c.newValue,
  })) : mockChanges;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Alterações de Permissões</AlertDialogTitle>
          <AlertDialogDescription>
            Revise as alterações antes de confirmar. Estas mudanças afetarão o acesso dos usuários
            imediatamente após a confirmação.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Changes Summary */}
        <div className="max-h-[400px] overflow-y-auto space-y-3 py-4">
          {displayChanges.map((change, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{change.profile}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{change.resource}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permissão: <strong>{change.permission}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={change.from ? "default" : "secondary"}>
                    {change.from ? "Ativo" : "Inativo"}
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge variant={change.to ? "default" : "secondary"}>
                    {change.to ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-sm text-gray-900 dark:text-gray-200">
            <strong>Atenção:</strong> {displayChanges.length} alteraç{displayChanges.length === 1 ? "ão" : "ões"} ser{displayChanges.length === 1 ? "á" : "ão"} aplicada{displayChanges.length === 1 ? "" : "s"}.
            Esta ação será registrada nos logs de auditoria.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-[#003366] hover:bg-[#004080]"
          >
            {isLoading ? "Salvando..." : "Confirmar Alterações"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}