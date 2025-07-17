import { User } from "@/stores/auth/auth.store";

export interface Ministry {
    id?: string;
    name: string;
    description: string;
    parentMinistry?: Ministry | null;
    parentMinistryId?: string | null;
    leader?: User | null;
    leaderId?: string | null;
    createdUser?: User;
    createdUserId?: string;
    createdDate?: Date;
    active: boolean;
    subMinistries?: Ministry[];
}
