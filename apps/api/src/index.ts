import { server } from "./core";
import { handle } from '@hono/node-server/vercel'

export default handle(server.app)