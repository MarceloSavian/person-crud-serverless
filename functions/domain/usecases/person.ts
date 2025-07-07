import { Person, NonEmptyString } from '../models/person';

export interface IPersonService {
  createPerson(person: Omit<Person, 'id'>): Promise<Person>;
  getPerson(id: NonEmptyString): Promise<Person>;
}
