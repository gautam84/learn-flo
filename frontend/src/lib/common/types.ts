type UserType = 'STUDENT' | 'TEACHER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserType;
}