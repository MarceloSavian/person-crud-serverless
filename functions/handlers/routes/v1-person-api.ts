import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { ProxyRoute } from '../domain/proxy';
import { IPersonProxy } from '../domain/v1-person';
import { logErrorAndFormat } from '../shared/error';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { PersonRepository } from '../../infra/repositories/PersonRepository';
import { PersonEvent } from '../../infra/events/PersonEvent';
import { PersonService } from '../../data/services/PersonService';
import { Person } from '../../domain/models/person';

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
}

const proxy: IPersonProxy = PersonProxy;

const routes: ProxyRoute = {
  'POST /person': proxy.createPerson,
};

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  const routeDefinition = `${event.requestContext.http.method} ${event.requestContext.http.path}`;
  const route = routes[routeDefinition];
  return route
    ? await route(event)
    : { statusCode: 404, body: `Request path ${routeDefinition} not found` };
};
