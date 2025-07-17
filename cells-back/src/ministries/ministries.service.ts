import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ministry } from './entities/ministry.entity';
import { CreateMinistryInput, UpdateMinistryInput } from './dto/ministry.input';

@Injectable()
export class MinistriesService {
  constructor(
    @InjectRepository(Ministry)
    private readonly ministriesRepository: Repository<Ministry>,
  ) {}

  async create(createMinistryInput: CreateMinistryInput): Promise<Ministry> {
    const ministry = this.ministriesRepository.create(createMinistryInput);
    return await this.ministriesRepository.save(ministry);
  }

  async findAll(): Promise<Ministry[]> {
    return await this.ministriesRepository.find({
      relations: ['parentMinistry', 'leader', 'createdUser', 'subMinistries'],
    });
  }

  async findOne(id: string): Promise<Ministry> {
    const ministry = await this.ministriesRepository.findOne({
      where: { id },
      relations: ['parentMinistry', 'leader', 'createdUser', 'subMinistries'],
    });

    if (!ministry) {
      throw new NotFoundException(`Ministry with ID ${id} not found`);
    }

    return ministry;
  }

  async update(id: string, updateMinistryInput: UpdateMinistryInput): Promise<Ministry> {
    const ministry = await this.findOne(id);
    
    Object.assign(ministry, updateMinistryInput);
    
    return await this.ministriesRepository.save(ministry);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.ministriesRepository.delete(id);
    return result.affected > 0;
  }

  async findSubMinistries(ministryId: string): Promise<Ministry[]> {
    return await this.ministriesRepository.find({
      where: { parentMinistryId: ministryId },
      relations: ['leader'],
    });
  }
}
