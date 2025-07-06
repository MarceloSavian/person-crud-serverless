import { Person } from "../../domain/models/person";

export interface IPersonRepository {
  insert(person: Omit<Person, "id">): Promise<Person>;
}
