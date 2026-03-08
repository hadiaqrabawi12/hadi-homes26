/* ═══════════════════════════════════════════════════════
   LOVING HOMES — Main JavaScript  v2.0
   ═══════════════════════════════════════════════════════ */
'use strict';

const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const lerp = (a,b,t)=>a+(b-a)*t;
const rand = (lo,hi)=>Math.random()*(hi-lo)+lo;

/* ─── 1. Cursor ─────────────────────────────── */
function initCursor(){
  const dot=$('#cursor'),ring=$('#cursor-ring');
  if(!dot)return;
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  $$('a,button,.btn,.card,.pkg-card,.gallery-item,.testimonial-card,.accordion-btn,.tab-btn,.nav-link,.nav-logo,.footer-social a').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-big'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-big'));
  });
  (function tick(){rx=lerp(rx,mx,.1);ry=lerp(ry,my,.1);if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}requestAnimationFrame(tick);})();
}

/* ─── 2. Scroll Progress + Navbar ──────────── */
function initScroll(){
  const bar=$('#scroll-bar'),nav=$('.navbar');
  window.addEventListener('scroll',()=>{
    if(bar){const h=document.documentElement;bar.style.width=(window.scrollY/(h.scrollHeight-h.clientHeight)*100)+'%';}
    if(nav)nav.classList.toggle('scrolled',window.scrollY>40);
  },{passive:true});
}

/* ─── 3. Reveal on Scroll ───────────────────── */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('vis'),i*80);});
  },{threshold:0.1});
  $$('.reveal,.reveal-left,.reveal-scale').forEach(el=>obs.observe(el));
}

/* ─── 4. Counter Animate ────────────────────── */
function initCounters(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target,tgt=parseFloat(el.dataset.target),dur=1800,t0=performance.now();
      (function tick(now){const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,4),val=tgt*ease;
        el.textContent=tgt<10?val.toFixed(1):Math.round(val).toLocaleString();
        if(p<1)requestAnimationFrame(tick);})(t0);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  $$('[data-target]').forEach(el=>obs.observe(el));
}

