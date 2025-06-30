import { Service } from "../service";
import { Storage } from "../storage";
import { db } from "@fundlevel/db";

function getEnvVar(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

let storage: Storage;
function getStorage() {
  if (!storage) {
    storage = new Storage(db(getEnvVar("DATABASE_URL")));
  }

  return storage;
}

let service: Service;
export function getService() {
  if (!service) {
    service = new Service({
      storage: getStorage(),
      qbConfig: {
        clientId: getEnvVar("QUICK_BOOKS_CLIENT_ID"),
        clientSecret: getEnvVar("QUICK_BOOKS_CLIENT_SECRET"),
        redirectUri: getEnvVar("QUICK_BOOKS_REDIRECT_URI"),
        environment: getEnvVar("QUICK_BOOKS_ENVIRONMENT") as
          | "sandbox"
          | "production",
      },
      plaidConfig: {
        clientId: getEnvVar("PLAID_CLIENT_ID"),
        secret: getEnvVar("PLAID_SECRET"),
        webhookUrl: getEnvVar("PLAID_WEBHOOK_URL"),
        environment: getEnvVar("PLAID_ENVIRONMENT") as "sandbox" | "production",
      },
      openaiKey: getEnvVar("OPENAI_API_KEY"),
    });
  }

  return service;
}
