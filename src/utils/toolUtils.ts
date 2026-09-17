/**
 * Utilitaires sécurisés pour la manipulation et l'affichage des outils & technologies.
 * Évite rigoureusement les bugs de rendu JavaScript du type "[object Object]".
 */

export function getToolName(tool: unknown): string {
  if (!tool) return '';
  if (typeof tool === 'string') return tool.trim();
  if (typeof tool === 'object' && tool !== null) {
    if ('name' in tool && typeof (tool as any).name === 'string') {
      return (tool as any).name.trim();
    }
    if ('title' in tool && typeof (tool as any).title === 'string') {
      return (tool as any).title.trim();
    }
  }
  return '';
}

export function getToolNames(tools: unknown[] | undefined | null): string[] {
  if (!Array.isArray(tools)) return [];
  return tools.map(getToolName).filter((name): name is string => Boolean(name && name.length > 0));
}

export function formatToolsList(tools: unknown[] | undefined | null, max?: number): string {
  const names = getToolNames(tools);
  const sliced = typeof max === 'number' && max > 0 ? names.slice(0, max) : names;
  return sliced.join(', ');
}
