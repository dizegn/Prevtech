import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { FileText, Newspaper, ArrowRight, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface SelecionarTipoProcessoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectManual: () => void;
  onSelectPublicacao: () => void;
  onSelectINSS: () => void;
}

export function SelecionarTipoProcessoModal({
  open,
  onOpenChange,
  onSelectManual,
  onSelectPublicacao,
  onSelectINSS
}: SelecionarTipoProcessoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Processo</DialogTitle>
          <DialogDescription>
            Selecione como deseja cadastrar o processo no sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-6">
          {/* Opção 1: Criar via INSS/GOV.BR - Módulo Previdenciário */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 bg-purple-50/30 dark:bg-purple-900/10">
            <button
              onClick={onSelectINSS}
              className="w-full text-left"
            >
              <div className="flex items-start gap-6">
                {/* Ícone à esquerda */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Conteúdo principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900 dark:text-white text-lg">
                      Busca Automática INSS
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs">
                      Módulo Previdenciário
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Importe processos previdenciários automaticamente via GOV.BR com acesso ao CNIS
                  </p>
                  
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                      <span>Busca processual automática do INSS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                      <span>Acesso ao Módulo de Contagem (M07)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                      <span>Integração com CNIS via GOV.BR</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </Card>

          {/* Opção 2: Criar via Publicação */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white">
            <button
              onClick={onSelectPublicacao}
              className="w-full text-left"
            >
              <div className="flex items-start gap-6">
                {/* Ícone à esquerda */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-white dark:text-black" />
                  </div>
                </div>
                
                {/* Conteúdo principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900 dark:text-white text-lg">
                      Criar via Publicação
                    </h3>
                    <div className="inline-flex items-center gap-1 text-sm text-black dark:text-white">
                      <span>Recomendado</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Importe automaticamente dados de processos através da API de publicações do tribunal
                  </p>
                  
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span>Dados pré-preenchidos automaticamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span>Integração com tribunais via API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span>Maior agilidade no cadastro</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </Card>

          {/* Opção 3: Cadastro Manual */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500">
            <button
              onClick={onSelectManual}
              className="w-full text-left"
            >
              <div className="flex items-start gap-6">
                {/* Ícone à esquerda */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-700 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Conteúdo principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900 dark:text-white text-lg">
                      Cadastro Manual
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Para casos especiais
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Preencha manualmente todos os dados do processo
                  </p>
                  
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      <span>Ideal para processos em segredo de justiça</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      <span>Processos sem publicação disponível</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      <span>Controle total sobre os dados inseridos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}