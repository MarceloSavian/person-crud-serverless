import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

export interface IPersonProxy {
  createPerson(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult>;
}
