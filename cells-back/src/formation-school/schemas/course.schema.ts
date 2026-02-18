import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  levelId: string;

  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  classroomId: string;

  @Prop({ required: true })
  scheduleId: string;

  @Prop({ required: true })
  cycleId: string;

  @Prop()
  qrCode: string;

  @Prop()
  qrExpiration: Date;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
