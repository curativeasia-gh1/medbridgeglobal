// Medbridge — Main JS

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile nav toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
  }

  // ── Active nav link ──
  const links = document.querySelectorAll('.nav-link');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(l => {
    const href = l.getAttribute('href') || '';
    if (href === current || href.includes(current.replace('.html',''))) {
      l.classList.add('active');
    }
  });

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ── Accordions ──
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Scroll reveal ──
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.card, .market-card, .service-item, .model-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ── Contact form ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      btn.textContent = 'Message Sent ✓';
      btn.disabled = true;
      btn.style.background = '#35978F';
      setTimeout(() => {
        btn.textContent = 'Request Assessment';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ── Sticky nav shadow ──
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(6,47,90,0.1)' : '';
    });
  }

});

// ── WebMCP — expose site tools to AI agents via browser ──
// https://webmachinelearning.github.io/webmcp/
if (typeof navigator !== 'undefined' && navigator.modelContext) {
  const controller = new AbortController();
  const { signal } = controller;

  const tools = [
    {
      name: "get_site_summary",
      description: "Get a full plain-language summary of Medbridge — services, markets, capabilities and contact details — suitable for AI agents.",
      inputSchema: { type: "object", properties: {}, required: [] },
      execute: async () => {
        const res = await fetch('/llms.txt');
        return { content: await res.text(), mimeType: 'text/plain' };
      }
    },
    {
      name: "list_services",
      description: "List all Medbridge services: Regulatory Market Entry, In-Market Representation, Licence Holding, Importer of Record, Healthcare 3PL, Last-Mile Logistics, Commercial Market Access.",
      inputSchema: { type: "object", properties: {}, required: [] },
      execute: async () => ({
        services: [
          "Regulatory Market Entry",
          "In-Market Representation",
          "Licence Holding",
          "Importer of Record",
          "Healthcare 3PL",
          "Last-Mile Logistics",
          "Commercial Market Access"
        ],
        url: "https://www.medbridge-global.com/pages/services.html"
      })
    },
    {
      name: "list_markets",
      description: "List the Asian markets Medbridge operates in and their regulatory frameworks.",
      inputSchema: { type: "object", properties: {}, required: [] },
      execute: async () => ({
        markets: [
          { name: "Hong Kong", role: "Regional headquarters", url: "https://www.medbridge-global.com/pages/hong-kong.html" },
          { name: "Singapore", framework: "HSA / Health Products Act", url: "https://www.medbridge-global.com/pages/singapore.html" },
          { name: "Malaysia", framework: "MDA / Medical Device Act 2012", url: "https://www.medbridge-global.com/pages/malaysia.html" },
          { name: "Thailand", framework: "Thai FDA", url: "https://www.medbridge-global.com/pages/thailand.html" }
        ]
      })
    },
    {
      name: "get_contact",
      description: "Get Medbridge contact information and the market-entry assessment request page.",
      inputSchema: { type: "object", properties: {}, required: [] },
      execute: async () => ({
        headquarters: "Hong Kong",
        contact_url: "https://www.medbridge-global.com/pages/contact.html",
        assessment: "Request a market-entry assessment at the contact URL above"
      })
    },
    {
      name: "get_market_guide",
      description: "Get the regulatory registration guide for a specific market.",
      inputSchema: {
        type: "object",
        properties: {
          market: {
            type: "string",
            enum: ["malaysia", "singapore", "importer-of-record", "licence-holding"],
            description: "Which guide to retrieve"
          }
        },
        required: ["market"]
      },
      execute: async ({ market }) => {
        const urls = {
          "malaysia": "/pages/resources/mda-medical-device-registration-malaysia.html",
          "singapore": "/pages/resources/hsa-medical-device-registration-singapore.html",
          "importer-of-record": "/pages/resources/importer-of-record-healthcare-asia.html",
          "licence-holding": "/pages/resources/medical-device-licence-holding-asia.html"
        };
        const url = urls[market];
        if (!url) return { error: "Unknown market guide" };
        const res = await fetch(url, { headers: { Accept: 'text/markdown' } });
        return { content: await res.text(), url: `https://www.medbridge-global.com${url}` };
      }
    }
  ];

  tools.forEach(tool => {
    navigator.modelContext.registerTool(tool.name, {
      description: tool.description,
      inputSchema: tool.inputSchema,
      execute: tool.execute,
      signal
    });
  });

  // Clean up on page unload
  window.addEventListener('pagehide', () => controller.abort(), { once: true });
}
