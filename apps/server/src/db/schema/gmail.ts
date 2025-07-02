import { boolean, pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const gmailAccount = pgTable("gmail_account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	email: text("email").notNull(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	scope: text("scope").notNull(),
	tokenType: text("token_type").notNull().default("Bearer"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const inboxListener = pgTable("inbox_listener", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	gmailAccountId: text("gmail_account_id")
		.notNull()
		.references(() => gmailAccount.id, { onDelete: "cascade" }),
	inboxEmail: text("inbox_email").notNull(), // e.g. docs@swiftbooks.cloud
	isActive: boolean("is_active").notNull().default(true),
	historyId: text("history_id"), // Last Gmail history ID for incremental sync
	pubsubTopicName: text("pubsub_topic_name"), // Google Cloud Pub/Sub topic name
	pubsubSubscriptionName: text("pubsub_subscription_name"), // Google Cloud Pub/Sub subscription name
	watchExpiration: timestamp("watch_expiration"), // When the Gmail watch expires (needs renewal every 7 days)
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const emailProcessingLog = pgTable("email_processing_log", {
	id: text("id").primaryKey(),
	inboxListenerId: text("inbox_listener_id")
		.notNull()
		.references(() => inboxListener.id, { onDelete: "cascade" }),
	messageId: text("message_id").notNull(), // Gmail message ID
	threadId: text("thread_id").notNull(), // Gmail thread ID
	from: text("from").notNull(),
	subject: text("subject"),
	receivedAt: timestamp("received_at").notNull(),
	attachments: json("attachments"), // Array of attachment info
	processed: boolean("processed").notNull().default(false),
	processedAt: timestamp("processed_at"),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at").notNull(),
});