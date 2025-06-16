import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { chatMessages, chatSessions } from "~/server/db/schema";

// Define the message schema
const messageSchema = z.object({
    id: z.number(),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    createdAt: z.date().optional(),
});

export const chatRouter = createTRPCRouter({
    // Get all chat sessions with their messages
    getSessions: publicProcedure.query(async ({ ctx }) => {
        try {
            const sessions = await ctx.db
                .select()
                .from(chatSessions)
                .orderBy(desc(chatSessions.createdAt))
                .limit(20);

            // Get messages for each session
            const sessionsWithMessages = await Promise.all(
                sessions.map(async (session) => {
                    const messages = await ctx.db
                        .select()
                        .from(chatMessages)
                        .where(eq(chatMessages.sessionId, session.id))
                        .orderBy(chatMessages.createdAt);

                    return {
                        ...session,
                        messages,
                    };
                })
            );

            return sessionsWithMessages;
        } catch (error) {
            console.error("Error fetching sessions:", error);
            return [];
        }
    }),

    // Get a specific session with messages
    getSession: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            try {
                const session = await ctx.db
                    .select()
                    .from(chatSessions)
                    .where(eq(chatSessions.id, input.id))
                    .limit(1);

                if (session.length === 0) {
                    throw new Error("Session not found");
                }

                const messages = await ctx.db
                    .select()
                    .from(chatMessages)
                    .where(eq(chatMessages.sessionId, input.id))
                    .orderBy(chatMessages.createdAt);

                return {
                    ...session[0],
                    messages,
                };
            } catch (error) {
                console.error("Error fetching session:", error);
                throw new Error("Failed to fetch session");
            }
        }),

    // Save a chat session
    saveSession: publicProcedure
        .input(
            z.object({
                title: z.string(),
                messages: z.array(
                    z.object({
                        role: z.enum(['user', 'assistant']),
                        content: z.string(),
                    })
                ),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                // Create the session
                const [newSession] = await ctx.db
                    .insert(chatSessions)
                    .values({
                        title: input.title,
                    })
                    .returning();

                if (!newSession) {
                    throw new Error("Failed to create session");
                }

                // Create the messages
                if (input.messages.length > 0) {
                    await ctx.db.insert(chatMessages).values(
                        input.messages.map((message) => ({
                            sessionId: newSession.id,
                            role: message.role,
                            content: message.content,
                        }))
                    );
                }

                return newSession;
            } catch (error) {
                console.error("Error saving session:", error);
                throw new Error("Failed to save session");
            }
        }),

    // Delete a chat session
    deleteSession: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            try {
                // Messages will be cascade deleted due to foreign key constraint
                await ctx.db
                    .delete(chatSessions)
                    .where(eq(chatSessions.id, input.id));

                return { success: true };
            } catch (error) {
                console.error("Error deleting session:", error);
                throw new Error("Failed to delete session");
            }
        }),

    // Get chat statistics
    getStats: publicProcedure.query(async ({ ctx }) => {
        try {
            const [sessionCount] = await ctx.db
                .select({ count: count() })
                .from(chatSessions);

            const [messageCount] = await ctx.db
                .select({ count: count() })
                .from(chatMessages);

            const totalSessions = sessionCount?.count ?? 0;
            const totalMessages = messageCount?.count ?? 0;
            const averageMessagesPerSession = totalSessions > 0
                ? Number((totalMessages / totalSessions).toFixed(1))
                : 0;

            return {
                totalSessions,
                totalMessages,
                averageMessagesPerSession,
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
            return {
                totalSessions: 0,
                totalMessages: 0,
                averageMessagesPerSession: 0,
            };
        }
    }),
});

export type ChatRouter = typeof chatRouter;