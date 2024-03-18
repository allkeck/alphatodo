interface CreateTokenArgs {
  id: number;
  username: string;
}

type CreateTokenFunction = (tokenInfo: CreateTokenArgs) => string;

type VerifyTokenFunction = (token: string) => JwtPayload | string;

interface RegistrationErrors {
  username: string;
  password: string;
  token: string;
  misc: string;
}

interface User {
  id: number;
  login: string;
  password: string;
}

interface Todo {
  id: number;
  title: string;
  isDone: boolean;
  ownerId: number;
}

export { CreateTokenFunction, VerifyTokenFunction, RegistrationErrors, User, Todo };
