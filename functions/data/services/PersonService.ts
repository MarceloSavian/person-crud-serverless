import { Person } from '../../domain/models/person';
import { IPersonService } from '../../domain/usecases/person';
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
}
