import { OpenAPIRoute } from "chanfana";
import { stream } from "hono/streaming";
import { type AppContext, ChatMessage } from "../types";

export class ChatAsk extends OpenAPIRoute {
  schema = {
    tags: ["Chat"],
    summary: "Ask a question to the chat",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ChatMessage
          }
        }
      }
    }
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const chatMessage = data.body;

    const { role, content } = chatMessage;

    return stream(c, async (s) => {
      c.header("Content-Type", "text/plain; charset=utf-8");
      s.write(`Role: ${role}\n`);
      s.write(`You said: ${content}\n`);
      for (const chunk of ["你好", "，这是", " AI 回复"]) {
        await s.write(chunk);
        await s.sleep(100);
      }
    });
  }
}
