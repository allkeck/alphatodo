export type Todo = {
  id: number;
  ownerId: number;
  title: string;
  isDone: boolean;
};

export type User = {
  id?: number;
  username: string;
  password: string;
};
