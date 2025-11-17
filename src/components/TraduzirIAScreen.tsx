import { useState } from "react";
import { ArrowLeft, FileText, Sparkles, Send, Copy, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Breadcrumb } from "./Breadcrumb";
import { toast } from "sonner@2.0.3";
import type { Publication } from "./PublicacoesScreen";

interface TraduzirIAScreenProps {
  publicacao: Publication | null;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
}

export function TraduzirIAScreen({ publicacao, onNavigateBack, onNavigateHome }: TraduzirIAScreenProps) {
  const [resumoIA, setResumoIA] = useState("");
  const [resumoOriginal, setResumoOriginal] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [isModified, setIsModified] = useState(false);

  // Simula geração do resumo com IA
  useState(() => {
    setTimeout(() => {
      if (publicacao) {
        const resumoGerado = gerarResumoIA(publicacao);
        setResumoIA(resumoGerado);
        setResumoOriginal(resumoGerado);
        setIsGenerating(false);
        toast.success("Resumo gerado com sucesso pela IA");
      }
    }, 2000);
  });

  const handleResumoChange = (value: string) => {
    setResumoIA(value);
    setIsModified(value !== resumoOriginal);
  };

  const gerarResumoIA = (pub: Publication): string => {
    // Simulação de resumo gerado pela IA
    const prazoTexto = pub.deadline 
      ? `⏰ PRAZO FATAL: ${new Date(pub.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`
      : '';
    
    return `📋 RESUMO EXECUTIVO - TRADUÇÃO INTELIGENTE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 INFORMAÇÕES PRINCIPAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Tipo de Publicação: ${getCategoryLabel(pub.category).toUpperCase()}
🔹 Processo Nº: ${pub.processNumber || "Não especificado"}
🔹 Data da Publicação: ${new Date(pub.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
🔹 Fonte: ${pub.source}
${prazoTexto ? `\n${prazoTexto}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 SÍNTESE DA PUBLICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pub.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ANÁLISE E PONTOS DE ATENÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Verificar prazos processuais e cumprir todas as determinações judiciais
⚠️ Documentar todas as ações e providências adotadas
⚠️ Manter comunicação constante com o cliente sobre o andamento
⚠️ Revisar a necessidade de juntada de documentos ou peças complementares

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ RECOMENDAÇÕES JURÍDICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta publicação demanda atenção imediata da equipe jurídica. É fundamental realizar análise minuciosa do teor integral e adotar as providências cabíveis dentro dos prazos legalmente estabelecidos, evitando preclusões ou outros prejuízos processuais.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRÓXIMOS PASSOS SUGERIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Realizar leitura integral e detalhada da publicação
2️⃣ Verificar necessidade de juntada de documentos ou esclarecimentos
3️⃣ Preparar minutas de peças processuais, se aplicável
4️⃣ Protocolar tempestivamente dentro do prazo legal
5️⃣ Registrar no sistema de gestão processual
6️⃣ Notificar o cliente sobre a publicação e providências

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Resumo gerado automaticamente por IA
✏️ Este texto é totalmente editável antes do envio`;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "intimacao": return "Intimação";
      case "citacao": return "Citação";
      case "sentenca": return "Sentença";
      case "despacho": return "Despacho";
      case "edicao": return "Edição";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "intimacao": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "citacao": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "sentenca": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "despacho": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "edicao": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const handleEnviarWhatsApp = () => {
    if (!resumoIA.trim()) {
      toast.error("O resumo está vazio. Gere ou edite o conteúdo antes de enviar.");
      return;
    }

    // Simula abertura de seleção de contato/número do WhatsApp
    // Em produção, isso abriria um modal de seleção de contatos ou integraria com a API do WhatsApp Business
    const numeroWhatsApp = "5511999999999"; // Número de exemplo
    const textoEncoded = encodeURIComponent(resumoIA);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoEncoded}`;
    
    toast.success("Abrindo WhatsApp Web...");
    // window.open(urlWhatsApp, '_blank');
    
    // Por enquanto, apenas simula
    console.log("Enviar para WhatsApp:", resumoIA);
  };

  const handleCopiarResumo = () => {
    navigator.clipboard.writeText(resumoIA);
    toast.success("Resumo copiado para a área de transferência");
  };

  const handleBaixarResumo = () => {
    const blob = new Blob([resumoIA], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-ia-${publicacao?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Resumo baixado com sucesso");
  };

  if (!publicacao) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">Nenhuma publicação selecionada.</p>
            <Button onClick={onNavigateBack} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Publicações", onClick: onNavigateBack },
            { label: "Traduzir com IA" }
          ]}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onNavigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-gray-900 dark:text-white">Tradução com IA</h1>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-11">
              Resumo automático gerado por Inteligência Artificial
            </p>
          </div>
          
          <Badge className={getCategoryColor(publicacao.category)}>
            {getCategoryLabel(publicacao.category)}
          </Badge>
        </div>

        {/* Seção Superior: Conteúdo Original */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-gray-900 dark:text-white">Conteúdo Original da Publicação</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <p className="text-gray-900 dark:text-white">
                {publicacao.title}
              </p>
            </div>

            <Separator />

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Descrição Completa
              </label>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {publicacao.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Fonte
                </label>
                <p className="text-gray-900 dark:text-white">
                  {publicacao.source}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Data de Publicação
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(publicacao.date).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {publicacao.processNumber && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Número do Processo
                  </label>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {publicacao.processNumber}
                  </p>
                </div>
              )}
            </div>

            {publicacao.deadline && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-700 dark:text-red-300">
                    ⏰ Prazo: {new Date(publicacao.deadline).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção Inferior: Resumo Gerado pela IA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-gray-900 dark:text-white">Resumo Gerado pela IA</h2>
                {isGenerating && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                    Gerando...
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopiarResumo}
                  disabled={isGenerating || !resumoIA}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBaixarResumo}
                  disabled={isGenerating || !resumoIA}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Edite o resumo conforme necessário
              </label>
              {isGenerating ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-2/3" />
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                      <span>A IA está analisando a publicação e gerando o resumo...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea
                    value={resumoIA}
                    onChange={(e) => setResumoIA(e.target.value)}
                    placeholder="Digite ou edite o resumo aqui"
                    className="min-h-[500px] font-mono text-sm leading-relaxed resize-y"
                  />
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {resumoIA.length} caracteres
                  </p>
                </>
              )}
            </div>

            <Separator />

            {/* Botão Enviar para WhatsApp */}
            <div className="flex justify-end">
              <Button 
                onClick={handleEnviarWhatsApp}
                disabled={isGenerating || !resumoIA.trim()}
                className="gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                size="lg"
              >
                <Send className="w-5 h-5" />
                Enviar para WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Informação sobre IA */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Sobre a Tradução com IA:</strong> Este resumo foi gerado automaticamente por 
                Inteligência Artificial com base no conteúdo da publicação. Você pode editar livremente 
                o texto antes de enviá-lo. A IA analisa o conteúdo jurídico e gera uma síntese executiva 
                com os pontos mais relevantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
