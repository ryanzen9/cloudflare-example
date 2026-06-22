import { fromHono } from "chanfana";
import { Hono } from "hono";
import { UserList } from "./endpoints/users/userList";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/"
});

openapi.get("/api/hello", (c) => c.json({ message: "Hello, OpenAPI!" }));
openapi.get("/api/users", UserList);

export default app;
