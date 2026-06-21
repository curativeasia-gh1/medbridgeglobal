import { json } from "../../_lib.js";

export async function onRequestGet(context) {
  const post = await context.env.DB.prepare(
    `SELECT * FROM posts
      WHERE slug=? AND status='published'
        AND published_at <= CURRENT_TIMESTAMP
      LIMIT 1`
  ).bind(context.params.slug).first();

  return post
    ? json({ post }, 200, { "cache-control": "public, max-age=60, s-maxage=300" })
    : json({ error: "Article not found." }, 404);
}
