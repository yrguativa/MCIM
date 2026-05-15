import axios, { AxiosError } from 'axios';
import { CellFull } from '../models/cellFull';
import { CellInput } from '../schemas/cellSchema';
import { CellRecordInput } from '../schemas/cellRecordsSchema';

const API_URL = (import.meta.env.VITE_API_BASE_URL as string);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const CELL_FIELDS = `
  id
  leader
  network
  host
  timoteo
  address
  neighborhood
  day
  time
  createdDate
  createdUser
  assistants {
    disciple
    status
    createdDate
    createdUser
    updatedDate
    updatedUser
  }
  records {
    topic
    date
    createdUser
    assistants {
      name
      disciple
    }
  }
`;

export class CellsService {
  static async getCells(): Promise<CellFull[]> {
    try {
      const query = `
      query {
        cells {
          ${CELL_FIELDS}
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({ query })
      );

      if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error fetching cells');
      return data.data.cells || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting cells');
      }
      console.error(error);
      throw new Error('Error getting cells');
    }
  }

  static async getCell(id: string): Promise<CellFull> {
    try {
      const query = `
      query Cell($id: String!) {
        cell(id: $id) {
          ${CELL_FIELDS}
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: { id }
        })
      );

      if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error fetching cell');
      return data.data.cell;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting cell');
      }
      console.error(error);
      throw new Error('Error getting cell');
    }
  }

  static async createCell(cell: CellInput): Promise<string> {
    try {
      const query = `mutation CreateCell($createCellInput: CreateCellInput!) {
        createCell(createCellInput: $createCellInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "createCellInput": {
              leader: cell.leader,
              network: cell.network,
              host: cell.host,
              timoteo: cell.timoteo,
              address: cell.address,
              neighborhood: cell.neighborhood,
              day: cell.day || null,
              time: cell.time || null,
              createdUser: cell.createdUser,
            }
          }
        })
      );

      return data.data.createCell.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error creating cell');
      }
      console.error(error);
      throw new Error('Error creating cell');
    }
  }

  static async updateCell(cell: CellInput): Promise<string> {
    try {
      const query = `mutation UpdateCell($updateCellInput: UpdateCellInput!) {
        updateCell(updateCellInput: $updateCellInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "updateCellInput": {
              id: cell.id,
              leader: cell.leader,
              network: cell.network,
              host: cell.host,
              timoteo: cell.timoteo,
              address: cell.address,
              neighborhood: cell.neighborhood,
              day: cell.day || null,
              time: cell.time || null,
              createdUser: cell.createdUser,
            }
          }
        })
      );

      return data.data.updateCell.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error updating cell');
      }
      console.error(error);
      throw new Error('Error updating cell');
    }
  }

  static async createRecord(cellId: string, record: CellRecordInput): Promise<string> {
    try {
      const query = `mutation CreateRecordCell($cellId: String!, $createRecordCellInput: CreateRecordCellInput!) {
        createRecordCell(cellId: $cellId, createRecordCellInput: $createRecordCellInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            cellId,
            "createRecordCellInput": {
              topic: record.topic,
              date: record.date,
              createdUser: record.createdUser,
              assistants: record.assistants
                .filter(a => a.attended)
                .map(a => ({
                name: a.name,
                disciple: a.discipleId || a.id,
              })),
            }
          }
        })
      );

      return data.data.createRecordCell.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error creating cell record');
      }
      console.error(error);
      throw new Error('Error creating cell record');
    }
  }

  static async addCellAssistant(cellId: string, discipleId: string, userId: string): Promise<void> {
    try {
      const query = `mutation AddCellAssistant($cellId: String!, $addCellAssistantInput: AddCellAssistantInput!) {
        addCellAssistant(cellId: $cellId, addCellAssistantInput: $addCellAssistantInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            cellId,
            addCellAssistantInput: {
              disciple: discipleId,
              createdUser: userId,
            },
          },
        })
      );

      if (data.errors) throw new Error(data.errors[0]?.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error adding cell assistant');
      }
      console.error(error);
      throw new Error('Error adding cell assistant');
    }
  }

  static async deactivateCellAssistant(cellId: string, discipleId: string, userId: string): Promise<void> {
    try {
      const query = `mutation DeactivateCellAssistant($cellId: String!, $deactivateCellAssistantInput: DeactivateCellAssistantInput!) {
        deactivateCellAssistant(cellId: $cellId, deactivateCellAssistantInput: $deactivateCellAssistantInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            cellId,
            deactivateCellAssistantInput: {
              disciple: discipleId,
              updatedUser: userId,
            },
          },
        })
      );

      if (data.errors) throw new Error(data.errors[0]?.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error deactivating cell assistant');
      }
      console.error(error);
      throw new Error('Error deactivating cell assistant');
    }
  }
}
