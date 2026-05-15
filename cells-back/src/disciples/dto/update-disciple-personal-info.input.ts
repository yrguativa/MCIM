import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateDisciplePersonalInfoInput } from './create-disciple-personal-info.input';
import { IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class UpdateDisciplePersonalInfoInput extends PartialType(CreateDisciplePersonalInfoInput) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId({ message: 'Invalid personal info ID' })
  id: string;
}
