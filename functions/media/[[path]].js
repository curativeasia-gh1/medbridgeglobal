export async function onRequestGet(context) {
  const path = Array.isArray(context.params.path)
    ? context.params.path.join("/")
    : context.params.path;

  const object = await context.env.MEDIA.get(path);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");

  return new Response(object.body, { headers });
}
