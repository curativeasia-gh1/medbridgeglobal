export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers
    }
  });
}

export function requireAdmin(context) {
  const email = (
    context.request.headers.get("Cf-Access-Authenticated-User-Email") || ""
  ).toLowerCase();

  const allowed = String(context.env.ADMIN_EMAILS || "")
    .split(",")
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !allowed.includes(email)) {
    return { email: null, response: json({ error: "Unauthorized" }, 401) };
  }
  return { email, response: null };
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function postInput(body) {
  const title = String(body.title || "").trim().slice(0, 160);
  const slug = slugify(body.slug || title);
  if (!title || !slug) return { error: "Title and slug are required." };

  const status = ["draft","published","archived"].includes(body.status)
    ? body.status : "draft";

  return {
    value: {
      title,
      slug,
      excerpt: String(body.excerpt || "").trim().slice(0, 500),
      content_html: String(body.content_html || "").slice(0, 200000),
      featured_image: String(body.featured_image || "").trim().slice(0, 2000) || null,
      featured_image_alt: String(body.featured_image_alt || "").trim().slice(0, 300),
      author: String(body.author || "").trim().slice(0, 120),
      category: String(body.category || "").trim().slice(0, 120),
      seo_title: String(body.seo_title || "").trim().slice(0, 70),
      meta_description: String(body.meta_description || "").trim().slice(0, 180),
      status,
      published_at: status === "published"
        ? (String(body.published_at || "").trim() || new Date().toISOString())
        : null
    }
  };
}
