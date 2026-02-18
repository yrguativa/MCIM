import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class StudentCourseHistory extends Document {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  enrollmentDate: Date;

  @Prop()
  completionDate: Date;

  @Prop()
  finalGrade: number;

  @Prop({ required: true, enum: ['in_progress', 'completed', 'withdrawn'] })
  status: 'in_progress' | 'completed' | 'withdrawn';

  @Prop({ required: true, default: false })
  promotedToNextLevel: boolean;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const StudentCourseHistorySchema = SchemaFactory.createForClass(StudentCourseHistory);
