export interface ISession {
  id: string;
  userId: string;
  sessionId: string;
  timeStamps: string[];
  timeStampsCount: number;
  sessionStartedAt: string;
  sessionEndedAt: string;
  sessionDuration: number;
}

export interface IUser {
  id: string;
  userId: string;
  sessions: ISession[];
  sessionsCount: number;
  createdAt: string;
  lastSeenAt: string;
  totalTimeSpent: number;
}
