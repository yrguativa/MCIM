import { Module } from '@nestjs/common';
import { DisciplesService } from './disciples.service';
import { DisciplesResolver } from './disciples.resolver';
import { Disciple, DiscipleSchema } from './schemas/disciple.schema';
import { DisciplePersonalInfo, DisciplePersonalInfoSchema } from './schemas/disciple-personal-info.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciple.name, schema: DiscipleSchema },
      { name: DisciplePersonalInfo.name, schema: DisciplePersonalInfoSchema },
    ]),
  ],
  providers: [DisciplesResolver, DisciplesService],
  exports: [DisciplesService],
})
export class DisciplesModule {}
