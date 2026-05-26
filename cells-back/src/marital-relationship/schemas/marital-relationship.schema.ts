import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class MaritalRelationship extends Document {
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Disciple',
    unique: true,
  })
  discipleId: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  attendsChurch: string;

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Disciple',
  })
  spouseId: string;

  @Prop({ required: false })
  spouseName: string;

  @Prop({ required: false })
  createdUser: string;

  @Prop({ required: false })
  updatedUser: string;
}

export const MaritalRelationshipSchema =
  SchemaFactory.createForClass(MaritalRelationship);
