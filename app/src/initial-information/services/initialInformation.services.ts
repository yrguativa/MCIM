import axios, { AxiosError } from "axios";
import type { AssistantFull, Leader } from "../store/initialInformation.store";

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
  ): Promise<AssistantFull | null> {
    try {
      const query = `
        query FindAssistant($identification: String!) {
          assistantByIdentification(identification: $identification) {
            assistant {
              id
              names
              lastNames
              email
              phone
              identificationType
              identification
              directLeaderId
              createdAt
              updatedAt
            }
            personalInfo {
              id
              assistantId
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

      return data.data.assistantByIdentification || null;
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
          assistantLeaders {
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

      return data.data.assistantLeaders || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return [];
    }
  }

  static async create(data: {
    createAssistantInput: Record<string, unknown>;
    createPersonalInfoInput: Record<string, unknown>;
  }): Promise<boolean> {
    try {
      const mutation = `
        mutation CreateAssistant(
          $createAssistantInput: CreateAssistantInput!
          $createPersonalInfoInput: CreateAssistantPersonalInfoInput!
        ) {
          createAssistant(
            createAssistantInput: $createAssistantInput
            createPersonalInfoInput: $createPersonalInfoInput
          ) {
            id
            names
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
        return false;
      }

      return !!response.data.data.createAssistant;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return false;
    }
  }

  static async update(
    id: string,
    data: {
      updateAssistantInput: Record<string, unknown>;
      updatePersonalInfoInput?: Record<string, unknown>;
    },
  ): Promise<boolean> {
    try {
      const hasPersonalInfo = data.updatePersonalInfoInput && Object.keys(data.updatePersonalInfoInput).length > 0;

      const mutation = `
        mutation UpdateAssistant(
          $updateAssistantInput: UpdateAssistantInput!
          $updatePersonalInfoInput: UpdateAssistantPersonalInfoInput
        ) {
          updateAssistant(
            updateAssistantInput: $updateAssistantInput
            updatePersonalInfoInput: $updatePersonalInfoInput
          ) {
            id
            names
            identification
          }
        }
      `;
      const response = await api.post(
        "",
        JSON.stringify({
          query: mutation,
          variables: {
            updateAssistantInput: { ...data.updateAssistantInput, id },
            updatePersonalInfoInput: hasPersonalInfo ? data.updatePersonalInfoInput : undefined,
          },
        }),
      );

      if (response.data.errors) {
        console.error("GraphQL errors:", response.data.errors);
        return false;
      }

      return !!response.data.data.updateAssistant;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
      console.error(error);
      return false;
    }
  }
}
