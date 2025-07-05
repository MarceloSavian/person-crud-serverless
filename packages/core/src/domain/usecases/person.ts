import { Person } from "../models/person";

export interface IPersonService {
  createPerson(person: Omit<Person, "id">): Promise<Person>;
}
