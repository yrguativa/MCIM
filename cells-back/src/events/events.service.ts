import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventAttendance } from './schemas/event.schema';
import { EventEntity } from './entities/event.entity';
import { EventAttendanceEntity } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(EventAttendance.name)
    private eventAttendanceModel: Model<EventAttendance>,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<EventEntity> {
    const createdEvent = new this.eventModel(createEventInput);
    const savedEvent = await createdEvent.save();
    return this.toEventModel(savedEvent);
  }

  async findAll(): Promise<EventEntity[]> {
    const events = await this.eventModel
      .find()
      .populate('ministry')
      .populate('attendees')
      .exec();
    return events.map((event) => this.toEventModel(event));
  }

  async findOne(id: string): Promise<EventEntity> {
    const event = await this.eventModel
      .findById(id)
      .populate('ministry')
      .populate('attendees')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.toEventModel(event);
  }

  async createAttendance(
    createAttendanceInput: CreateEventAttendanceInput,
  ): Promise<EventAttendanceEntity> {
    const event = await this.eventModel
      .findById(createAttendanceInput.eventId)
      .exec();

    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createAttendanceInput.eventId} not found`,
      );
    }

    const createdAttendance = new this.eventAttendanceModel({
      event: createAttendanceInput.eventId,
      disciple: createAttendanceInput.discipleId,
      attended: true,
      createdDate: new Date(),
      createdUser: event.createdUser, // Using the event's creator as the attendance creator
    });

    const savedAttendance = await createdAttendance.save();
    return this.toAttendanceModel(savedAttendance);
  }

  async getEventAttendance(eventId: string): Promise<EventAttendanceEntity[]> {
    const attendances = await this.eventAttendanceModel
      .find({ event: eventId })
      .populate('disciple')
      .exec();
    return attendances.map((attendance) => this.toAttendanceModel(attendance));
  }

  private toEventModel(event: Event): EventEntity {
    return {
      id: event._id.toString(),
      name: event.name,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      ministry: null, // Will be populated by resolver
      ministryId: event.ministry?.toString(),
      location: '', // TODO: Add location to schema
      capacity: null, // TODO: Add capacity to schema
      createdUser: event.createdUser,
      createdUserId: event.createdUser,
      createdDate: event.createdDate,
      createdAt: event.createdDate,
      updatedAt: event.createdDate,
      attendees: [], // Will be populated by resolver
      active: event.active,
    };
  }

  private toAttendanceModel(
    attendance: EventAttendance,
  ): EventAttendanceEntity {
    return {
      id: attendance._id.toString(),
      event: null, // Will be populated by resolver
      eventId: attendance.event?.toString(),
      disciple: null, // Will be populated by resolver
      discipleId: attendance.disciple?.toString(),
      timestamp: attendance.createdDate,
    };
  }
}
