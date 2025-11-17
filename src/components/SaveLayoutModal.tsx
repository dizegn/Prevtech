import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SaveLayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (layoutName: string) => void;
  isLoading?: boolean;
}

export function SaveLayoutModal({ open, onOpenChange, onSave, isLoading = false }: SaveLayoutModalProps) {
  const [layoutName, setLayoutName] = useState("");

  const handleSave = () => {
    if (layoutName.trim()) {
      onSave(layoutName.trim());
      setLayoutName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar Layout</DialogTitle>
          <DialogDescription>
            Informe um nome para este layout personalizado do dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="layout-name">Nome do Layout</Label>
            <Input
              id="layout-name"
              placeholder="Ex: Meu Dashboard Personalizado"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && layoutName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!layoutName.trim() || isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
