import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class StudentEnrollment extends Document {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  enrollmentDate: Date;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  finalGrade: number;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const StudentEnrollmentSchema =
  SchemaFactory.createForClass(StudentEnrollment);
