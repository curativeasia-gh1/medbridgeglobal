import { json, requireAdmin, postInput } from "../../../_lib.js";

export async function onRequestGet(context) {
  const auth = requireAdmin(context);
  if (auth.response) return auth.response;

  const result = await context.env.DB.prepare(
    "SELECT * FROM posts ORDER BY updated_at DESC"
  ).all();

  return json({ posts: result.results || [] });
}

export async function onRequestPost(context) {
  const auth = requireAdmin(context);
  if (auth.response) return auth.response;

  const body = await context.request.json();
  const parsed = postInput(body);
  if (parsed.error) return json({ error: parsed.error }, 400);

  const p = parsed.value;
  const id = crypto.randomUUID();

  try {
    await context.env.DB.prepare(
      `INSERT INTO posts (
        id,title,slug,excerpt,content_html,featured_image,
        featured_image_alt,author,category,seo_title,
        meta_description,status,published_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      id,p.title,p.slug,p.excerpt,p.content_html,p.featured_image,
      p.featured_image_alt,p.author,p.category,p.seo_title,
      p.meta_description,p.status,p.published_at
    ).run();
  } catch (error) {
    if (String(error).includes("UNIQUE")) {
      return json({ error: "Slug already exists." }, 409);
    }
    throw error;
  }

  return json({ ok: true, id }, 201);
}
