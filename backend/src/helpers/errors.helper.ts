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
  productExists: new AppError('Product already exists', HttpStatusCode.Conflict),
  companyExists: new AppError('Company already exists', HttpStatusCode.Conflict),
  noCompanyFound: new AppError(
    'Cannot generate company information',
    HttpStatusCode.InternalServerError,
  ),
  internalServerError: new AppError('Internal Server Error', HttpStatusCode.InternalServerError),
};

export function handleServerError(reply: FastifyReply, error: Error) {
  if (error instanceof ZodError) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send({ message: 'Validation error', issues: error.format() });
  } else if ('validation' in error) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send({ message: 'Validation error', issues: error.validation });
  } else if (error instanceof SyntaxError) {
    return reply
      .status(HttpStatusCode.BadRequest)
      .send({ message: 'Syntax error', issues: error.message });
  } else if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  } else if (error instanceof AxiosError) {
    return reply.status(HttpStatusCode.InternalServerError).send({ message: error.message });
  }

  return reply
    .status(ERRORS.internalServerError.statusCode)
    .send(ERRORS.internalServerError.message);
}
