import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Schedule extends Document {
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop()
  courseId: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
