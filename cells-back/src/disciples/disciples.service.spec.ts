import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DisciplesService } from './disciples.service';
import { Disciple } from './schemas/disciple.schema';
import { DisciplePersonalInfo } from './schemas/disciple-personal-info.schema';

describe('DisciplesService', () => {
  let service: DisciplesService;

  const mockDiscipleModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    findByIdAndDelete: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    deleteMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
    save: jest.fn(),
  };

  const mockPersonalInfoModel = {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    deleteMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplesService,
        { provide: getModelToken(Disciple.name), useValue: mockDiscipleModel },
        { provide: getModelToken(DisciplePersonalInfo.name), useValue: mockPersonalInfoModel },
      ],
    }).compile();

    service = module.get<DisciplesService>(DisciplesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
