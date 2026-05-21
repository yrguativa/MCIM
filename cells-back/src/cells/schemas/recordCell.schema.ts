import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AssistantRecordCell,
  AssistantRecordCellSchema,
} from './assistantRecordCell.schema';

@Schema()
export class RecordCell extends Document {
  @Prop()
  topic: string;

  @Prop()
  date: Date;

  @Prop({ required: true })
  mode: string;

  @Prop()
  location?: string;

  @Prop({ required: true })
  leader: string;

  //   @Prop({ required: true, ref: 'Disciple' })
  @Prop({ required: true })
  createdUser: string;

  @Prop([AssistantRecordCellSchema])
  assistants: AssistantRecordCell[];
}

export const RecordCellSchema = SchemaFactory.createForClass(RecordCell);
