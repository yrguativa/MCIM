import axios, { AxiosError } from 'axios';
import type { Event } from '../models/event';
import { EventAttendance } from '../models/eventAttendance';

const API_URL = (import.meta.env.VITE_API_BASE_URL as string);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class EventService {
  static async getEvent(id: string): Promise<Event> {
    try {
      const query = `
      query Event($eventId: ID!) {
        event(eventId: $eventId) {
          id
          name
          description
          date
          startTime
          endTime
          ministry {
            id
            name
            createdUser
            createdDate
            active
          }
          ministryId
          location
          capacity
          createdUser
          createdUserId
          createdDate
          attendees {
            id
            disciple {
              id
              identification
              name
              lastName
              email
              phone
              address
              birthDate
              ministryId
              createdUser
              createdDate
              updatedUser
              updatedDate
            }
            discipleId
            dateRegister
          }
          createdAt
          updatedAt
          active
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "eventId": id
          }
        }),
      );

      return data.data.event;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting event');
      }
      console.error(error);
      throw new Error('Error getting event');
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const query = `
      query GetEvents {
        events {
          id
          name
          description
          date
          startTime
          endTime
          location
          capacity
          createdUser
          createdDate
          createdAt
        }
      }
      `;
      const { data } = await api.post('',
        JSON.stringify({ query })
      );

      return data.data.events;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting events');
      }
      console.error(error);
      throw new Error('Error getting events');
    }
  }

  static async createEvent(event: Partial<Event>): Promise<string> {
    try {
      const query = `mutation CreateEvent($createEventInput: CreateEventInput!) {
        createEvent(createEventInput: $createEventInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "createEventInput": {
              name: event.name,
              description: event.description,
              location: event.location,
              date: event.date,
              capacity: event.capacity,
              createdBy: event.createdBy
            }
          }
        })
      );

      return data.data.createEvent.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error creating event');
      }
      console.error(error);
      throw new Error('Error creating event');
    }
  }

  static async updateEvent(event: Event): Promise<string> {
    try {
      const query = `mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
        updateEvent(updateEventInput: $updateEventInput) {
          id
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "updateEventInput": event
          }
        })
      );

      return data.data.updateEvent.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error updating event');
      }
      console.error(error);
      throw new Error('Error updating event');
    }
  }

  static async registerAttendance(attendance: Partial<EventAttendance>): Promise<EventAttendance> {
    try {
      const query = `mutation CreateEventAttendance($createEventAttendanceInput: CreateEventAttendanceInput!) {
        createEventAttendance(createEventAttendanceInput: $createEventAttendanceInput) {
          id
          dateRegister
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: {
            "createEventAttendanceInput": attendance
          }
        })
      );

      return data.data.createEventAttendance;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error registering attendance');
      }
      console.error(error);
      throw new Error('Error registering attendance');
    }
  }

  static async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    try {
      const query = `query EventAttendance($eventId: ID!) {
        eventAttendance(eventId: $eventId) {
          discipleId
          eventId
          timestamp
        }
      }`;
      const { data } = await api.post('',
        JSON.stringify({
          query,
          variables: { eventId }
        })
      );

      return data.data.eventAttendance;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error((error as AxiosError).response?.data);
        throw new Error(JSON.stringify((error as AxiosError).response?.data) || 'Error getting event attendance');
      }
      console.error(error);
      throw new Error('Error getting event attendance');
    }
  }
}
