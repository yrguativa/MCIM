import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class DisciplePersonalInfo extends Document {
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Disciple' })
  discipleId: string;

  @Prop({ required: true, enum: ['COLOMBIAN', 'VENEZUELAN', 'FOREIGN'] })
  nationality: string;

  @Prop({ required: true, enum: ['FEMALE', 'MALE'] })
  gender: string;

  @Prop({ required: false, enum: ['SINGLE', 'MARRIED', 'WIDOWED', 'FREE_UNION', 'DIVORCED'] })
  maritalStatus: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  hasChildren: string;

  @Prop({ required: false, enum: ['YES', 'NO'] })
  childrenAttendChurch: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  housingComplex: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true, enum: ['MOSQUERA', 'FUNZA', 'MADRID', 'BOJACA', 'FACATATIVA', 'FONTIBON', 'BOGOTA'] })
  municipality: string;

  @Prop({ required: true, enum: ['YOUTH', 'PRE', 'ROCAS', 'MEN', 'WOMEN'] })
  network: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true })
  ministryId: string;

  @Prop({ required: true })
  yearArrivedAtChurch: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  hasAttendedEncounter: string;

  @Prop({ required: false })
  yearAttendedEncounter: string;

  @Prop({ required: false, enum: ['YES', 'NO'] })
  hasRepeatedEncounter: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  hasAttendedReencounter: string;

  @Prop({ required: false })
  yearAttendedReencounter: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  baptizedAtMCI: string;

  @Prop({ required: false, enum: ['YES', 'NO'] })
  isLeader: string;

  @Prop({ required: true, enum: ['12', '144', '1728', '20736', '248832', '2985984'] })
  generation: string;

  @Prop({ required: true, enum: ['BASIC_1', 'BASIC_2', 'BASIC_3', 'ADVANCED_1', 'ADVANCED_2', 'ADVANCED_3', 'GRADUATE', 'NOT_STARTED'] })
  formationSchoolLevel: string;
}

export const DisciplePersonalInfoSchema = SchemaFactory.createForClass(DisciplePersonalInfo);
