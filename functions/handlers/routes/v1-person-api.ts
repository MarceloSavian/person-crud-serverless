import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ProxyRoute } from '../domain/proxy';
import { IPersonProxy } from '../domain/v1-person';
import { logErrorAndFormat } from '../shared/error';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { PersonRepository } from '../../infra/repositories/PersonRepository';
import { PersonEvent } from '../../infra/events/PersonEvent';
import { PersonService } from '../../data/services/PersonService';
import { NonEmptyString, Person } from '../../domain/models/person';

const dynamo = new DynamoDBClient();
const eventBus = new EventBridgeClient();
const repository = new PersonRepository(dynamo);
const personEvent = new PersonEvent(eventBus);
const personService = new PersonService(repository, personEvent);

class PersonProxy {
  static async createPerson(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(event.body ?? '{}');
      const input = Person.omit({ id: true }).parse(body);

      const result = await personService.createPerson(input);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return logErrorAndFormat(error);
    }
  }

  static async getPerson(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const input = NonEmptyString.parse(event.pathParameters?.personId);

      const result = await personService.getPerson(input);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return logErrorAndFormat(error);
    }
  }
}

const proxy: IPersonProxy = PersonProxy;

const routes: ProxyRoute = {
  'POST /person': proxy.createPerson,
  'GET /person/{personId}': proxy.getPerson,
};

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  const route = routes[event.routeKey];
  return route
    ? await route(event)
    : { statusCode: 404, body: `Request path ${event.routeKey} not found` };
};
