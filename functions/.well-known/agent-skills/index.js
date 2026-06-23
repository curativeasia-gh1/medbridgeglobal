export async function onRequest(context) {
  const payload = {
    "$schema": "https://agentskills.io/schema/v0.2.0/index.json",
    "name": "Medbridge",
    "description": "Healthcare market-access and logistics company headquartered in Hong Kong. Supports medical device and healthcare manufacturers across Hong Kong, Singapore, Malaysia and Thailand.",
    "url": "https://www.medbridge-global.com",
    "skills": [
      {
        "name": "llms-txt",
        "type": "llms-txt",
        "description": "Structured plain-language summary of Medbridge for large language models",
        "url": "https://www.medbridge-global.com/llms.txt"
      },
      {
        "name": "sitemap",
        "type": "sitemap",
        "description": "XML sitemap listing all public Medbridge pages",
        "url": "https://www.medbridge-global.com/sitemap.xml"
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
