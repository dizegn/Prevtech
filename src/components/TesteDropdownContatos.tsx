import { MoreHorizontal, Edit, FileText, FolderOpen, Archive } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Card } from "./ui/card";

export function TesteDropdownContatos() {
  const handleClick = (action: string) => {
    alert(`Ação clicada: ${action}`);
  };

  return (
    <Card className="p-8 max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4 text-black dark:text-white">
        Teste de Dropdown Menu
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Clique nos três pontinhos abaixo:
      </p>
      
      <div className="flex justify-center">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="ghost" 
              className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-haspopup="menu"
              aria-label="Menu de ações teste"
            >
              <span className="sr-only">Abrir menu de teste</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 z-[100]"
            sideOffset={5}
          >
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleClick("Ver/Editar Cadastro");
              }}
              className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Ver/Editar Cadastro</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleClick("Gerar Kit Contratual");
              }}
              className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Gerar Kit Contratual</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleClick("Visualizar Processos");
              }}
              className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Visualizar Processos</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleClick("Inativar Contato");
              }}
              className="text-orange-600 dark:text-orange-400 cursor-pointer focus:bg-orange-50 dark:focus:bg-orange-950/20"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>Inativar Contato</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Se o menu abrir e as opções forem clicáveis, o dropdown está funcionando corretamente.
      </p>
    </Card>
  );
}
