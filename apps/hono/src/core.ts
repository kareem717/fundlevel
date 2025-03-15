import { Server } from "@/internal/server";
import { env } from "./env";
import { Service } from "@/internal/service";
import { Storage } from "@/internal/storage";
import { hc } from "hono/client";

const supabaseConfig= {
  url: env.SUPABASE_URL,
  serviceKey: env.SUPABASE_SERVICE_KEY
}
const repositories = new Storage(supabaseConfig);

const services = new Service(repositories);

export const server = new Server(
  env.PORT,
  services,
  supabaseConfig
);
