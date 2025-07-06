import { describe, it, expect, vi, beforeEach } from "vitest";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PersonResitory } from "./PersonRepository";

vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

vi.mock("sst", () => ({
  Resource: {
    Person: { name: "MockPersonTable" },
  },
}));

describe("PersonRepository", () => {
  let mockSend = vi.fn().mockResolvedValue({});
  let repo: PersonResitory;

  const mockClient: unknown = {
    send: mockSend,
  };

  repo = new PersonResitory(mockClient as DynamoDBClient);

  it("should insert a person and return the person with id", async () => {
    const personData = {
      firstName: "test",
      lastName: "test",
      address: "test",
      phoneNumber: "test",
    };

    const result = await repo.insert(personData);

    expect(result).toEqual({
      id: "mock-uuid",
      ...personData,
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          TableName: "MockPersonTable",
          Item: {
            id: { S: "mock-uuid" },
            address: { S: personData.address },
            firstName: { S: personData.firstName },
            lastName: { S: personData.lastName },
            phoneNumber: { S: personData.phoneNumber },
          },
        },
      }),
    );
  });
});
