import { NotFoundException, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getDB } from "../db";
import { type AppContext, Task } from "../types";

export class TaskFetch extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Get a single Task by slug",
    request: {
      params: z.object({
        taskSlug: z.string().describe("Task slug")
      })
    },
    responses: {
      "200": {
        description: "Returns a single task if found",
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
    const data = await this.getValidatedData<typeof this.schema>();
    const { taskSlug } = data.params;

    const result = await getDB(c.env)
      .prepare(`SELECT * FROM tasks WHERE slug = ?`)
      .bind(taskSlug)
      .first<Task>();

    if (!result) {
      throw new NotFoundException();
    }

    return {
      success: true,
      task: result
    };
  }
}
