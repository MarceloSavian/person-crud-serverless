import { beforeAll, describe, vi, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { IPersonRepository } from '../protocols/PersonRepository';
import { IPersonEvent } from '../protocols/PersonEvent';
import { PersonService } from './PersonService';

const mockPersonRepository = mockDeep<IPersonRepository>();
const mockPersonEvent = mockDeep<IPersonEvent>();

describe('PersonService', () => {
  const personService = new PersonService(mockPersonRepository, mockPersonEvent);

  const person = {
    address: 'test',
    firstName: 'test',
    lastName: 'test',
    phoneNumber: 'test',
  };

  beforeAll(() => mockPersonRepository.insert.mockResolvedValue({ ...person, id: 'any' }));

  describe('createPerson', () => {
    it('should call repository with correct values', async () => {
      const insertSpy = vi.spyOn(mockPersonRepository, 'insert');

      await personService.createPerson(person);

      expect(insertSpy).toHaveBeenCalledWith(person);
    });
    it('should call person event with correct values', async () => {
      const sendSpy = vi.spyOn(mockPersonEvent, 'send');

      await personService.createPerson(person);

      expect(sendSpy).toHaveBeenCalledWith({ id: 'any', ...person });
    });
    it('should return correct values', async () => {
      const result = await personService.createPerson(person);

      expect(result).toEqual({
        ...person,
        id: 'any',
      });
    });
    it('should throw error if repository fails', async () => {
      mockPersonRepository.insert.mockRejectedValueOnce(new Error('Invalid'));

      const result = personService.createPerson(person);

      await expect(result).rejects.toEqual(new Error('Invalid'));
    });
  });
});
