import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Lock } from "lucide-react";

interface MatrizPermissoesScreenProps {
  onSave: (changes: PermissionChange[]) => void;
  onCancel: () => void;
}

export interface PermissionChange {
  profile: string;
  resource: string;
  permission: string;
  oldValue: boolean;
  newValue: boolean;
}

interface Permission {
  resource: string;
  diretor: { c: boolean; r: boolean; u: boolean; d: boolean };
  gestor: { c: boolean; r: boolean; u: boolean; d: boolean };
  colaborador: { c: boolean; r: boolean; u: boolean; d: boolean };
}

export function MatrizPermissoesScreen({ onSave, onCancel }: MatrizPermissoesScreenProps) {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      resource: "Dashboard",
      diretor: { c: true, r: true, u: true, d: true },
      gestor: { c: false, r: true, u: true, d: false },
      colaborador: { c: false, r: true, u: false, d: false },
    },
    {
      resource: "Relatórios",
      diretor: { c: true, r: true, u: true, d: true },
      gestor: { c: true, r: true, u: false, d: false },
      colaborador: { c: false, r: true, u: false, d: false },
    },
    {
      resource: "Metas/KPIs",
      diretor: { c: true, r: true, u: true, d: true },
      gestor: { c: false, r: true, u: true, d: false },
      colaborador: { c: false, r: true, u: false, d: false },
    },
    {
      resource: "Permissões",
      diretor: { c: false, r: true, u: true, d: false },
      gestor: { c: false, r: true, u: false, d: false },
      colaborador: { c: false, r: false, u: false, d: false },
    },
    {
      resource: "Contatos",
      diretor: { c: true, r: true, u: true, d: false },
      gestor: { c: true, r: true, u: true, d: false },
      colaborador: { c: true, r: true, u: true, d: false },
    },
  ]);

  const handlePermissionChange = (
    resourceIndex: number,
    profile: "diretor" | "gestor" | "colaborador",
    permission: "c" | "r" | "u" | "d"
  ) => {
    const newPermissions = [...permissions];
    newPermissions[resourceIndex][profile][permission] = !newPermissions[resourceIndex][profile][permission];
    setPermissions(newPermissions);
  };

  const handleSave = () => {
    // In a real app, calculate changes and pass to parent
    const changes: PermissionChange[] = [];
    onSave(changes);
  };

  const PermissionCell = ({
    checked,
    disabled = false,
    onChange,
  }: {
    checked: boolean;
    disabled?: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-center">
      {disabled ? (
        <Lock className="w-4 h-4 text-gray-400" />
      ) : (
        <Checkbox checked={checked} onCheckedChange={onChange} />
      )}
    </div>
  );

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Matriz de Permissões</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ajuste permissões CRUD por perfil e recurso
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-sm">
          <Badge variant="outline">C = Criar</Badge>
          <Badge variant="outline">R = Ler</Badge>
          <Badge variant="outline">U = Atualizar</Badge>
          <Badge variant="outline">D = Deletar</Badge>
        </div>

        {/* Matrix Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Recurso</TableHead>
                <TableHead className="text-center" colSpan={4}>Diretor</TableHead>
                <TableHead className="text-center" colSpan={4}>Gestor</TableHead>
                <TableHead className="text-center" colSpan={4}>Colaborador</TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                {["Diretor", "Gestor", "Colaborador"].map((profile) => (
                  <React.Fragment key={profile}>
                    <TableHead className="text-center w-12">C</TableHead>
                    <TableHead className="text-center w-12">R</TableHead>
                    <TableHead className="text-center w-12">U</TableHead>
                    <TableHead className="text-center w-12">D</TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, idx) => (
                <TableRow key={idx}>
                  <TableCell>{perm.resource}</TableCell>
                  
                  {/* Diretor */}
                  <TableCell>
                    <PermissionCell
                      checked={perm.diretor.c}
                      onChange={() => handlePermissionChange(idx, "diretor", "c")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.diretor.r}
                      onChange={() => handlePermissionChange(idx, "diretor", "r")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.diretor.u}
                      onChange={() => handlePermissionChange(idx, "diretor", "u")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.diretor.d}
                      disabled={perm.resource === "Contatos"}
                      onChange={() => handlePermissionChange(idx, "diretor", "d")}
                    />
                  </TableCell>

                  {/* Gestor */}
                  <TableCell>
                    <PermissionCell
                      checked={perm.gestor.c}
                      onChange={() => handlePermissionChange(idx, "gestor", "c")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.gestor.r}
                      onChange={() => handlePermissionChange(idx, "gestor", "r")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.gestor.u}
                      onChange={() => handlePermissionChange(idx, "gestor", "u")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.gestor.d}
                      disabled={perm.resource === "Contatos"}
                      onChange={() => handlePermissionChange(idx, "gestor", "d")}
                    />
                  </TableCell>

                  {/* Colaborador */}
                  <TableCell>
                    <PermissionCell
                      checked={perm.colaborador.c}
                      onChange={() => handlePermissionChange(idx, "colaborador", "c")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.colaborador.r}
                      onChange={() => handlePermissionChange(idx, "colaborador", "r")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.colaborador.u}
                      onChange={() => handlePermissionChange(idx, "colaborador", "u")}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionCell
                      checked={perm.colaborador.d}
                      disabled={perm.resource === "Contatos"}
                      onChange={() => handlePermissionChange(idx, "colaborador", "d")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Info Alert */}
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Bloqueio de Segurança:</strong> A exclusão de contatos (D) está sempre bloqueada
            para todos os perfis por política de segurança da organização.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-[#003366] hover:bg-[#004080]">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add React import for Fragment
import React from "react";