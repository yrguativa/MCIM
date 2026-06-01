import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Neighborhood extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
