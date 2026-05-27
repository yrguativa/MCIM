import axios, { AxiosError } from 'axios';
import { Disciple, DiscipleFull, Leader } from '../models/disciple';

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

    static async getDiscipleFull(id: string): Promise<DiscipleFull | null> {
        try {
            const query = `
            query DiscipleFull($discipleId: String!) {
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
                disciplePersonalInfo(discipleId: $discipleId) {
                    id
                    discipleId
                    nationality
                    gender
                    maritalStatus
                    hasChildren
                    childrenAttendChurch
                    address
                    housingComplex
                    neighborhood
                    municipality
                    network
                    birthDate
                    ministryId
                    yearArrivedAtChurch
                    attendedAnotherChurch
                    yearArrivedAtOtherChurch
                    otherChurchName
                    hasAttendedEncounter
                    yearAttendedEncounter
                    hasRepeatedEncounter
                    hasAttendedReencounter
                    yearAttendedReencounter
                    baptizedAtMCI
                    isLeader
                    generation
                    rh
                    contactName
                    contactPhone
                    formationSchoolLevel
                }
            }
            `;
            const { data } = await api.post('',
                JSON.stringify({
                    query,
                    variables: { discipleId: id }
                })
            );

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return null;
            }

            return {
                disciple: data.data.disciple,
                personalInfo: data.data.disciplePersonalInfo || null,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
            }
            console.error(error);
            return null;
        }
    }

    static async getLeaders(): Promise<Leader[]> {
        try {
            const query = `
            query {
                discipleLeaders {
                    id
                    names
                    lastNames
                }
            }
            `;
            const { data } = await api.post('', JSON.stringify({ query }));

            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return [];
            }

            return data.data.discipleLeaders || [];
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
            }
            console.error(error);
            return [];
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

    static async addDiscipleFull(data: {
        createDiscipleInput: Record<string, unknown>;
        createPersonalInfoInput: Record<string, unknown>;
    }): Promise<boolean> {
        try {
            const mutation = `
            mutation CreateDiscipleFull(
                $createDiscipleInput: CreateDiscipleInput!
                $createPersonalInfoInput: CreateDisciplePersonalInfoInput!
            ) {
                createDiscipleFull(
                    createDiscipleInput: $createDiscipleInput
                    createPersonalInfoInput: $createPersonalInfoInput
                ) {
                    id
                }
            }
            `;
            const response = await api.post('',
                JSON.stringify({
                    query: mutation,
                    variables: data,
                })
            );

            if (response.data.errors) {
                console.error('GraphQL errors:', response.data.errors);
                return false;
            }

            return !!response.data.data.createDiscipleFull;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
            }
            console.error(error);
            return false;
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

    static async updateDiscipleFull(
        id: string,
        data: {
            updateDiscipleInput: Record<string, unknown>;
            updatePersonalInfoInput?: Record<string, unknown>;
        },
    ): Promise<boolean> {
        try {
            const mutation = `
            mutation UpdateDiscipleFull(
                $updateDiscipleInput: UpdateDiscipleInput!
                $updatePersonalInfoInput: UpdateDisciplePersonalInfoInput
            ) {
                updateDiscipleFull(
                    updateDiscipleInput: $updateDiscipleInput
                    updatePersonalInfoInput: $updatePersonalInfoInput
                ) {
                    id
                }
            }
            `;
            const response = await api.post('',
                JSON.stringify({
                    query: mutation,
                    variables: {
                        updateDiscipleInput: { ...data.updateDiscipleInput, id },
                        updatePersonalInfoInput: data.updatePersonalInfoInput || undefined,
                    },
                })
            );

            if (response.data.errors) {
                console.error('GraphQL errors:', response.data.errors);
                return false;
            }

            return !!response.data.data.updateDiscipleFull;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error((error as AxiosError).response?.data);
            }
            console.error(error);
            return false;
        }
    }

    static async getMaritalRelationship(discipleId: string): Promise<{
        id: string; discipleId: string; attendsChurch: string; spouseId?: string; spouseName?: string;
    } | null> {
        try {
            const query = `
            query MaritalRelationshipByDisciple($discipleId: String!) {
                maritalRelationshipByDisciple(discipleId: $discipleId) {
                    id
                    discipleId
                    attendsChurch
                    spouseId
                    spouseName
                }
            }`;
            const { data } = await api.post('', JSON.stringify({
                query,
                variables: { discipleId }
            }));
            if (data.errors) return null;
            return data.data.maritalRelationshipByDisciple || null;
        } catch {
            return null;
        }
    }

    static async getMaritalRelationshipBySpouse(spouseId: string): Promise<{
        id: string; discipleId: string; attendsChurch: string; spouseId?: string; spouseName?: string;
    } | null> {
        try {
            const query = `
            query MaritalRelationshipBySpouse($spouseId: String!) {
                maritalRelationshipBySpouse(spouseId: $spouseId) {
                    id
                    discipleId
                    attendsChurch
                    spouseId
                    spouseName
                }
            }`;
            const { data } = await api.post('', JSON.stringify({
                query,
                variables: { spouseId }
            }));
            if (data.errors) return null;
            return data.data.maritalRelationshipBySpouse || null;
        } catch {
            return null;
        }
    }

    static async saveMaritalRelationship(input: {
        discipleId: string; attendsChurch: string; spouseId?: string; spouseName?: string; createdUser?: string;
    }): Promise<string | null> {
        try {
            const query = `mutation CreateMaritalRelationship($input: CreateMaritalRelationshipInput!) {
                createMaritalRelationship(input: $input) { id }
            }`;
            const { data } = await api.post('', JSON.stringify({ query, variables: { input } }));
            if (data.errors) return null;
            return data.data.createMaritalRelationship.id;
        } catch {
            return null;
        }
    }

    static async updateMaritalRelationship(input: {
        id: string; spouseId?: string; spouseName?: string; attendsChurch?: string; updatedUser?: string;
    }): Promise<boolean> {
        try {
            const query = `mutation UpdateMaritalRelationship($input: UpdateMaritalRelationshipInput!) {
                updateMaritalRelationship(input: $input) { id }
            }`;
            const { data } = await api.post('', JSON.stringify({ query, variables: { input } }));
            if (data.errors) return false;
            return true;
        } catch {
            return false;
        }
    }
}
