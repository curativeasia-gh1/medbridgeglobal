import { json } from "../../_lib.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 12), 50);

  let where = "status='published' AND published_at <= CURRENT_TIMESTAMP";
  const params = [];

  if (q) {
    where += " AND (title LIKE ? OR excerpt LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    where += " AND category=?";
    params.push(category);
  }

  const result = await context.env.DB.prepare(
    `SELECT id,title,slug,excerpt,featured_image,featured_image_alt,
            author,category,published_at
       FROM posts
      WHERE ${where}
      ORDER BY published_at DESC
      LIMIT ?`
  ).bind(...params, limit).all();

  return json(
    { posts: result.results || [] },
    200,
    { "cache-control": "public, max-age=60, s-maxage=300" }
  );
}
