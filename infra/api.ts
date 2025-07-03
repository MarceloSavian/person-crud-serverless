import { bucket } from "./storage";

export const myApi = new sst.aws.Function("my-example", {
  url: true,
  link: [bucket],
  handler: "packages/functions/src/api.handler",
});
