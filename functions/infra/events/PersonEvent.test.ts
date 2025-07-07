import { describe, it, expect, vi } from 'vitest';
import { PersonEvent } from './PersonEvent';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { Resource } from 'sst';

describe('PersonEvent', () => {
  const mockSend = vi.fn().mockResolvedValue({});

  const mockClient: unknown = {
    send: mockSend,
  };

  const personEvent = new PersonEvent(mockClient as EventBridgeClient);

  it('should send a PutItemCommand to event bridge', async () => {
    const personData = {
      id: 'any',
      firstName: 'test',
      lastName: 'test',
      address: 'test',
      phoneNumber: 'test',
    };

    await personEvent.send(personData);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Entries: [
            {
              Source: 'person.api',
              DetailType: 'person.created',
              Detail: JSON.stringify(personData),
              EventBusName: Resource.PersonCreated.name,
            },
          ],
        },
      }),
    );
  });
});
