import { Test, TestingModule } from '@nestjs/testing';
import { CellsResolver } from './cells.resolver';
import { CellsService } from './cells.service';

describe('CellsResolver', () => {
  let resolver: CellsResolver;
  let service: CellsService;

  const mockCellsService = {
    create: jest.fn().mockResolvedValue({
      id: 'cell-1',
      leader: 'leader-1',
      network: 1,
      host: 'host-1',
      timoteo: 'timoteo-1',
      address: 'Calle 123',
      neighborhood: 1,
      day: 'Lunes',
      time: '18:00',
      createdDate: new Date(),
      createdUser: 'user-1',
      assistants: [],
      records: [],
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    addRecord: jest.fn().mockResolvedValue({
      id: 'cell-1',
      leader: 'leader-1',
      network: 1,
      host: 'host-1',
      timoteo: 'timoteo-1',
      address: 'Calle 123',
      neighborhood: 1,
      day: 'Lunes',
      time: '18:00',
      createdDate: new Date(),
      createdUser: 'user-1',
      assistants: [],
      records: [
        {
          topic: 'Test Topic',
          date: new Date(),
          createdUser: 'user-1',
          assistants: [{ name: 'Juan', disciple: 'disciple-1' }],
        },
      ],
    }),
    addAssistant: jest.fn().mockResolvedValue({
      id: 'cell-1',
      assistants: [
        {
          disciple: 'disciple-1',
          status: 'active',
          createdDate: new Date(),
          createdUser: 'user-1',
          updatedDate: new Date(),
          updatedUser: 'user-1',
        },
      ],
    }),
    deactivateAssistant: jest.fn().mockResolvedValue({
      id: 'cell-1',
      assistants: [
        {
          disciple: 'disciple-1',
          status: 'inactive',
          createdDate: new Date(),
          createdUser: 'user-1',
          updatedDate: new Date(),
          updatedUser: 'user-2',
        },
      ],
    }),
    remove: jest.fn().mockResolvedValue('Cell removed'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CellsResolver,
        { provide: CellsService, useValue: mockCellsService },
      ],
    }).compile();

    resolver = module.get<CellsResolver>(CellsResolver);
    service = module.get<CellsService>(CellsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCell', () => {
    it('should create a cell with all fields', async () => {
      const input = {
        leader: 'leader-1',
        network: 1,
        cellType: 'presencial',
        host: 'host-1',
        timoteo: 'timoteo-1',
        address: 'Calle 123',
        neighborhood: 'neighborhood-1',
        day: 'Lunes',
        time: '18:00',
        createdUser: 'user-1',
      };

      const result = await resolver.createCell(input);
      expect(service.create).toHaveBeenCalledWith(input);
      expect(result.timoteo).toEqual('timoteo-1');
      expect(result.host).toEqual('host-1');
    });
  });

  describe('findAll', () => {
    it('should return all cells', async () => {
      await resolver.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createRecordCell', () => {
    it('should add record with assistants to a cell', async () => {
      const recordInput = {
        topic: 'Test Topic',
        date: new Date(),
        mode: 'presencial',
        createdUser: 'user-1',
        assistants: [{ name: 'Juan', disciple: 'disciple-1' }],
      };

      const result = await resolver.createRecordCell('cell-1', recordInput);
      expect(service.addRecord).toHaveBeenCalledWith('cell-1', recordInput);
      expect(result.records).toHaveLength(1);
    });
  });

  describe('addCellAssistant', () => {
    it('should add assistant to cell', async () => {
      const result = await resolver.addCellAssistant('cell-1', {
        disciple: 'disciple-1',
        createdUser: 'user-1',
      });

      expect(service.addAssistant).toHaveBeenCalledWith('cell-1', {
        disciple: 'disciple-1',
        createdUser: 'user-1',
      });
      expect(result.assistants).toHaveLength(1);
      expect(result.assistants[0].status).toEqual('active');
    });
  });

  describe('deactivateCellAssistant', () => {
    it('should deactivate assistant in cell', async () => {
      const result = await resolver.deactivateCellAssistant('cell-1', {
        disciple: 'disciple-1',
        updatedUser: 'user-2',
      });

      expect(service.deactivateAssistant).toHaveBeenCalledWith('cell-1', {
        disciple: 'disciple-1',
        updatedUser: 'user-2',
      });
      expect(result.assistants[0].status).toEqual('inactive');
    });
  });
});
