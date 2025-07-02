import { EventHandler } from "sst/node/event-bus";
import { Todo } from "@person-crud-serverless/core/todo";

export const handler = EventHandler(Todo.Events.Created, async (evt) => {
  console.log("Todo created", evt);
});
