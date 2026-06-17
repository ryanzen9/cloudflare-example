import { NotFoundException, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getDB } from "../db";
import { type AppContext, Task } from "../types";

export class TaskDelete extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Delete a Task",
    request: {
      params: z.object({
        taskSlug: z.string().describe("Task slug")
      })
    },
    responses: {
      "200": {
        description: "Returns if the task was deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                task: Task
              })
            })
          }
        }
      }
    }
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { taskSlug } = data.params;

    const db = getDB(c.env);

    const task = await db
      .prepare(`SELECT * FROM tasks WHERE slug = ?`)
      .bind(taskSlug)
      .first<Task>();

    if (!task) {
      throw new NotFoundException();
    }

    await db
      .prepare(`DELETE FROM tasks WHERE slug = ?`)
      .bind(taskSlug)
      .run();

    return {
      success: true,
      result: { task }
    };
  }
}
