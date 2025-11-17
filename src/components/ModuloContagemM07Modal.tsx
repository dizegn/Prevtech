import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Calculator, Calendar, CheckCircle2, AlertCircle, Download, FileText, Shield } from "lucide-react";
import { Progress } from "./ui/progress";

interface ModuloContagemM07ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processData: any;
}

type PeriodoContribuicao = {
  id: string;
  inicio: string;
  fim: string;
  empresa: string;
  tipo: "CLT" | "Autonomo" | "Rural" | "Especial";
  tempoTotal: string;
  status: "validado" | "pendente" | "inconsistente";
};

const mockPeriodos: PeriodoContribuicao[] = [
  {
    id: "1",
    inicio: "01/03/1985",
    fim: "15/12/1992",
    empresa: "Metalúrgica ABC Ltda",
    tipo: "CLT",
    tempoTotal: "7 anos, 9 meses e 14 dias",
    status: "validado"
  },
  {
    id: "2",
    inicio: "02/01/1993",
    fim: "30/06/2000",
    empresa: "Construtora XYZ S/A",
    tipo: "CLT",
    tempoTotal: "7 anos, 5 meses e 28 dias",
    status: "validado"
  },
  {
    id: "3",
    inicio: "10/08/2000",
    fim: "20/04/2008",
    empresa: "Indústria Delta ME",
    tipo: "Especial",
    tempoTotal: "7 anos, 8 meses e 10 dias (x1.4)",
    status: "validado"
  },
  {
    id: "4",
    inicio: "15/05/2008",
    fim: "10/09/2024",
    empresa: "Comércio Beta Ltda",
    tipo: "CLT",
    tempoTotal: "16 anos, 3 meses e 25 dias",
    status: "validado"
  }
];

export function ModuloContagemM07Modal({
  open,
  onOpenChange,
  processData
}: ModuloContagemM07ModalProps) {
  const [isCalculating, setIsCalculating] = useState(false);

  // Dados calculados
  const tempoTotalContribuicao = "35 anos, 4 meses e 7 dias";
  const tempoNecessario = "35 anos";
  const percentualAtingido = 100.95;
  const dataElegibilidade = "01/09/2020";
  const idadeAtual = 58;
  const idadeMinima = 60; // Para aposentadoria por idade

  const handleGerarRelatorio = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Relatório M07 gerado! (Em produção, seria baixado em PDF)");
    setIsCalculating(false);
  };

  const getStatusIcon = (status: PeriodoContribuicao["status"]) => {
    switch (status) {
      case "validado":
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "pendente":
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "inconsistente":
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusBadge = (status: PeriodoContribuicao["status"]) => {
    switch (status) {
      case "validado":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">Validado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs">Pendente</Badge>;
      case "inconsistente":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">Inconsistente</Badge>;
    }
  };

  const getTipoBadge = (tipo: PeriodoContribuicao["tipo"]) => {
    const colors = {
      "CLT": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "Autonomo": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Rural": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "Especial": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    };
    return <Badge className={`${colors[tipo]} text-xs`}>{tipo}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[832px] max-w-[832px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Módulo de Contagem de Aposentadoria (M07)
          </DialogTitle>
          <DialogDescription>
            Cálculo automatizado de tempo de contribuição baseado nos dados do CNIS
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header com diferencial */}
          <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-purple-900 dark:text-purple-100">
              <strong>Diferencial MVP:</strong> Este módulo utiliza dados do CNIS obtidos via integração GOV.BR 
              para calcular automaticamente o tempo de contribuição e elegibilidade para aposentadoria.
            </AlertDescription>
          </Alert>

          {/* Resumo do Cálculo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Tempo Total de Contribuição</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-gray-900 dark:text-white">{tempoTotalContribuicao}</p>
                <Progress value={percentualAtingido} className="mt-2 h-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {percentualAtingido.toFixed(2)}% do tempo necessário
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Data de Elegibilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-gray-900 dark:text-white">{dataElegibilidade}</p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2">
                  Elegível
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs">Idade Atual / Mínima</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-gray-900 dark:text-white">{idadeAtual} / {idadeMinima} anos</p>
                {idadeAtual < idadeMinima ? (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mt-2">
                    Faltam {idadeMinima - idadeAtual} anos
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2">
                    Idade atingida
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Análise de Períodos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>Períodos de Contribuição (CNIS)</CardTitle>
              </div>
              <CardDescription>
                Períodos importados automaticamente do CNIS via GOV.BR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPeriodos.map((periodo) => (
                  <div
                    key={periodo.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(periodo.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {periodo.empresa}
                        </p>
                        {getTipoBadge(periodo.tipo)}
                        {getStatusBadge(periodo.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{periodo.inicio} a {periodo.fim}</span>
                        </div>
                        <div>
                          <strong>Tempo:</strong> {periodo.tempoTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info sobre tempo especial */}
              <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                  <strong>Tempo Especial:</strong> Períodos marcados como "Especial" possuem fator 
                  de conversão de 1.4, conforme legislação previdenciária vigente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Análise de Elegibilidade */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <CardTitle>Análise de Elegibilidade</CardTitle>
              </div>
              <CardDescription>
                Requisitos para aposentadoria conforme regras atuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 dark:text-green-100">
                      <strong>Tempo de Contribuição:</strong> Requisito atingido em {dataElegibilidade}. 
                      O segurado possui {tempoTotalContribuicao} de contribuição, ultrapassando o mínimo de {tempoNecessario}.
                    </p>
                  </div>
                </div>

                {idadeAtual < idadeMinima && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-900 dark:text-yellow-100">
                        <strong>Idade Mínima:</strong> O segurado ainda não atingiu a idade mínima de {idadeMinima} anos. 
                        Atualmente com {idadeAtual} anos, faltam {idadeMinima - idadeAtual} anos para elegibilidade completa.
                      </p>
                    </div>
                  </div>
                )}

                {idadeAtual >= idadeMinima && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900 dark:text-green-100">
                        <strong>Idade Mínima:</strong> Requisito atingido. O segurado possui {idadeAtual} anos, 
                        superando a idade mínima de {idadeMinima} anos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={handleGerarRelatorio}
            disabled={isCalculating}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isCalculating ? (
              <>
                <Calculator className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Gerar Relatório M07
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}