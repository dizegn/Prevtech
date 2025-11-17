import { Home, CheckSquare, FileText, Calendar, BookOpen, BarChart3, Target, Shield, Puzzle, Settings, Users } from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "tarefas", label: "Tarefas", icon: CheckSquare },
  { id: "contatos", label: "Clientes", icon: Users },
  { id: "processos", label: "Processos", icon: FileText },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "publicacoes", label: "Publicações", icon: BookOpen },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "metas", label: "Metas/KPIs", icon: Target },
  { id: "permissoes", label: "Permissões", icon: Shield },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ activeItem = "dashboard", onItemClick }: SidebarProps) {
  return (
    <div className="bg-[#1a1a1a] dark:bg-[#0a0a0a] h-screen w-64 flex flex-col text-white">
      {/* Logo */}
      <div className="h-[113px] flex items-center justify-center border-b border-gray-700">
        <div className="bg-[rgba(255,255,255,0)] rounded-lg px-6 py-4 text-[rgba(255,255,255,0)]">
          <p className="text-[rgb(255,255,255)] text-xl font-bold">PrevTech</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                activeItem === item.id
                  ? "bg-gray-800"
                  : "hover:bg-gray-700/30"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="h-[65px] border-t border-gray-700 flex items-center justify-center px-4">
        <p className="text-xs text-gray-400 text-center">
          © 2025 PrevTech. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}