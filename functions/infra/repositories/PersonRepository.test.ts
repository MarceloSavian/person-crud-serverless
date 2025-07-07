import { describe, it, expect, vi } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PersonRepository } from './PersonRepository';

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

vi.mock('sst', () => ({
  Resource: {
    Person: { name: 'MockPersonTable' },
  },
}));

describe('PersonRepository', () => {
  const mockSend = vi.fn().mockResolvedValue({});

  const mockClient: unknown = {
    send: mockSend,
  };

  const repo = new PersonRepository(mockClient as DynamoDBClient);
  describe('insert', () => {
    it('should insert a person and return the person with id', async () => {
      const personData = {
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        phoneNumber: 'test',
      };

      const result = await repo.insert(personData);

      expect(result).toEqual({
        id: 'mock-uuid',
        ...personData,
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: 'MockPersonTable',
            Item: {
              id: 'mock-uuid',
              address: personData.address,
              firstName: personData.firstName,
              lastName: personData.lastName,
              phoneNumber: personData.phoneNumber,
            },
          },
        }),
      );
    });
  });
  describe('get', () => {
    it('should return the correct person and call with a command', async () => {
      const personData = {
        id: 'd62fca97-53e3-4254-b390-c506d1dc7e55',
        firstName: 'test',
        lastName: 'test',
        address: 'test',
        phoneNumber: 'test',
      };

      mockSend.mockResolvedValueOnce({ Item: personData });

      const result = await repo.get(personData.id);

      expect(result).toEqual(personData);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            TableName: 'MockPersonTable',
            Key: {
              id: personData.id,
            },
          },
        }),
      );
    });
  });
});
