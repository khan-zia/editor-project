let id = 0;

export const mapNodeId = (nodes: Record<string, unknown>[]): Record<string, unknown>[] =>
  nodes.map((node: Record<string, unknown>) => {
    id++;
    return { ...node, id: id.toString() };
  });
