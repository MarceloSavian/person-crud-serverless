import { Person } from "../../domain/models/person";
import { IPersonService } from "../../domain/usecases/person";
import { IPersonRepository } from "../usecases/PersonRepository";

export class PersonService implements IPersonService {
  constructor(private readonly personRepository: IPersonRepository) {}

  async createPerson(person: Omit<Person, "id">): Promise<Person> {
    return this.personRepository.insert(person);
  }
}
