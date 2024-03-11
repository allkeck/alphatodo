export type Todo = {
  id: number;
  ownerId: number;
  title: string;
  isDone: boolean;
  ownerName: string;
};

export type User = {
  id?: number;
  username: string;
  password: string;
};
