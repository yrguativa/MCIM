import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FormationSchoolService } from '../services/formation-school.services';
import { Cycle, Level, Classroom, Schedule, CourseClass, StudentEnrollment, Attendance } from '../models';

interface FormationSchoolState {
  cycles: Cycle[];
  levels: Level[];
  classrooms: Classroom[];
  schedules: Schedule[];
  courseClasses: CourseClass[];
  enrollments: StudentEnrollment[];
  attendances: Attendance[];
  activeCycle: Cycle | null;
  
  getCycles: () => Promise<void>;
  getActiveCycle: () => Promise<void>;
  createCycle: (cycle: Partial<Cycle>) => Promise<boolean>;
  
  getLevelsByCycle: (cycleId: string) => Promise<void>;
  createLevel: (level: Partial<Level>) => Promise<boolean>;
  
  getClassrooms: () => Promise<void>;
  createClassroom: (classroom: Partial<Classroom>) => Promise<boolean>;
  
  getSchedules: () => Promise<void>;
  createSchedule: (schedule: Partial<Schedule>) => Promise<boolean>;
  
  getCourseClassesByCycle: (cycleId: string) => Promise<void>;
  getCourseClassesByTeacher: (teacherId: string) => Promise<void>;
  createCourseClass: (courseClass: Partial<CourseClass>) => Promise<boolean>;
  generateQRCode: (courseClassId: string) => Promise<{ id: string; qrCode: string; qrExpiration: Date }>;
  
  getEnrollmentsByCourseClass: (courseClassId: string) => Promise<void>;
  getEnrollmentsByStudent: (studentId: string) => Promise<void>;
  enrollStudent: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  updateEnrollment: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  calculateFinalGrade: (enrollmentId: string, requiredClasses: number) => Promise<number>;
  
  getAttendanceByCourseClass: (courseClassId: string) => Promise<void>;
  getAttendanceByEnrollment: (enrollmentId: string) => Promise<void>;
  createAttendance: (attendance: Partial<Attendance>) => Promise<boolean>;
}

const store: StateCreator<FormationSchoolState> = (set, get) => ({
  cycles: [],
  levels: [],
  classrooms: [],
  schedules: [],
  courseClasses: [],
  enrollments: [],
  attendances: [],
  activeCycle: null,

  getCycles: async () => {
    const data = await FormationSchoolService.getCycles();
    set({ cycles: data.cycles });
  },

  getActiveCycle: async () => {
    const data = await FormationSchoolService.getActiveCycle();
    set({ activeCycle: data.activeCycle });
  },

  createCycle: async (cycle) => {
    try {
      await FormationSchoolService.createCycle(cycle);
      await get().getCycles();
      return true;
    } catch (error) {
      console.error('Error creating cycle:', error);
      return false;
    }
  },

  getLevelsByCycle: async (cycleId) => {
    const data = await FormationSchoolService.getLevelsByCycle(cycleId);
    set({ levels: data.levelsByCycle });
  },

  createLevel: async (level) => {
    try {
      await FormationSchoolService.createLevel(level);
      await get().getLevelsByCycle(level.cycleId!);
      return true;
    } catch (error) {
      console.error('Error creating level:', error);
      return false;
    }
  },

  getClassrooms: async () => {
    const data = await FormationSchoolService.getClassrooms();
    set({ classrooms: data.classrooms });
  },

  createClassroom: async (classroom) => {
    try {
      await FormationSchoolService.createClassroom(classroom);
      await get().getClassrooms();
      return true;
    } catch (error) {
      console.error('Error creating classroom:', error);
      return false;
    }
  },

  getSchedules: async () => {
    const data = await FormationSchoolService.getSchedules();
    set({ schedules: data.schedules });
  },

  createSchedule: async (schedule) => {
    try {
      await FormationSchoolService.createSchedule(schedule);
      await get().getSchedules();
      return true;
    } catch (error) {
      console.error('Error creating schedule:', error);
      return false;
    }
  },

  getCourseClassesByCycle: async (cycleId) => {
    const data = await FormationSchoolService.getCourseClassesByCycle(cycleId);
    set({ courseClasses: data.courseClassesByCycle });
  },

  getCourseClassesByTeacher: async (teacherId) => {
    const data = await FormationSchoolService.getCourseClassesByTeacher(teacherId);
    set({ courseClasses: data.courseClassesByTeacher });
  },

  createCourseClass: async (courseClass) => {
    try {
      await FormationSchoolService.createCourseClass(courseClass);
      await get().getCourseClassesByCycle(courseClass.cycleId!);
      return true;
    } catch (error) {
      console.error('Error creating course class:', error);
      return false;
    }
  },

  generateQRCode: async (courseClassId) => {
    const data = await FormationSchoolService.generateQRCode(courseClassId);
    return data.generateQRCode;
  },

  getEnrollmentsByCourseClass: async (courseClassId) => {
    const data = await FormationSchoolService.getEnrollmentsByCourseClass(courseClassId);
    set({ enrollments: data.enrollmentsByCourseClass });
  },

  getEnrollmentsByStudent: async (studentId) => {
    const data = await FormationSchoolService.getEnrollmentsByStudent(studentId);
    set({ enrollments: data.enrollmentsByStudent });
  },

  enrollStudent: async (enrollment) => {
    try {
      await FormationSchoolService.enrollStudent(enrollment);
      await get().getEnrollmentsByCourseClass(enrollment.courseClassId!);
      return true;
    } catch (error) {
      console.error('Error enrolling student:', error);
      return false;
    }
  },

  updateEnrollment: async (enrollment) => {
    try {
      await FormationSchoolService.updateEnrollment(enrollment);
      return true;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      return false;
    }
  },

  calculateFinalGrade: async (enrollmentId, requiredClasses) => {
    return FormationSchoolService.calculateFinalGrade(enrollmentId, requiredClasses);
  },

  getAttendanceByCourseClass: async (courseClassId) => {
    const data = await FormationSchoolService.getAttendanceByCourseClass(courseClassId);
    set({ attendances: data.attendanceByCourseClass });
  },

  getAttendanceByEnrollment: async (enrollmentId) => {
    const data = await FormationSchoolService.getAttendanceByEnrollment(enrollmentId);
    set({ attendances: data.attendanceByEnrollment });
  },

  createAttendance: async (attendance) => {
    try {
      await FormationSchoolService.createAttendance(attendance);
      await get().getAttendanceByCourseClass(attendance.courseClassId!);
      return true;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return false;
    }
  },
});

export const useFormationSchoolStore = create<FormationSchoolState>()(
  devtools(persist(store, { name: 'formation-school-storage' }))
);
