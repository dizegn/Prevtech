import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { FileText, Info, CheckCircle2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

interface GerarKitContratualModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNome: string;
  clienteEmail: string;
  onGerar: (data: {
    template: string;
    incluirAnexos: boolean;
    emailDestinatario: string;
    mensagemPersonalizada?: string;
  }) => void;
  isLoading?: boolean;
}

// Templates disponíveis
const templatesContratuais = [
  { id: "contrato-honorarios-padrao", nome: "Contrato de Honorários - Padrão" },
  { id: "contrato-honorarios-exitoso", nome: "Contrato de Honorários - Êxito" },
  { id: "contrato-previdenciario", nome: "Contrato Previdenciário Completo" },
  { id: "contrato-trabalhista", nome: "Contrato Trabalhista" },
  { id: "procuracao-ad-judicia", nome: "Procuração Ad Judicia" },
  { id: "kit-completo-previdenciario", nome: "Kit Completo - Previdenciário (Contrato + Procuração)" },
];

export function GerarKitContratualModal({
  open,
  onOpenChange,
  clienteNome,
  clienteEmail,
  onGerar,
  isLoading = false
}: GerarKitContratualModalProps) {
  const [templateSelecionado, setTemplateSelecionado] = useState("");
  const [incluirAnexos, setIncluirAnexos] = useState(true);
  const [emailDestinatario, setEmailDestinatario] = useState(clienteEmail);
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");

  const handleGerar = () => {
    if (!templateSelecionado) return;

    onGerar({
      template: templateSelecionado,
      incluirAnexos,
      emailDestinatario,
      mensagemPersonalizada: mensagemPersonalizada || undefined
    });

    // Reset
    setTemplateSelecionado("");
    setIncluirAnexos(true);
    setMensagemPersonalizada("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gerar Kit Contratual
          </DialogTitle>
          <DialogDescription>
            Configurar e enviar documentos contratuais para {clienteNome}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informação sobre o fluxo */}
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
              <strong>Módulo M02 - Assinatura Digital:</strong> O kit contratual será gerado e enviado 
              para o cliente via e-mail com link para assinatura eletrônica (integração com plataformas 
              como ClickSign, DocuSign ou D4Sign).
            </AlertDescription>
          </Alert>

          {/* Seleção de Template */}
          <div className="space-y-2">
            <Label htmlFor="template">Template Contratual *</Label>
            <Select value={templateSelecionado} onValueChange={setTemplateSelecionado}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecione o template..." />
              </SelectTrigger>
              <SelectContent>
                {templatesContratuais.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Escolha o tipo de contrato ou procuração que será enviado ao cliente
            </p>
          </div>

          {/* E-mail de Destino */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail para Envio *</Label>
            <Input
              id="email"
              type="email"
              value={emailDestinatario}
              onChange={(e) => setEmailDestinatario(e.target.value)}
              placeholder="email@cliente.com"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              O link de assinatura será enviado para este e-mail
            </p>
          </div>

          {/* Opção de incluir anexos */}
          <div className="flex items-start space-x-3 py-2">
            <Checkbox
              id="incluirAnexos"
              checked={incluirAnexos}
              onCheckedChange={(checked) => setIncluirAnexos(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="incluirAnexos" className="cursor-pointer">
                Incluir documentos complementares
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Anexar automaticamente: Tabela de Honorários, Política de Privacidade e Termos de Uso
              </p>
            </div>
          </div>

          {/* Mensagem Personalizada (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem Personalizada (Opcional)</Label>
            <Input
              id="mensagem"
              value={mensagemPersonalizada}
              onChange={(e) => setMensagemPersonalizada(e.target.value)}
              placeholder="Ex: Olá, segue o contrato para sua análise..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Será incluída no corpo do e-mail (máx. 200 caracteres)
            </p>
          </div>

          {/* Preview do Fluxo */}
          {templateSelecionado && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-900 dark:text-green-100 text-sm">
                <strong>Próximos passos:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                  <li>Sistema gerará o documento com dados preenchidos automaticamente</li>
                  <li>E-mail será enviado para {emailDestinatario}</li>
                  <li>Cliente receberá link para visualizar e assinar eletronicamente</li>
                  <li>Você será notificado quando a assinatura for concluída</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
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
            onClick={handleGerar}
            disabled={isLoading || !templateSelecionado || !emailDestinatario}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isLoading ? "Gerando..." : "Gerar e Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
