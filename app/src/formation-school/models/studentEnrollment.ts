export interface StudentEnrollment {
    id: string;
    studentId: string;
    student?: { id: string; name: string; lastName: string };
    courseId: string;
    course?: { id: string; levelId: string };
    enrollmentDate: Date;
    status: 'active' | 'completed' | 'withdrawn';
    finalGrade?: number;
    createdUser: string;
    createdDate: Date;
}
