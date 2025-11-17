import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar, FileText, Tag } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface VisualizarPublicacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicacao: {
    title: string;
    source: string;
    date: string;
    category: string;
    content: string;
  } | null;
}

export function VisualizarPublicacaoModal({ open, onOpenChange, publicacao }: VisualizarPublicacaoModalProps) {
  if (!publicacao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{publicacao.title}</DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos desta publicação
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{publicacao.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(publicacao.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <Badge variant="secondary">{publicacao.category}</Badge>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {publicacao.content}
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
