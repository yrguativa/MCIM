import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateEventAttendanceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  discipleId: string;
}
