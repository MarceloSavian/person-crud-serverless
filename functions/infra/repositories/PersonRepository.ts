import { PutCommand, GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IPersonRepository } from '../../data/protocols/PersonRepository';
import { NonEmptyString, Person } from '../../domain/models/person';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from 'sst';

export class PersonRepository implements IPersonRepository {
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  async insert(person: Omit<Person, 'id'>): Promise<Person> {
    const id = uuidv4();

    const item = {
      id: id,
      address: person.address,
      firstName: person.firstName,
      lastName: person.lastName,
      phoneNumber: person.phoneNumber,
    };

    const command = new PutCommand({
      TableName: Resource.Person.name,
      Item: item,
    });
    await this.dynamoDb.send(command);

    return { id, ...person };
  }

  async get(id: NonEmptyString): Promise<Person | null> {
    console.log(id);
    const command = new GetCommand({
      TableName: Resource.Person.name,
      Key: {
        id,
      },
    });

    const res = await this.dynamoDb.send(command);

    if (!res.Item) return null;

    return Person.parse(res.Item);
  }
}
