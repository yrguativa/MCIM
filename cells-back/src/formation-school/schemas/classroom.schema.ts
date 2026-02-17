import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Classroom extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
