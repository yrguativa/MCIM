import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Disciple extends Document {
  @Prop({ required: true, unique: true })
  identification: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  email: string;

  phone: string;

  address: string;

  birthDate: Date;
}

export const DiscipleSchema = SchemaFactory.createForClass(Disciple);
