import { gql } from '@apollo/client';
import { client } from '../../config/apollo-client';
import { Event } from "../models/event";
import { EventAttendance } from "../models/eventAttendance";

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      description
      date
      endDate
      location
      capacity
      createdUser {
        id
        name
      }
      createdDate
    }
  }
`;

const ADD_EVENT = gql`
  mutation CreateEvent($event: EventInput!) {
    createEvent(event: $event) {
      id
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($event: EventInput!) {
    updateEvent(event: $event) {
      id
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

const REGISTER_ATTENDANCE = gql`
  mutation RegisterAttendance($attendance: EventAttendanceInput!) {
    registerAttendance(attendance: $attendance) {
      id
    }
  }
`;

const GET_EVENT_ATTENDANCE = gql`
  query GetEventAttendance($eventId: ID!) {
    eventAttendance(eventId: $eventId) {
      id
      eventId
      discipleId
      disciple {
        id
        name
      }
      registrationDate
      attended
      attendanceDate
      notes
    }
  }
`;

const GET_DISCIPLE_ATTENDANCE = gql`
  query GetDiscipleAttendance($discipleId: ID!) {
    discipleAttendance(discipleId: $discipleId) {
      id
      eventId
      event {
        id
        name
        date
      }
      registrationDate
      attended
      attendanceDate
      notes
    }
  }
`;

export class EventsService {
    static async getEvents(): Promise<Event[]> {
        try {
            const { data } = await client.query({
                query: GET_EVENTS
            });
            return data.events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    static async addEvent(event: Event): Promise<string> {
        try {
            const { data } = await client.mutate({
                mutation: ADD_EVENT,
                variables: { event }
            });
            return data.createEvent.id;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    static async updateEvent(event: Event): Promise<void> {
        try {
            await client.mutate({
                mutation: UPDATE_EVENT,
                variables: { event }
            });
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    static async deleteEvent(eventId: string): Promise<void> {
        try {
            await client.mutate({
                mutation: DELETE_EVENT,
                variables: { id: eventId }
            });
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    static async registerAttendance(attendance: EventAttendance): Promise<string> {
        try {
            const { data } = await client.mutate({
                mutation: REGISTER_ATTENDANCE,
                variables: { attendance }
            });
            return data.registerAttendance.id;
        } catch (error) {
            console.error('Error registering attendance:', error);
            throw error;
        }
    }

    static async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
        try {
            const { data } = await client.query({
                query: GET_EVENT_ATTENDANCE,
                variables: { eventId }
            });
            return data.eventAttendance;
        } catch (error) {
            console.error('Error fetching event attendance:', error);
            throw error;
        }
    }

    static async getAttendanceByDisciple(discipleId: string): Promise<EventAttendance[]> {
        try {
            const { data } = await client.query({
                query: GET_DISCIPLE_ATTENDANCE,
                variables: { discipleId }
            });
            return data.discipleAttendance;
        } catch (error) {
            console.error('Error fetching disciple attendance:', error);
            throw error;
        }
    }
}
