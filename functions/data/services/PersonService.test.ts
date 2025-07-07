import { beforeAll, describe, vi, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { IPersonRepository } from '../protocols/PersonRepository';
import { IPersonEvent } from '../protocols/PersonEvent';
import { PersonService } from './PersonService';
import { BaseError } from '../../handlers/shared/error';

const mockPersonRepository = mockDeep<IPersonRepository>();
const mockPersonEvent = mockDeep<IPersonEvent>();

describe('PersonService', () => {
  const personService = new PersonService(mockPersonRepository, mockPersonEvent);

  const basePerson = {
    address: 'test',
    firstName: 'test',
    lastName: 'test',
    phoneNumber: 'test',
  };

  beforeAll(() => {
    mockPersonRepository.insert.mockResolvedValue({ ...basePerson, id: 'any' });
    mockPersonRepository.get.mockResolvedValue({ ...basePerson, id: 'any' });
  });

  describe('createPerson', () => {
    const person = basePerson;
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
  describe('getPerson', () => {
    const person = {
      id: 'any',
      ...basePerson,
    };
    it('should call repository with correct values', async () => {
      const getSpy = vi.spyOn(mockPersonRepository, 'get');

      await personService.getPerson('any_id');

      expect(getSpy).toHaveBeenCalledWith('any_id');
    });
    it('should return correct values', async () => {
      const result = await personService.getPerson('id');

      expect(result).toEqual(person);
    });
    it('should throw error if repository fails', async () => {
      mockPersonRepository.get.mockRejectedValueOnce(new Error('Invalid'));

      const result = personService.getPerson('id');

      await expect(result).rejects.toEqual(new Error('Invalid'));
    });
    it('should return error if person does not exists', async () => {
      mockPersonRepository.get.mockResolvedValueOnce(null);

      const result = personService.getPerson('id');

      await expect(result).rejects.toEqual(new BaseError('Person not found', 404));
    });
  });
});
