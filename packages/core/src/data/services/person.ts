import { Person } from "../../domain/models/person";
import { IPersonService } from "../../domain/usecases/person";

export class PersonService implements IPersonService {
  async createPerson(person: Omit<Person, "id">): Promise<Person> {
    return {
      id: "test",
      firstName: "test",
      address: "test",
      lastname: "test",
      phoneNumber: "test",
    };
  }
}
