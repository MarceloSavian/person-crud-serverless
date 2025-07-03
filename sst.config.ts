/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "person-crud-serverless",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");

    return {
      MyBucket: storage.bucket.name,
    };
  },
});
