import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cars: defineTable({
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
  }).index("by_slug", ["slug"]),
  
  articles: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    date: v.string(),
    tag: v.string(),
    image: v.string(),
    body: v.array(v.string()),
    relatedCarSlugs: v.array(v.string()),
    gallery: v.array(v.string()),
  }).index("by_slug", ["slug"]),

  videos: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    thumbnail: v.string(),
    duration: v.string(),
    location: v.string(),
    youtubeId: v.string(),
  }).index("by_slug", ["slug"]),
});
