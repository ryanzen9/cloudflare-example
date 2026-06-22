import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { getDB } from "../../db/db";
import { usersTable } from "../../db/schema";
import { AppContext } from "../../types";

export class UserList extends OpenAPIRoute {
  schema = {
    tags: ["Users"],
    summary: "List Users",
    request: {
      query: z.object({
        page: z.number().default(0).describe("Page number"),
        pageSize: z.number().default(10).describe("Number of items per page")
      })
    },
    responses: {
      "200": {
        description: "Returns a list of users",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              users: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  age: z.number(),
                  email: z.string()
                })
              )
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
    const { page, pageSize } = data.query;

    // Implement your own object list here
    const db = getDB(c.env);

    const rows = await db
      .select()
      .from(usersTable)
      .limit(pageSize)
      .offset(page * pageSize);

    return {
      success: true,
      users: rows
    };
  }
}