/* ─── 5. Card Spotlight ─────────────────────── */
function initSpotlight(){
  $$('.card,.pkg-card,.testimonial-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

/* ─── 6. Card Tilt ──────────────────────────── */
function initTilt(){
  $$('.pkg-card,.gallery-item').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`translateY(-8px) perspective(700px) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* ─── 7. Button Ripple ──────────────────────── */
function initRipple(){
  $$('.btn,.nav-cta,.adopt-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const r=btn.getBoundingClientRect(),s=document.createElement('span');
      Object.assign(s.style,{position:'absolute',borderRadius:'50%',background:'rgba(255,255,255,.2)',width:'0',height:'0',pointerEvents:'none',zIndex:'10',left:(e.clientX-r.left)+'px',top:(e.clientY-r.top)+'px',transform:'translate(-50%,-50%)',transition:'width .55s ease,height .55s ease,opacity .55s ease'});
      btn.appendChild(s);requestAnimationFrame(()=>{s.style.width='280px';s.style.height='280px';s.style.opacity='0';});
      setTimeout(()=>s.remove(),600);
    });
  });
}

/* ─── 8. Mobile Menu ────────────────────────── */
function initMobileMenu(){
  const btn=$('.nav-hamburger'),menu=$('.nav-mobile');
  if(!btn||!menu)return;
  btn.addEventListener('click',()=>{btn.classList.toggle('open');menu.classList.toggle('open');document.body.style.overflow=menu.classList.contains('open')?'hidden':'';});
  $$('.nav-mobile .nav-link').forEach(link=>link.addEventListener('click',()=>{btn.classList.remove('open');menu.classList.remove('open');document.body.style.overflow='';}));
}

/* ─── 9. Accordion ──────────────────────────── */
function initAccordion(){
  $$('.accordion-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const body=btn.nextElementSibling,isOpen=btn.classList.contains('open');
      $$('.accordion-btn.open').forEach(b=>{b.classList.remove('open');b.nextElementSibling.classList.remove('open');});
      if(!isOpen){btn.classList.add('open');body.classList.add('open');}
    });
  });
}

/* ─── 10. Tabs ──────────────────────────────── */
function initTabs(){
  $$('.tabs-nav').forEach(nav=>{
    $$('.tab-btn',nav).forEach(btn=>{
      btn.addEventListener('click',()=>{
        $$('.tab-btn',nav).forEach(b=>b.classList.remove('active'));btn.classList.add('active');
        const target=btn.dataset.tab,panels=btn.closest('.tabs-wrapper').querySelectorAll('.tab-panel');
        panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===target));
      });
    });
  });
}

/* ─── 11. Form Validation ───────────────────── */
function initForms(){
  $$('form.contact-form,form.booking-form').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();let valid=true;
      $$('[required]',form).forEach(field=>{const g=field.closest('.form-group');if(!field.value.trim()){valid=false;g.classList.add('has-error');}else g.classList.remove('has-error');});
      if(valid){const btn=$('[type=submit]',form);btn.textContent='✓ تم الإرسال!';btn.style.background='var(--green)';btn.disabled=true;toast('✓ تم إرسال طلبك بنجاح! سنتصل بك قريباً 🐾');setTimeout(()=>{btn.textContent='إرسال';btn.style.background='';btn.disabled=false;form.reset();},3000);}
    });
    $$('[required]',form).forEach(field=>field.addEventListener('input',()=>{if(field.value.trim())field.closest('.form-group').classList.remove('has-error');}));
  });
}

/* ─── 12. Toast ─────────────────────────────── */
function toast(msg){
  const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('show')));
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),450);},3500);
}
window.toast=toast;

/* ─── 13. Active Nav Link ───────────────────── */
function setActiveNav(){
  const path=window.location.pathname.split('/').pop()||'index.html';
  $$('.nav-link,.nav-mobile .nav-link').forEach(link=>{const href=link.getAttribute('href');link.classList.toggle('active',href===path||(path===''&&href==='index.html'));});
}

/* ─── 14. Parallax ──────────────────────────── */
function initParallax(){
  const skyline=$('.hk-skyline');if(!skyline)return;
  window.addEventListener('scroll',()=>{skyline.style.transform=`translateY(${window.scrollY*.3}px)`;},{passive:true});
}

/* ─── 15. Hero Ticker ───────────────────────── */
function initHeroTicker(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(!entry.isIntersecting)return;
      $$('[data-target]',entry.target).forEach(el=>{const tgt=parseFloat(el.dataset.target),dur=2000,t0=performance.now();(function tick(now){const p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=tgt<10?(tgt*e).toFixed(1):Math.round(tgt*e).toLocaleString();if(p<1)requestAnimationFrame(tick);})(t0);obs.unobserve(entry.target);});
    });
  },{threshold:.3});
  $$('.hero-stats,.stats-band').forEach(el=>obs.observe(el));
}

/* ─── 16. Lightbox ──────────────────────────── */
function initLightbox(){
  $$('.gallery-item[data-label]').forEach(item=>{
    item.addEventListener('click',()=>{
      const label=item.dataset.label,emoji=item.querySelector('.gi-emoji')?.textContent||'🐾';
      const box=document.createElement('div');
      box.style.cssText='position:fixed;inset:0;background:rgba(7,11,18,.95);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;cursor:pointer;backdrop-filter:blur(10px)';
      box.innerHTML=`<div style="font-size:clamp(60px,15vw,120px)">${emoji}</div><div style="font-family:'Tajawal',sans-serif;font-size:clamp(16px,4vw,24px);color:var(--text);font-weight:700;text-align:center;padding:0 20px">${label}</div><div style="font-size:13px;color:var(--mid)">اضغط للإغلاق</div>`;
      box.addEventListener('click',()=>box.remove());document.body.appendChild(box);
    });
  });
}

/* ─── 17. Particles ─────────────────────────── */
function initParticles(){
  const canvas=$('#particles-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H,particles=[];
  const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
  resize();window.addEventListener('resize',resize);
  particles=Array.from({length:40},()=>({x:rand(0,W),y:rand(0,H),vx:rand(-.3,.3),vy:rand(-.3,.3),r:rand(.5,2),a:rand(.1,.5),hue:rand(170,210)}));
  (function tick(){ctx.clearRect(0,0,W,H);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`hsla(${p.hue},100%,70%,${p.a})`;ctx.shadowColor=`hsl(${p.hue},100%,70%)`;ctx.shadowBlur=6;ctx.fill();});requestAnimationFrame(tick);})();
}

/* ─── 18. Smooth Anchors ────────────────────── */
function initSmoothAnchors(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}});
  });
}

/* ─── 19. Click Sound ───────────────────────── */
function initClickSound(){
  const audio=new Audio('../sounds/sound1.mp3');audio.preload='auto';
  const play=()=>{audio.currentTime=0;audio.play().catch(()=>{});};
  document.addEventListener('click',e=>{if(e.target.closest('a,button,.btn,.nav-link,.nav-logo,.footer-links a,.accordion-btn,.tab-btn,.gallery-item'))play();});
}

/* ═══════════════════════════════════════════════════
   NEW FEATURES
   ═══════════════════════════════════════════════════ */

/* ─── TRANSLATIONS ──────────────────────────── */
const T={
  ar:{
    nav_cta:'احجز الآن ✦',settings_title:'⚙️ الإعدادات',
    settings_mode:'الوضع',settings_dark:'🌙 ليلي',settings_light:'☀️ نهاري',mode_hint:'انقر للتبديل',
    settings_cb:'دعم عمى الألوان',settings_cb_normal:'عادي',settings_cb_deut:'ثنائي اللون',settings_cb_prot:'عمى الأحمر',settings_cb_trit:'عمى الأزرق',settings_cb_achro:'رمادي كامل',
    settings_font:'نوع الخط',settings_lang:'اللغة',
    search_placeholder:'ابحث عن خدمة أو صفحة...',search_pages:'الصفحات',settings_services:'الخدمات',search_services:'الخدمات',
    search_noresult:'لا توجد نتائج',search_noresult_hint:'جرّب كلمات أخرى',search_suggest:'اقتراحات:',
    fav_title:'❤️ المفضلة',fav_add_current:'+ أضف هذه الصفحة للمفضلة',fav_empty:'لا توجد مفضلات بعد',fav_empty_hint:'أضف الصفحات التي تزورها كثيراً',
    logo_sub:'منتجع الكلاب الفاخر',
  },
  en:{
    nav_cta:'Book Now ✦',settings_title:'⚙️ Settings',
    settings_mode:'Mode',settings_dark:'🌙 Dark',settings_light:'☀️ Light',mode_hint:'Click to toggle',
    settings_cb:'Color Blindness Support',settings_cb_normal:'Normal',settings_cb_deut:'Deuteranopia',settings_cb_prot:'Protanopia',settings_cb_trit:'Tritanopia',settings_cb_achro:'Achromatopsia',
    settings_font:'Font Style',settings_lang:'Language',
    search_placeholder:'Search for a service or page...',search_pages:'Pages',search_services:'Services',
    search_noresult:'No results found',search_noresult_hint:'Try different keywords',search_suggest:'Suggestions:',
    fav_title:'❤️ Favorites',fav_add_current:'+ Add this page to favorites',fav_empty:'No favorites yet',fav_empty_hint:'Add pages you visit often',
    logo_sub:'Luxury Dog Resort',
  }
};

/* ─── STATE ─────────────────────────────────── */
const STATE={
  theme:localStorage.getItem('lh_theme')||'dark',
  cb:localStorage.getItem('lh_cb')||'normal',
  font:localStorage.getItem('lh_font')||'cairo',
  lang:localStorage.getItem('lh_lang')||'ar',
  favs:JSON.parse(localStorage.getItem('lh_favs')||'[]'),
};
const saveState=(k,v)=>{STATE[k]=v;localStorage.setItem('lh_'+k,typeof v==='object'?JSON.stringify(v):v);};
const t=key=>(T[STATE.lang]||T.ar)[key]||key;

/* ─── SITE DATA ─────────────────────────────── */
const SITE_DATA=[
  {key:'home',emoji:'🏠',file:'index.html',ar:'الرئيسية',en:'Home',tag_ar:'صفحة',tag_en:'Page',sub_ar:'الصفحة الرئيسية',sub_en:'Main page'},
  {key:'about',emoji:'👥',file:'about.html',ar:'من نحن',en:'About Us',tag_ar:'صفحة',tag_en:'Page',sub_ar:'قصتنا وفريقنا',sub_en:'Our story and team'},
  {key:'video',emoji:'🎬',file:'video.html',ar:'الفيديو',en:'Video',tag_ar:'صفحة',tag_en:'Page',sub_ar:'مقاطع فيديو المنتجع',sub_en:'Resort video tours'},
  {key:'services',emoji:'⭐',file:'services.html',ar:'الخدمات',en:'Services',tag_ar:'صفحة',tag_en:'Page',sub_ar:'جميع خدماتنا',sub_en:'All our services'},
  {key:'packages',emoji:'📦',file:'packages.html',ar:'الحزم والأسعار',en:'Packages & Pricing',tag_ar:'أسعار',tag_en:'Pricing',sub_ar:'اليومي / كلاسيك / بريميوم',sub_en:'Daily / Classic / Premium'},
  {key:'rooms',emoji:'🛏️',file:'rooms.html',ar:'الغرف الفاخرة',en:'Luxury Rooms',tag_ar:'إقامة',tag_en:'Stay',sub_ar:'ستاندرد / ديلوكس / سويت',sub_en:'Standard / Deluxe / Suite'},
  {key:'grooming',emoji:'✂️',file:'grooming.html',ar:'صالون الحلاقة',en:'Grooming Salon',tag_ar:'تجميل',tag_en:'Beauty',sub_ar:'تجميل احترافي لكلبك',sub_en:'Professional dog grooming'},
  {key:'outdoor',emoji:'🌿',file:'outdoor.html',ar:'المرافق الخارجية',en:'Outdoor Areas',tag_ar:'ترفيه',tag_en:'Play',sub_ar:'مراعي وغابات ورمال',sub_en:'Meadows, forests and sand'},
  {key:'vet',emoji:'🏥',file:'veterinary.html',ar:'الرعاية البيطرية',en:'Veterinary',tag_ar:'صحة 24/7',tag_en:'Health',sub_ar:'رعاية طبية 24/7',sub_en:'24/7 medical care'},
  {key:'gallery',emoji:'🖼️',file:'gallery.html',ar:'المعرض',en:'Gallery',tag_ar:'صور',tag_en:'Photos',sub_ar:'لحظات سعيدة من حياة كلابنا',sub_en:'Happy moments from our dogs'},
  {key:'test',emoji:'💬',file:'testimonials.html',ar:'آراء العملاء',en:'Reviews',tag_ar:'تقييمات',tag_en:'Reviews',sub_ar:'ماذا يقول عملاؤنا',sub_en:'What our clients say'},
  {key:'faq',emoji:'❓',file:'faq.html',ar:'الأسئلة الشائعة',en:'FAQ',tag_ar:'مساعدة',tag_en:'Help',sub_ar:'إجابات الأسئلة الشائعة',sub_en:'Common questions answered'},
  {key:'contact',emoji:'📞',file:'contact.html',ar:'تواصل معنا',en:'Contact Us',tag_ar:'تواصل',tag_en:'Contact',sub_ar:'احجز أو تواصل معنا',sub_en:'Book or reach our team'},
  {key:'bath',emoji:'🛁',file:'grooming.html',ar:'الاستحمام',en:'Bath & Dry',tag_ar:'تجميل',tag_en:'Grooming',sub_ar:'شامبو عضوي HK$120',sub_en:'Organic shampoo HK$120'},
  {key:'nails',emoji:'💅',file:'grooming.html',ar:'تقليم الأظافر',en:'Nail Trim',tag_ar:'تجميل',tag_en:'Grooming',sub_ar:'تقليم دقيق HK$60',sub_en:'Precise trim HK$60'},
  {key:'spa',emoji:'💆',file:'grooming.html',ar:'مساج الاسترخاء',en:'Relaxation Spa',tag_ar:'سبا',tag_en:'Spa',sub_ar:'مساج HK$100',sub_en:'Massage HK$100'},
  {key:'suite',emoji:'🏰',file:'rooms.html',ar:'غرفة سويت',en:'Suite Room',tag_ar:'فاخر',tag_en:'Luxury',sub_ar:'من HK$450/ليلة',sub_en:'From HK$450/night'},
  {key:'deluxe',emoji:'✨',file:'rooms.html',ar:'غرفة ديلوكس',en:'Deluxe Room',tag_ar:'ديلوكس',tag_en:'Deluxe',sub_ar:'من HK$280/ليلة',sub_en:'From HK$280/night'},
  {key:'emergency',emoji:'🚨',file:'veterinary.html',ar:'طوارئ بيطرية',en:'Vet Emergency',tag_ar:'طوارئ',tag_en:'Emergency',sub_ar:'استجابة فورية 24/7',sub_en:'Immediate 24/7 response'},
  {key:'premium',emoji:'👑',file:'packages.html',ar:'حزمة بريميوم',en:'Premium Package',tag_ar:'HK$780/يوم',tag_en:'HK$780/day',sub_ar:'أعلى مستوى رعاية شخصية',sub_en:'Ultimate personal care'},
  {key:'classic',emoji:'⭐',file:'packages.html',ar:'حزمة كلاسيك',en:'Classic Package',tag_ar:'HK$480/يوم',tag_en:'HK$480/day',sub_ar:'التوازن بين الرعاية والقيمة',sub_en:'Perfect care & value balance'},
  {key:'forest',emoji:'🌲',file:'outdoor.html',ar:'التمشية في الغابات',en:'Forest Walks',tag_ar:'مغامرة',tag_en:'Adventure',sub_ar:'مسارات طبيعية يومية',sub_en:'Daily nature trail walks'},
  {key:'standard',emoji:'🏠',file:'rooms.html',ar:'غرفة ستاندرد',en:'Standard Room',tag_ar:'HK$180/ليلة',tag_en:'HK$180/night',sub_ar:'سرير مريح وتدفئة',sub_en:'Cozy bed and heating'},
  {key:'haircut',emoji:'✂️',file:'grooming.html',ar:'قص الشعر الكامل',en:'Full Haircut',tag_ar:'تجميل',tag_en:'Grooming',sub_ar:'من HK$180',sub_en:'From HK$180'},
];

/* ─── inject SVG CB filters ─────────────────── */
function injectCBFilters(){
  if(document.getElementById('cb-svg'))return;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.id='cb-svg';svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML=`<defs>
    <filter id="filter-deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>
    <filter id="filter-protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>
    <filter id="filter-tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>
  </defs>`;
  document.body.insertAdjacentElement('afterbegin',svg);
}

/* ─── 20. NAV TOOLS ─────────────────────────── */
function initNavTools(){
  const navbar=$('.navbar');if(!navbar)return;
  const div=document.createElement('div');
  div.className='nav-tools';
  div.innerHTML=`
    <button class="nav-tool-btn" id="btn-search" aria-label="Search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
    <button class="nav-tool-btn" id="btn-fav" aria-label="Favorites">❤️<span class="ntb-badge" id="fav-count-badge"></span></button>
    <button class="nav-tool-btn lang-btn" id="btn-lang">AR</button>
    <button class="nav-tool-btn" id="btn-settings" aria-label="Settings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>`;
  const cta=navbar.querySelector('.nav-cta');
  if(cta)navbar.insertBefore(div,cta);else navbar.appendChild(div);
  $('#btn-search')?.addEventListener('click',openSearch);
  $('#btn-fav')?.addEventListener('click',openFavorites);
  $('#btn-settings')?.addEventListener('click',openSettings);
  $('#btn-lang')?.addEventListener('click',toggleLanguage);
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();}
    if(e.key==='Escape')closeAll();
  });
  updateFavBadge();
}

