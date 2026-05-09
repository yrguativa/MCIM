import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Assistant extends Document {
  @Prop({ required: true })
  names: string;

  @Prop({ required: true })
  lastNames: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: ['CC', 'TI', 'CE', 'PPT', 'PASSPORT', 'OTHER'] })
  identificationType: string;

  @Prop({ required: true, unique: true })
  identification: string;

  @Prop({ type: String, ref: 'Assistant', required: false })
  directLeaderId: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);
