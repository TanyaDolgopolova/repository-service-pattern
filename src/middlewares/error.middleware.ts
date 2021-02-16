import { Request, Response } from 'express';
import HttpException from '../app/common/HttpException';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  resp: Response,
  next: () => void
) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  return resp.status(status).send({
    status,
    message,
  });
};

export default errorMiddleware;
