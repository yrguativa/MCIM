import { InputType, Int, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class CreateCellInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  leader: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsPositive()
  network: number;

  @Field(() => String, {
    description:
      'Enter the name of the host who will receive the cell in their home.',
  })
  @IsNotEmpty()
  @IsMongoId()
  host: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  timoteo: string;

  @Field(() => String)
  @IsNotEmpty()
  address: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsPositive()
  neighborhood: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  day?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  time?: string;

  @Field(() => String)
  @IsNotEmpty()
  createdUser: string;
}
