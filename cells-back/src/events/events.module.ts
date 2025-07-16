import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { Event } from './entities/event.entity';
import { EventAttendance } from './entities/event-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventAttendance])],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
