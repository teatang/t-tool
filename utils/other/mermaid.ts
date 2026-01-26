export interface MermaidRenderResult {
  success: boolean;
  svg?: string;
  error?: string;
}

export function mermaidParse(code: string): { success: boolean; error?: string } {
  try {
    new Function(code);
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export function mermaidGetDiagramType(code: string): string {
  const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
  return match ? match[1].toLowerCase() : 'unknown';
}
