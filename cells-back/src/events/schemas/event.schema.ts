import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Attendance {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Disciple',
    required: true,
  })
  disciple: string;

  @Prop({ required: true })
  attended: boolean;

  @Prop()
  notes: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: false })
  endTime?: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Ministry',
    required: false,
  })
  ministryId: string;

  @Prop({ type: [AttendanceSchema], default: [] })
  attendance: Attendance[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
