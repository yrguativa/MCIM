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

export class CellsService {
  static async getCells(): Promise<CellFull[]> {
    try {
      const query = `
      query {
        cells {
          id
          leader
          network
          host
          address
          neighborhood
          createdDate
          createdUser
          records {
            topic
            date
            createdUser
            assistants {
              name
              disciple
            }
          }
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({ query })
      );

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
          id
          leader
          network
          host
          address
          neighborhood
          createdDate
          createdUser
          records {
            topic
            date
            createdUser
            assistants {
              name
              disciple
            }
          }
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: { id }
        })
      );

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
              address: cell.address,
              neighborhood: cell.neighborhood,
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
            "updateCellInput": cell
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
              assistants: record.assistants.map(a => ({
                name: a.name,
                disciple: a.id,
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
}
