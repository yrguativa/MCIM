import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      id
      name
      description
      date
      startTime
      endTime
      location
      capacity
      leaderId
      createdAt
    }
  }
`;
