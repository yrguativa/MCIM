import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FormationSchoolService } from './formation-school.service';
import { CycleEntity } from './entities/cycle.entity';
import { LevelEntity } from './entities/level.entity';
import { ClassroomEntity } from './entities/classroom.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { CourseEntity } from './entities/course.entity';
import { StudentEntity } from './entities/student.entity';
import { StudentEnrollmentEntity } from './entities/student-enrollment.entity';
import { TeacherAssignmentEntity } from './entities/teacher-assignment.entity';
import { AttendanceEntity } from './entities/attendance.entity';
import { StudentCourseHistoryEntity } from './entities/student-course-history.entity';
import { CreateCycleInput } from './dto/create-cycle.input';
import { CreateLevelInput } from './dto/create-level.input';
import { CreateClassroomInput } from './dto/create-classroom.input';
import { CreateScheduleInput, UpdateScheduleInput, UpdateScheduleInputWithId } from './dto/create-schedule.input';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateStudentInput, UpdateStudentInput } from './dto/create-student.input';
import { EnrollStudentInput, UpdateEnrollmentInput } from './dto/enroll-student.input';
import { CreateTeacherAssignmentInput } from './dto/teacher-assignment.input';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { CreateStudentCourseHistoryInput, UpdateStudentCourseHistoryInput } from './dto/create-student-course-history.input';

@Resolver()
export class FormationSchoolResolver {
  constructor(private readonly fsService: FormationSchoolService) {}

  // Cycles
  @Query(() => [CycleEntity])
  async cycles(): Promise<CycleEntity[]> {
    return this.fsService.findAllCycles();
  }

  @Query(() => CycleEntity)
  async cycle(@Args('id', { type: () => ID }) id: string): Promise<CycleEntity> {
    return this.fsService.findCycleById(id);
  }

  @Query(() => CycleEntity, { nullable: true })
  async activeCycle(): Promise<CycleEntity | null> {
    return this.fsService.findActiveCycle();
  }

  @Mutation(() => CycleEntity)
  async createCycle(@Args('input') input: CreateCycleInput): Promise<CycleEntity> {
    return this.fsService.createCycle(input);
  }

  // Levels
  @Query(() => [LevelEntity])
  async levels(): Promise<LevelEntity[]> {
    return this.fsService.findAllLevels();
  }

  @Query(() => [LevelEntity])
  async levelsByCycle(@Args('cycleId', { type: () => ID }) cycleId: string): Promise<LevelEntity[]> {
    return this.fsService.findLevelsByCycle(cycleId);
  }

  @Mutation(() => LevelEntity)
  async createLevel(@Args('input') input: CreateLevelInput): Promise<LevelEntity> {
    return this.fsService.createLevel(input);
  }

  // Classrooms
  @Query(() => [ClassroomEntity])
  async classrooms(): Promise<ClassroomEntity[]> {
    return this.fsService.findAllClassrooms();
  }

  @Mutation(() => ClassroomEntity)
  async createClassroom(@Args('input') input: CreateClassroomInput): Promise<ClassroomEntity> {
    return this.fsService.createClassroom(input);
  }

  // Schedules
  @Query(() => [ScheduleEntity])
  async schedules(): Promise<ScheduleEntity[]> {
    return this.fsService.findAllSchedules();
  }

  @Mutation(() => ScheduleEntity)
  async createSchedule(@Args('input') input: CreateScheduleInput): Promise<ScheduleEntity> {
    return this.fsService.createSchedule(input);
  }

  @Mutation(() => ScheduleEntity)
  async updateSchedule(@Args('input') input: UpdateScheduleInputWithId): Promise<ScheduleEntity> {
    return this.fsService.updateSchedule(input);
  }

  // Students
  @Query(() => [StudentEntity])
  async students(): Promise<StudentEntity[]> {
    return this.fsService.findAllStudents();
  }

  @Query(() => StudentEntity)
  async student(@Args('id', { type: () => ID }) id: string): Promise<StudentEntity> {
    return this.fsService.findStudentById(id);
  }

  @Query(() => StudentEntity, { nullable: true })
  async studentByDisciple(@Args('discipleId', { type: () => ID }) discipleId: string): Promise<StudentEntity | null> {
    return this.fsService.findStudentByDiscipleId(discipleId);
  }

  @Mutation(() => StudentEntity)
  async createStudent(@Args('input') input: CreateStudentInput): Promise<StudentEntity> {
    return this.fsService.createStudent(input);
  }

