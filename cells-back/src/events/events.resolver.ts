import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EventsService } from './events.service';
import { EventEntity } from './entities/event.entity';
import { EventAttendanceEntity } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';
import { Logger } from '@nestjs/common';

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [EventEntity])
  async events(): Promise<EventEntity[]> {
    return this.eventsService.findAll();
  }

  @Query(() => EventEntity)
  async event(
    @Args('eventId', { type: () => ID }) id: string,
  ): Promise<EventEntity> {
    Logger.log('🚀 ~ DisciplesResolver ~ event ~ id:' + id);
    return this.eventsService.findOne(id);
  }

  @Mutation(() => EventEntity)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<EventEntity> {
    return this.eventsService.create(createEventInput);
  }

  @Mutation(() => EventEntity)
  async updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ): Promise<EventEntity> {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => EventAttendanceEntity)
  async createEventAttendance(
    @Args('createEventAttendanceInput')
    createEventAttendanceInput: CreateEventAttendanceInput,
  ): Promise<EventAttendanceEntity> {
    Logger.log(
      '🚀 ~ EventsResolver ~ createEventAttendance ~ createEventAttendanceInput:',
      createEventAttendanceInput,
    );
    return this.eventsService.createAttendance(createEventAttendanceInput);
  }

  @Query(() => [EventAttendanceEntity])
  async eventAttendance(
    @Args('eventId', { type: () => ID }) eventId: string,
  ): Promise<EventAttendanceEntity[]> {
    return this.eventsService.getEventAttendance(eventId);
  }

  @ResolveField('attendees', () => [EventAttendanceEntity])
  async getAttendees(
    @Parent() event: EventEntity,
  ): Promise<EventAttendanceEntity[]> {
    Logger.log(`Resolving attendees for event ID: ${event.id}`);
    return this.eventsService.getEventAttendance(event.id);
  }
}
