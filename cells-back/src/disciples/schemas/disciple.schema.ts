import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Disciple extends Document {
  @Prop({ required: true, unique: true })
  identification: string;

  @Prop({
    required: true,
    enum: ['CC', 'TI', 'CE', 'PPT', 'PASSPORT', 'OTHER'],
  })
  identificationType: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  names: string;

  @Prop({ required: false })
  lastNames: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: true })
  ministryId: string;

  @Prop({ type: String, ref: 'Disciple', required: false })
  leaderId: string;

  @Prop({ required: false })
  network: string;

  @Prop({ required: false })
  status: string;

  @Prop()
  createdUser: string;

  @Prop()
  createdDate: Date;

  @Prop({ required: false })
  updatedUser: string;

  @Prop({ required: false })
  updatedDate: Date;
}

export const DiscipleSchema = SchemaFactory.createForClass(Disciple);
