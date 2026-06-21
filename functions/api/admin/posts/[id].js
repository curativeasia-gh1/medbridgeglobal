import { json, requireAdmin, postInput } from "../../../_lib.js";

export async function onRequestPut(context) {
  const auth = requireAdmin(context);
  if (auth.response) return auth.response;

  const body = await context.request.json();
  const parsed = postInput(body);
  if (parsed.error) return json({ error: parsed.error }, 400);
  const p = parsed.value;

  try {
    const result = await context.env.DB.prepare(
      `UPDATE posts SET
        title=?,slug=?,excerpt=?,content_html=?,featured_image=?,
        featured_image_alt=?,author=?,category=?,seo_title=?,
        meta_description=?,status=?,published_at=?,
        updated_at=CURRENT_TIMESTAMP
       WHERE id=?`
    ).bind(
      p.title,p.slug,p.excerpt,p.content_html,p.featured_image,
      p.featured_image_alt,p.author,p.category,p.seo_title,
      p.meta_description,p.status,p.published_at,context.params.id
    ).run();

    if (!result.meta.changes) return json({ error: "Not found." }, 404);
  } catch (error) {
    if (String(error).includes("UNIQUE")) {
      return json({ error: "Slug already exists." }, 409);
    }
    throw error;
  }

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const auth = requireAdmin(context);
  if (auth.response) return auth.response;

  await context.env.DB.prepare(
    "DELETE FROM posts WHERE id=?"
  ).bind(context.params.id).run();

  return json({ ok: true });
}
