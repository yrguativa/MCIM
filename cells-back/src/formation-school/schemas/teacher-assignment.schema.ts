import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TeacherAssignment extends Document {
  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true, default: 'teacher' })
  type: string;

  @Prop({ required: true })
  assignedDate: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const TeacherAssignmentSchema = SchemaFactory.createForClass(TeacherAssignment);
