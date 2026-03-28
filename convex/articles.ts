import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("articles").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    date: v.string(),
    tag: v.string(),
    image: v.string(),
    body: v.array(v.string()),
    relatedCarSlugs: v.array(v.string()),
    gallery: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("articles", args);
  },
});
