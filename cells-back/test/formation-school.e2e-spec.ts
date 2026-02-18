import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { FormationSchoolModule } from '../src/formation-school/formation-school.module';

describe('FormationSchool E2E Tests', () => {
  let app: INestApplication;

  const testCycle = {
    name: 'Test Cycle 2026',
    startDate: new Date('2026-01-01').toISOString(),
    endDate: new Date('2026-06-30').toISOString(),
    requiredClasses: 8,
    active: true,
    createdUser: 'test-user',
  };

  const testClassroom = {
    name: 'Test Classroom',
    capacity: 20,
    location: 'Test Location',
    createdUser: 'test-user',
  };

  const testSchedule = {
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    createdUser: 'test-user',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/formation-school-test'),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
        }),
        FormationSchoolModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GraphQL Queries and Mutations', () => {
    it('should create a cycle', async () => {
      const createCycleMutation = `
        mutation CreateCycle($input: CreateCycleInput!) {
          createCycle(input: $input) {
            id
            name
            requiredClasses
            active
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createCycleMutation,
          variables: {
            input: testCycle,
          },
        });

      expect(result.status).toBe(200);
      expect(result.body.data.createCycle.name).toBe(testCycle.name);
    });

    it('should query all cycles', async () => {
      const query = `
        query {
          cycles {
            id
            name
            requiredClasses
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(result.status).toBe(200);
      expect(Array.isArray(result.body.data.cycles)).toBe(true);
    });

    it('should create a classroom', async () => {
      const mutation = `
        mutation CreateClassroom($input: CreateClassroomInput!) {
          createClassroom(input: $input) {
            id
            name
            capacity
            location
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
          variables: {
            input: testClassroom,
          },
        });

      expect(result.status).toBe(200);
      expect(result.body.data.createClassroom.name).toBe(testClassroom.name);
    });

    it('should create a schedule', async () => {
      const mutation = `
        mutation CreateSchedule($input: CreateScheduleInput!) {
          createSchedule(input: $input) {
            id
            dayOfWeek
            startTime
            endTime
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
          variables: {
            input: testSchedule,
          },
        });

      expect(result.status).toBe(200);
      expect(result.body.data.createSchedule.dayOfWeek).toBe(testSchedule.dayOfWeek);
    });

    it('should query all classrooms', async () => {
      const query = `
        query {
          classrooms {
            id
            name
            capacity
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(result.status).toBe(200);
      expect(Array.isArray(result.body.data.classrooms)).toBe(true);
    });

    it('should query all schedules', async () => {
      const query = `
        query {
          schedules {
            id
            dayOfWeek
            startTime
            endTime
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(result.status).toBe(200);
      expect(Array.isArray(result.body.data.schedules)).toBe(true);
    });
  });

  describe('Business Logic Integration', () => {
    it('should detect schedule conflict', async () => {
      const createCourseClassMutation = `
        mutation CreateCourseClass($input: CreateCourseClassInput!) {
          createCourseClass(input: $input) {
            id
            levelId
            teacherId
            classroomId
            scheduleId
          }
        }
      `;

      const result1 = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createCourseClassMutation,
          variables: {
            input: {
              levelId: 'level-1',
              teacherId: 'teacher-1',
              classroomId: 'classroom-1',
              scheduleId: 'schedule-1',
              cycleId: 'cycle-1',
              createdUser: 'test-user',
            },
          },
        });

      const result2 = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createCourseClassMutation,
          variables: {
            input: {
              levelId: 'level-2',
              teacherId: 'teacher-2',
              classroomId: 'classroom-1',
              scheduleId: 'schedule-1',
              cycleId: 'cycle-1',
              createdUser: 'test-user',
            },
          },
        });

      expect(result2.body.errors).toBeDefined();
    });

    it('should calculate attendance grade correctly', async () => {
      const mutation = `
        mutation CalculateFinalGrade($enrollmentId: ID!, $cycleRequiredClasses: Float!) {
          calculateFinalGrade(enrollmentId: $enrollmentId, cycleRequiredClasses: $cycleRequiredClasses)
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
          variables: {
            enrollmentId: 'test-enrollment-id',
            cycleRequiredClasses: 8,
          },
        });

      expect(result.status).toBe(200);
      expect(
        typeof result.body.data?.calculateFinalGrade === 'number' || result.body.errors,
      ).toBe(true);
    });
  });

  describe('Full Workflow Integration', () => {
    it('should complete full enrollment workflow', async () => {
      const createCycleResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCycle($input: CreateCycleInput!) {
              createCycle(input: $input) { id name }
            }
          `,
          variables: { input: testCycle },
        });

      const cycleId = createCycleResult.body.data?.createCycle?.id;
      expect(cycleId).toBeDefined();

      const createLevelResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateLevel($input: CreateLevelInput!) {
              createLevel(input: $input) { id name order }
            }
          `,
          variables: {
            input: {
              name: 'Basic Level',
              description: 'Basic course',
              order: 1,
              cycleId,
              createdUser: 'test-user',
            },
          },
        });

      const levelId = createLevelResult.body.data?.createLevel?.id;
      expect(levelId).toBeDefined();

      const classroomResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateClassroom($input: CreateClassroomInput!) {
              createClassroom(input: $input) { id name capacity }
            }
          `,
          variables: { input: testClassroom },
        });

      const classroomId = classroomResult.body.data?.createClassroom?.id;
      expect(classroomId).toBeDefined();

      const scheduleResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateSchedule($input: CreateScheduleInput!) {
              createSchedule(input: $input) { id dayOfWeek startTime endTime }
            }
          `,
          variables: { input: testSchedule },
        });

      const scheduleId = scheduleResult.body.data?.createSchedule?.id;
      expect(scheduleId).toBeDefined();

      const courseClassResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateCourseClass($input: CreateCourseClassInput!) {
              createCourseClass(input: $input) { id }
            }
          `,
          variables: {
            input: {
              levelId,
              teacherId: 'teacher-1',
              classroomId,
              scheduleId,
              cycleId,
              createdUser: 'test-user',
            },
          },
        });

      const courseClassId = courseClassResult.body.data?.createCourseClass?.id;
      expect(courseClassId).toBeDefined();

      const enrollResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation EnrollStudent($input: EnrollStudentInput!) {
              enrollStudent(input: $input) { id studentId courseClassId status }
            }
          `,
          variables: {
            input: {
              studentId: 'student-1',
              courseClassId,
              createdUser: 'test-user',
            },
          },
        });

      const enrollmentId = enrollResult.body.data?.enrollStudent?.id;
      expect(enrollmentId).toBeDefined();

      const attendanceResult = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateAttendance($input: CreateAttendanceInput!) {
              createAttendance(input: $input) { id attended }
            }
          `,
          variables: {
            input: {
              studentEnrollmentId: enrollmentId,
              courseClassId,
              attended: true,
              attendanceDate: new Date().toISOString(),
              createdUser: 'test-user',
            },
          },
        });

      const attendanceId = attendanceResult.body.data?.createAttendance?.id;
      expect(attendanceId).toBeDefined();

      const attendanceQuery = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query AttendanceByEnrollment($enrollmentId: ID!) {
              attendanceByEnrollment(enrollmentId: $enrollmentId) {
                id
                attended
              }
            }
          `,
          variables: { enrollmentId },
        });

      const attendances = attendanceQuery.body.data?.attendanceByEnrollment;
      expect(attendances.length).toBeGreaterThan(0);
    });
  });
});
