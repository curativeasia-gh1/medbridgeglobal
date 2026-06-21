const posts=document.querySelector("#posts"),statusEl=document.querySelector("#status"),search=document.querySelector("#search"),category=document.querySelector("#category");
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let timer;
async function load(){
  statusEl.textContent="Loading…";
  const p=new URLSearchParams();
  if(search.value.trim())p.set("q",search.value.trim());
  if(category.value.trim())p.set("category",category.value.trim());
  const r=await fetch("/api/posts?"+p),d=await r.json();
  posts.innerHTML=(d.posts||[]).map(x=>`<article class="card">
    ${x.featured_image?`<img src="${esc(x.featured_image)}" alt="${esc(x.featured_image_alt)}">`:""}
    <div><small>${esc(x.category)}</small><h2><a href="/blog/article.html?slug=${encodeURIComponent(x.slug)}">${esc(x.title)}</a></h2><p>${esc(x.excerpt)}</p><p>${esc(x.author)}</p></div>
  </article>`).join("");
  statusEl.textContent=d.posts?.length?`${d.posts.length} article(s)`:"No articles found.";
}
search.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(load,300)});category.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(load,300)});load();
