export interface ISession {
  id: string;
  userId: string;
  sessionId: string;
  timeStamps: string[];
}

export interface IUser {
  id: string;
  userId: string;
  sessions: ISession[];
  createdAt: string;
}