/* ─── 21. SETTINGS PANEL ────────────────────── */
function initSettingsPanel(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="panel-backdrop" id="panel-backdrop"></div>
    <aside class="settings-panel" id="settings-panel" role="dialog">
      <div class="sp-head">
        <span class="sp-head-title" id="sp-title">⚙️ الإعدادات</span>
        <button class="sp-close" id="sp-close-btn">✕</button>
      </div>
      <div class="sp-body">
        <div>
          <span class="sp-section-label" id="sp-lbl-mode">الوضع</span>
          <div class="sp-toggle-row" id="sp-theme-toggle" tabindex="0" role="button">
            <div class="sp-toggle-info">
              <span class="sp-toggle-name" id="sp-mode-name">🌙 ليلي</span>
              <span class="sp-toggle-hint" id="sp-mode-hint">انقر للتبديل</span>
            </div>
            <div class="sp-switch" id="sp-theme-switch"></div>
          </div>
        </div>
        <div>
          <span class="sp-section-label" id="sp-lbl-cb">دعم عمى الألوان</span>
          <div class="sp-chips" id="sp-cb-chips">
            <button class="sp-chip active" data-cb="normal"><span class="chip-dot" style="background:#00e5ff"></span><span id="sp-cb-normal">عادي</span></button>
            <button class="sp-chip" data-cb="deuteranopia"><span class="chip-dot" style="background:#ff6b35"></span><span id="sp-cb-deut">ثنائي اللون</span></button>
            <button class="sp-chip" data-cb="protanopia"><span class="chip-dot" style="background:#ffd166"></span><span id="sp-cb-prot">عمى الأحمر</span></button>
            <button class="sp-chip" data-cb="tritanopia"><span class="chip-dot" style="background:#06d6a0"></span><span id="sp-cb-trit">عمى الأزرق</span></button>
            <button class="sp-chip" data-cb="achromatopsia"><span class="chip-dot" style="background:#888"></span><span id="sp-cb-achro">رمادي كامل</span></button>
          </div>
        </div>
        <div>
          <span class="sp-section-label" id="sp-lbl-font">نوع الخط</span>
          <div class="sp-chips" id="sp-font-chips">
            <button class="sp-chip active font-chip-cairo"         data-font="cairo">Cairo</button>
            <button class="sp-chip font-chip-tajawal"              data-font="tajawal">Tajawal</button>
            <button class="sp-chip font-chip-amiri"                data-font="amiri">أميري</button>
            <button class="sp-chip font-chip-noto"                 data-font="noto">نوتو كوفي</button>
            <button class="sp-chip font-chip-scheherazade"         data-font="scheherazade">شهرزاد</button>
          </div>
        </div>
        <div>
          <span class="sp-section-label" id="sp-lbl-lang">اللغة</span>
          <div class="sp-chips">
            <button class="sp-chip" data-lang="ar">🇸🇦 العربية</button>
            <button class="sp-chip" data-lang="en">🇬🇧 English</button>
          </div>
        </div>
      </div>
    </aside>`);

  $('#panel-backdrop')?.addEventListener('click',closeAll);
  $('#sp-close-btn')?.addEventListener('click',closeSettings);
  $('#sp-theme-toggle')?.addEventListener('click',()=>applyTheme(STATE.theme==='dark'?'light':'dark'));
  $('#sp-theme-toggle')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();applyTheme(STATE.theme==='dark'?'light':'dark');}});
  $$('#sp-cb-chips .sp-chip').forEach(c=>c.addEventListener('click',()=>applyCB(c.dataset.cb)));
  $$('#sp-font-chips .sp-chip').forEach(c=>c.addEventListener('click',()=>applyFont(c.dataset.font)));
  $$('[data-lang]').forEach(c=>c.addEventListener('click',()=>applyLanguage(c.dataset.lang)));

  applyTheme(STATE.theme,true);
  applyCB(STATE.cb,true);
  applyFont(STATE.font,true);
  applyLanguage(STATE.lang,true);
}

function openSettings(){$('#settings-panel')?.classList.add('open');$('#panel-backdrop')?.classList.add('open');}
function closeSettings(){$('#settings-panel')?.classList.remove('open');checkBackdrop();}

function applyTheme(mode,silent){
  saveState('theme',mode);
  document.body.classList.toggle('light-mode',mode==='light');
  const sw=$('#sp-theme-switch');if(sw)sw.classList.toggle('on',mode==='light');
  const nm=$('#sp-mode-name');if(nm)nm.textContent=mode==='light'?t('settings_light'):t('settings_dark');
  const hint=$('#sp-mode-hint');if(hint)hint.textContent=t('mode_hint');
  if(!silent)toast(mode==='dark'?'🌙 الوضع الليلي':'☀️ الوضع النهاري');
}

function applyCB(mode,silent){
  saveState('cb',mode);
  const html=document.documentElement;
  ['cb-deuteranopia','cb-protanopia','cb-tritanopia','cb-achromatopsia'].forEach(c=>html.classList.remove(c));
  if(mode!=='normal')html.classList.add('cb-'+mode);
  $$('#sp-cb-chips .sp-chip').forEach(c=>c.classList.toggle('active',c.dataset.cb===mode));
}

function applyFont(font,silent){
  saveState('font',font);
  ['font-cairo','font-tajawal','font-amiri','font-noto','font-scheherazade'].forEach(c=>document.body.classList.remove(c));
  document.body.classList.add('font-'+font);
  $$('#sp-font-chips .sp-chip').forEach(c=>c.classList.toggle('active',c.dataset.font===font));
}

function applyLanguage(lang,silent){
  saveState('lang',lang);
  const isEn=lang==='en';
  document.documentElement.lang=isEn?'en':'ar';
  document.documentElement.dir=isEn?'ltr':'rtl';
  document.body.dir=isEn?'ltr':'rtl';

  const navMap={'index.html':[isEn?'Home':'الرئيسية'],'about.html':[isEn?'About Us':'من نحن'],'video.html':[isEn?'Video':'الفيديو'],'services.html':[isEn?'Services':'الخدمات'],'packages.html':[isEn?'Packages':'الحزم'],'rooms.html':[isEn?'Rooms':'الغرف'],'grooming.html':[isEn?'Grooming':'الحلاقة'],'outdoor.html':[isEn?'Outdoor':'الخارجية'],'veterinary.html':[isEn?'Veterinary':'البيطري'],'gallery.html':[isEn?'Gallery':'المعرض'],'testimonials.html':[isEn?'Reviews':'آراء العملاء'],'faq.html':[isEn?'FAQ':'الأسئلة'],'contact.html':[isEn?'Contact':'تواصل']};
  $$('.nav-link,.nav-mobile .nav-link').forEach(link=>{const href=link.getAttribute('href');if(navMap[href])link.textContent=navMap[href][0];});
  $$('.nav-cta').forEach(el=>el.textContent=t('nav_cta'));
  $$('#btn-lang').forEach(el=>el.textContent=isEn?'ع':'EN');
  $$('.nav-logo-ar').forEach(el=>el.textContent=t('logo_sub'));

  const spMap={
    'sp-title':t('settings_title'),'sp-lbl-mode':t('settings_mode'),'sp-lbl-cb':t('settings_cb'),
    'sp-lbl-font':t('settings_font'),'sp-lbl-lang':t('settings_lang'),
    'sp-cb-normal':t('settings_cb_normal'),'sp-cb-deut':t('settings_cb_deut'),'sp-cb-prot':t('settings_cb_prot'),
    'sp-cb-trit':t('settings_cb_trit'),'sp-cb-achro':t('settings_cb_achro'),
    'sp-mode-name':STATE.theme==='light'?t('settings_light'):t('settings_dark'),'sp-mode-hint':t('mode_hint'),
    'fp-head-title':t('fav_title'),
  };
  Object.entries(spMap).forEach(([id,text])=>{const el=document.getElementById(id);if(el)el.textContent=text;});

  const fontLabels={cairo:'Cairo',tajawal:'Tajawal',amiri:isEn?'Amiri':'أميري',noto:isEn?'Noto Kufi':'نوتو كوفي',scheherazade:isEn?'Scheherazade':'شهرزاد'};
  $$('#sp-font-chips .sp-chip').forEach(c=>{if(fontLabels[c.dataset.font])c.textContent=fontLabels[c.dataset.font];});
  $$('[data-lang]').forEach(c=>c.classList.toggle('active',c.dataset.lang===lang));
  const si=document.getElementById('search-input');if(si)si.placeholder=t('search_placeholder');
  updateFavList();
  if(!silent)toast(isEn?'🇬🇧 Switched to English':'🇸🇦 تم التبديل إلى العربية');
}

function toggleLanguage(){applyLanguage(STATE.lang==='ar'?'en':'ar');}

/* ─── 22. SEARCH ────────────────────────────── */
function initSearch(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="search-overlay" id="search-overlay" role="dialog">
      <div class="search-box">
        <div class="search-input-wrap">
          <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" id="search-input" type="text" placeholder="ابحث عن خدمة أو صفحة..." autocomplete="off" spellcheck="false">
          <button class="search-close-x" id="search-close-x" aria-label="Close">✕</button>
        </div>
        <div class="search-hint-row" id="search-hints"></div>
        <div class="search-results" id="search-results" style="display:none"></div>
      </div>
    </div>`);

  const input=$('#search-input'),results=$('#search-results'),hints=$('#search-hints');
  const hintTerms=[{ar:'حلاقة',en:'Grooming'},{ar:'غرف',en:'Rooms'},{ar:'أسعار',en:'Prices'},{ar:'بيطري',en:'Vet'},{ar:'معرض',en:'Gallery'}];

  const buildHints=()=>{
    hints.innerHTML=`<span style="font-size:11px;color:var(--low)">${t('search_suggest')}</span>`+
      hintTerms.map(h=>`<span class="search-hint-chip">${STATE.lang==='en'?h.en:h.ar}</span>`).join('');
    $$('.search-hint-chip',hints).forEach(chip=>chip.addEventListener('click',()=>{input.value=chip.textContent;doSearch(chip.textContent);}));
  };
  buildHints();

  $('#search-close-x')?.addEventListener('click',closeSearch);
  $('#search-overlay')?.addEventListener('click',e=>{if(e.target===$('#search-overlay'))closeSearch();});
  input?.addEventListener('input',e=>doSearch(e.target.value.trim()));

  function doSearch(q){
    if(!q){results.style.display='none';return;}
    const lang=STATE.lang,lower=q.toLowerCase();
    const matched=SITE_DATA.filter(item=>{
      const text=((lang==='en'?item.en:item.ar)+' '+(lang==='en'?item.sub_en:item.sub_ar)).toLowerCase();
      return text.includes(lower);
    });
    if(!matched.length){results.innerHTML=`<div class="search-no-results"><span>🔍</span>${t('search_noresult')}<br><small>${t('search_noresult_hint')}</small></div>`;results.style.display='block';return;}
    const topKeys=['home','about','video','services','packages','rooms','grooming','outdoor','vet','gallery','test','faq','contact'];
    const pages=matched.filter(i=>topKeys.includes(i.key));
    const svcs=matched.filter(i=>!topKeys.includes(i.key));
    let html='';
    if(pages.length){html+=`<div class="search-section-head">${t('search_pages')}</div>`;html+=pages.map(item=>`<a class="search-result-row" href="${item.file}"><span class="srr-emoji">${item.emoji}</span><div class="srr-info"><div class="srr-title">${lang==='en'?item.en:item.ar}</div><div class="srr-sub">${lang==='en'?item.sub_en:item.sub_ar}</div></div><span class="srr-tag">${lang==='en'?item.tag_en:item.tag_ar}</span></a>`).join('');}
    if(svcs.length){html+=`<div class="search-section-head">${t('search_services')}</div>`;html+=svcs.map(item=>`<a class="search-result-row" href="${item.file}"><span class="srr-emoji">${item.emoji}</span><div class="srr-info"><div class="srr-title">${lang==='en'?item.en:item.ar}</div><div class="srr-sub">${lang==='en'?item.sub_en:item.sub_ar}</div></div><span class="srr-tag">${lang==='en'?item.tag_en:item.tag_ar}</span></a>`).join('');}
    results.innerHTML=html;results.style.display='block';
    $$('.search-result-row',results).forEach(row=>row.addEventListener('click',closeSearch));
  }
}

