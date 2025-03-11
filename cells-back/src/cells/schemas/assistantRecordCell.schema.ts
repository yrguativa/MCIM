import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AssistantRecordCell extends Document {
  @Prop()
  name: string;

  @Prop()
  disciple: string;
}

export const AssistantRecordCellSchema =
  SchemaFactory.createForClass(AssistantRecordCell);
