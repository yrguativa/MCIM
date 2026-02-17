import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormationSchoolService } from './formation-school.service';
import { FormationSchoolResolver } from './formation-school.resolver';
import { Cycle, CycleSchema } from './schemas/cycle.schema';
import { Level, LevelSchema } from './schemas/level.schema';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { CourseClass, CourseClassSchema } from './schemas/course-class.schema';
import { StudentEnrollment, StudentEnrollmentSchema } from './schemas/student-enrollment.schema';
import { TeacherAssignment, TeacherAssignmentSchema } from './schemas/teacher-assignment.schema';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cycle.name, schema: CycleSchema },
      { name: Level.name, schema: LevelSchema },
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: CourseClass.name, schema: CourseClassSchema },
      { name: StudentEnrollment.name, schema: StudentEnrollmentSchema },
      { name: TeacherAssignment.name, schema: TeacherAssignmentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
  ],
  providers: [FormationSchoolService, FormationSchoolResolver],
  exports: [FormationSchoolService],
})
export class FormationSchoolModule {}