function openSearch(){$('#search-overlay')?.classList.add('open');setTimeout(()=>$('#search-input')?.focus(),100);}
function closeSearch(){$('#search-overlay')?.classList.remove('open');const i=$('#search-input');if(i)i.value='';const r=$('#search-results');if(r)r.style.display='none';}

/* ─── 23. FAVORITES ─────────────────────────── */
function initFavorites(){
  document.body.insertAdjacentHTML('beforeend',`
    <aside class="favorites-panel" id="fav-panel" role="dialog">
      <div class="fp-head">
        <span class="fp-head-title" id="fp-head-title">❤️ المفضلة</span>
        <button class="sp-close" id="fp-close-btn">✕</button>
      </div>
      <div class="fp-body" id="fp-body">
        <button class="fp-add-btn" id="fp-add-current">+ أضف هذه الصفحة للمفضلة</button>
        <div id="fp-list"></div>
      </div>
    </aside>`);
  $('#fp-close-btn')?.addEventListener('click',closeFavorites);
  $('#fp-add-current')?.addEventListener('click',addCurrentToFav);
  updateFavList();
}

function addCurrentToFav(){
  const path=window.location.pathname.split('/').pop()||'index.html';
  const page=SITE_DATA.find(d=>d.file===path)||{file:path,emoji:'📄',ar:document.title.replace(' — Loving Homes 🐾','').trim(),en:document.title.replace(' — Loving Homes 🐾','').trim()};
  if(STATE.favs.find(f=>f.file===page.file)){toast('⭐ '+(STATE.lang==='en'?'Already in favorites':'موجود مسبقاً في المفضلة'));return;}
  STATE.favs.push({file:page.file,emoji:page.emoji,ar:page.ar,en:page.en});
  saveState('favs',STATE.favs);updateFavList();updateFavBadge();
  toast('❤️ '+(STATE.lang==='en'?'Added to favorites':'تمت الإضافة للمفضلة'));
}

