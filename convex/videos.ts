import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("videos").collect();
  },
});

export const add = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    thumbnail: v.string(),
    duration: v.string(),
    location: v.string(),
    youtubeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("videos"),
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    thumbnail: v.string(),
    duration: v.string(),
    location: v.string(),
    youtubeId: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const fetchMetadata = action({
  args: { url: v.string() },
  handler: async (_ctx, args) => {
    try {
      // 1. Fetch oEmbed (extremely reliable for title and thumbnail)
      let oembedData: any = null;
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(args.url)}&format=json`;
        const oembedResponse = await fetch(oembedUrl);
        if (oembedResponse.ok) {
          oembedData = await oembedResponse.json();
        }
      } catch (err) {
        console.error("oEmbed fetch failed:", err);
      }

      // 2. Fetch page HTML (for description and date)
      const response = await fetch(args.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+408',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      const html = await response.text();

      const extractMeta = (name: string) => {
        const patterns = [
          new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]+)"`, "i"),
          new RegExp(`<meta\\s+property="${name}"\\s+content="([^"]+)"`, "i"),
          new RegExp(`<meta\\s+itemprop="${name}"\\s+content="([^"]+)"`, "i"),
          new RegExp(`"${name}":"([^"]+)"`, "i"),
          new RegExp(`"${name}":\\s*"([^"]+)"`, "i"),
          // Look for nested structures in ytInitialData/PlayerResponse
          new RegExp(`"${name}":\\{"simpleText":"([^"]+)"\\}`, "i"),
          new RegExp(`"${name}":\\{"runs":\\[\\{"text":"([^"]+)"\\}`, "i"),
        ];
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1].length > 5) {
            let val = match[1];
            // Unescape Unicode sequences like \u0026
            val = val.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
            // Basic unescape
            val = val.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            return val;
          }
        }
        return null;
      };

      const title = oembedData?.title || extractMeta("og:title") || extractMeta("title");
      const description = extractMeta("description") || extractMeta("shortDescription") || extractMeta("og:description");
      const date = extractMeta("datePublished") || extractMeta("uploadDate") || extractMeta("startDate");
      const thumbnail_url = oembedData?.thumbnail_url || extractMeta("og:image");

      // Verify if the extracted description is the generic YouTube one
      const isGeneric = description?.includes("Enjoy the videos and music you love");
      
      return {
        title: title && title !== "YouTube" ? title : null,
        description: isGeneric ? null : description,
        date: date ? date.split('T')[0] : null,
        thumbnail_url
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  },
});
