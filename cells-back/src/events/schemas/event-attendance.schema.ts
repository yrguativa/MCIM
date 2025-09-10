import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class EventAttendance extends Document {
  @Prop({ required: true })
  attended: boolean;

  @Prop()
  notes: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Disciple',
    required: true,
  })
  disciple: string;
}

export const EventAttendanceSchema =
  SchemaFactory.createForClass(EventAttendance);
