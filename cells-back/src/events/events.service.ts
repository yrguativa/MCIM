import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { EventEntity } from './entities/event.entity';
import { EventAttendanceEntity } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';
import { DisciplesService } from 'src/disciples/disciples.service';
import { CreateDiscipleInput } from 'src/disciples/dto/create-disciple.input';
import { EventAttendance } from './schemas/event-attendance.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(EventAttendance.name)
    private eventAttendanceModel: Model<EventAttendance>,
    private readonly disciplesService: DisciplesService,
  ) {}

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

    if (!createAttendanceInput.discipleId) {
      const discipleInsert: CreateDiscipleInput = {
        name: createAttendanceInput.name!,
        lastName: createAttendanceInput.lastName!,
        ministryId: createAttendanceInput.ministryId!,
        identification: createAttendanceInput.identification!,
        phone: createAttendanceInput.phone!,
        createdUser: event.createdBy,
        createdDate: new Date().toISOString(),
      };
      const savedDisciple = await this.disciplesService.create(discipleInsert);
      createAttendanceInput.discipleId = savedDisciple.id;
    }

    const createdAttendance = new this.eventAttendanceModel({
      event: createAttendanceInput.eventId,
      disciple: createAttendanceInput.discipleId,
      attended: true,
      createdDate: new Date(),
      createdUser: event.createdBy, // Using the event's creator as the attendance creator
    });

    const savedAttendance = await createdAttendance.save();
    return this.toAttendanceModel(savedAttendance);
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
      attendees: [],
      ministry: ministryIsObject ? populatedMinistry : null,

      createdUser: event.createdBy,
      createdUserId: event.createdBy,
      createdDate: event.createdAt,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    };
  }

  async getEventAttendance(eventId: string): Promise<EventAttendanceEntity[]> {
    const attendances = await this.eventAttendanceModel
      .find({ event: eventId })
      .populate('disciple')
      .exec();
    return attendances.map((attendance) => this.toAttendanceModel(attendance));
  }

  private toAttendanceModel(
    attendance: EventAttendance,
  ): EventAttendanceEntity {
    return {
      id: attendance._id.toString(),
      disciple: attendance.disciple as any,
      discipleId: (attendance.disciple as any)._id.toString(),
      dateRegister: attendance.createdDate,
    };
  }
}
