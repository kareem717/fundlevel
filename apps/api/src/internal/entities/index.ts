export * from "./account";
export * from "./company";
export * from "./accounting";

/**
 * Represents a QuickBooks webhook event
 */
export interface QuickbooksWebhookEvent {
  eventNotifications: Array<{
    realmId: string;
    dataChangeEvent: {
      entities: Array<{
        name: string;
        id: string;
        operation: "Create" | "Update" | "Delete";
        lastUpdated: string;
      }>;
    };
  }>;
}
