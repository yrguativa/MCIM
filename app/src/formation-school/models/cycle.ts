export interface Cycle {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    requiredClasses: number;
    active: boolean;
    createdUser: string;
    createdDate: Date;
    updatedUser?: string;
    updatedDate?: Date;
}
