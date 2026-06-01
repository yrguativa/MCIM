import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface NeighborhoodItem {
  id: string;
  name: string;
}

export class NeighborhoodService {
  static async getAll(): Promise<NeighborhoodItem[]> {
    try {
      const { data } = await api.post('',
        JSON.stringify({
          query: `query { neighborhoods { id name } }`,
        }),
      );
      if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error');
      return data.data.neighborhoods || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error fetching neighborhoods');
      }
      console.error(error);
      throw new Error('Error fetching neighborhoods');
    }
  }

  static async create(name: string): Promise<NeighborhoodItem> {
    try {
      const { data } = await api.post('',
        JSON.stringify({
          query: `mutation CreateNeighborhood($name: String!) {
            createNeighborhood(name: $name) { id name }
          }`,
          variables: { name: name.trim().toUpperCase() },
        }),
      );
      if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error');
      return data.data.createNeighborhood;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error creating neighborhood');
      }
      console.error(error);
      throw new Error('Error creating neighborhood');
    }
  }
}
