declare const VERSION: string;
declare const DEVELOP: boolean;
declare namespace Express {
  interface Request {
    user: { [key: string]: any };
  }
}
