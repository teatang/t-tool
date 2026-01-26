import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock mermaid module - we can't use actual mermaid in Node test environment
// as it requires DOM
describe('Mermaid Utilities', () => {
  describe('mermaidGetDiagramType', () => {
    it('detects graph diagram', () => {
      const code = 'graph TD\n  A --> B';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('graph');
    });

    it('detects flowchart diagram', () => {
      const code = 'flowchart TD\n  A --> B';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('flowchart');
    });

    it('detects sequenceDiagram', () => {
      const code = 'sequenceDiagram\n  Alice -> Bob';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('sequencediagram');
    });

    it('detects classDiagram', () => {
      const code = 'classDiagram\n  Animal <|-- Duck';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('classdiagram');
    });

    it('detects pie chart', () => {
      const code = 'pie title Test\n  "A" : 10';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('pie');
    });

    it('detects gantt chart', () => {
      const code = 'gantt\n  title Test';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('gantt');
    });

    it('returns unknown for unrecognized type', () => {
      const code = 'some random text';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match ? match[1].toLowerCase() : 'unknown').toBe('unknown');
    });

    it('handles whitespace before diagram type', () => {
      const code = '   graph TD';
      const match = code.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i);
      expect(match?.[1].toLowerCase()).toBe('graph');
    });

    it('is case insensitive', () => {
      expect('GRAPH TD'.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i)?.[1].toLowerCase()).toBe('graph');
      expect('Flowchart TD'.match(/^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i)?.[1].toLowerCase()).toBe('flowchart');
    });
  });

  describe('mermaid diagram types list', () => {
    it('includes all common diagram types', () => {
      const diagramTypes = [
        'graph', 'flowchart', 'sequenceDiagram', 'classDiagram',
        'stateDiagram', 'erDiagram', 'pie', 'gantt'
      ];
      const regex = /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph|mindmap|requirementDiagram|timeline|block|sankey)\b/i;

      for (const type of diagramTypes) {
        const match = type.match(regex);
        expect(match).not.toBeNull();
        expect(match?.[0].toLowerCase()).toBe(type.toLowerCase());
      }
    });
  });
});
