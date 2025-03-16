import { Server } from "./internal/server";
import { env } from "./env";
import { Service } from "./internal/service";
import { Storage } from "./internal/storage";

const repositories = new Storage();

const services = new Service(repositories);

export const server = new Server(services);
