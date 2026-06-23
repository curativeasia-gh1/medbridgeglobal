// Cloudflare Pages middleware — runs on every request
// Implements Markdown for Agents: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
// When a request includes Accept: text/markdown, serve the llms.txt as the markdown
// representation of the site. For page-specific markdown, serve a structured summary.

const PAGE_MARKDOWN = {
  "/": `# Medbridge — Market Access. Made Simple.

> Healthcare market-access and logistics company headquartered in Hong Kong.

Medbridge supports medical device and healthcare manufacturers across Hong Kong, Singapore, Malaysia and Thailand with regulatory registration, in-market representation, licence holding, Importer of Record, healthcare 3PL, inventory management, last-mile delivery and commercial market-access support.

**Website:** https://www.medbridge-global.com  
**Contact:** https://www.medbridge-global.com/pages/contact.html  
**Full LLM summary:** https://www.medbridge-global.com/llms.txt
`,
  "/pages/about.html": `# About Medbridge

Medbridge is an independent healthcare market-access and logistics company headquartered in Hong Kong. We support medical device and healthcare manufacturers across Hong Kong, Singapore, Malaysia and Thailand.

## Mission
To simplify healthcare market entry across Asia by providing manufacturers with one accountable regional partner for regulatory access, representation, importation and delivery.

## Vision
To become a trusted healthcare market-access and logistics platform serving Hong Kong and Southeast Asia through strong regional coordination and reliable local execution.

## Operating Principles
- **Regional:** One regional account structure across four markets
- **Local:** Market-specific regulatory and logistics execution
- **Transparent:** Clear scopes, timelines and reporting
- **Commercially Practical:** Decisions aligned with long-term market objectives
- **Healthcare-Focused:** Quality controls designed for regulated products
`,
  "/pages/services.html": `# Medbridge Services

## 1. Regulatory Market Entry
Device classification, pathway planning, dossier review, registration submissions, authority communication, renewals, post-market support.

## 2. In-Market Representation
Local authorised representation, Local Responsible Person coordination, registration-holder services, regulatory records management.

## 3. Licence Holding
Distributor-independent registration structures where permitted, licence maintenance, renewal management, product-transfer planning.

## 4. Importer of Record
Local importer appointment, import permits, customs documentation, clearance coordination, duties and tax documentation, traceability.

## 5. Healthcare 3PL
Goods receiving, quarantine and released-stock segregation, lot/batch/serial tracking, expiry management, pick-and-pack, order fulfilment, returns, recall support.

## 6. Last-Mile Logistics
Scheduled delivery to hospitals, clinics and laboratories, proof of delivery, returns collection, consignment replenishment, capital equipment coordination.

## 7. Commercial Market Access
Market assessment, competitor analysis, pricing review, channel strategy, distributor identification, tender support, launch planning.
`,
  "/pages/markets.html": `# Medbridge Markets

## Hong Kong — Regional Headquarters
Medical device listing support, Local Responsible Person coordination, Importer of Record, warehousing, inventory management, hospital and clinic delivery, tender support, regional account management.

## Singapore
HSA regulatory support, product registration, licence holding, Importer of Record, healthcare warehousing, order fulfilment, hospital and clinic delivery, post-market support.

## Malaysia
MDA support, product registration, local authorised representation, establishment and licence coordination, importation, 3PL, inventory management, nationwide delivery coordination.

## Thailand
Thai FDA support, product registration, local representation, licence-holder coordination, import permits, Importer of Record, warehousing, inventory and delivery coordination.
`
};

export async function onRequest(context) {
  const { request, next } = context;
  const accept = request.headers.get("Accept") || "";
  const url = new URL(request.url);
  const path = url.pathname;

  // Only intercept if client explicitly requests markdown
  if (!accept.includes("text/markdown")) {
    return next();
  }

  // Serve page-specific markdown if available
  if (PAGE_MARKDOWN[path]) {
    const md = PAGE_MARKDOWN[path];
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Vary": "Accept",
        "x-markdown-tokens": String(md.split(/\s+/).length)
      }
    });
  }

  // Fallback: serve llms.txt for any unspecified page
  const llmsUrl = new URL("/llms.txt", request.url);
  const llmsResp = await fetch(llmsUrl.toString());
  if (llmsResp.ok) {
    const text = await llmsResp.text();
    return new Response(text, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Vary": "Accept",
        "x-markdown-tokens": String(text.split(/\s+/).length)
      }
    });
  }

  return next();
}
