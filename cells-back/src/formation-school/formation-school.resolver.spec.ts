import { Test, TestingModule } from '@nestjs/testing';
import { FormationSchoolResolver } from './formation-school.resolver';
import { FormationSchoolService } from './formation-school.service';

describe('FormationSchoolResolver', () => {
  let resolver: FormationSchoolResolver;
  let service: FormationSchoolService;

  beforeEach(async () => {
    const mockService = {
      findAllCycles: jest.fn().mockResolvedValue([]),
      findCycleById: jest.fn().mockResolvedValue({}),
      findActiveCycle: jest.fn().mockResolvedValue({}),
      createCycle: jest.fn().mockResolvedValue({}),
      findLevelsByCycle: jest.fn().mockResolvedValue([]),
      createLevel: jest.fn().mockResolvedValue({}),
      findAllClassrooms: jest.fn().mockResolvedValue([]),
      createClassroom: jest.fn().mockResolvedValue({}),
      findAllSchedules: jest.fn().mockResolvedValue([]),
      createSchedule: jest.fn().mockResolvedValue({}),
      findCourseClassesByCycle: jest.fn().mockResolvedValue([]),
      findCourseClassesByTeacher: jest.fn().mockResolvedValue([]),
      createCourseClass: jest.fn().mockResolvedValue({}),
      generateQRCode: jest.fn().mockResolvedValue({}),
      findEnrollmentsByCourseClass: jest.fn().mockResolvedValue([]),
      findEnrollmentsByStudent: jest.fn().mockResolvedValue([]),
      enrollStudent: jest.fn().mockResolvedValue({}),
      updateEnrollment: jest.fn().mockResolvedValue({}),
      calculateFinalGrade: jest.fn().mockResolvedValue(75),
      findAttendanceByCourseClass: jest.fn().mockResolvedValue([]),
      findAttendanceByEnrollment: jest.fn().mockResolvedValue([]),
      createAttendance: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormationSchoolResolver,
        { provide: FormationSchoolService, useValue: mockService },
      ],
    }).compile();

    resolver = module.get<FormationSchoolResolver>(FormationSchoolResolver);
    service = module.get<FormationSchoolService>(FormationSchoolService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('cycles', () => {
    it('should return all cycles', async () => {
      const result = await resolver.cycles();
      expect(Array.isArray(result)).toBe(true);
      expect(service.findAllCycles).toHaveBeenCalled();
    });

    it('should return active cycle', async () => {
      const result = await resolver.activeCycle();
      expect(service.findActiveCycle).toHaveBeenCalled();
    });

    it('should create a cycle', async () => {
      const input = {
        name: 'Ciclo 2026-1',
        startDate: new Date(),
        endDate: new Date(),
        requiredClasses: 8,
        active: true,
        createdUser: 'user-1',
      };
      
      const result = await resolver.createCycle(input);
      expect(service.createCycle).toHaveBeenCalledWith(input);
    });
  });

  describe('course classes', () => {
    it('should generate QR code', async () => {
      const courseClassId = 'course-class-1';
      const result = await resolver.generateQRCode(courseClassId);
      expect(service.generateQRCode).toHaveBeenCalledWith(courseClassId);
    });
  });

  describe('attendance', () => {
    it('should calculate final grade', async () => {
      const enrollmentId = 'enrollment-1';
      const cycleRequiredClasses = 8;
      
      const result = await resolver.calculateFinalGrade(enrollmentId, cycleRequiredClasses);
      expect(service.calculateFinalGrade).toHaveBeenCalledWith(enrollmentId, cycleRequiredClasses);
      expect(result).toBe(75);
    });
  });
});