  @Mutation(() => StudentEntity)
  async updateStudent(@Args('input') input: UpdateStudentInput): Promise<StudentEntity> {
    return this.fsService.updateStudent(input);
  }

  @Mutation(() => Boolean)
  async deleteStudent(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.fsService.deleteStudent(id);
  }

  // Courses
  @Query(() => [CourseEntity])
  async coursesByCycle(@Args('cycleId', { type: () => ID }) cycleId: string): Promise<CourseEntity[]> {
    return this.fsService.findCoursesByCycle(cycleId);
  }

  @Query(() => [CourseEntity])
  async coursesByTeacher(@Args('teacherId', { type: () => ID }) teacherId: string): Promise<CourseEntity[]> {
    return this.fsService.findCoursesByTeacher(teacherId);
  }

  @Mutation(() => CourseEntity)
  async createCourse(@Args('input') input: CreateCourseInput): Promise<CourseEntity> {
    return this.fsService.createCourse(input);
  }

  @Mutation(() => CourseEntity)
  async generateQRCode(@Args('courseId', { type: () => ID }) courseId: string): Promise<CourseEntity> {
    return this.fsService.generateQRCode(courseId);
  }

  // Enrollments
  @Query(() => [StudentEnrollmentEntity])
  async enrollmentsByCourse(@Args('courseId', { type: () => ID }) courseId: string): Promise<StudentEnrollmentEntity[]> {
    return this.fsService.findEnrollmentsByCourse(courseId);
  }

  @Query(() => [StudentEnrollmentEntity])
  async enrollmentsByStudent(@Args('studentId', { type: () => ID }) studentId: string): Promise<StudentEnrollmentEntity[]> {
    return this.fsService.findEnrollmentsByStudent(studentId);
  }

  @Mutation(() => StudentEnrollmentEntity)
  async enrollStudent(@Args('input') input: EnrollStudentInput): Promise<StudentEnrollmentEntity> {
    return this.fsService.enrollStudent(input);
  }

  @Mutation(() => TeacherAssignmentEntity)
  async enrollTeacher(@Args('input') input: CreateTeacherAssignmentInput): Promise<TeacherAssignmentEntity> {
    return this.fsService.enrollTeacher(input);
  }

  @Mutation(() => StudentEnrollmentEntity)
  async updateEnrollment(@Args('input') input: UpdateEnrollmentInput): Promise<StudentEnrollmentEntity> {
    return this.fsService.updateEnrollment(input);
  }

  @Mutation(() => Number)
  async calculateFinalGrade(
    @Args('enrollmentId', { type: () => ID }) enrollmentId: string,
    @Args('cycleRequiredClasses') cycleRequiredClasses: number,
  ): Promise<number> {
    return this.fsService.calculateFinalGrade(enrollmentId, cycleRequiredClasses);
  }

  // Attendance
  @Query(() => [AttendanceEntity])
  async attendanceByCourse(@Args('courseId', { type: () => ID }) courseId: string): Promise<AttendanceEntity[]> {
    return this.fsService.findAttendanceByCourse(courseId);
  }

  @Query(() => [AttendanceEntity])
  async attendanceByEnrollment(@Args('enrollmentId', { type: () => ID }) enrollmentId: string): Promise<AttendanceEntity[]> {
    return this.fsService.findAttendanceByEnrollment(enrollmentId);
  }

  @Mutation(() => AttendanceEntity)
  async createAttendance(@Args('input') input: CreateAttendanceInput): Promise<AttendanceEntity> {
    return this.fsService.createAttendance(input);
  }

  // Course History
  @Query(() => [StudentCourseHistoryEntity])
  async courseHistoriesByStudent(@Args('studentId', { type: () => ID }) studentId: string): Promise<StudentCourseHistoryEntity[]> {
    return this.fsService.findCourseHistoriesByStudent(studentId);
  }

  @Mutation(() => StudentCourseHistoryEntity)
  async createCourseHistory(@Args('input') input: CreateStudentCourseHistoryInput): Promise<StudentCourseHistoryEntity> {
    return this.fsService.createCourseHistory(input);
  }

  @Mutation(() => StudentCourseHistoryEntity)
  async updateCourseHistory(@Args('input') input: UpdateStudentCourseHistoryInput): Promise<StudentCourseHistoryEntity> {
    return this.fsService.updateCourseHistory(input);
  }
}
