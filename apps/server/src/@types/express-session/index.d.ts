import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      gameApiBearer: {
        expiryTimestamp: number;
        refreshToken: string;
        token: string;
      };
      gameUserId: number;
      id: number;
    };
  }
}
