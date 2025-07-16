import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventAttendance } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(EventAttendance)
    private eventAttendanceRepository: Repository<EventAttendance>,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    const event = this.eventsRepository.create(createEventInput);
    return await this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find({
      relations: ['attendances', 'attendances.disciple'],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['attendances', 'attendances.disciple'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }

  async createAttendance(
    createAttendanceInput: CreateEventAttendanceInput,
  ): Promise<EventAttendance> {
    const event = await this.eventsRepository.findOneBy({
      id: createAttendanceInput.eventId,
    });

    if (!event) {
      throw new NotFoundException(
        `Event with ID "${createAttendanceInput.eventId}" not found`,
      );
    }

    const attendance = this.eventAttendanceRepository.create(
      createAttendanceInput,
    );
    return await this.eventAttendanceRepository.save(attendance);
  }

  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    const attendances = await this.eventAttendanceRepository.find({
      where: { eventId },
      relations: ['disciple'],
    });

    return attendances;
  }
}
