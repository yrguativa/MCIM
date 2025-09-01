import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateEventAttendanceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  discipleId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  identification?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ministryId?: string;
}
