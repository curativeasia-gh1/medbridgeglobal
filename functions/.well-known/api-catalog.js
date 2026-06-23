export async function onRequest(context) {
  // RFC 9727 API Catalog — application/linkset+json
  // Medbridge is a B2B brochure site with no public API.
  // This catalog documents the site's machine-readable resources
  // so agents can discover structured content endpoints.
  const payload = {
    "linkset": [
      {
        "anchor": "https://www.medbridge-global.com/",
        "https://www.iana.org/assignments/link-relations/service-doc": [
          { "href": "https://www.medbridge-global.com/llms.txt", "type": "text/plain" }
        ],
        "https://www.iana.org/assignments/link-relations/describedby": [
          { "href": "https://www.medbridge-global.com/sitemap.xml", "type": "application/xml" }
        ]
      }
    ]
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
