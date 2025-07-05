import { describe, expect, it } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { PersonService } from "@person-crud-serverless/core";
import { IPersonRepository } from "../usecases/PersonRepository";

const mockPersonRepository = mockDeep<IPersonRepository>();

describe("PersonService", () => {
  const personService = new PersonService(mockPersonRepository);
  describe("createPerson", () => {
    it("Should return correct value", async () => {
      const person = {
        address: "test",
        firstName: "test",
        lastName: "test",
        phoneNumber: "test",
      };

      mockPersonRepository.insert.mockResolvedValue({ ...person, id: "any" });

      const result = await personService.createPerson(person);

      expect(result).toEqual({
        ...person,
        id: "any",
      });
    });
    it("Should throw error if repository fails", async () => {
      const person = {
        address: "test",
        firstName: "test",
        lastName: "test",
        phoneNumber: "test",
      };

      mockPersonRepository.insert.mockRejectedValueOnce(new Error("Invalid"));

      const result = personService.createPerson(person);

      await expect(result).rejects.toEqual(new Error("Invalid"));
    });
  });
});
