import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getDB } from "../db";
import { type AppContext, Task } from "../types";

export class TaskCreate extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Create a new Task",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Task
          }
        }
      }
    },
    responses: {
      "201": {
        description: "Returns the created task",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              task: Task
            })
          }
        }
      }
    }
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const taskToCreate = data.body;

    // Implement your own object insertion here
    const db = getDB(c.env);
    await db
      .prepare(
        `
        INSERT INTO tasks (name, slug, description, completed, due_date)
        VALUES (?, ?, ?, ?, ?)
        `
      )
      .bind(
        taskToCreate.name,
        taskToCreate.slug,
        taskToCreate.description,
        taskToCreate.completed,
        taskToCreate.due_date
      )
      .run();

    // return the new task
    return c.json(
      {
        success: true,
        task: {
          name: taskToCreate.name,
          slug: taskToCreate.slug,
          description: taskToCreate.description,
          completed: taskToCreate.completed,
          due_date: taskToCreate.due_date
        }
      },
      201
    );
  }
}
