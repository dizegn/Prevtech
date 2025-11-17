import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface ConfigurarAlertaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (channels: string[], keywords: string[]) => void;
  isLoading?: boolean;
}

export function ConfigurarAlertaModal({
  open,
  onOpenChange,
  onSave,
  isLoading
}: ConfigurarAlertaModalProps) {
  const [channels, setChannels] = useState<string[]>(["email"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["Intimação", "Citação"]);

  const toggleChannel = (channel: string) => {
    setChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = () => {
    onSave(channels, keywords);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar Alertas</DialogTitle>
          <DialogDescription>
            Defina como e quando você deseja receber notificações sobre novas publicações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Canais de notificação */}
          <div className="space-y-3">
            <Label>Canais de Notificação</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="email"
                  checked={channels.includes("email")}
                  onCheckedChange={() => toggleChannel("email")}
                />
                <label htmlFor="email" className="text-sm cursor-pointer">
                  Email
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="push"
                  checked={channels.includes("push")}
                  onCheckedChange={() => toggleChannel("push")}
                />
                <label htmlFor="push" className="text-sm cursor-pointer">
                  Notificação Push
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sms"
                  checked={channels.includes("sms")}
                  onCheckedChange={() => toggleChannel("sms")}
                />
                <label htmlFor="sms" className="text-sm cursor-pointer">
                  SMS
                </label>
              </div>
            </div>
          </div>

          {/* Palavras-chave */}
          <div className="space-y-3">
            <Label htmlFor="keyword">Palavras-chave</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receba alertas quando estas palavras aparecerem nas publicações
            </p>
            <div className="flex gap-2">
              <Input
                id="keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Digite uma palavra-chave"
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                Adicionar
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || channels.length === 0}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}