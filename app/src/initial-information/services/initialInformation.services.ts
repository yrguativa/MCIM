import axios, { AxiosError } from "axios";
import type { DiscipleFull, Leader } from "../store/initialInformation.store";

const API_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class InitialInformationService {
  static async findByIdentification(
    identification: string,
  ): Promise<DiscipleFull | null> {
    try {
      const query = `
        query FindDisciple($identification: String!) {
          discipleByIdentification(identification: $identification) {
            disciple {
              id
              identification
              identificationType
              name
              lastName
              names
              lastNames
              email
              phone
              leaderId
              createdUser
              createdDate
              updatedDate
            }
            personalInfo {
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
              hasAttendedEncounter
              yearAttendedEncounter
              hasRepeatedEncounter
              hasAttendedReencounter
              yearAttendedReencounter
              baptizedAtMCI
              isLeader
              generation
              formationSchoolLevel
              createdAt
              updatedAt
            }
          }
        }
      `;
      const { data } = await api.post(
        "",
        JSON.stringify({
          query,
          variables: { identification },
        }),
      );

      if (data.errors) {
        console.error("GraphQL errors:", data.errors);
        return null;
      }

      return data.data.discipleByIdentification || null;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
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
      const { data } = await api.post("", JSON.stringify({ query }));

      if (data.errors) {
        console.error("GraphQL errors:", data.errors);
        return [];
      }

      return data.data.discipleLeaders || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return [];
    }
  }

  static async create(data: {
    createDiscipleInput: Record<string, unknown>;
    createPersonalInfoInput: Record<string, unknown>;
  }): Promise<string | null> {
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
            name
            identification
          }
        }
      `;
      const response = await api.post(
        "",
        JSON.stringify({
          query: mutation,
          variables: data,
        }),
      );

      if (response.data.errors) {
        console.error("GraphQL errors:", response.data.errors);
        return null;
      }

      return response.data.data.createDiscipleFull?.id || null;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return null;
    }
  }

  static async update(
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
            name
            identification
          }
        }
      `;
      const response = await api.post(
        "",
        JSON.stringify({
          query: mutation,
          variables: {
            updateDiscipleInput: { ...data.updateDiscipleInput, id },
            updatePersonalInfoInput: data.updatePersonalInfoInput || undefined,
          },
        }),
      );

      if (response.data.errors) {
        console.error("GraphQL errors:", response.data.errors);
        return false;
      }

      return !!response.data.data.updateDiscipleFull;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return false;
    }
  }
}
