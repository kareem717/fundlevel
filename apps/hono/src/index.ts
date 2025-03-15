import { server } from "./core";

export default {
  fetch: server.app,
  port: server.port,
};
