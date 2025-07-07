import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { IPersonRepository } from '../../data/protocols/PersonRepository';
import { Person } from '../../domain/models/person';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from 'sst';

export class PersonRepository implements IPersonRepository {
  constructor(private readonly dynamoDb: DynamoDBClient) {}

  async insert(person: Omit<Person, 'id'>): Promise<Person> {
    const id = uuidv4();

    const item = {
      id: { S: id },
      address: { S: person.address },
      firstName: { S: person.firstName },
      lastName: { S: person.lastName },
      phoneNumber: { S: person.phoneNumber },
    };

    const command = new PutItemCommand({
      TableName: Resource.Person.name,
      Item: item,
    });
    await this.dynamoDb.send(command);

    return { id, ...person };
  }
}
