import mermaid from 'mermaid';

export interface MermaidRenderResult {
  success: boolean;
  svg?: string;
  error?: string;
}

// 初始化 mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  suppressErrorRendering: true,
});

let idCounter = 0;

/**
 * 渲染 Mermaid 图表
 * @param code Mermaid 图表代码
 * @returns 渲染结果，包含 SVG 或错误信息
 */
export async function mermaidRender(code: string): Promise<MermaidRenderResult> {
  if (!code.trim()) {
    return { success: false, error: 'Empty code' };
  }

  try {
    // 生成唯一的图表 ID
    const id = `mermaid-chart-${++idCounter}-${Date.now()}`;

    // 使用 mermaid.render 异步渲染
    const { svg } = await mermaid.render(id, code);
    return { success: true, svg };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

/**
 * 验证 Mermaid 语法
 * @param code Mermaid 图表代码
 * @returns 验证结果
 */
export function mermaidValidate(code: string): { success: boolean; error?: string } {
  if (!code.trim()) {
    return { success: true };
  }

  try {
    // 尝试解析语法
    mermaid.parse(code);
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export function mermaidGetDiagramType(code: string): string {
  const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
  return match ? match[1].toLowerCase() : 'unknown';
}
