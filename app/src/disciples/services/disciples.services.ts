import axios, { AxiosError } from 'axios';
import { Disciple } from '../models/disciple';

const API_URL = (import.meta.env.VITE_API_BASE_URL as string);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export class DisciplesService {
    static async searchByName(name: string): Promise<Disciple[]> {
        try {
            const query = `
            query DiscipleByName($name: String!) {
                discipleByName(name: $name) {
                    id
                    identification
                    identificationType
                    name
                    lastName
                    phone
                    ministryId
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({
                    query,
                    variables: { name }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data.discipleByName || [];
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('[DisciplesService] Axios error:', (error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error searching disciples');
            }
            console.error('[DisciplesService] Error:', error);
            throw new Error('Error searching disciples');
        }
    }

    static async searchByIdentification(identification: string): Promise<Disciple | undefined> {
        try {
            const query = `
            query DiscipleByIdentification($identification: String!) {
                discipleByIdentification(identification: $identification) {
                    disciple {
                        id
                        identification
                        identificationType
                        name
                        lastName
                        phone
                        ministryId
                    }
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({
                    query,
                    variables: { identification }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data?.discipleByIdentification?.disciple ?? undefined;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error searching disciples');
            }
            console.error(error);
            throw new Error('Error searching disciples');
        }
    }

    static async getDisciples(): Promise<Disciple[]> {
        try {
            const queryDisciples = `
            query {
                disciples {
                    id
                    identification
                    identificationType
                    name
                    lastName
                    email
                    network
                    ministryId
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({ query: queryDisciples })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data?.disciples ?? [];
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'In get disciples');
            }
            console.error(error);
            throw new Error('In get disciples');
        }
    }

    static async getDisciple(id: string): Promise<Disciple> {
        try {
            const queryDisciples = `
            query Disciple($discipleId: String!) {
                disciple(id: $discipleId) {
                    id
                    identification
                    identificationType
                    name
                    lastName
                    email
                    phone
                    ministryId
                    leaderId
                    network
                    status
                    createdUser
                    createdDate
                    updatedUser
                    updatedDate
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({
                    query: queryDisciples,
                    variables: { "discipleId": id }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data.disciple;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'In get disciples');
            }
            console.error(error);
            throw new Error('In get disciples');
        }
    }

    static async addDisciple(disciple: Disciple): Promise<string> {
        try {
            const queryDisciples = `
            mutation CreateDisciple($createDiscipleInput: CreateDiscipleInput!) {
                createDisciple(createDiscipleInput: $createDiscipleInput) {
                    id
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({
                    query: queryDisciples,
                    variables: { "createDiscipleInput": disciple }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data?.createDisciple?.id ?? '';
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'In get disciples');
            }
            console.error(error);
            throw new Error('In get disciples');
        }
    }

    static async updateDisciple(disciple: Disciple): Promise<string> {
        try {
            const queryDisciples = `mutation UpdateDisciple($updateDiscipleInput: UpdateDiscipleInput!) {
                updateDisciple(updateDiscipleInput: $updateDiscipleInput) {
                    id
                }
            }`;
            const { data } = await api.post('',
                JSON.stringify({
                    query: queryDisciples,
                    variables: { "updateDiscipleInput": disciple }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error(data.errors[0]?.message || 'GraphQL error');
            }

            return data.data?.updateDisciple?.id ?? '';
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
                throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'In get disciples');
            }
            console.error(error);
            throw new Error('In get disciples');
        }
    }
}
