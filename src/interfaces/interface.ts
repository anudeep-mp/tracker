export interface ISession {
  id: string;
  userId: string;
  sessionId: string;
  timeStamps: string[];
  sessionStart?: Date | string;
  sessionEnd?: string;
  timeStampsCount?: number;
}

export interface IUser {
  id: string;
  userId: string;
  sessions: ISession[];
  createdAt: string;
}
