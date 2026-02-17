import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function graphqlRequest(query: string, variables?: Record<string, unknown>) {
  const { data } = await api.post(API_URL, JSON.stringify({ query, variables }));
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

export const FormationSchoolService = {
  async getCycles() {
    const query = `query { cycles { id name startDate endDate requiredClasses active } }`;
    return graphqlRequest(query);
  },
  
  async getActiveCycle() {
    const query = `query { activeCycle { id name startDate endDate requiredClasses active } }`;
    return graphqlRequest(query);
  },
  
  async createCycle(input: Record<string, unknown>) {
    const query = `mutation CreateCycle($input: CreateCycleInput!) { createCycle(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getLevelsByCycle(cycleId: string) {
    const query = `query LevelsByCycle($cycleId: ID!) { levelsByCycle(cycleId: $cycleId) { id name description order cycleId } }`;
    return graphqlRequest(query, { cycleId });
  },
  
  async createLevel(input: Record<string, unknown>) {
    const query = `mutation CreateLevel($input: CreateLevelInput!) { createLevel(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getClassrooms() {
    const query = `query { classrooms { id name capacity location } }`;
    return graphqlRequest(query);
  },
  
  async createClassroom(input: Record<string, unknown>) {
    const query = `mutation CreateClassroom($input: CreateClassroomInput!) { createClassroom(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getSchedules() {
    const query = `query { schedules { id dayOfWeek startTime endTime } }`;
    return graphqlRequest(query);
  },
  
  async createSchedule(input: Record<string, unknown>) {
    const query = `mutation CreateSchedule($input: CreateScheduleInput!) { createSchedule(input: $input) { id } }`;
    return graphqlRequest(query, { input });
  },

  async getCourseClassesByCycle(cycleId: string) {
    const query = `query CourseClassesByCycle($cycleId: ID!) { courseClassesByCycle(cycleId: $cycleId) { id levelId teacherId classroomId scheduleId cycleId qrCode qrExpiration } }`;
    return graphqlRequest(query, { cycleId });
  },
  
  async getCourseClassesByTeacher(teacherId: string) {
    const query = `query CourseClassesByTeacher($teacherId: ID!) { courseClassesByTeacher(teacherId: $teacherId) { id levelId teacherId classroomId scheduleId cycleId qrCode qrExpiration } }`;
    return graphqlRequest(query, { teacherId });
  },
  
  async createCourseClass(input: Record<string, unknown>) {
    const query = `mutation CreateCourseClass($input: CreateCourseClassInput!) { createCourseClass(input: $input) { id } }`;
    return graphqlRequest(query, { input });
  },
  
  async generateQRCode(courseClassId: string) {
    const query = `mutation GenerateQRCode($courseClassId: ID!) { generateQRCode(courseClassId: $courseClassId) { id qrCode qrExpiration } }`;
    return graphqlRequest(query, { courseClassId });
  },

  async getEnrollmentsByCourseClass(courseClassId: string) {
    const query = `query EnrollmentsByCourseClass($courseClassId: ID!) { enrollmentsByCourseClass(courseClassId: $courseClassId) { id studentId courseClassId enrollmentDate status finalGrade } }`;
    return graphqlRequest(query, { courseClassId });
  },
  
  async getEnrollmentsByStudent(studentId: string) {
    const query = `query EnrollmentsByStudent($studentId: ID!) { enrollmentsByStudent(studentId: $studentId) { id studentId courseClassId enrollmentDate status finalGrade } }`;
    return graphqlRequest(query, { studentId });
  },
  
  async enrollStudent(input: Record<string, unknown>) {
    const query = `mutation EnrollStudent($input: EnrollStudentInput!) { enrollStudent(input: $input) { id studentId courseClassId status } }`;
    return graphqlRequest(query, { input });
  },
  
  async updateEnrollment(input: Record<string, unknown>) {
    const query = `mutation UpdateEnrollment($input: UpdateEnrollmentInput!) { updateEnrollment(input: $input) { id status finalGrade } }`;
    return graphqlRequest(query, { input });
  },
  
  async calculateFinalGrade(enrollmentId: string, cycleRequiredClasses: number) {
    const query = `mutation CalculateFinalGrade($enrollmentId: ID!, $cycleRequiredClasses: Float!) { calculateFinalGrade(enrollmentId: $enrollmentId, cycleRequiredClasses: $cycleRequiredClasses) }`;
    return graphqlRequest(query, { enrollmentId, cycleRequiredClasses });
  },

  async getAttendanceByCourseClass(courseClassId: string) {
    const query = `query AttendanceByCourseClass($courseClassId: ID!) { attendanceByCourseClass(courseClassId: $courseClassId) { id studentEnrollmentId courseClassId attended attendanceDate notes } }`;
    return graphqlRequest(query, { courseClassId });
  },
  
  async getAttendanceByEnrollment(enrollmentId: string) {
    const query = `query AttendanceByEnrollment($enrollmentId: ID!) { attendanceByEnrollment(enrollmentId: $enrollmentId) { id studentEnrollmentId courseClassId attended attendanceDate notes } }`;
    return graphqlRequest(query, { enrollmentId });
  },
  
  async createAttendance(input: Record<string, unknown>) {
    const query = `mutation CreateAttendance($input: CreateAttendanceInput!) { createAttendance(input: $input) { id attended } }`;
    return graphqlRequest(query, { input });
  },
};
