import apiClient from './client';
import { Diagram, CreateDiagramRequest, CreateDiagramResponse } from './types';

export const diagramService = {
  /**
   * Create a new diagram
   */
  async createDiagram(data: CreateDiagramRequest): Promise<CreateDiagramResponse> {
    console.log('DiagramService - Creating diagram with data:', data);
    const response = await apiClient.post<CreateDiagramResponse>('/diagrams', data);
    console.log('DiagramService - Response:', response.data);
    return response.data;
  },

  /**
   * Get all diagrams for the current user
   */
  async getDiagrams(): Promise<Diagram[]> {
    const response = await apiClient.get<Diagram[]>('/diagrams');
    return response.data;
  },

  /**
   * Get a specific diagram by ID
   */
  async getDiagramById(diagramId: string): Promise<Diagram> {
    const response = await apiClient.get<Diagram>(`/diagrams/${diagramId}`);
    return response.data;
  },

  /**
   * Delete a diagram
   */
  async deleteDiagram(diagramId: string): Promise<void> {
    await apiClient.delete(`/diagrams/${diagramId}`);
  },
};
