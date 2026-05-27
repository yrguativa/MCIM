import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from './schemas/child.schema';
import { ChildrenService } from './services/children.service';
import { ChildrenResolver } from './resolvers/children.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Child.name, schema: ChildSchema },
    ]),
  ],
  providers: [ChildrenResolver, ChildrenService],
})
export class ChildrenModule {}
