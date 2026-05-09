import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateAssistantInput {
  @Field()
  @IsNotEmpty({ message: 'Names are required' })
  names: string;

  @Field()
  @IsNotEmpty({ message: 'Last names are required' })
  lastNames: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @Field()
  @IsNotEmpty({ message: 'Identification type is required' })
  identificationType: string;

  @Field()
  @IsNotEmpty({ message: 'Identification is required' })
  identification: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  directLeaderId: string;
}
