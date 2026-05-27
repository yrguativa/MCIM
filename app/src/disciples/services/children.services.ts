import axios from "axios";
import type { Child, ChildInput } from "../models/child";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

export class ChildrenService {
  static async getByParent(parentId: string): Promise<Child[]> {
    const { data } = await api.post('', JSON.stringify({
      query: `query($parentId: String!) {
        childrenByParent(parentId: $parentId) {
          id parentId name age childDiscipleId attendsChurch
          createdUser createdAt updatedUser updatedAt
        }
      }`,
      variables: { parentId },
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.childrenByParent;
  }

  static async create(input: ChildInput): Promise<Child> {
    const { data } = await api.post('', JSON.stringify({
      query: `mutation($input: CreateChildInput!) {
        createChild(input: $input) {
          id parentId name age childDiscipleId attendsChurch
        }
      }`,
      variables: { input },
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.createChild;
  }

  static async createBatch(inputs: ChildInput[]): Promise<Child[]> {
    const { data } = await api.post('', JSON.stringify({
      query: `mutation($inputs: [CreateChildInput!]!) {
        createChildrenBatch(inputs: $inputs) {
          id parentId name age childDiscipleId attendsChurch
        }
      }`,
      variables: { inputs },
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.createChildrenBatch;
  }

  static async update(input: { id: string; name?: string; age?: number; childDiscipleId?: string; attendsChurch?: string; updatedUser?: string }): Promise<Child> {
    const { data } = await api.post('', JSON.stringify({
      query: `mutation($input: UpdateChildInput!) {
        updateChild(input: $input) {
          id parentId name age childDiscipleId attendsChurch
        }
      }`,
      variables: { input },
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.updateChild;
  }

  static async delete(id: string): Promise<Child> {
    const { data } = await api.post('', JSON.stringify({
      query: `mutation($id: String!) {
        deleteChild(id: $id) { id }
      }`,
      variables: { id },
    }));
    if (data.errors) throw new Error(data.errors[0]?.message);
    return data.data.deleteChild;
  }
}
