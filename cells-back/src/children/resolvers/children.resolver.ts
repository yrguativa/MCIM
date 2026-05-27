import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChildrenService } from '../services/children.service';
import { ChildEntity } from '../entities/child.entity';
import { CreateChildInput } from '../dto/create-child.input';
import { UpdateChildInput } from '../dto/update-child.input';

@Resolver(() => ChildEntity)
export class ChildrenResolver {
  constructor(private readonly service: ChildrenService) {}

  @Mutation(() => ChildEntity)
  createChild(@Args('input') input: CreateChildInput) {
    return this.service.create(input);
  }

  @Mutation(() => [ChildEntity])
  createChildrenBatch(@Args('inputs', { type: () => [CreateChildInput] }) inputs: CreateChildInput[]) {
    return this.service.createBatch(inputs);
  }

  @Mutation(() => ChildEntity)
  updateChild(@Args('input') input: UpdateChildInput) {
    return this.service.update(input);
  }

  @Query(() => [ChildEntity])
  childrenByParent(@Args('parentId', { type: () => String }) parentId: string) {
    return this.service.findByParent(parentId);
  }

  @Mutation(() => ChildEntity)
  deleteChild(@Args('id', { type: () => String }) id: string) {
    return this.service.delete(id);
  }
}
