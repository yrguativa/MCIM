import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RecordCellEntity } from './recordCell.entity';
import { CellAssistantEntity } from './assistantCell.entity';

@ObjectType('Cell')
export class CellEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  leader: string;

  @Field(() => Int)
  network: number;

  @Field(() => String)
  cellType: string;

  @Field(() => String, { nullable: true })
  host?: string;

  @Field(() => String, { nullable: true })
  timoteo?: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  neighborhood: string;

  @Field(() => String, { nullable: true })
  day: string;

  @Field(() => String, { nullable: true })
  time: string;

  @Field(() => Int, { nullable: true })
  yearOpened: number;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => String)
  createdUser: string;

  @Field(() => [CellAssistantEntity], { nullable: true })
  assistants: CellAssistantEntity[];

  @Field(() => [RecordCellEntity], { nullable: true })
  records: RecordCellEntity[];
}