function updateFavList(){
  const list=$('#fp-list');if(!list)return;
  const addBtn=$('#fp-add-current');if(addBtn)addBtn.textContent=t('fav_add_current');
  const title=$('#fp-head-title');if(title)title.textContent=t('fav_title');
  if(!STATE.favs.length){list.innerHTML=`<div class="fav-empty"><span>🤍</span>${t('fav_empty')}<br><small>${t('fav_empty_hint')}</small></div>`;return;}
  const lang=STATE.lang;
  list.innerHTML=STATE.favs.map(f=>`<div class="fav-item"><span class="fav-icon">${f.emoji}</span><div class="fav-info"><div class="fav-name">${lang==='en'?f.en:f.ar}</div><div class="fav-url">${f.file}</div></div><div class="fav-actions"><a class="fav-go" href="${f.file}">↗</a><button class="fav-rm" data-file="${f.file}">✕</button></div></div>`).join('');
  $$('#fp-list .fav-rm').forEach(btn=>btn.addEventListener('click',()=>{STATE.favs=STATE.favs.filter(f=>f.file!==btn.dataset.file);saveState('favs',STATE.favs);updateFavList();updateFavBadge();}));
}

function updateFavBadge(){
  const badge=$('#fav-count-badge');if(!badge)return;
  badge.textContent=STATE.favs.length;badge.classList.toggle('show',STATE.favs.length>0);
}

