// Templates de Workflow para Criação de Subtarefas com Alocação Automática

export interface SubTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueOffset: number; // dias após a data da tarefa principal
  isRequired: boolean;
  order: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subtasks: SubTask[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "onboarding-cliente",
    name: "Onboarding de Cliente",
    description: "Processo completo de integração de novo cliente",
    category: "Clientes",
    subtasks: [
      {
        id: "st1",
        title: "Cadastro inicial e coleta de documentos",
        description: "Coletar CPF, RG, comprovante de residência e documentos específicos do caso",
        assignee: "Ana Silva",
        dueOffset: 2,
        isRequired: true,
        order: 1
      },
      {
        id: "st2",
        title: "Análise preliminar do caso",
        description: "Revisar documentação e identificar viabilidade jurídica",
        assignee: "Carlos Santos",
        dueOffset: 5,
        isRequired: true,
        order: 2
      },
      {
        id: "st3",
        title: "Elaboração de proposta comercial",
        description: "Criar proposta de honorários e cronograma de trabalho",
        assignee: "Beatriz Lima",
        dueOffset: 7,
        isRequired: true,
        order: 3
      },
      {
        id: "st4",
        title: "Assinatura de contrato",
        description: "Enviar contrato para assinatura digital e arquivar",
        assignee: "Ana Silva",
        dueOffset: 10,
        isRequired: true,
        order: 4
      }
    ]
  },
  {
    id: "processo-previdenciario",
    name: "Processo Previdenciário - Fluxo Completo",
    description: "Workflow para gestão de processo previdenciário do início ao fim",
    category: "Previdenciário",
    subtasks: [
      {
        id: "st1",
        title: "Busca automática via GOV.BR",
        description: "Acessar sistema GOV.BR e extrair dados previdenciários do cliente",
        assignee: "Ana Silva",
        dueOffset: 1,
        isRequired: true,
        order: 1
      },
      {
        id: "st2",
        title: "Análise de contagem M07",
        description: "Realizar contagem de tempo de contribuição usando módulo M07",
        assignee: "Carlos Santos",
        dueOffset: 3,
        isRequired: true,
        order: 2
      },
      {
        id: "st3",
        title: "Elaboração de peça inicial",
        description: "Redigir petição inicial com base nos dados coletados",
        assignee: "Beatriz Lima",
        dueOffset: 7,
        isRequired: true,
        order: 3
      },
      {
        id: "st4",
        title: "Protocolo judicial",
        description: "Protocolar ação no sistema e-Proc ou PJe",
        assignee: "Ana Silva",
        dueOffset: 10,
        isRequired: true,
        order: 4
      },
      {
        id: "st5",
        title: "Notificação ao cliente",
        description: "Informar cliente sobre protocolo e próximos passos",
        assignee: "Ana Silva",
        dueOffset: 11,
        isRequired: false,
        order: 5
      }
    ]
  },
  {
    id: "auditoria-compliance",
    name: "Auditoria e Compliance",
    description: "Processo de auditoria interna e verificação de conformidade",
    category: "Compliance",
    subtasks: [
      {
        id: "st1",
        title: "Levantamento de documentação",
        description: "Coletar todos os documentos e registros do período auditado",
        assignee: "Carlos Santos",
        dueOffset: 5,
        isRequired: true,
        order: 1
      },
      {
        id: "st2",
        title: "Análise de conformidade",
        description: "Verificar aderência às normas e políticas internas",
        assignee: "Beatriz Lima",
        dueOffset: 10,
        isRequired: true,
        order: 2
      },
      {
        id: "st3",
        title: "Relatório de não conformidades",
        description: "Documentar desvios e pontos de atenção identificados",
        assignee: "Beatriz Lima",
        dueOffset: 12,
        isRequired: true,
        order: 3
      },
      {
        id: "st4",
        title: "Plano de ação corretiva",
        description: "Elaborar plano com ações para correção dos desvios",
        assignee: "Carlos Santos",
        dueOffset: 15,
        isRequired: true,
        order: 4
      }
    ]
  },
  {
    id: "fechamento-contrato",
    name: "Fechamento de Contrato Corporativo",
    description: "Processo de negociação e fechamento de contrato empresarial",
    category: "Contratos",
    subtasks: [
      {
        id: "st1",
        title: "Reunião de levantamento de requisitos",
        description: "Entender necessidades e expectativas do cliente corporativo",
        assignee: "Ana Silva",
        dueOffset: 2,
        isRequired: true,
        order: 1
      },
      {
        id: "st2",
        title: "Elaboração de minuta contratual",
        description: "Redigir minuta com base nas tratativas comerciais",
        assignee: "Carlos Santos",
        dueOffset: 7,
        isRequired: true,
        order: 2
      },
      {
        id: "st3",
        title: "Revisão jurídica",
        description: "Análise técnica de cláusulas e conformidade legal",
        assignee: "Beatriz Lima",
        dueOffset: 10,
        isRequired: true,
        order: 3
      },
      {
        id: "st4",
        title: "Negociação de ajustes",
        description: "Realizar rodadas de ajustes com contrapartida",
        assignee: "Ana Silva",
        dueOffset: 14,
        isRequired: false,
        order: 4
      },
      {
        id: "st5",
        title: "Assinatura e arquivamento",
        description: "Colher assinaturas e arquivar contrato no sistema",
        assignee: "Ana Silva",
        dueOffset: 18,
        isRequired: true,
        order: 5
      }
    ]
  },
  {
    id: "relatorio-mensal",
    name: "Relatório Mensal de Performance",
    description: "Geração de relatório consolidado mensal para diretoria",
    category: "Relatórios",
    subtasks: [
      {
        id: "st1",
        title: "Coleta de dados operacionais",
        description: "Consolidar métricas de todos os departamentos",
        assignee: "Carlos Santos",
        dueOffset: 3,
        isRequired: true,
        order: 1
      },
      {
        id: "st2",
        title: "Análise de indicadores financeiros",
        description: "Processar dados de faturamento, custos e margens",
        assignee: "Beatriz Lima",
        dueOffset: 5,
        isRequired: true,
        order: 2
      },
      {
        id: "st3",
        title: "Elaboração de apresentação executiva",
        description: "Criar slides com destaques e insights do período",
        assignee: "Ana Silva",
        dueOffset: 7,
        isRequired: true,
        order: 3
      },
      {
        id: "st4",
        title: "Revisão e aprovação",
        description: "Validar informações e aprovar versão final",
        assignee: "Carlos Santos",
        dueOffset: 9,
        isRequired: true,
        order: 4
      }
    ]
  }
];

// Categorias disponíveis
export const WORKFLOW_CATEGORIES = [
  "Todos",
  "Clientes",
  "Previdenciário",
  "Compliance",
  "Contratos",
  "Relatórios"
];
