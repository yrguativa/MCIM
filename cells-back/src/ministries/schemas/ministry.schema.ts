import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Ministry extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ default: true })
  active: boolean;
}

export const MinistrySchema = SchemaFactory.createForClass(Ministry);
