import { OpenAPIHono } from "@hono/zod-openapi";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import * as jose from "jose";
import { createHash, createHmac } from "crypto";
import { getService } from "../../middleware/with-service-layer";
import { plaidWebhookRoute, quickBooksWebhookRoute } from "./route";
import { env } from "hono/adapter";

/**
 * Verifies a Plaid webhook JWT signature
 */
async function verifyPlaidWebhook(
  jwt: string,
  body: string,
  plaidApi: PlaidApi,
): Promise<boolean> {
  try {
    const decodedHeader = jose.decodeProtectedHeader(jwt);
    const keyId = decodedHeader.kid;

    if (!keyId) {
      console.error("No key ID in JWT header");
      return false;
    }

    if (decodedHeader.alg !== "ES256") {
      console.error(`Invalid algorithm: ${decodedHeader.alg}, expected ES256`);
      return false;
    }

    console.log(`Fetching new verification key for key ID: ${keyId}`);

    let key = null;
    try {
      const response = await plaidApi.webhookVerificationKeyGet({
        key_id: keyId,
      });
      key = response.data.key;
    } catch (error) {
      console.error("Error fetching verification key:", error);
      return false;
    }

    if (!key) {
      console.error("Failed to get verification key");
      return false;
    }

    try {
      const publicKey = await jose.importJWK(key, "ES256");
      const { payload } = await jose.jwtVerify(jwt, publicKey, {
        maxTokenAge: "5 minutes",
      });

      const bodyHash = createHash("sha256").update(body).digest("hex");
      const jwtPayload = payload as { request_body_sha256: string };

      if (jwtPayload.request_body_sha256 !== bodyHash) {
        console.error("Request body hash mismatch");
        return false;
      }

      return true;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return false;
    }
  } catch (error) {
    console.error("Error verifying Plaid webhook:", error);
    return false;
  }
}

const webhookHandler = new OpenAPIHono()
  .openapi(plaidWebhookRoute, async (c) => {
    const plaidConfig = new Configuration({
      basePath: env(c).PLAID_ENVIRONMENT === "sandbox" ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": env(c).PLAID_CLIENT_ID,
          "PLAID-SECRET": env(c).PLAID_SECRET,
        },
      },
    });

    const plaid = new PlaidApi(plaidConfig);
    const plaidVerification = c.req.header("plaid-verification");

    if (plaidVerification) {
      const rawBody = await c.req.raw.clone().text();
      const isVerified = await verifyPlaidWebhook(plaidVerification, rawBody, plaid);

      if (!isVerified) {
        console.error("Failed to verify Plaid webhook");
        return c.json({ error: "Invalid webhook signature" }, 401);
      }
    }

    const payload = await c.req.json();
    const webhookType = payload.webhook_type as string | undefined;
    const webhookCode = payload.webhook_code as string | undefined;

    if (!webhookType || !webhookCode) {
      console.error("Missing webhook type or code");
      return c.json({ error: "Missing webhook type or code" }, 400);
    }

    try {
      switch (webhookType) {
        case "ITEM": {
          if (webhookCode === "NEW_ACCOUNTS_AVAILABLE") {
            await getService(c).company.syncBankAccounts(payload.item_id);
          }
          break;
        }
        case "TRANSACTIONS": {
          if (webhookCode === "SYNC_UPDATES_AVAILABLE") {
            await getService(c).company.syncBankTransactions(payload.item_id);
          }
          break;
        }
        default: {
          console.log(`Unhandled webhook type => TYPE: ${webhookType} CODE: ${webhookCode}`);
        }
      }
    } catch (error) {
      console.error(`Error processing webhook: ${error}`);
    }

    return c.json({ success: true }, 200);
  })
  .openapi(quickBooksWebhookRoute, async (c) => {
    const signature = c.req.header("intuit-signature");

    if (!signature) {
      console.error("No signature provided in QuickBooks webhook");
      return c.json({ error: "Intuit signature missing" }, 401);
    }

    const rawBody = await c.req.raw.clone().text();
    const hmac = createHmac("sha256", env(c).QUICK_BOOKS_WEBHOOK_VERIFIER_TOKEN as string);
    hmac.update(rawBody);
    const computedSignature = hmac.digest("base64");

    if (computedSignature !== signature) {
      console.error("Invalid signature for QuickBooks webhook");
      return c.json({ error: "Invalid signature" }, 401);
    }

    const payload = await c.req.json();
    const eventNotifications = payload.eventNotifications;

    if (!Array.isArray(eventNotifications) || eventNotifications.length === 0) {
      console.error("No events in QuickBooks webhook payload");
      return c.json({ error: "No events to process" }, 400);
    }

    for (const notification of eventNotifications) {
      const { realmId, dataChangeEvent } = notification;

      if (!realmId || !dataChangeEvent?.entities) {
        console.error("Invalid notification format");
        continue;
      }

      try {
        for (const entity of dataChangeEvent.entities) {
          if (entity.name === "Invoice") {
            console.log(`Processing Invoice event for realmId: ${realmId}`);
            const company = await getService(c).company.getCompanyByQuickBooksRealmId(realmId);

            if (!company) {
              console.error(`No company found with realmId: ${realmId}`);
              continue;
            }

            await getService(c).company.syncInvoices(company.id);
            console.log(`Successfully synced invoices for company ${company.id}`);
          }
        }
      } catch (error) {
        console.error(`Error processing QuickBooks webhook for realmId ${realmId}:`, error);
      }
    }

    return c.json({ success: true }, 200);
  });

export default webhookHandler;
