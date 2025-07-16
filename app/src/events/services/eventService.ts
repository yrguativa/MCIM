import type { Event, EventAttendance } from '../models/event';

export const eventService = {
  async createEvent(event: Partial<Event>): Promise<Event> {
    // TODO: Implementar la llamada a la API
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Error al crear el evento');
    }

    return response.json();
  },

  async registerAttendance(attendance: Partial<EventAttendance>): Promise<EventAttendance> {
    // TODO: Implementar la llamada a la API
    const response = await fetch('/api/events/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendance),
    });

    if (!response.ok) {
      throw new Error('Error al registrar la asistencia');
    }

    return response.json();
  },

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`/api/events/${id}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el evento');
    }

    return response.json();
  },

  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    const response = await fetch(`/api/events/${eventId}/attendance`);
    
    if (!response.ok) {
      throw new Error('Error al obtener la lista de asistencia');
    }

    return response.json();
  },
};
