import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `chatbot_${name}`);

export const chatSessions = createTable(
  "chat_session",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    titleIndex: index("chat_session_title_idx").on(example.title),
    createdAtIndex: index("chat_session_created_at_idx").on(example.createdAt),
  })
);

export const chatMessages = createTable(
  "chat_message",
  {
    id: serial("id").primaryKey(),
    sessionId: serial("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    sessionIdIndex: index("chat_message_session_id_idx").on(example.sessionId),
    roleIndex: index("chat_message_role_idx").on(example.role),
    createdAtIndex: index("chat_message_created_at_idx").on(example.createdAt),
  })
);

// Types for TypeScript
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;