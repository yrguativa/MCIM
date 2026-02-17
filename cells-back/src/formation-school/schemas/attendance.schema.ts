import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attendance extends Document {
  @Prop({ required: true })
  studentEnrollmentId: string;

  @Prop({ required: true })
  courseClassId: string;

  @Prop({ required: true })
  attended: boolean;

  @Prop({ required: true })
  attendanceDate: Date;

  @Prop()
  notes: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
