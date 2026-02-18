export interface Student {
    id: string;
    discipleId: string;
    currentLevelId: string;
    status: 'active' | 'inactive';
    createdUser: string;
    createdDate: Date;
}
