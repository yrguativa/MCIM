import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FormationSchoolService } from '../services/formation-school.services';
import { Student, Cycle, Level, Classroom, Schedule, Course, StudentEnrollment, TeacherAssignment, Attendance, StudentCourseHistory } from '../models';

interface FormationSchoolState {
  students: Student[];
  cycles: Cycle[];
  levels: Level[];
  classrooms: Classroom[];
  schedules: Schedule[];
  courses: Course[];
  enrollments: StudentEnrollment[];
  teacherAssignments: TeacherAssignment[];
  attendances: Attendance[];
  courseHistories: StudentCourseHistory[];
  activeCycle: Cycle | null;
  
  getStudents: () => Promise<void>;
  getStudentById: (id: string) => Promise<Student | null>;
  createStudent: (student: Partial<Student>) => Promise<boolean>;
  updateStudent: (student: Partial<Student>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  getCycles: () => Promise<void>;
  getActiveCycle: () => Promise<void>;
  createCycle: (cycle: Partial<Cycle>) => Promise<boolean>;
  
  getLevelsByCycle: (cycleId: string) => Promise<void>;
  getLevels: () => Promise<void>;
  createLevel: (level: Partial<Level>) => Promise<boolean>;
  
  getClassrooms: () => Promise<void>;
  createClassroom: (classroom: Partial<Classroom>) => Promise<boolean>;
  
  getSchedules: () => Promise<void>;
  createSchedule: (schedule: Partial<Schedule>) => Promise<boolean>;
  
  getCoursesByCycle: (cycleId: string) => Promise<void>;
  getCoursesByTeacher: (teacherId: string) => Promise<void>;
  createCourse: (course: Partial<Course>) => Promise<boolean>;
  generateQRCode: (courseId: string) => Promise<{ id: string; qrCode: string; qrExpiration: Date }>;
  
  getEnrollmentsByCourse: (courseId: string) => Promise<void>;
  getEnrollmentsByStudent: (studentId: string) => Promise<void>;
  enrollStudent: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  enrollTeacher: (assignment: Partial<TeacherAssignment>) => Promise<boolean>;
  updateEnrollment: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  calculateFinalGrade: (enrollmentId: string, requiredClasses: number) => Promise<number>;
  
  getAttendanceByCourse: (courseId: string) => Promise<void>;
  getAttendanceByEnrollment: (enrollmentId: string) => Promise<void>;
  createAttendance: (attendance: Partial<Attendance>) => Promise<boolean>;
  
  getCourseHistoriesByStudent: (studentId: string) => Promise<void>;
  createCourseHistory: (history: Partial<StudentCourseHistory>) => Promise<boolean>;
  updateCourseHistory: (history: Partial<StudentCourseHistory>) => Promise<boolean>;
}

const store: StateCreator<FormationSchoolState> = (set, get) => ({
  students: [],
  cycles: [],
  levels: [],
  classrooms: [],
  schedules: [],
  courses: [],
  enrollments: [],
  teacherAssignments: [],
  attendances: [],
  courseHistories: [],
  activeCycle: null,

  getStudents: async () => {
    const data = await FormationSchoolService.getStudents();
    set({ students: data.students });
  },

  getStudentById: async (id: string) => {
    const data = await FormationSchoolService.getStudentById(id);
    return data.student;
  },

  createStudent: async (student) => {
    try {
      const { id, createdDate, ...studentData } = student as any;
      await FormationSchoolService.createStudent({
        ...studentData,
        createdUser: studentData.createdUser || 'system',
      });
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error creating student:', error);
      return false;
    }
  },

  updateStudent: async (student) => {
    try {
      await FormationSchoolService.updateStudent(student);
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      await FormationSchoolService.deleteStudent(id);
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  },

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
      const { id, createdDate, ...cycleData } = cycle as any;
      await FormationSchoolService.createCycle({
        ...cycleData,
        createdUser: cycleData.createdUser || 'system',
      });
      await get().getCycles();
      return true;
    } catch (error) {
      console.error('Error creating cycle:', error);
      return false;
    }
  },

  getLevelsByCycle: async (cycleId: string) => {
    const data = await FormationSchoolService.getLevelsByCycle(cycleId);
    set({ levels: data.levelsByCycle });
  },

  getLevels: async () => {
    const data = await FormationSchoolService.getLevels();
    set({ levels: data.levels });
  },

  createLevel: async (level) => {
    try {
      const { id, createdDate, ...levelData } = level as any;
      await FormationSchoolService.createLevel({
        ...levelData,
        createdUser: levelData.createdUser || 'system',
      });
      await get().getLevels();
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
      const { id, createdDate, ...classroomData } = classroom as any;
      await FormationSchoolService.createClassroom({
        ...classroomData,
        createdUser: classroomData.createdUser || 'system',
      });
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
      const { id, createdDate, ...scheduleData } = schedule as any;
      await FormationSchoolService.createSchedule({
        ...scheduleData,
        createdUser: scheduleData.createdUser || 'system',
      });
      await get().getSchedules();
      return true;
    } catch (error) {
      console.error('Error creating schedule:', error);
      return false;
    }
  },

  getCoursesByCycle: async (cycleId: string) => {
    const data = await FormationSchoolService.getCoursesByCycle(cycleId);
    set({ courses: data.coursesByCycle });
  },

  getCoursesByTeacher: async (teacherId: string) => {
    const data = await FormationSchoolService.getCoursesByTeacher(teacherId);
    set({ courses: data.coursesByTeacher });
  },

  createCourse: async (course) => {
    try {
      const { id, createdDate, ...courseData } = course as any;
      await FormationSchoolService.createCourse({
        ...courseData,
        createdUser: courseData.createdUser || 'system',
      });
      await get().getCoursesByCycle(course.cycleId!);
      return true;
    } catch (error) {
      console.error('Error creating course:', error);
      return false;
    }
  },

  generateQRCode: async (courseId: string) => {
    const data = await FormationSchoolService.generateQRCode(courseId);
    return data.generateQRCode;
  },

  getEnrollmentsByCourse: async (courseId: string) => {
    const data = await FormationSchoolService.getEnrollmentsByCourse(courseId);
    set({ enrollments: data.enrollmentsByCourse });
  },

  getEnrollmentsByStudent: async (studentId: string) => {
    const data = await FormationSchoolService.getEnrollmentsByStudent(studentId);
    set({ enrollments: data.enrollmentsByStudent });
  },

  enrollStudent: async (enrollment) => {
    try {
      const { id, createdDate, enrollmentDate, ...enrollmentData } = enrollment as any;
      await FormationSchoolService.enrollStudent({
        ...enrollmentData,
        createdUser: enrollmentData.createdUser || 'system',
        enrollmentDate: new Date(),
      });
      await get().getEnrollmentsByCourse(enrollment.courseId!);
      return true;
    } catch (error) {
      console.error('Error enrolling student:', error);
      return false;
    }
  },

  enrollTeacher: async (assignment) => {
    try {
      const { id, createdDate, assignedDate, ...assignmentData } = assignment as any;
      await FormationSchoolService.enrollTeacher({
        ...assignmentData,
        createdUser: assignmentData.createdUser || 'system',
        assignedDate: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error enrolling teacher:', error);
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

  getAttendanceByCourse: async (courseId: string) => {
    const data = await FormationSchoolService.getAttendanceByCourse(courseId);
    set({ attendances: data.attendanceByCourse });
  },

  getAttendanceByEnrollment: async (enrollmentId: string) => {
    const data = await FormationSchoolService.getAttendanceByEnrollment(enrollmentId);
    set({ attendances: data.attendanceByEnrollment });
  },

  createAttendance: async (attendance) => {
    try {
      const { id, createdDate, attendanceDate, ...attendanceData } = attendance as any;
      await FormationSchoolService.createAttendance({
        ...attendanceData,
        createdUser: attendanceData.createdUser || 'system',
        attendanceDate: new Date(),
      });
      await get().getAttendanceByCourse(attendance.courseId!);
      return true;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return false;
    }
  },

  getCourseHistoriesByStudent: async (studentId: string) => {
    const data = await FormationSchoolService.getCourseHistoriesByStudent(studentId);
    set({ courseHistories: data.courseHistoriesByStudent });
  },

  createCourseHistory: async (history) => {
    try {
      const { id, createdDate, enrollmentDate, ...historyData } = history as any;
      await FormationSchoolService.createCourseHistory({
        ...historyData,
        createdUser: historyData.createdUser || 'system',
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
      });
      await get().getCourseHistoriesByStudent(history.studentId!);
      return true;
    } catch (error) {
      console.error('Error creating course history:', error);
      return false;
    }
  },

  updateCourseHistory: async (history) => {
    try {
      await FormationSchoolService.updateCourseHistory(history);
      await get().getCourseHistoriesByStudent(history.studentId!);
      return true;
    } catch (error) {
      console.error('Error updating course history:', error);
      return false;
    }
  },
});

export const useFormationSchoolStore = create<FormationSchoolState>()(
  devtools(persist(store, { name: 'formation-school-storage' }))
);
