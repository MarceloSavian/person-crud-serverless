const personTable = new sst.aws.Dynamo("Person", {
  fields: {
    id: "string",
  },
  primaryIndex: { hashKey: "id" },
});

export { personTable };
