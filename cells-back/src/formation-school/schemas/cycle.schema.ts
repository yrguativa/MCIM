import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cycle extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  requiredClasses: number;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop()
  updatedUser: string;

  @Prop()
  updatedDate: Date;
}

export const CycleSchema = SchemaFactory.createForClass(Cycle);
