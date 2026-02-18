export interface StudentCourseHistory {
    id: string;
    studentId: string;
    courseId: string;
    enrollmentDate: Date;
    completionDate?: Date;
    finalGrade?: number;
    status: 'in_progress' | 'completed' | 'withdrawn';
    promotedToNextLevel: boolean;
    createdUser: string;
    createdDate: Date;
}
