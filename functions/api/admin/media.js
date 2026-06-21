import { json, requireAdmin } from "../../_lib.js";

const TYPES = new Set([
  "image/jpeg","image/png","image/webp","image/gif","image/svg+xml"
]);

export async function onRequestPost(context) {
  const auth = requireAdmin(context);
  if (auth.response) return auth.response;

  const form = await context.request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt_text") || "").trim().slice(0,300);

  if (!(file instanceof File)) return json({ error: "Choose an image." }, 400);
  if (!TYPES.has(file.type)) return json({ error: "Unsupported image type." }, 400);
  if (file.size > 10 * 1024 * 1024) {
    return json({ error: "Maximum file size is 10 MB." }, 400);
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
  const key = `blog/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${safeName}`;

  await context.env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable"
    }
  });

  await context.env.DB.prepare(
    `INSERT INTO media
      (id,object_key,filename,mime_type,size_bytes,alt_text,uploaded_by)
     VALUES (?,?,?,?,?,?,?)`
  ).bind(
    crypto.randomUUID(),key,file.name,file.type,file.size,alt,auth.email
  ).run();

  return json({ ok: true, url: `/media/${key}` }, 201);
}
