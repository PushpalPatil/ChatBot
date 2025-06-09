import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import {eq, desc} from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  deleteLatest: publicProcedure.mutation(async ({ctx}) =>{
    const latestPost = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    // if latest post is null/undefined 
    // await ctx.db.delete(posts) - starts a delete sql operation on the posts table - Dizzle (ctx) db instance.delete query
    // .where - which record to delete
    // eq - equality condition : means : WHERE posts.id = latestPost.id
    // ensures only the specific post mentioned by ID that will get deleted. 
    if(latestPost) await ctx.db.delete(posts).where(eq(posts.id, latestPost.id));
  }),
  
});
