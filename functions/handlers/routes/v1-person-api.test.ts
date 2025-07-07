import { describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { PersonService } from '../../data/services/PersonService';
import { Person } from '../../domain/models/person';
import { BaseError } from '../shared/error';

const mockPersonService = mockDeep<PersonService>();

vi.doMock('../../data/services/PersonService', () => {
  return {
    PersonService: vi.fn(() => mockPersonService),
  };
});

const { handler } = await import('./v1-person-api');

describe('v1-person-api', () => {
  describe('createPerson', () => {
    function buildEvent(person: unknown): APIGatewayProxyEventV2 {
      return {
        routeKey: 'POST /person',
        body: JSON.stringify(person),
      } as APIGatewayProxyEventV2;
    }
    it('should call createPerson with the correct values and return the correct result', async () => {
      const person = {
        firstName: 'test',
        address: 'test',
        lastName: 'test',
        phoneNumber: 'test',
      };

      const resultPerson = {
        id: '123',
        ...person,
      };

      mockPersonService.createPerson.mockResolvedValue(resultPerson);

      const event = buildEvent(person);
      const result = await handler(event);

      expect(mockPersonService.createPerson).toHaveBeenCalledWith({
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        phoneNumber: 'test',
      });
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(resultPerson),
      });
    });
    it('should return zod error in case of invalid data', async () => {
      const person = {
        address: 'test',
        lastName: 'test',
        phoneNumber: 'test',
      };

      const event = buildEvent(person);
      const result = await handler(event);

      const error = Person.omit({ id: true }).safeParse(person);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual(error.error?.issues);
    });
    it('should call return error in case of service error', async () => {
      const person = {
        firstName: 'test',
        address: 'test',
        lastName: 'test',
        phoneNumber: 'test',
      };

      mockPersonService.createPerson.mockRejectedValueOnce(new Error('Invalid'));

      const event = buildEvent(person);
      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual('Invalid');
    });
  });
  describe('getPerson', () => {
    function buildEvent(): APIGatewayProxyEventV2 {
      return {
        routeKey: 'GET /person/{personId}',
        pathParameters: { personId: 'any_id' },
      } as unknown as APIGatewayProxyEventV2;
    }
    it('should call getPerson with the correct values and return correct values', async () => {
      const person = {
        firstName: 'test',
        address: 'test',
        lastName: 'test',
        phoneNumber: 'test',
      };

      const resultPerson = {
        id: '123',
        ...person,
      };

      mockPersonService.getPerson.mockResolvedValue(resultPerson);

      const event = buildEvent();
      const result = await handler(event);

      expect(mockPersonService.getPerson).toHaveBeenCalledWith('any_id');
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(resultPerson),
      });
    });
    it('should return error in case of service error', async () => {
      mockPersonService.getPerson.mockRejectedValueOnce(new BaseError('Not found', 404));

      const event = buildEvent();
      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      expect(result.body).toEqual('Not found');
    });
  });
});
