import { Disciple } from '@/src/disciples/models/disciple';
import axios, { AxiosError } from 'axios';


const API_URL = 'http://localhost:3000/graphql';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export class GeneralService {

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
}