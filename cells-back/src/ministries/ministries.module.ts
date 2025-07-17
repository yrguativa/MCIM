import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinistriesService } from './ministries.service';
import { MinistriesResolver } from './ministries.resolver';
import { Ministry, MinistrySchema } from './schemas/ministry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ministry.name, schema: MinistrySchema },
    ]),
  ],
  providers: [MinistriesResolver, MinistriesService],
  exports: [MinistriesService],
})
export class MinistriesModule {}
