import { Module } from '@nestjs/common';
import { DisciplesService } from './disciples.service';
import { DisciplesResolver } from './disciples.resolver';
import { Disciple, DiscipleSchema } from './schemas/disciple.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciple.name, schema: DiscipleSchema },
    ]),
  ],
  providers: [DisciplesResolver, DisciplesService],
})
export class DisciplesModule {}
