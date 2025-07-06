import { Person } from '../../domain/models/person';

export interface IPersonEvent {
  send(person: Person): Promise<void>;
}
