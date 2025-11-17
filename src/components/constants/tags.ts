/**
 * ETIQUETAS FIXAS DO SISTEMA
 *
 * Este arquivo contém a lista de etiquetas pré-definidas que podem ser
 * utilizadas no sistema de tarefas. Estas etiquetas são fixas e não podem
 * ser criadas ou modificadas pelos usuários finais.
 *
 * IMPORTANTE: Qualquer adição ou modificação de etiquetas deve ser feita
 * apenas pela equipe de desenvolvimento para manter a integridade dos
 * filtros e relatórios do sistema.
 *
 * ========================================================================
 * INSTRUÇÕES PARA ADICIONAR NOVAS ETIQUETAS
 * ========================================================================
 *
 * Para adicionar uma nova etiqueta ao sistema:
 *
 * 1. Adicione um novo objeto ao array FIXED_TAGS abaixo seguindo o formato:
 *    { id: "identificador-unico", label: "Nome da Etiqueta" }
 *
 * 2. O campo "id" deve ser:
 *    - Em minúsculas
 *    - Sem espaços (use hífen)
 *    - Único (não duplicar IDs existentes)
 *
 * 3. O campo "label" deve ser:
 *    - O nome exato que aparecerá na interface
 *    - Com capitalização adequada
 *
 * 4. Exemplo de adição:
 *    { id: "auditoria", label: "Auditoria" },
 *
 * 5. Após adicionar, a nova etiqueta estará automaticamente disponível em:
 *    - Modal de criação de tarefas (NovaTarefaModal)
 *    - Modal de edição de tarefas (EditarTarefaModal)
 *    - Filtro de etiquetas na listagem (TarefasScreen)
 *
 * 6. NUNCA remova etiquetas que estejam em uso no banco de dados!
 *    Marque como deprecated ou consulte a equipe antes de remover.
 *
 * ========================================================================
 */

export const FIXED_TAGS = [
  { id: "recurso", label: "Recurso" },
  { id: "peticao", label: "Petição" },
  { id: "prazo-fatal", label: "Prazo Fatal" },
  { id: "contratos", label: "Contratos" },
  { id: "relatorios", label: "Relatórios" },
  { id: "documentacao", label: "Documentação" },
  { id: "clientes", label: "Clientes" },
  { id: "planejamento", label: "Planejamento" },
  { id: "reunioes", label: "Reuniões" },
  { id: "financeiro", label: "Financeiro" },
  { id: "urgente", label: "Urgente" },
  { id: "administrativo", label: "Administrativo" },
  { id: "juridico", label: "Jurídico" },
] as const;

export type FixedTagId = (typeof FIXED_TAGS)[number]["id"];
export type FixedTag = (typeof FIXED_TAGS)[number];