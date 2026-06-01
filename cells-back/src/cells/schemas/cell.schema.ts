import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RecordCell, RecordCellSchema } from './recordCell.schema';

@Schema()
export class CellAssistant {
  @Prop({ required: true })
  disciple: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ required: true })
  updatedDate: Date;

  @Prop({ required: true })
  updatedUser: string;
}

export const CellAssistantSchema = SchemaFactory.createForClass(CellAssistant);

@Schema()
export class Cell extends Document {
  @Prop()
  leader: string;

  @Prop()
  network: number;

  @Prop({ enum: ['discipulado', 'celula', 'celula_anexa'], default: 'celula' })
  cellType: string;

  @Prop()
  host: string;

  @Prop()
  timoteo: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop()
  day: string;

  @Prop()
  time: string;

  @Prop()
  yearOpened: number;

  @Prop()
  createdDate: Date;

  @Prop({ required: true })
  createdUser: string;

  @Prop({ type: [CellAssistantSchema], default: [] })
  assistants: CellAssistant[];

  @Prop({ type: [RecordCellSchema], required: false })
  records: RecordCell[];
}

export const CellSchema = SchemaFactory.createForClass(Cell);
