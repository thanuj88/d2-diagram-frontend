export interface Diagram {
  diagramId: string;
  userId: string;
  diagramType: string;
  d2Text: string;
  svgContent: string;
  createdAt: string;
}

export interface CreateDiagramRequest {
  diagramType: string;
  d2Text: string;
}

export interface CreateDiagramResponse {
  diagramId: string;
  userId?: string;
  diagramType: string;
  d2Text?: string;
  svgContent?: string;
  s3Url?: string;
  createdAt: string;
  renderDuration?: number;
}

export type DiagramType = 'architecture' | 'sequence' | 'flow';
