import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinistriesService } from './ministries.service';
import { MinistriesResolver } from './ministries.resolver';
import { Ministry } from './entities/ministry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ministry])],
  providers: [MinistriesResolver, MinistriesService],
  exports: [MinistriesService],
})
export class MinistriesModule {}
