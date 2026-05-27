import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Child extends Document {
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Disciple' })
  parentId: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'Disciple' })
  childDiscipleId: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  attendsChurch: string;

  @Prop({ required: false })
  createdUser: string;

  @Prop({ required: false })
  updatedUser: string;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
