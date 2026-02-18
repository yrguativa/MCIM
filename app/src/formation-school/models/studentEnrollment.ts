export interface StudentEnrollment {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
    status: 'active' | 'completed' | 'withdrawn';
    finalGrade?: number;
    createdUser: string;
    createdDate: Date;
}
