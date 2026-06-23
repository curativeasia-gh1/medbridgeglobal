export async function onRequest(context) {
  // Rename to server-card.json via route
  const payload = {
    "serverInfo": {
      "name": "Medbridge",
      "version": "1.0.0",
      "description": "Healthcare market-access and logistics platform headquartered in Hong Kong. Supports medical device manufacturers across Hong Kong, Singapore, Malaysia and Thailand.",
      "url": "https://www.medbridge-global.com"
    },
    "endpoint": "https://www.medbridge-global.com/llms.txt",
    "capabilities": {
      "resources": true,
      "tools": false,
      "prompts": false
    },
    "resources": [
      {
        "name": "site-summary",
        "description": "Full plain-language summary of Medbridge services, markets and capabilities",
        "uri": "https://www.medbridge-global.com/llms.txt",
        "mimeType": "text/plain"
      },
      {
        "name": "sitemap",
        "description": "XML sitemap of all public pages",
        "uri": "https://www.medbridge-global.com/sitemap.xml",
        "mimeType": "application/xml"
      },
      {
        "name": "market-access-guide-malaysia",
        "description": "MDA medical device registration guide for Malaysia",
        "uri": "https://www.medbridge-global.com/pages/resources/mda-medical-device-registration-malaysia.html",
        "mimeType": "text/html"
      },
      {
        "name": "market-access-guide-singapore",
        "description": "HSA medical device registration guide for Singapore",
        "uri": "https://www.medbridge-global.com/pages/resources/hsa-medical-device-registration-singapore.html",
        "mimeType": "text/html"
      },
      {
        "name": "importer-of-record-guide",
        "description": "Guide to Importer of Record in healthcare across Asia",
        "uri": "https://www.medbridge-global.com/pages/resources/importer-of-record-healthcare-asia.html",
        "mimeType": "text/html"
      },
      {
        "name": "licence-holding-guide",
        "description": "Guide to distributor-independent licence holding in Asia",
        "uri": "https://www.medbridge-global.com/pages/resources/medical-device-licence-holding-asia.html",
        "mimeType": "text/html"
      }
    ]
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