function openFavorites(){$('#fav-panel')?.classList.add('open');$('#panel-backdrop')?.classList.add('open');}
function closeFavorites(){$('#fav-panel')?.classList.remove('open');checkBackdrop();}

function closeAll(){closeSearch();closeSettings();closeFavorites();}
function checkBackdrop(){if(!$('#settings-panel')?.classList.contains('open')&&!$('#fav-panel')?.classList.contains('open'))$('#panel-backdrop')?.classList.remove('open');}

/* ─── 24. Splash Screen ────────────────────── */
function initSplash(){
  const splash=$('#welcome-splash'),enterBtn=$('#splash-enter');
  if(!splash||!enterBtn)return;
  const isShowed=sessionStorage.getItem('lh_splash');
  if(isShowed){splash.classList.add('hidden');return;}
  document.body.style.overflow='hidden';
  enterBtn.addEventListener('click',()=>{
    splash.classList.add('hidden');document.body.style.overflow='';
    sessionStorage.setItem('lh_splash','true');
    toast('🐾 مرحباً بك في Loving Homes!');
  });
}

/* ─── Boot ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();
  injectCBFilters();
  initCursor();
  initScroll();
  initReveal();
  initCounters();
  initSpotlight();
  initTilt();
  initRipple();
  initMobileMenu();
  initAccordion();
  initTabs();
  initForms();
  setActiveNav();
  initParallax();
  initHeroTicker();
  initLightbox();
  initParticles();
  initSmoothAnchors();
  initClickSound();
  initNavTools();
  initSettingsPanel();
  initSearch();
  initFavorites();
  console.log('%c 🐾 Loving Homes HK ','background:#00e5ff;color:#070b12;padding:6px 16px;font-size:14px;font-weight:800;border-radius:6px;');
});
