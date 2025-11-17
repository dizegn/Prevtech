import { Bell, Sun, Moon, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TopbarProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onNotificationsClick: () => void;
  onLogout: () => void;
  title?: string;
  subtitle?: string;
}

export function Topbar({ 
  theme, 
  onThemeToggle, 
  onNotificationsClick,
  onLogout,
  title = "PrevTech", 
  subtitle = "Sistema de Gestão Administrativa" 
}: TopbarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl">{title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onNotificationsClick}
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-3">
                <div className="bg-black dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Administrador</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Gerente de Processos</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}