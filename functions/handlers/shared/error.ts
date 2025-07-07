import { APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

export class BaseError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export const logErrorAndFormat = (error: unknown): APIGatewayProxyResult => {
  if (error instanceof BaseError) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
  if (error instanceof ZodError) {
    console.warn(`Data validation error`, error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
  if (error instanceof Error) {
    console.error(`Error occurred while processing the request: ${error.message}`, error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }

  console.error(`Invalid error`, error);
  return {
    statusCode: 500,
    body: JSON.stringify(error),
  };
};
