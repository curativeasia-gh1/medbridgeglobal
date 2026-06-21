(async()=>{
 const s=new URLSearchParams(location.search).get("slug"),status=document.querySelector("#status");
 if(!s){status.textContent="Article not specified.";return}
 const r=await fetch("/api/posts/"+encodeURIComponent(s)),d=await r.json();
 if(!r.ok){status.textContent=d.error||"Unable to load.";return}
 const p=d.post;document.title=(p.seo_title||p.title)+" | Blog";document.querySelector('meta[name="description"]').content=p.meta_description||p.excerpt||"";
 document.querySelector("#category").textContent=p.category||"";document.querySelector("#title").textContent=p.title;document.querySelector("#excerpt").textContent=p.excerpt||"";
 document.querySelector("#meta").textContent=[p.author,p.published_at?new Date(p.published_at).toLocaleDateString():null].filter(Boolean).join(" · ");
 const img=document.querySelector("#image");if(p.featured_image){img.src=p.featured_image;img.alt=p.featured_image_alt||"";img.hidden=false}
 document.querySelector("#body").innerHTML=p.content_html||"";status.hidden=true;document.querySelector("#content").hidden=false;
})();
