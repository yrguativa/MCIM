export interface Child {
  id: string;
  parentId: string;
  name?: string;
  age?: number;
  childDiscipleId?: string;
  attendsChurch: string;
  createdUser: string;
  createdAt: Date;
  updatedUser: string;
  updatedAt: Date;
}

export interface ChildInput {
  parentId: string;
  name?: string;
  age?: number;
  childDiscipleId?: string;
  attendsChurch: string;
  createdUser?: string;
}
