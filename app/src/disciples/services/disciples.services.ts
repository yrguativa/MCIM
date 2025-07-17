import axios, { AxiosError } from 'axios';
import { Disciple } from '../models/disciple';

const API_URL = 'http://localhost:3000/graphql';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export class DisciplesService {
    static async searchDisciples(searchTerm: string): Promise<Disciple[]> {
        try {
            const query = `
            query SearchDisciples($searchTerm: String!) {
                searchDisciples(searchTerm: $searchTerm) {
                    id
                    identification
                    name
                    lastName
                }
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query,
                    variables: {
                        searchTerm
                    }
                })
            );

            return data.data.searchDisciples;
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
                disciples
                {
                    ...fieldsBasic
                }
            }
            fragment fieldsBasic on Disciple {
                id
                identification
                name
                lastName
            }
                
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query: queryDisciples,
                })
            );

            return data.data.disciples;
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
                    name
                    lastName
                    email
                    phone
                    address
                    birthDate
                    createdUser
                    createdDate
                    updatedUser
                    updatedDate
                }
            }
            `;
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query: queryDisciples,
                    variables: {
                        "discipleId": id
                    }
                })
            );

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
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query: queryDisciples,
                    variables: {
                        "createDiscipleInput": disciple
                    }
                })
            );

            return data.data.id;
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
            const { data } = await api.post(API_URL,
                JSON.stringify({
                    query: queryDisciples,
                    variables: {
                        "updateDiscipleInput": disciple
                    }
                })
            );

            return data.data.id;
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