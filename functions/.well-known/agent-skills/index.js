export async function onRequest(context) {
  const payload = {
    "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    "name": "Medbridge",
    "description": "Healthcare market-access and logistics company headquartered in Hong Kong, supporting medical device manufacturers across Hong Kong, Singapore, Malaysia and Thailand.",
    "url": "https://www.medbridge-global.com",
    "skills": [
      {
        "name": "llms-txt",
        "type": "skill-md",
        "description": "Structured plain-language summary of Medbridge services, markets and capabilities for large language models",
        "url": "https://www.medbridge-global.com/llms.txt",
        "digest": "sha256:e9426eb632f6b5ad62413c4bc472273c8fb19b850f8c7362e0b8fd6d288a6d65"
      },
      {
        "name": "sitemap",
        "type": "skill-md",
        "description": "XML sitemap listing all public Medbridge pages",
        "url": "https://www.medbridge-global.com/sitemap.xml",
        "digest": "sha256:6965d0cf36e13e4f68f9879d0bbb590617aaf8d51d9c56800dcceeac23f9f580"
      }
    ]
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
