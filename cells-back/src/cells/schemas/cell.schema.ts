import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cell extends Document {
  @Prop()
  leader: string;

  @Prop()
  network: number;

  @Prop()
  host: string;

  @Prop()
  address: string;

  @Prop()
  neighborhood: number;

  @Prop()
  createdDate: Date;

  @Prop({ required: true })
  createdUser: string;
}

export const CellSchema = SchemaFactory.createForClass(Cell);
