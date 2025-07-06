import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { IPersonEvent } from '../../data/protocols/PersonEvent';
import { Person } from '../../domain/models/person';
import { Resource } from 'sst';

export class PersonEvent implements IPersonEvent {
  constructor(private readonly eventBridge: EventBridgeClient) {}

  async send(person: Person): Promise<void> {
    const event = new PutEventsCommand({
      Entries: [
        {
          Source: 'person.api',
          DetailType: 'person.created',
          Detail: JSON.stringify(person),
          EventBusName: Resource.PersonCreated.name,
        },
      ],
    });
    await this.eventBridge.send(event);
  }
}
