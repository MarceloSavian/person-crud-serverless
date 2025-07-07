import { NonEmptyString, Person } from '../../domain/models/person';
import { IPersonService } from '../../domain/usecases/person';
import { BaseError } from '../../handlers/shared/error';
import { IPersonEvent } from '../protocols/PersonEvent';
import { IPersonRepository } from '../protocols/PersonRepository';

export class PersonService implements IPersonService {
  constructor(
    private readonly personRepository: IPersonRepository,
    private readonly personEvent: IPersonEvent,
  ) {}

  async createPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const result = await this.personRepository.insert(person);

    await this.personEvent.send(result);

    return result;
  }

  async getPerson(id: NonEmptyString): Promise<Person> {
    const person = await this.personRepository.get(id);

    if (!person) throw new BaseError('Person not found', 404);

    return person;
  }
}
