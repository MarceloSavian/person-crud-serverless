import { APIGatewayProxyResult } from "aws-lambda";

export const logErrorAndFormat = (error: unknown): APIGatewayProxyResult => {
  if (error?.constructor?.name === "ZodError") {
    console.warn(`Data validation error`, error);
    return {
      statusCode: 400,
      body: (error as Error).message,
    };
  }
  if (error instanceof Error) {
    console.error(
      `Error occurred while processing the request: ${error.message}`,
      error,
    );
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
