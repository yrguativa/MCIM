import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  identification: string;

  @Prop({ required: false })
  ministryId: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  displayName: string;

  @Prop({ required: false })
  photoURL: string;

  @Prop({ required: true })
  authProvider: string; // 'email' | 'google' | 'apple'

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  lastLogin: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Disciple',
    required: false,
  })
  discipleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
