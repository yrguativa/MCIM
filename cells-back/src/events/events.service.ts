import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { EventEntity } from './entities/event.entity';
import { EventAttendanceEntity } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) { }

  async create(createEventInput: CreateEventInput): Promise<EventEntity> {
    const createdEvent = new this.eventModel({
      ...createEventInput,
      createdAt: new Date(),
      startTime: createEventInput.date,
    });
    const savedEvent = await createdEvent.save();
    return this.toEventModel(savedEvent);
  }

  async findAll(): Promise<EventEntity[]> {
    const events = await this.eventModel.find().populate('ministryId').exec();
    return events.map((event) => this.toEventModel(event));
  }

  async findOne(id: string): Promise<EventEntity> {
    const event = await this.eventModel
      .findById(id)
      .populate('ministryId')
      .exec();
    Logger.log('🚀 ~ EventsService ~ findOne ~ event:', event);
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

    const newAttendance = {
      disciple: createAttendanceInput.discipleId,
      attended: true,
      createdDate: new Date(),
      createdUser: event.createdBy, // Using the event's creator as the attendance creator
      notes: '',
    };

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(
        createAttendanceInput.eventId,
        {
          $push: { attendance: newAttendance },
        },
        { new: true },
      )
      .populate('attendance.disciple')
      .exec();

    const createdAttendance = updatedEvent.attendance[updatedEvent.attendance.length - 1];

    // We need to map it to EventAttendanceEntity. 
    // The populated disciple might be in the last element.

    return this.toAttendanceModel(createdAttendance);
  }

  private toEventModel(event: Event): EventEntity {
    const populatedMinistry = event.ministryId as any;
    const ministryIsObject =
      populatedMinistry && typeof populatedMinistry === 'object';

    return {
      id: event._id.toString(),
      name: event.name,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      ministryId: ministryIsObject
        ? populatedMinistry._id.toString()
        : event.ministryId,
      location: event.location,
      capacity: event.capacity,
      active: event.active,
      attendees: event.attendance ? event.attendance.map(a => this.toAttendanceModel(a)) : [],
      ministry: ministryIsObject ? populatedMinistry : null,

      createdUser: event.createdBy,
      createdUserId: event.createdBy,
      createdDate: event.createdAt,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    };
  }

  async getEventAttendance(eventId: string): Promise<EventAttendanceEntity[]> {
    const event = await this.eventModel
      .findById(eventId)
      .populate('attendance.disciple')
      .exec();

    if (!event || !event.attendance) {
      return [];
    }

    return event.attendance.map((attendance) => this.toAttendanceModel(attendance));
  }

  private toAttendanceModel(
    attendance: any,
  ): EventAttendanceEntity {
    return {
      id: attendance._id ? attendance._id.toString() : '',
      disciple: attendance.disciple,
      discipleId: attendance.disciple && attendance.disciple._id ? attendance.disciple._id.toString() : attendance.disciple,
      dateRegister: attendance.createdDate,
    };
  }
}
