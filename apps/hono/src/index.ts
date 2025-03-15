import { server } from "./core";

console.log(`Starting server on port ${server.port}`);

export default {
  fetch: server.app,
  port: server.port,
};
