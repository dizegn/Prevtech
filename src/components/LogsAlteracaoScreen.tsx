import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

interface LogsAlteracaoScreenProps {
  onBack: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  profile: string;
  resource: string;
  permission: string;
  oldValue: string;
  newValue: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "08/10/2025 14:35:22",
    user: "admin@global.com.br",
    action: "Alteração",
    profile: "Gestor",
    resource: "Relatórios",
    permission: "Criar",
    oldValue: "Inativo",
    newValue: "Ativo",
  },
  {
    id: "2",
    timestamp: "07/10/2025 09:12:44",
    user: "admin@global.com.br",
    action: "Alteração",
    profile: "Colaborador",
    resource: "Dashboard",
    permission: "Atualizar",
    oldValue: "Inativo",
    newValue: "Ativo",
  },
  {
    id: "3",
    timestamp: "06/10/2025 16:20:15",
    user: "maria.silva@global.com.br",
    action: "Alteração",
    profile: "Diretor",
    resource: "Metas/KPIs",
    permission: "Deletar",
    oldValue: "Ativo",
    newValue: "Inativo",
  },
  {
    id: "4",
    timestamp: "05/10/2025 11:45:03",
    user: "admin@global.com.br",
    action: "Alteração",
    profile: "Gestor",
    resource: "Permissões",
    permission: "Ler",
    oldValue: "Inativo",
    newValue: "Ativo",
  },
];

export function LogsAlteracaoScreen({ onBack }: LogsAlteracaoScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl text-gray-900 dark:text-white">Logs de Alteração</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Histórico de alterações de permissões (retenção: 365 dias)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por usuário, perfil ou recurso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell className="text-sm">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.profile}</Badge>
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.permission}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.oldValue}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{log.newValue}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredLogs.length)} de {filteredLogs.length} registros
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}