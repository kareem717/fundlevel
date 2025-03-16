import { OpenAPIHono } from "@hono/zod-openapi";
import { createHash } from "node:crypto";
import * as jose from "jose";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { env } from "../../../../env";
import type { ICompanyService } from "../../../service";

// Type definition for Plaid verification key
interface PlaidVerificationKey {
  alg: string;
  crv: string;
  kid: string;
  kty: string;
  use: string;
  x: string;
  y: string;
  created_at: number;
  expired_at: number | null;
}

// Cache for Plaid verification keys to avoid repeated API calls
const plaidKeyCache: Record<string, PlaidVerificationKey> = {};

const webhookHandler = (companyService: ICompanyService) => {
  const app = new OpenAPIHono().post("/plaid", async (c) => {
    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[env.PLAID_ENVIRONMENT],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
          "PLAID-SECRET": env.PLAID_SECRET,
        },
      },
    });

    const plaid = new PlaidApi(plaidConfig);

    // 1. Extract the JWT from the Plaid-Verification header
    const plaidVerification = c.req.header("plaid-verification");
    if (!plaidVerification) {
      console.warn("Plaid webhook received without verification header");
      // Continue processing - verification is optional according to Plaid
    } else {
      // Get the raw body as text for verification
      const rawBody = await c.req.raw.clone().text();

      // 2. Verify the webhook
      const isVerified = await verifyPlaidWebhook(
        plaidVerification,
        rawBody,
        plaid,
      );

      if (!isVerified) {
        console.error("Failed to verify Plaid webhook");
        return c.json({ error: "Invalid webhook signature" }, 401);
      }
    }

    // Process the webhook payload
    const payload = await c.req.json();

    // Implement Plaid webhook handling based on webhook type
    const webhookType = payload.webhook_type as string | undefined;
    const webhookCode = payload.webhook_code as string | undefined;

    if (!webhookType) {
      console.error("No webhook type in payload");
      return c.json({ error: "Undefined webhook type" }, 400);
    }

    if (!webhookCode) {
      console.error("No webhook type in payload");
      return c.json({ error: "Undefined webhook code" }, 400);
    }

    try {
      switch (webhookType) {
        case "ITEM": {
          // Handle transaction webhooks
          switch (webhookCode) {
            case "NEW_ACCOUNTS_AVAILABLE": {
              const itemId = payload.item_id;
              await companyService.syncPlaidBankAccounts(itemId);
            }
          }
          break;
        }
        case "TRANSACTIONS": {
          // Handle transaction webhooks
          switch (webhookCode) {
            case "SYNC_UPDATES_AVAILABLE": {
              console.log("HIT");
              const itemId = payload.item_id;
              await companyService.syncPlaidTransactions(itemId);
            }
          }
          break;
        }
        default: {
          // Log unhandled webhook types but still return 200
          console.log(`Unhandled webhook type => TYPE: ${webhookType} CODE: ${webhookCode}`);
        }
      }
    } catch (error) {
      // Log error but still return 200 to acknowledge receipt
      console.error(`Error processing webhook: ${error}`);
    }

    // Always return 200 OK for Plaid webhooks
    return c.json({ success: true }, 200);
  });

  return app;
};

/**
 * Verifies a Plaid webhook using JWT verification
 *
 * @param jwt The JWT from the Plaid-Verification header
 * @param body The raw request body as text
 * @returns true if verified, false otherwise
 */
async function verifyPlaidWebhook(
  jwt: string,
  body: string,
  plaidApi: PlaidApi,
): Promise<boolean> {
  try {
    // 1. Decode the JWT header (without verification)
    const decodedHeader = jose.decodeProtectedHeader(jwt);

    // 2. Extract the key ID (kid)
    const keyId = decodedHeader.kid;

    if (!keyId) {
      console.error("No key ID in JWT header");
      return false;
    }

    // 3. Ensure the algorithm is ES256
    if (decodedHeader.alg !== "ES256") {
      console.error(`Invalid algorithm: ${decodedHeader.alg}, expected ES256`);
      return false;
    }

    // 4. Get the verification key (from cache or API)
    let key = plaidKeyCache[keyId];

    if (!key) {
      console.log(`Fetching new verification key for key ID: ${keyId}`);

      try {
        // Create a temporary Plaid client to get the verification key
        const response = await plaidApi.webhookVerificationKeyGet({
          key_id: keyId,
        });

        key = response.data.key;

        // Cache the key
        plaidKeyCache[keyId] = key;
      } catch (error) {
        console.error("Error fetching verification key:", error);
        return false;
      }
    }

    if (!key) {
      console.error("Failed to get verification key");
      return false;
    }

    // 5. Verify the JWT
    try {
      // Import the JWK
      const publicKey = await jose.importJWK(key, "ES256");

      // Verify the JWT
      const { payload } = await jose.jwtVerify(jwt, publicKey, {
        maxTokenAge: "5 minutes", // Reject webhooks older than 5 minutes
      });

      // 6. Verify the request body hash
      const bodyHash = createHash("sha256").update(body).digest("hex");

      // Check if the hash in the JWT matches the calculated hash
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

export default webhookHandler;
