import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Student extends Document {
  @Prop({ required: true, unique: true })
  discipleId: string;

  @Prop({ required: true })
  currentLevelId: string;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
