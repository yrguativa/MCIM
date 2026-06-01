import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateNeighborhoodInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Neighborhood name is required' })
  name: string;
}
