import z from "zod";

export const NonEmptyString = z
  .string()
  .trim()
  .min(1, { message: "Non empty string expected" });
export const UUIDString = z.string().uuid({ message: "Invalid UUID string" });

export type Person = z.infer<typeof Person>;
export const Person = z.object({
  id: UUIDString,
  firstName: NonEmptyString,
  lastName: NonEmptyString,
  phoneNumber: NonEmptyString,
  address: NonEmptyString,
});
