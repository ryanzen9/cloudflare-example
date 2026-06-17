import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getDB } from "../db";
import { type AppContext, Task } from "../types";

export class TaskList extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "List Tasks",
    request: {
      query: z.object({
        page: z.number().default(0).describe("Page number"),
        isCompleted: z.boolean().optional().describe("Filter by completed flag")
      })
    },
    responses: {
      "200": {
        description: "Returns a list of tasks",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              tasks: Task.array()
            })
          }
        }
      }
    }
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated parameters
    const { page, isCompleted } = data.query;

    // Implement your own object list here
    const result = await getDB(c.env)
      .prepare(
        `
        SELECT * FROM tasks where completed = coalesce(?, completed)
        LIMIT 10 OFFSET ?
        `
      )
      .bind(isCompleted != null ? (isCompleted ? 1 : 0) : null, page * 10)
      .all();

    const rows = result.results as Task[];

    return {
      success: true,
      tasks: rows
    };
  }
}
