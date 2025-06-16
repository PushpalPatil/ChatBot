CREATE TABLE "chatbot_chat_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" serial NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatbot_chat_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "chatbot_chat_message" ADD CONSTRAINT "chatbot_chat_message_session_id_chatbot_chat_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chatbot_chat_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_message_session_id_idx" ON "chatbot_chat_message" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "chat_message_role_idx" ON "chatbot_chat_message" USING btree ("role");--> statement-breakpoint
CREATE INDEX "chat_message_created_at_idx" ON "chatbot_chat_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chat_session_title_idx" ON "chatbot_chat_session" USING btree ("title");--> statement-breakpoint
CREATE INDEX "chat_session_created_at_idx" ON "chatbot_chat_session" USING btree ("created_at");