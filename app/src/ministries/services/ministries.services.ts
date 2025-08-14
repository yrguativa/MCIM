import axios, { AxiosError } from 'axios';
import { Ministry } from '../models/ministry';
import { create } from 'zustand';

const API_URL = 'http://localhost:3000/graphql';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export class MinistriesService {
    static async getMinistries(): Promise<Ministry[]> {
        try {
            const query = `
            query {
                ministries {
                    ...ministryFields
                }
            }
            fragment ministryFields on Ministry {
                id
                name
                active
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                })
            );

            return data.data.ministries;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting ministries');
            }
            console.error(error);
            throw new Error('Error getting ministries');
        }
    }

    static async getMinistry(id: string): Promise<Ministry> {
        try {
            const query = `
            query Ministry($ministryId: String!) {
                ministry(id: $ministryId) {
                    id
                    name
                    description
                    name
                    active
                    createdUser {
                        id
                        name
                    }
                    createdDate
                }
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "ministryId": id
                    }
                })
            );

            return data.data.ministry;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting ministry');
            }
            console.error(error);
            throw new Error('Error getting ministry');
        }
    }

    static async getSubMinistries(ministryId: string): Promise<Ministry[]> {
        try {
            const query = `
            query SubMinistries($ministryId: String!) {
                subMinistries(parentMinistryId: $ministryId) {
                    id
                    name
                    description
                    leader {
                        id
                        name
                    }
                    active
                }
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "ministryId": ministryId
                    }
                })
            );

            return data.data.subMinistries;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting sub-ministries');
            }
            console.error(error);
            throw new Error('Error getting sub-ministries');
        }
    }

    static async addMinistry(ministry: Ministry): Promise<string> {
        try {
            const query = `mutation CreateMinistry($ministry: CreateMinistryInput!) {
                createMinistry(ministry: $ministry) {
                    id
                }
            }`;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "ministry":{
                            name: ministry.name,
                            active: ministry.active,
                            createdDate: ministry.createdDate,
                            createdUser: ministry.createdUser,
                        } 
                    }
                })
            );

            return data.data.createMinistry.id;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error creating ministry');
            }
            console.error(error);
            throw new Error('Error creating ministry');
        }
    }

    static async updateMinistry(ministry: Ministry): Promise<string> {
        try {
            const query = `
            mutation UpdateMinistry($updateMinistryInput: UpdateMinistryInput!) {
                updateMinistry(updateMinistryInput: $updateMinistryInput) {
                    id
                }
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "updateMinistryInput": ministry
                    }
                })
            );

            return data.data.updateMinistry.id;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error updating ministry');
            }
            console.error(error);
            throw new Error('Error updating ministry');
        }
    }

    static async deleteMinistry(ministryId: string): Promise<boolean> {
        try {
            const query = `
            mutation DeleteMinistry($id: String!) {
                deleteMinistry(id: $id)
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        "id": ministryId
                    }
                })
            );

            return data.data.deleteMinistry;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error deleting ministry');
            }
            console.error(error);
            throw new Error('Error deleting ministry');
        }
    }
}
