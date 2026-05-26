import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaritalRelationship, MaritalRelationshipSchema } from './schemas/marital-relationship.schema';
import { MaritalRelationshipService } from './services/marital-relationship.service';
import { MaritalRelationshipResolver } from './resolvers/marital-relationship.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaritalRelationship.name, schema: MaritalRelationshipSchema },
    ]),
  ],
  providers: [MaritalRelationshipResolver, MaritalRelationshipService],
})
export class MaritalRelationshipModule {}
