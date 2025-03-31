import { FastifyReply } from 'fastify';
import { AxiosError, HttpStatusCode } from 'axios';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const ERRORS = {
  invalidToken: new AppError('Token is invalid.', 401),
  userExists: new AppError('User already exists', 409),
  userNotExists: new AppError('User not exists', 404),
  userCredError: new AppError('Invalid credential', 401),
  tokenError: new AppError('Invalid Token', 401),
  invalidRequest: new AppError('Invalid Token', 400),
  internalServerError: new AppError('Internal Server Error', 500),
  unauthorizedAccess: new AppError('Unauthorized access', 401),
};

export function handleServerError(reply: FastifyReply, error: Error) {
  if (error instanceof ZodError) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send({ message: 'Validation error', issues: error.format() });
  } else if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  } else if (error instanceof AxiosError) {
    return reply.status(HttpStatusCode.InternalServerError).send({ message: error.message });
  }

  return reply
    .status(ERRORS.internalServerError.statusCode)
    .send(ERRORS.internalServerError.message);
}
