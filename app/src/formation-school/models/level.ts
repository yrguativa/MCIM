export interface Level {
    id: string;
    name: string;
    description: string;
    order: number;
    type: 'vision' | 'doctrina';
    createdUser: string;
    createdDate: Date;
}
