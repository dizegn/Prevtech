import { Shield, Edit2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Breadcrumb } from "./Breadcrumb";

interface PermissoesScreenProps {
  onEditMatrix: () => void;
  onViewLogs: () => void;
  onNavigateHome?: () => void;
}

interface Profile {
  id: string;
  name: string;
  description: string;
  users: number;
  resources: { name: string; permissions: string[] }[];
}

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Diretor",
    description: "Acesso total ao sistema",
    users: 3,
    resources: [
      { name: "Dashboard", permissions: ["Leitura", "Edição", "Criação", "Exclusão"] },
      { name: "Relatórios", permissions: ["Leitura", "Criação"] },
      { name: "Metas/KPIs", permissions: ["Leitura", "Edição", "Criação", "Exclusão"] },
    ],
  },
  {
    id: "2",
    name: "Gestor",
    description: "Gerenciamento de equipe e processos",
    users: 8,
    resources: [
      { name: "Dashboard", permissions: ["Leitura", "Edição"] },
      { name: "Relatórios", permissions: ["Leitura", "Criação"] },
      { name: "Metas/KPIs", permissions: ["Leitura", "Edição"] },
    ],
  },
  {
    id: "3",
    name: "Colaborador",
    description: "Acesso operacional limitado",
    users: 45,
    resources: [
      { name: "Dashboard", permissions: ["Leitura"] },
      { name: "Relatórios", permissions: ["Leitura"] },
      { name: "Tarefas", permissions: ["Leitura", "Edição"] },
    ],
  },
];

export function PermissoesScreen({ onEditMatrix, onViewLogs, onNavigateHome }: PermissoesScreenProps) {
  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Permissões", onClick: onNavigateHome }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white">Permissões</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie perfis e controle de acesso por recurso
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onViewLogs} className="gap-2">
              <FileText className="w-4 h-4" />
              Ver Logs
            </Button>
            <Button onClick={onEditMatrix} className="bg-black hover:bg-black/90 text-white gap-2">
              <Edit2 className="w-4 h-4" />
              Editar Matriz
            </Button>
          </div>
        </div>

        {/* Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProfiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#003366] dark:bg-[#004080] rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <CardDescription className="mt-1">{profile.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{profile.users} usuários</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm text-gray-900 dark:text-white">Permissões por Recurso</h4>
                  {profile.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-t dark:border-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {resource.name}
                      </span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {resource.permissions.map((perm, pidx) => (
                          <Badge key={pidx} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Alert */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Atenção:</strong> A exclusão de contatos está sempre bloqueada para todos os perfis por
            política de segurança. Alterações na matriz de permissões requerem confirmação com visualização de diffs.
          </p>
        </div>
      </div>
    </div>
  );
}