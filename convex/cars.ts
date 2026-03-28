import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cars").collect();
  },
});

export const add = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    url: v.string(),
    spec: v.string(),
    year: v.string(),
    engine: v.string(),
    power: v.string(),
    drivetrain: v.string(),
    weight: v.string(),
    origin: v.string(),
    description: v.string(),
    gallery: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cars", args);
  },
});
