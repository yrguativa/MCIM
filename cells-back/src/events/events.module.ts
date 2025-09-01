import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import {
  Event,
  EventSchema,
  EventAttendance,
  EventAttendanceSchema,
} from './schemas/event.schema';
import { DisciplesModule } from '../disciples/disciples.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventAttendance.name, schema: EventAttendanceSchema },
    ]),
    DisciplesModule,
  ],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
