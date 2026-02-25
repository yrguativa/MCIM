export interface Student {
    id: string;
    discipleId: string;
    discipleName?: string;
    currentLevelId?: string;
    status: 'active' | 'inactive';
    createdUser: string;
    createdDate: Date;
}
