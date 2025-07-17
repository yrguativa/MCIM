export interface Ministry {
    id?: string;
    name: string;
    parentMinistry?: Ministry | null;
    parentMinistryId?: string | null;
    leader?: string | null;
    createdUser: string;
    createdDate?: Date;
    active: boolean;
    subMinistries?: Ministry[];
}
