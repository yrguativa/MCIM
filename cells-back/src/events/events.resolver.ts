import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventAttendance } from './entities/event-attendance.entity';
import { CreateEventInput } from './dto/create-event.input';
import { CreateEventAttendanceInput } from './dto/create-event-attendance.input';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event])
  async events(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Query(() => Event)
  async event(@Args('id', { type: () => ID }) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<Event> {
    return this.eventsService.create(createEventInput);
  }

  @Mutation(() => EventAttendance)
  async createEventAttendance(
    @Args('createEventAttendanceInput')
    createEventAttendanceInput: CreateEventAttendanceInput,
  ): Promise<EventAttendance> {
    return this.eventsService.createAttendance(createEventAttendanceInput);
  }

  @Query(() => [EventAttendance])
  async eventAttendance(
    @Args('eventId', { type: () => ID }) eventId: string,
  ): Promise<EventAttendance[]> {
    return this.eventsService.getEventAttendance(eventId);
  }
}
