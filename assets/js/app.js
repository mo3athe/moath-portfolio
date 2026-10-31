/* Moath Alnajem — portfolio.
   React + htm (no build step), Three.js network scene, Motion for React when available.
   Edit content in the T object below; edit links and files in the REAL ASSETS block. */
(function(){
"use strict";
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;
const html = htm.bind(React.createElement);

/* =============================================================
   REAL ASSETS & LINKS (edit here). Empty values hide their button.
   ============================================================= */
const CV_FILE = "assets/docs/Moath-Alnajem-CV.pdf";
const PORTRAIT = "assets/img/portrait.jpg";
const CONTACT = { email:"moathe.n@outlook.com", phone:"+966544395500", phoneDisplay:"+966 54 439 5500", linkedin:"https://www.linkedin.com/in/moathalnajem/" };
const STORES = { tag:"https://tagpluss.com/", qeraaty:"https://qeraaty1.com/" };
const STORE_SHOTS = { tag:null, qeraaty:null };   // add real store screenshots (file names) when available
const IC_SHOTS = [
  { src:"assets/img/ic-1-welcome.webp", w:569, h:1171 },
  { src:"assets/img/ic-2-role-selection.webp", w:596, h:1166 },
  { src:"assets/img/ic-3-intern-dashboard.webp", w:608, h:1285 },
  { src:"assets/img/ic-4-internship-details.webp", w:653, h:1380 },
  { src:"assets/img/ic-5-company-dashboard.webp", w:669, h:1412 },
  { src:"assets/img/ic-6-edit-profile.webp", w:619, h:1307 },
  { src:"assets/img/ic-7-settings.webp", w:625, h:1320 },
];

/* ---------- Motion for React (optional) ---------- */
const FM = window.Motion || null;
const STRIP = ["initial","animate","exit","transition","layoutId","layout","variants","whileHover","whileInView","viewport"];
const sCache = {};
const sTag = tag => sCache[tag] || (sCache[tag] = React.forwardRef((props, ref) => { const p = Object.assign({}, props); STRIP.forEach(k => delete p[k]); return React.createElement(tag, Object.assign({}, p, { ref })); }));
const motion = FM && FM.motion ? FM.motion : new Proxy({}, { get: (_, tag) => sTag(tag) });
const AnimatePresence = FM && FM.AnimatePresence ? FM.AnimatePresence : ({ children }) => children;
const MotionConfig = FM && FM.MotionConfig ? FM.MotionConfig : ({ children }) => children;
const EASE = [0.22, 1, 0.36, 1];

/* ---------- environment ---------- */
const mq = q => { try { return window.matchMedia(q).matches; } catch(e){ return false; } };
const REDUCED = mq("(prefers-reduced-motion: reduce)");
const MOBILE = mq("(max-width: 820px)") || mq("(pointer: coarse)");
const store = {
  get(k){ try { return localStorage.getItem("moath:"+k); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem("moath:"+k,v); } catch(e){} },
};
const pascal = n => n.split("-").map(s => s[0].toUpperCase()+s.slice(1)).join("");

/* one rAF-throttled scroll/resize loop shared by every scroll-linked element */
const scrollSubs = new Set();
let scrollQueued = false;
function runScroll(){ scrollQueued = false; const y = window.scrollY, vh = window.innerHeight; scrollSubs.forEach(fn => fn(y, vh)); }
function queueScroll(){ if (!scrollQueued){ scrollQueued = true; requestAnimationFrame(runScroll); } }
window.addEventListener("scroll", queueScroll, { passive:true });
window.addEventListener("resize", queueScroll);
function useScrollFrame(fn, deps){
  useEffect(() => { scrollSubs.add(fn); queueScroll(); return () => { scrollSubs.delete(fn); }; }, deps || []);
}

/* ---------- content ---------- */
const T = {
  en: {
    dir:"ltr", name:"Moath Alnajem", nameLines:["Moath","Alnajem"], skip:"Skip to content", sep:", ",
    nav:{ about:"About", journey:"Journey", work:"Work", skills:"Skills", credentials:"Certifications", contact:"Contact" },
    ui:{ menu:"Open menu", close:"Close menu", lang:"Language", copy:"Copy", copied:"Copied", cvSaved:"CV saved", cvOpen:"Download isn't available here. Tap again to open the PDF.", prev:"Previous screen", next:"Next screen", enlarge:"Enlarge", closeLb:"Close", of:"of", scroll:"Scroll", visit:"Visit website", openProfile:"Open profile" },
    hero:{
      loc:"Al Khobar, Saudi Arabia", title:"IT Support Specialist",
      quote:"Building reliable technology today. Exploring the networks and security of tomorrow.",
      work:"Explore my work", cv:"Download CV", contact:"Contact me",
      photoAlt:"Moath Alnajem, professional portrait", caption:"Moath Alnajem, Al Khobar",
    },
    about:{
      title:"About",
      text:"I keep technology working for the people who depend on it. I diagnose faults, restore service, and document every fix. Since 2022 I've supported POS systems, Microsoft 365, workstations, printers, and networks. Next, I'm building toward the networks and security that will run tomorrow.",
      facts:[["Degree","Bachelor's in Information Technology, PMU, 2025"],["Based in","Al Khobar, Saudi Arabia"],["Languages","Arabic, English"],["In IT since","April 2022"]],
    },
    journey:{
      title:"Career journey", lead:"Four IT roles since 2022, from frontline support to Microsoft 365 administration.",
      current:"Current role",
      items:[
        { key:"lamsat", role:"IT Support Specialist", org:"Lamsat Al Aziziyah Trading Establishment", place:"", when:"Present", big:"Now", now:true,
          bullets:["Support POS systems and provide day-to-day technical support.","Troubleshoot hardware and software issues.","Support network connectivity and resolve connection problems.","Manage inventory systems and organize data in Excel.","Prepare operational documentation and reports."] },
        { key:"hayat", role:"IT Support Technician", org:"Hayat Al-Madina Contracting Establishment", place:"Khobar", when:"May 2022 – Apr 2025", big:"2022–25",
          bullets:["Delivered Tier 1 support for the organization's PC and printing infrastructure, keeping workflows running.","Resolved frontline hardware and software issues to keep staff productive.","Handled routine operational tasks, including user provisioning and IT asset inventory management."] },
        { key:"se", role:"IT Intern", org:"Saudi Electricity Company (SE)", place:"Dammam", when:"Jun 2024 – Aug 2024", big:"2024",
          bullets:["Diagnosed and resolved PC and printer issues, keeping users working without interruption.","Provided direct hardware and software support to end users.","Contributed to the deployment of 100 new workstations in line with technical standards."] },
        { key:"qeraaty", role:"IT Specialist", org:"Qeraaty Library", place:"Khobar", when:"Apr 2022 – Dec 2023", big:"2022–23",
          bullets:["Streamlined IT support workflows and prioritized daily tasks, reducing resolution time and disruption.","Administered and supported the Microsoft 365 environment for team collaboration and cloud services.","Kept IT infrastructure and peripherals available through proactive monitoring and maintenance."] },
      ],
      vol:{ label:"Volunteering", role:"Volunteer", org:"King Abdulaziz Center for World Culture (Ithra)", place:"Dhahran", when:"2018 – Present" },
    },
    work:{
      title:"Selected work", lead:"A graduation app, two live online stores, and an academic programming project.",
      ic:{ kicker:"University graduation project", name:"Intern Connect",
        desc:"A mobile application designed to connect university students with internship opportunities, and to let companies manage internship postings and applications.",
        mine:"My contribution focused on UI/UX design and interface development.",
        tags:["Mobile app","UI/UX design","Interface development"], note:"Real app screens. Names and figures inside are illustrative prototype data.",
        shots:[["Welcome screen","The entry point of the app, with a single Get Started action."],["User role selection","People choose whether to join as an intern or as a company."],["Intern dashboard","Interns see upcoming interviews and filter applications by status."],["Internship details","A full posting with requirements, responsibilities, and the deadline."],["Company dashboard","Companies track postings, applications, interviews, and hires."],["Profile editing","Interns manage their skills, certifications, and languages."],["Settings","Account, notifications, appearance, and support options."]] },
      tag:{ kicker:"Salla e-commerce store", name:"Tag+", desc:"Online store for the Tag+ brand, built on the Salla platform. My work covered the store itself, not the platform:",
        did:["Store setup","Store configuration","Product categories","Visual content","Blog content"], screen:"My contributions" },
      qer:{ kicker:"E-commerce store", name:"Qeraaty", wordmark:"قراءتي", desc:"A live online store for Qeraaty, a real-world e-commerce project I worked on.", screen:"Live store" },
      java:{ kicker:"Academic programming project", name:"Java Operating Systems Simulator", desc:"A Java-based project exploring operating system concepts such as process scheduling, resource management, and memory management.",
        tags:["Java"], sched:"Process scheduling", mem:"Memory management", res:"Resource management", time:"time", free:"free", held:"held", req:"requested",
        note:"Concept visualization of the topics the project covers. It is not output from the simulator." },
    },
    skills:{
      title:"Skills", lead:"Proven skills come from my roles and certifications. Learning marks where I'm building next.",
      proven:"Proven", learning:"Learning",
      groups:[
        { icon:"server", name:"IT support and systems", items:[["Tier 1 & 2 technical support",1],["Hardware & software troubleshooting",1],["POS systems",1],["Microsoft 365 administration",1],["Windows environments",1],["IT asset inventory",1]] },
        { icon:"network", name:"Networking fundamentals", items:[["Network & system troubleshooting",1],["Network connectivity support",1],["Advanced networking",0]] },
        { icon:"shield-check", name:"Cybersecurity learning path", items:[["User provisioning",1],["Cybersecurity fundamentals",0]] },
        { icon:"code", name:"Development and databases", items:[["HTML",1],["CSS",1],["JavaScript",1],["Python",1],["Java",1],["SQL",1],["Advanced Excel",1],["Power BI & data analysis",1]] },
        { icon:"pen-tool", name:"UI/UX and design tools", items:[["Figma",1],["UI/UX design",1],["Usability & accessibility",1],["Interface development",1]] },
      ],
    },
    cred:{
      title:"Certifications", degreeLabel:"Education", degree:"Bachelor's in Information Technology", uni:"Prince Mohammad Bin Fahd University", grad:"2025",
      certs:[["ITIL 5 Foundation","PeopleCert"],["UI/UX and AI Bootcamp","Tuwaiq Academy"],["Advanced Excel Certificate","MIRAN"],["Power BI / Data Analysis Certificate","MIRAN"],["Tuwaiq Programming Challenge (Python)","Tuwaiq Academy"]],
    },
    contact:{
      title:"Let's talk.", lead:"For IT support, help desk, or technical operations roles, reach me directly.",
      email:"Email", phone:"Phone", linkedin:"LinkedIn", location:"Location", loc:"Al Khobar, Saudi Arabia", cvNote:"PDF, one page",
    },
    footer:"© 2026 Moath Alnajem", footer2:"IT Support Specialist, Al Khobar",
  },

  ar: {
    dir:"rtl", name:"معاذ الناجم", nameLines:["معاذ","الناجم"], skip:"انتقل إلى المحتوى", sep:"، ",
    nav:{ about:"نبذة", journey:"المسيرة", work:"الأعمال", skills:"المهارات", credentials:"الشهادات", contact:"تواصل" },
    ui:{ menu:"فتح القائمة", close:"إغلاق القائمة", lang:"اللغة", copy:"نسخ", copied:"تم النسخ", cvSaved:"تم حفظ السيرة الذاتية", cvOpen:"التحميل غير متاح هنا. اضغط مرة أخرى لفتح ملف PDF.", prev:"الشاشة السابقة", next:"الشاشة التالية", enlarge:"تكبير", closeLb:"إغلاق", of:"من", scroll:"مرّر", visit:"زيارة الموقع", openProfile:"فتح الملف الشخصي" },
    hero:{
      loc:"الخبر، المملكة العربية السعودية", title:"أخصائي دعم تقني",
      quote:"أبني تقنية موثوقة اليوم، وأستكشف شبكات الغد وأمنه.",
      work:"استكشف أعمالي", cv:"تحميل السيرة الذاتية", contact:"تواصل معي",
      photoAlt:"معاذ الناجم، صورة مهنية", caption:"معاذ الناجم، الخبر",
    },
    about:{
      title:"نبذة",
      text:"أحرص على أن تعمل التقنية بكفاءة لمن يعتمدون عليها. أشخّص الأعطال، وأعيد الخدمة، وأوثّق كل حل. منذ 2022 دعمت أنظمة نقاط البيع وMicrosoft 365 ومحطات العمل والطابعات والشبكات. وخطوتي التالية هي التعمق في الشبكات والأمن اللذين سيقودان الغد.",
      facts:[["المؤهل","بكالوريوس تقنية المعلومات، جامعة الأمير محمد بن فهد، 2025"],["المقر","الخبر، المملكة العربية السعودية"],["اللغات","العربية، الإنجليزية"],["في تقنية المعلومات منذ","أبريل 2022"]],
    },
    journey:{
      title:"المسيرة المهنية", lead:"أربع وظائف في تقنية المعلومات منذ 2022، من الدعم المباشر إلى إدارة Microsoft 365.",
      current:"الوظيفة الحالية",
      items:[
        { key:"lamsat", role:"أخصائي دعم تقني", org:"مؤسسة لمسات العزيزية التجارية", place:"", when:"حاليًا", big:"الآن", now:true,
          bullets:["دعم أنظمة نقاط البيع وتقديم الدعم الفني اليومي.","استكشاف أعطال الأجهزة والبرمجيات وإصلاحها.","دعم الاتصال بالشبكة وحل مشكلاته.","إدارة أنظمة المخزون وتنظيم البيانات باستخدام Excel.","إعداد التوثيق التشغيلي والتقارير."] },
        { key:"hayat", role:"فني دعم تقني", org:"مؤسسة حياة المدينة للمقاولات", place:"الخبر", when:"مايو 2022 – أبريل 2025", big:"2022–25",
          bullets:["تقديم دعم المستوى الأول لأجهزة الحاسب والطباعة في المؤسسة لضمان استمرارية سير العمل.","حل مشكلات الأجهزة والبرمجيات للموظفين للحفاظ على إنتاجيتهم.","تنفيذ المهام التشغيلية الدورية، ومنها تهيئة حسابات المستخدمين وإدارة جرد الأصول التقنية."] },
        { key:"se", role:"متدرب تقنية معلومات", org:"الشركة السعودية للكهرباء (SE)", place:"الدمام", when:"يونيو 2024 – أغسطس 2024", big:"2024",
          bullets:["تشخيص أعطال أجهزة الحاسب والطابعات وحلها لضمان استمرار عمل المستخدمين.","تقديم الدعم المباشر للمستخدمين في الأجهزة والبرمجيات.","المساهمة في تجهيز 100 محطة عمل جديدة وفق المعايير التقنية."] },
        { key:"qeraaty", role:"أخصائي تقنية معلومات", org:"مكتبة قراءتي", place:"الخبر", when:"أبريل 2022 – ديسمبر 2023", big:"2022–23",
          bullets:["تحسين سير عمل الدعم التقني وترتيب أولويات المهام اليومية، مما قلّل وقت الحل والتأثير على العمليات.","إدارة بيئة Microsoft 365 ودعمها لتعزيز التعاون بين الفريق واستقرار الخدمات السحابية.","الحفاظ على جاهزية البنية التقنية والأجهزة الملحقة عبر المراقبة والصيانة الاستباقية."] },
      ],
      vol:{ label:"العمل التطوعي", role:"متطوع", org:"مركز الملك عبدالعزيز الثقافي العالمي (إثراء)", place:"الظهران", when:"2018 – حتى الآن" },
    },
    work:{
      title:"أعمال مختارة", lead:"تطبيق مشروع التخرج، ومتجران إلكترونيان قائمان، ومشروع برمجي أكاديمي.",
      ic:{ kicker:"مشروع التخرج الجامعي", name:"Intern Connect",
        desc:"تطبيق جوال يهدف إلى ربط طلاب الجامعات بفرص التدريب، ويتيح للشركات إدارة إعلانات التدريب والطلبات المقدمة عليها.",
        mine:"تركّزت مساهمتي على تصميم UI/UX وتطوير الواجهات.",
        tags:["تطبيق جوال","تصميم UI/UX","تطوير الواجهات"], note:"شاشات حقيقية من التطبيق، والأسماء والأرقام فيها بيانات توضيحية للنموذج الأولي.",
        shots:[["شاشة الترحيب","نقطة البداية في التطبيق مع زر واحد للبدء."],["اختيار نوع المستخدم","يختار المستخدم الانضمام كمتدرب أو كشركة."],["لوحة المتدرب","يتابع المتدرب المقابلات القادمة ويصفّي طلباته حسب الحالة."],["تفاصيل فرصة التدريب","عرض كامل للفرصة يشمل المتطلبات والمسؤوليات وموعد التقديم."],["لوحة الشركة","تتابع الشركة الفرص والطلبات والمقابلات والتعيينات."],["تعديل الملف الشخصي","يدير المتدرب مهاراته وشهاداته ولغاته."],["الإعدادات","خيارات الحساب والإشعارات والمظهر والدعم."]] },
      tag:{ kicker:"متجر إلكتروني على منصة سلة", name:"Tag+", desc:"متجر إلكتروني لعلامة Tag+ مبني على منصة سلة. شمل عملي المتجر نفسه، وليس المنصة:",
        did:["إعداد المتجر","تهيئة المتجر","تصنيفات المنتجات","المحتوى المرئي","محتوى المدونة"], screen:"مساهماتي" },
      qer:{ kicker:"متجر إلكتروني", name:"قراءتي", wordmark:"قراءتي", desc:"متجر إلكتروني قائم لقراءتي، وهو مشروع تجارة إلكترونية فعلي شاركت فيه.", screen:"متجر قائم" },
      java:{ kicker:"مشروع برمجي أكاديمي", name:"محاكي أنظمة التشغيل بلغة Java", desc:"مشروع بلغة Java يستكشف مفاهيم أنظمة التشغيل مثل جدولة العمليات وإدارة الموارد وإدارة الذاكرة.",
        tags:["Java"], sched:"جدولة العمليات", mem:"إدارة الذاكرة", res:"إدارة الموارد", time:"الزمن", free:"متاح", held:"محجوز", req:"مطلوب",
        note:"تصوير توضيحي للمفاهيم التي يغطيها المشروع، وليس مخرجات من المحاكي نفسه." },
    },
    skills:{
      title:"المهارات", lead:"المهارات المثبتة مصدرها وظائفي وشهاداتي، وعلامة «أتعلّمها» توضح ما أعمل على تطويره حاليًا.",
      proven:"مثبتة", learning:"أتعلّمها",
      groups:[
        { icon:"server", name:"الدعم التقني والأنظمة", items:[["الدعم الفني من المستويين الأول والثاني",1],["استكشاف أعطال الأجهزة والبرمجيات",1],["أنظمة نقاط البيع",1],["إدارة Microsoft 365",1],["بيئات Windows",1],["جرد الأصول التقنية",1]] },
        { icon:"network", name:"أساسيات الشبكات", items:[["استكشاف أعطال الشبكات والأنظمة",1],["دعم الاتصال بالشبكة",1],["الشبكات المتقدمة",0]] },
        { icon:"shield-check", name:"مسار تعلّم الأمن السيبراني", items:[["تهيئة حسابات المستخدمين",1],["أساسيات الأمن السيبراني",0]] },
        { icon:"code", name:"البرمجة وقواعد البيانات", items:[["HTML",1],["CSS",1],["JavaScript",1],["Python",1],["Java",1],["SQL",1],["Excel المتقدم",1],["Power BI وتحليل البيانات",1]] },
        { icon:"pen-tool", name:"تصميم UI/UX وأدواته", items:[["Figma",1],["تصميم UI/UX",1],["قابلية الاستخدام وإمكانية الوصول",1],["تطوير الواجهات",1]] },
      ],
    },
    cred:{
      title:"الشهادات", degreeLabel:"التعليم", degree:"بكالوريوس تقنية المعلومات", uni:"جامعة الأمير محمد بن فهد", grad:"2025",
      certs:[["شهادة ITIL 5 Foundation","PeopleCert"],["معسكر UI/UX والذكاء الاصطناعي","أكاديمية طويق"],["شهادة Excel المتقدم","MIRAN"],["شهادة Power BI وتحليل البيانات","MIRAN"],["تحدي طويق البرمجي (Python)","أكاديمية طويق"]],
    },
    contact:{
      title:"لنتحدث.", lead:"للتواصل بخصوص وظائف الدعم التقني أو مكتب المساعدة أو العمليات التقنية.",
      email:"البريد الإلكتروني", phone:"الجوال", linkedin:"لينكدإن", location:"الموقع", loc:"الخبر، المملكة العربية السعودية", cvNote:"ملف PDF، صفحة واحدة",
    },
    footer:"© 2026 معاذ الناجم", footer2:"أخصائي دعم تقني، الخبر",
  },
};
const NAV = ["about","journey","work","skills","credentials","contact"];

/* ---------- small components ---------- */
function Icon({ name, fallback, size=18, sw=1.6, className="" }){
  const lib = window.lucide ? (window.lucide.icons || window.lucide) : null;
  const node = lib && (lib[pascal(name)] || (fallback && lib[pascal(fallback)]));
  if (!node) return html`<span aria-hidden="true" style=${{ display:"inline-block", width:size, height:size }}></span>`;
  const kids = (Array.isArray(node) && node[0] === "svg") ? (node[2] || []) : node;
  return React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:sw, strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":"true", focusable:"false", className },
    kids.map((k, i) => React.createElement(k[0], Object.assign({}, k[1], { key:i }))));
}

/* reveal on enter: content is visible by default; hidden only once JS confirms it can reveal it */
function Rv({ as="div", className="", delay=0, children, ...rest }){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || REDUCED || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add("rv-wait");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting){ el.classList.add("rv-in"); io.disconnect(); } }, { rootMargin:"0px 0px -10% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return React.createElement(as, Object.assign({ ref, className:"rv " + className, style:{ "--d": delay + "s" } }, rest), children);
}

let toastTimer = 0;
function useToast(){
  const [msg, setMsg] = useState(null);
  const show = useCallback(m => { setMsg(m); clearTimeout(toastTimer); toastTimer = setTimeout(() => setMsg(null), 2600); }, []);
  return [msg, show];
}
function useDownloads(){
  const [dl, setDl] = useState(null);
  useEffect(() => { let on = true; try { const c = window.claude; if (c && c.use) c.use("downloads").then(d => { if (on) setDl(d); }, () => {}); } catch(e){} return () => { on = false; }; }, []);
  return dl;
}
let cvFallback = false;
const IN_CLAUDE = !!(window.claude && window.claude.use);   /* true only inside a Claude artifact */
function CVButton({ t, dl, toast, className="btn btn-ghost" }){
  const onClick = async e => {
    if (!dl || cvFallback) return;
    e.preventDefault();
    try {
      const r = await fetch(CV_FILE); if (!r.ok) throw { code:"unavailable" };
      await dl.save({ filename:"Moath-Alnajem-CV.pdf", data: await r.blob() }); toast(t.ui.cvSaved);
    } catch(err){ if (!err || err.code !== "declined"){ cvFallback = true; toast(t.ui.cvOpen); } }
  };
  return html`<a href=${CV_FILE} target="_blank" rel="noopener" type="application/pdf" download=${IN_CLAUDE ? undefined : "Moath-Alnajem-CV.pdf"} className=${className} onClick=${onClick}><${Icon} name="download" size=${17} />${t.hero.cv}</a>`;
}
async function copyText(text, el){
  try { await navigator.clipboard.writeText(text); return true; }
  catch(e){ try { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch(_){} return false; }
}

/* =============================================================
   THREE.JS NETWORK — one persistent scene; camera follows the story
   ============================================================= */
function glowTexture(){
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), r = g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,"rgba(255,255,255,1)"); r.addColorStop(.22,"rgba(255,255,255,.85)"); r.addColorStop(.5,"rgba(255,255,255,.18)"); r.addColorStop(1,"rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0,0,64,64);
  const t = new THREE.CanvasTexture(c); return t;
}
function seeded(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function createNetwork(canvas){
  if (!window.THREE) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, alpha:true, powerPreference:"high-performance" }); }
  catch(e){ return null; }
  if (!renderer || !renderer.getContext()) return null;
  const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.5);
  renderer.setPixelRatio(DPR); renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050816, MOBILE ? 0.02 : 0.016);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  const rnd = seeded(20220401);
  const VIOLET = new THREE.Color("#8B5CF6"), CYAN = new THREE.Color("#22D3EE"), SILVER = new THREE.Color("#C9D2EA");
  const tex = glowTexture();
  const disposables = [tex];
  const world = new THREE.Group(); scene.add(world);

  /* nodes */
  const N = MOBILE ? 64 : 150;
  const pts = [];
  for (let i = 0; i < N; i++){
    const u = rnd(), v = rnd(), w = rnd();
    pts.push(new THREE.Vector3((u - .5) * 92, (v - .5) * 46 + Math.sin(u * 6.28) * 4, (w - .65) * 64));
  }
  const colorAt = p => VIOLET.clone().lerp(CYAN, Math.min(1, Math.max(0, (p.x + 46) / 92)));
  const nodeGeo = new THREE.BufferGeometry();
  const nPos = new Float32Array(N * 3), nCol = new Float32Array(N * 3);
  pts.forEach((p, i) => { nPos.set([p.x, p.y, p.z], i * 3); const c = colorAt(p); nCol.set([c.r, c.g, c.b], i * 3); });
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
  nodeGeo.setAttribute("color", new THREE.BufferAttribute(nCol, 3));
  const nodeMat = new THREE.PointsMaterial({ size: MOBILE ? 1.5 : 1.25, map: tex, vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true, opacity:.95 });
  world.add(new THREE.Points(nodeGeo, nodeMat)); disposables.push(nodeGeo, nodeMat);

  /* edges: each node to its 3 nearest neighbours */
  const edges = [], adj = pts.map(() => []), seen = new Set();
  pts.forEach((p, i) => {
    const near = pts.map((q, j) => [j, p.distanceToSquared(q)]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 3);
    near.forEach(([j, d]) => { const k = i < j ? i + "-" + j : j + "-" + i; if (seen.has(k) || d > 22 * 22) return; seen.add(k); edges.push([i, j]); adj[i].push(j); adj[j].push(i); });
  });
  const lGeo = new THREE.BufferGeometry();
  const lPos = new Float32Array(edges.length * 6), lCol = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => { const A = pts[a], B = pts[b], ca = colorAt(A), cb = colorAt(B); lPos.set([A.x,A.y,A.z,B.x,B.y,B.z], k * 6); lCol.set([ca.r,ca.g,ca.b,cb.r,cb.g,cb.b], k * 6); });
  lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3)); lGeo.setAttribute("color", new THREE.BufferAttribute(lCol, 3));
  const lMat = new THREE.LineBasicMaterial({ vertexColors:true, transparent:true, opacity:.2, depthWrite:false, blending:THREE.AdditiveBlending });
  world.add(new THREE.LineSegments(lGeo, lMat)); disposables.push(lGeo, lMat);

  /* the journey: a brighter path through the network, left (past) to right (future) */
  const milestones = [];
  for (let k = 0; k < 7; k++){
    const t = k / 6, target = new THREE.Vector3(-38 + 76 * t, Math.sin(t * Math.PI) * 7 - 3, -26 + 30 * t);
    let best = 0, bd = Infinity; pts.forEach((p, i) => { const d = p.distanceToSquared(target); if (d < bd && !milestones.includes(i)){ bd = d; best = i; } });
    milestones.push(best);
  }
  const curve = new THREE.CatmullRomCurve3(milestones.map(i => pts[i]));
  const cPts = curve.getPoints(220);
  const pGeo = new THREE.BufferGeometry().setFromPoints(cPts);
  const pMat = new THREE.LineBasicMaterial({ color:CYAN, transparent:true, opacity:.55, depthWrite:false, blending:THREE.AdditiveBlending });
  world.add(new THREE.Line(pGeo, pMat)); disposables.push(pGeo, pMat);
  const hGeo = new THREE.BufferGeometry(); const hPos = new Float32Array(milestones.length * 3);
  milestones.forEach((i, k) => hPos.set([pts[i].x, pts[i].y, pts[i].z], k * 3));
  hGeo.setAttribute("position", new THREE.BufferAttribute(hPos, 3));
  const hMat = new THREE.PointsMaterial({ size: MOBILE ? 4.2 : 3.6, map:tex, color:CYAN, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending });
  world.add(new THREE.Points(hGeo, hMat)); disposables.push(hGeo, hMat);

  /* signals travelling along edges and along the journey */
  const S = MOBILE ? 16 : 46, J = MOBILE ? 3 : 5;
  const sig = []; for (let i = 0; i < S; i++){ const e = edges[Math.floor(rnd() * edges.length)]; sig.push({ a:e[0], b:e[1], t:rnd(), v:.25 + rnd() * .45 }); }
  const jr = []; for (let i = 0; i < J; i++) jr.push({ t: i / J, v: .035 + rnd() * .015 });
  const sGeo = new THREE.BufferGeometry(); const sPos = new Float32Array((S + J) * 3), sCol = new Float32Array((S + J) * 3);
  for (let i = 0; i < S + J; i++){ const c = i < S ? SILVER : CYAN; sCol.set([c.r, c.g, c.b], i * 3); }
  sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3)); sGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
  const sMat = new THREE.PointsMaterial({ size: MOBILE ? 1.9 : 1.6, map:tex, vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending });
  world.add(new THREE.Points(sGeo, sMat)); disposables.push(sGeo, sMat);

  /* atmospheric dust */
  const D = MOBILE ? 160 : 520;
  const dGeo = new THREE.BufferGeometry(); const dPos = new Float32Array(D * 3);
  for (let i = 0; i < D; i++) dPos.set([(rnd() - .5) * 220, (rnd() - .5) * 120, (rnd() - .7) * 160], i * 3);
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dMat = new THREE.PointsMaterial({ size:.45, map:tex, color:SILVER, transparent:true, opacity:.5, depthWrite:false, blending:THREE.AdditiveBlending });
  const dust = new THREE.Points(dGeo, dMat); scene.add(dust); disposables.push(dGeo, dMat);

  /* camera story: one keyframe per section anchor */
  const KEYS = [
    { id:"top",         pos:[-14, 2, 40], look:[-12, 0, 0], tint:0 },
    { id:"about",       pos:[  0, 9, 30], look:[ 0, -2, -6], tint:.15 },
    { id:"journey",     pos:[-22, -2, 26], look:[-6, 0, -10], tint:.3 },
    { id:"work",        pos:[ 18, -6, 30], look:[ 6, 0, -12], tint:.55 },
    { id:"skills",      pos:[ -4, 14, 24], look:[ 0, 0, -16], tint:.75 },
    { id:"credentials", pos:[ 10, 4, 20], look:[ 2, 0, -18], tint:.85 },
    { id:"contact",     pos:[ 2, 0, 10], look:[ 4, 0, -24], tint:1 },
  ];
  let anchors = [];
  const measure = () => {
    anchors = KEYS.map(k => { const el = document.getElementById(k.id); return el ? el.getBoundingClientRect().top + window.scrollY : null; });
  };
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const target = { pos:V(KEYS[0].pos), look:V(KEYS[0].look), tint:0 };
  const cur = { pos:V(KEYS[0].pos).add(new THREE.Vector3(0, 0, REDUCED ? 0 : 46)), look:V(KEYS[0].look), tint:0 };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
  const smooth = x => x * x * (3 - 2 * x);
  const computeTarget = () => {
    const y = window.scrollY + window.innerHeight * .4;
    let i = 0; while (i < KEYS.length - 1 && anchors[i + 1] != null && y >= anchors[i + 1]) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const y0 = anchors[i] || 0, y1 = anchors[i + 1] != null ? anchors[i + 1] : y0 + 1;
    const f = b === a ? 0 : smooth(Math.min(1, Math.max(0, (y - y0) / Math.max(1, y1 - y0))));
    target.pos.copy(tmpA.set(...a.pos).lerp(tmpB.set(...b.pos), f));
    target.look.copy(tmpA.set(...a.look).lerp(tmpB.set(...b.look), f));
    target.tint = a.tint + (b.tint - a.tint) * f;
  };

  const pointer = { x:0, y:0, tx:0, ty:0 };
  const onPointer = e => { pointer.tx = (e.clientX / window.innerWidth - .5) * 2; pointer.ty = (e.clientY / window.innerHeight - .5) * 2; };
  if (!MOBILE) window.addEventListener("pointermove", onPointer, { passive:true });

  let w = 0, h = 0;
  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 700 ? 68 : 55; camera.updateProjectionMatrix(); measure(); computeTarget();
  };
  const lineCol = new THREE.Color();
  const frame = (dt, time) => {
    const k = REDUCED ? 1 : 1 - Math.exp(-dt * 2.2);
    cur.pos.lerp(target.pos, k); cur.look.lerp(target.look, k); cur.tint += (target.tint - cur.tint) * k;
    pointer.x += (pointer.tx - pointer.x) * (REDUCED ? 1 : 1 - Math.exp(-dt * 3)); pointer.y += (pointer.ty - pointer.y) * (REDUCED ? 1 : 1 - Math.exp(-dt * 3));
    const drift = REDUCED ? 0 : Math.sin(time * .00012) * 1.6;
    camera.position.set(cur.pos.x + pointer.x * 3.2 + drift, cur.pos.y - pointer.y * 2.2, cur.pos.z);
    camera.lookAt(cur.look.x + pointer.x * 1.2, cur.look.y - pointer.y * .8, cur.look.z);
    lineCol.copy(VIOLET).lerp(CYAN, cur.tint); hMat.color.copy(CYAN).lerp(VIOLET, 1 - Math.min(1, cur.tint + .5));
    lMat.opacity = .16 + cur.tint * .1; pMat.opacity = .42 + cur.tint * .3;
    if (!REDUCED){
      world.rotation.y = Math.sin(time * .00005) * .08; dust.rotation.y += dt * .006;
      for (let i = 0; i < S; i++){
        const s = sig[i]; s.t += s.v * dt;
        if (s.t >= 1){ const nb = adj[s.b]; const nx = nb.length ? nb[Math.floor(Math.random() * nb.length)] : s.a; s.a = s.b; s.b = nx; s.t = 0; }
        const A = pts[s.a], B = pts[s.b]; sPos[i*3] = A.x + (B.x - A.x) * s.t; sPos[i*3+1] = A.y + (B.y - A.y) * s.t; sPos[i*3+2] = A.z + (B.z - A.z) * s.t;
      }
      for (let j = 0; j < J; j++){ const r = jr[j]; r.t = (r.t + r.v * dt) % 1; const p = curve.getPointAt(r.t); sPos.set([p.x, p.y, p.z], (S + j) * 3); }
      sGeo.attributes.position.needsUpdate = true;
    } else if (!frame.placed){
      frame.placed = true;
      for (let i = 0; i < S; i++){ const s = sig[i], A = pts[s.a], B = pts[s.b]; sPos.set([A.x + (B.x - A.x) * s.t, A.y + (B.y - A.y) * s.t, A.z + (B.z - A.z) * s.t], i * 3); }
      for (let j = 0; j < J; j++){ const p = curve.getPointAt(jr[j].t); sPos.set([p.x, p.y, p.z], (S + j) * 3); }
      sGeo.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
  };

  let raf = 0, last = 0, running = false, alive = true;
  const loop = now => { if (!running) return; const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; frame(dt, now); raf = requestAnimationFrame(loop); };
  const start = () => { if (REDUCED || running || document.hidden || !alive) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const onScroll = () => { computeTarget(); if (REDUCED) frame(0, 0); };
  const onVis = () => document.hidden ? stop() : start();
  resize(); onScroll(); frame(0, 0); start();
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", onScroll, { passive:true });
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(() => { measure(); computeTarget(); if (REDUCED) frame(0,0); }); ro.observe(document.body);

  return {
    remeasure(){ measure(); computeTarget(); if (REDUCED) frame(0,0); },
    dispose(){
      alive = false; stop(); ro.disconnect();
      window.removeEventListener("resize", resize); window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer); document.removeEventListener("visibilitychange", onVis);
      disposables.forEach(d => d.dispose && d.dispose()); renderer.dispose();
    },
  };
}

function Backdrop({ lang }){
  const ref = useRef(null), api = useRef(null);
  const [gl, setGl] = useState(true);
  useEffect(() => {
    const net = createNetwork(ref.current);
    if (!net){ setGl(false); return; }
    api.current = net; document.documentElement.classList.add("gl-on");
    return () => { net.dispose(); api.current = null; };
  }, []);
  useEffect(() => { const id = setTimeout(() => api.current && api.current.remeasure(), 120); return () => clearTimeout(id); }, [lang]);
  return html`
    <div className="backdrop" aria-hidden="true">
      ${gl ? html`<canvas ref=${ref} className="gl"></canvas>` : html`<div className="static-net"></div>`}
      <div className="atmos"></div>
      <div className="grain"></div>
    </div>`;
}

/* ---------- header ---------- */
function Header({ t, lang, setLang, active }){
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const barRef = useRef(null);
  useScrollFrame((y, vh) => {
    setSolid(y > 24);
    const max = document.documentElement.scrollHeight - vh;
    if (barRef.current) barRef.current.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  });
  useEffect(() => {
    const k = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const other = lang === "en" ? "ar" : "en";
  return html`
    <header className=${"hdr" + (solid || open ? " solid" : "")}>
      <div className="wrap hdr-in">
        <a href="#top" className="brand" aria-label=${t.name} onClick=${() => setOpen(false)}>
          <span className="mark" aria-hidden="true"><i></i></span>
          <span className="brand-name">${t.name}</span>
        </a>
        <nav className="nav" aria-label=${lang === "ar" ? "القائمة الرئيسية" : "Primary"}>
          ${NAV.map(id => html`
            <a key=${id} href=${"#" + id} className=${active === id ? "on" : ""} aria-current=${active === id ? "true" : undefined}>
              ${t.nav[id]}
              ${active === id && html`<${motion.span} layoutId="navline" className="nav-line" transition=${{ type:"spring", stiffness:420, damping:36 }} />`}
            </a>`)}
        </nav>
        <div className="hdr-act">
          <button type="button" className="lang" onClick=${() => setLang(other)} lang=${other} aria-label=${other === "ar" ? "التبديل إلى العربية" : "Switch to English"}>
            ${other === "ar" ? html`<span className="ar-g">عربي</span>` : "EN"}
          </button>
          <button type="button" className="burger" onClick=${() => setOpen(o => !o)} aria-expanded=${open} aria-controls="menu" aria-label=${open ? t.ui.close : t.ui.menu}>
            <span className=${open ? "x" : ""}><i></i><i></i></span>
          </button>
        </div>
      </div>
      <span className="progress" ref=${barRef} aria-hidden="true"></span>
      <${AnimatePresence}>
        ${open && html`
          <${motion.div} key="menu" id="menu" className="menu" initial=${{ opacity:0 }} animate=${{ opacity:1 }} exit=${{ opacity:0 }} transition=${{ duration:.3 }}>
            <nav className="wrap menu-in" aria-label=${lang === "ar" ? "قائمة الجوال" : "Mobile"}>
              ${NAV.map((id, i) => html`
                <${motion.a} key=${id} href=${"#" + id} onClick=${() => setOpen(false)} className=${active === id ? "on" : ""}
                  initial=${{ opacity:0, y:18 }} animate=${{ opacity:1, y:0 }} transition=${{ delay:.04 * i + .05, duration:.45, ease:EASE }}>
                  ${t.nav[id]}
                </${motion.a}>`)}
            </nav>
          </${motion.div}>`}
      </${AnimatePresence}>
    </header>`;
}

/* ---------- hero ---------- */
function NameReveal({ t, lang }){
  const lines = t.nameLines;
  return html`
    <h1 className=${"name" + (lang === "ar" ? " ar" : "")} aria-label=${t.name}>
      ${lines.map((ln, li) => html`
        <span key=${li} className="name-line" aria-hidden="true">
          ${lang === "ar"
            ? html`<span className="ch" style=${{ "--i": li * 3 }}>${ln}</span>`
            : Array.from(ln).map((c, ci) => html`<span key=${ci} className="ch" style=${{ "--i": li * 5 + ci }}>${c}</span>`)}
        </span>`)}
    </h1>`;
}

function Portrait({ t }){
  const ref = useRef(null);
  const onMove = e => {
    if (REDUCED || MOBILE) return;
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    ref.current.style.setProperty("--ry", (x * 10).toFixed(2) + "deg"); ref.current.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    ref.current.style.setProperty("--mx", ((x + .5) * 100).toFixed(1) + "%"); ref.current.style.setProperty("--my", ((y + .5) * 100).toFixed(1) + "%");
  };
  const onLeave = () => { const s = ref.current.style; s.setProperty("--ry", "0deg"); s.setProperty("--rx", "0deg"); };
  return html`
    <figure className="portrait" ref=${ref} onPointerMove=${onMove} onPointerLeave=${onLeave}>
      <div className="p-card">
        <img src=${PORTRAIT} alt=${t.hero.photoAlt} width="960" height="1200" fetchpriority="high" decoding="async" />
        <span className="p-sheen" aria-hidden="true"></span>
        <span className="vf tl" aria-hidden="true"></span><span className="vf tr" aria-hidden="true"></span>
        <span className="vf bl" aria-hidden="true"></span><span className="vf br" aria-hidden="true"></span>
      </div>
      <figcaption>${t.hero.caption}</figcaption>
    </figure>`;
}

function Hero({ t, lang, dl, toast }){
  const h = t.hero;
  return html`
    <section id="top" className="hero" aria-labelledby="hero-name">
      <div className="wrap hero-grid" key=${lang}>
        <div className="hero-text">
          <p className="loc in-1"><${Icon} name="map-pin" size=${14} />${h.loc}</p>
          <div id="hero-name"><${NameReveal} t=${t} lang=${lang} /></div>
          <p className="role in-2">${h.title}</p>
          <p className="quote in-3"><q>${h.quote}</q></p>
          <div className="cta in-4">
            <a href="#work" className="btn btn-primary">${h.work}<${Icon} name="arrow-down" size=${17} /></a>
            <${CVButton} t=${t} dl=${dl} toast=${toast} />
            <a href="#contact" className="btn btn-ghost">${h.contact}</a>
          </div>
        </div>
        <div className="hero-visual in-p"><${Portrait} t=${t} /></div>
      </div>
      <a href="#about" className="cue in-4" aria-label=${t.ui.scroll}><span>${t.ui.scroll}</span><i aria-hidden="true"></i></a>
    </section>`;
}

/* ---------- about: words light up as you read ---------- */
function About({ t }){
  const a = t.about;
  const ref = useRef(null);
  const words = useMemo(() => a.text.split(/\s+/), [a.text]);
  useScrollFrame((y, vh) => {
    const el = ref.current; if (!el) return;
    if (REDUCED){ el.style.setProperty("--p", 1); return; }
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    el.style.setProperty("--p", p.toFixed(3));
  }, [a.text]);
  return html`
    <section id="about" className="sec" aria-labelledby="about-h">
      <div className="wrap">
        <h2 id="about-h" className="eyeline"><span>${a.title}</span></h2>
        <p className="statement" ref=${ref} style=${{ "--n": words.length }}>
          ${words.map((w, i) => html`<span key=${i} className="wd" style=${{ "--i": i }}>${w} </span>`)}
        </p>
        <${Rv} as="dl" className="facts">
          ${a.facts.map(([k, v]) => html`<div key=${k}><dt>${k}</dt><dd>${v}</dd></div>`)}
        </${Rv}>
      </div>
    </section>`;
}

/* ---------- career journey ---------- */
function Journey({ t }){
  const j = t.journey;
  const [act, setAct] = useState(0);
  const listRef = useRef(null), fillRef = useRef(null);
  useScrollFrame((y, vh) => {
    const list = listRef.current; if (!list) return;
    const r = list.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * .45 - r.top) / r.height));
    if (fillRef.current) fillRef.current.style.transform = "scaleY(" + (REDUCED ? 1 : p) + ")";
    const items = list.querySelectorAll(".role");
    let best = 0;
    items.forEach((el, i) => { if (el.getBoundingClientRect().top < vh * .5) best = i; });
    setAct(best);
  });
  const cur = j.items[act];
  return html`
    <section id="journey" className="sec" aria-labelledby="journey-h">
      <div className="wrap">
        <${Rv} className="sec-head">
          <h2 id="journey-h" className="h2">${j.title}</h2>
          <p className="lead">${j.lead}</p>
        </${Rv}>
        <div className="journey">
          <aside className="j-side" aria-hidden="true">
            <div className="j-sticky">
              <${AnimatePresence} mode="wait" initial=${false}>
                <${motion.div} key=${cur.key} initial=${{ opacity:0, y:14 }} animate=${{ opacity:1, y:0 }} exit=${{ opacity:0, y:-14 }} transition=${{ duration:.35, ease:EASE }}>
                  <p className="j-big">${cur.big}</p>
                  <p className="j-org">${cur.org}</p>
                </${motion.div}>
              </${AnimatePresence}>
              <p className="j-count"><span>${String(act + 1).padStart(2, "0")}</span> / ${String(j.items.length).padStart(2, "0")}</p>
            </div>
          </aside>
          <ol className="j-list" ref=${listRef}>
            <span className="j-rail" aria-hidden="true"><span ref=${fillRef}></span></span>
            ${j.items.map((it, i) => html`
              <li key=${it.key} className=${"role" + (i === act ? " on" : "")}>
                <span className="j-dot" aria-hidden="true"></span>
                <p className="j-when">${it.when}${it.now && html` <span className="now">${j.current}</span>`}</p>
                <h3 className="j-role">${it.role}</h3>
                <p className="j-at">${it.org}${it.place && html`<span>${t.sep}${it.place}</span>`}</p>
                <ul className="j-bul">${it.bullets.map(b => html`<li key=${b}>${b}</li>`)}</ul>
              </li>`)}
          </ol>
        </div>
        <${Rv} className="vol">
          <${Icon} name="heart-handshake" fallback="heart" size=${20} />
          <p><span className="vol-l">${j.vol.label}</span><strong>${j.vol.role}</strong>${t.sep}${j.vol.org}${t.sep}${j.vol.place}</p>
          <span className="vol-w">${j.vol.when}</span>
        </${Rv}>
      </div>
    </section>`;
}

/* ---------- Intern Connect: 3D device coverflow ---------- */
function useSwipe(onPrev, onNext, rtl){
  const s = useRef(null);
  return {
    onPointerDown: e => { s.current = { x:e.clientX, y:e.clientY }; },
    onPointerUp: e => {
      if (!s.current) return; const dx = e.clientX - s.current.x, dy = e.clientY - s.current.y; s.current = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){ e.preventDefault(); const fwd = rtl ? dx > 0 : dx < 0; fwd ? onNext() : onPrev(); window.__swiped = Date.now(); }
    },
    onPointerCancel: () => { s.current = null; },
  };
}

function Lightbox({ idx, setIdx, onClose, caps, t, rtl }){
  const total = IC_SHOTS.length;
  const prev = () => setIdx(i => (i - 1 + total) % total), next = () => setIdx(i => (i + 1) % total);
  const closeRef = useRef(null);
  useEffect(() => {
    const last = document.activeElement; if (closeRef.current) closeRef.current.focus();
    const k = e => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") (rtl ? prev : next)(); if (e.key === "ArrowLeft") (rtl ? next : prev)(); };
    window.addEventListener("keydown", k); const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = o; if (last && last.focus) last.focus(); };
  }, []);
  const sw = useSwipe(prev, next, rtl);
  const s = IC_SHOTS[idx];
  return html`
    <${motion.div} className="lb" role="dialog" aria-modal="true" aria-label=${caps[idx][0]} initial=${{ opacity:0 }} animate=${{ opacity:1 }} exit=${{ opacity:0 }} transition=${{ duration:.25 }}>
      <div className="lb-top">
        <span className="tnum">${idx + 1} ${t.ui.of} ${total}</span>
        <button ref=${closeRef} type="button" className="round" onClick=${onClose} aria-label=${t.ui.closeLb}><${Icon} name="x" size=${20} /></button>
      </div>
      <div className="lb-stage" ...${sw} onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
        <img key=${idx} src=${s.src} alt=${caps[idx][0]} width=${s.w} height=${s.h} draggable="false" />
        <button type="button" className="round lb-prev" onClick=${prev} aria-label=${t.ui.prev}><${Icon} name="chevron-left" size=${22} className="flip" /></button>
        <button type="button" className="round lb-next" onClick=${next} aria-label=${t.ui.next}><${Icon} name="chevron-right" size=${22} className="flip" /></button>
      </div>
      <p className="lb-cap"><strong>${caps[idx][0]}</strong> ${caps[idx][1]}</p>
    </${motion.div}>`;
}

function InternConnect({ t, rtl }){
  const p = t.work.ic, total = IC_SHOTS.length;
  const [idx, setIdx] = useState(0);
  const [lb, setLb] = useState(false);
  const stageRef = useRef(null);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(total - 1, i + 1));
  const sw = useSwipe(prev, next, rtl);
  const sign = rtl ? -1 : 1;
  const onMove = e => {
    if (REDUCED || MOBILE) return;
    const r = stageRef.current.getBoundingClientRect();
    stageRef.current.style.setProperty("--ty", (((e.clientX - r.left) / r.width - .5) * 8).toFixed(2) + "deg");
    stageRef.current.style.setProperty("--tx", (-((e.clientY - r.top) / r.height - .5) * 6).toFixed(2) + "deg");
  };
  const onLeave = () => { stageRef.current.style.setProperty("--ty", "0deg"); stageRef.current.style.setProperty("--tx", "0deg"); };
  return html`
    <article className="case ic" aria-labelledby="ic-h">
      <${Rv} className="case-text">
        <p className="kicker">${p.kicker}</p>
        <h3 id="ic-h" className="case-title">${p.name}</h3>
        <p className="case-desc">${p.desc}</p>
        <p className="case-mine">${p.mine}</p>
        <ul className="tags">${p.tags.map(x => html`<li key=${x}>${x}</li>`)}</ul>
        <ol className="steps">
          ${p.shots.map(([n, d], i) => html`
            <li key=${i}>
              <button type="button" aria-current=${i === idx ? "true" : undefined} onClick=${() => setIdx(i)}>
                <span className="sn tnum">${String(i + 1).padStart(2, "0")}</span>
                <span><span className="st">${n}</span>${i === idx && html`<span className="sd">${d}</span>`}</span>
              </button>
            </li>`)}
        </ol>
        <p className="fine">${p.note}</p>
      </${Rv}>
      <div className="flow-wrap" role="region" aria-roledescription="carousel" aria-label=${p.name}
        onKeyDown=${e => { if (e.key === "ArrowRight"){ e.preventDefault(); rtl ? prev() : next(); } if (e.key === "ArrowLeft"){ e.preventDefault(); rtl ? next() : prev(); } }}>
        <div className="flow-stage" ref=${stageRef} onPointerMove=${onMove} onPointerLeave=${onLeave} ...${sw}>
          <div className="flow-3d">
            ${IC_SHOTS.map((s, i) => {
              const off = i - idx, a = Math.abs(off);
              const style = {
                transform: "translate(-50%,-50%) translateX(calc(" + (off * sign) + " * var(--gap))) translateZ(" + (-a * 150) + "px) rotateY(" + (-off * sign * 26) + "deg) scale(" + (1 - a * .05) + ")",
                opacity: a > 2 ? 0 : 1 - a * .3, zIndex: 20 - a, pointerEvents: a > 2 ? "none" : "auto",
              };
              return html`
                <button key=${i} type="button" className=${"dev" + (a === 0 ? " on" : "")} style=${style} tabIndex=${a === 0 ? 0 : -1}
                  aria-label=${a === 0 ? t.ui.enlarge + ": " + p.shots[i][0] : p.shots[i][0]}
                  onClick=${() => { if (window.__swiped && Date.now() - window.__swiped < 300) return; a === 0 ? setLb(true) : setIdx(i); }}>
                  <img src=${s.src} alt=${p.shots[i][0] + ". " + p.shots[i][1]} width=${s.w} height=${s.h} loading="lazy" decoding="async" draggable="false" />
                </button>`;
            })}
          </div>
          <span className="floor" aria-hidden="true"></span>
        </div>
        <div className="flow-bar" aria-live="polite">
          <button type="button" className="round" onClick=${prev} disabled=${idx === 0} aria-label=${t.ui.prev}><${Icon} name="chevron-left" size=${20} className="flip" /></button>
          <p><strong>${p.shots[idx][0]}</strong><span className="tnum">${idx + 1} / ${total}</span></p>
          <button type="button" className="round" onClick=${next} disabled=${idx === total - 1} aria-label=${t.ui.next}><${Icon} name="chevron-right" size=${20} className="flip" /></button>
        </div>
      </div>
      <${AnimatePresence}>${lb && html`<${Lightbox} key="lb" idx=${idx} setIdx=${setIdx} onClose=${() => setLb(false)} caps=${p.shots} t=${t} rtl=${rtl} />`}</${AnimatePresence}>
    </article>`;
}

/* ---------- browser mockup (typographic: no fabricated store UI) ---------- */
function Browser({ url, shot, children, tone }){
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return html`
    <div className=${"browser " + tone}>
      <div className="b-bar" aria-hidden="true">
        <span className="b-dots"><i></i><i></i><i></i></span>
        <span className="b-url"><${Icon} name="lock" size=${11} />${domain}</span>
      </div>
      <div className="b-screen">${shot ? html`<img src=${shot} alt="" loading="lazy" />` : children}</div>
    </div>`;
}

function StoreCase({ d, url, shot, visit, tone, flip, wordmarkAr, children }){
  return html`
    <article className=${"case store" + (flip ? " flip" : "")}>
      <${Rv} className="store-vis">
        <${Browser} url=${url} shot=${shot} tone=${tone}>${children}</${Browser}>
      </${Rv}>
      <${Rv} className="case-text" delay=${.08}>
        <p className="kicker">${d.kicker}</p>
        <h3 className=${"case-title" + (wordmarkAr ? " arw" : "")}>${d.name}</h3>
        <p className="case-desc">${d.desc}</p>
        ${d.did && html`<ul className="did">${d.did.map(x => html`<li key=${x}><${Icon} name="check" size=${15} />${x}</li>`)}</ul>`}
        <a className="btn btn-ghost btn-sm" href=${url} target="_blank" rel="noopener noreferrer">
          <${Icon} name="external-link" size=${15} />${visit}<span className="ltr dim">${url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
        </a>
      </${Rv}>
    </article>`;
}

/* ---------- Java simulator: technical visualization ---------- */
const GANTT = [[1,2],[2,2],[3,2],[4,1],[1,2],[3,2],[2,1],[1,1],[3,1]];
const MEM = ["os","os","p1","p1","p1","f","p2","p2","f","f","p3","p3","p3","p3","f","p4","p4","f","f","f"];
const RES = [["h","r",""],["","h","r"],["r","","h"]];
function JavaCase({ d }){
  const units = GANTT.reduce((s, g) => s + g[1], 0);
  return html`
    <article className="case java">
      <${Rv} className="case-text">
        <p className="kicker">${d.kicker}</p>
        <h3 className="case-title">${d.name}</h3>
        <p className="case-desc">${d.desc}</p>
        <ul className="tags">${d.tags.map(x => html`<li key=${x}>${x}</li>`)}</ul>
      </${Rv}>
      <${Rv} className="viz" delay=${.08} dir="ltr">
        <div className="viz-block">
          <p className="viz-h"><span lang=${d === T.ar.work.java ? "ar" : "en"}>${d.sched}</span><span className="mono dim">round-robin, q = 2</span></p>
          <div className="gantt" style=${{ "--u": units }}>
            ${GANTT.map(([p, n], i) => html`<span key=${i} className=${"g p" + p} style=${{ flexGrow:n }}>P${p}</span>`)}
            <i className="playhead"></i>
          </div>
          <div className="axis mono">${Array.from({ length: units + 1 }, (_, i) => html`<span key=${i}>${i}</span>`)}</div>
        </div>
        <div className="viz-row">
          <div className="viz-block">
            <p className="viz-h"><span>${d.mem}</span></p>
            <div className="mem">${MEM.map((m, i) => html`<span key=${i} className=${"m " + m} style=${{ "--i": i }}>${m === "f" ? "" : m.toUpperCase()}</span>`)}</div>
            <p className="legend mono"><i className="lg-f"></i>${d.free}</p>
          </div>
          <div className="viz-block">
            <p className="viz-h"><span>${d.res}</span></p>
            <table className="res mono">
              <thead><tr><th></th><th>R1</th><th>R2</th><th>R3</th></tr></thead>
              <tbody>${RES.map((row, i) => html`<tr key=${i}><th>P${i + 1}</th>${row.map((c, j) => html`<td key=${j}><i className=${c === "h" ? "held" : c === "r" ? "req" : ""}></i></td>`)}</tr>`)}</tbody>
            </table>
            <p className="legend mono"><i className="lg-h"></i>${d.held}<i className="lg-r"></i>${d.req}</p>
          </div>
        </div>
        <p className="fine" dir="auto">${d.note}</p>
      </${Rv}>
    </article>`;
}

function Work({ t, rtl, lang }){
  const w = t.work;
  return html`
    <section id="work" className="sec" aria-labelledby="work-h">
      <div className="wrap">
        <${Rv} className="sec-head">
          <h2 id="work-h" className="h2">${w.title}</h2>
          <p className="lead">${w.lead}</p>
        </${Rv}>
        <${InternConnect} t=${t} rtl=${rtl} />
        <${StoreCase} d=${w.tag} url=${STORES.tag} shot=${STORE_SHOTS.tag} visit=${t.ui.visit} tone="v">
          <div className="scr tagscr">
            <span className="scr-mark">Tag+</span>
            <span className="scr-k">${w.tag.screen}</span>
            <ul>${w.tag.did.map((x, i) => html`<li key=${x} style=${{ "--i": i }}><i></i>${x}</li>`)}</ul>
          </div>
        </${StoreCase}>
        <${StoreCase} d=${w.qer} url=${STORES.qeraaty} shot=${STORE_SHOTS.qeraaty} visit=${t.ui.visit} tone="c" flip=${true} wordmarkAr=${lang === "ar"}>
          <div className="scr qscr">
            <span className="scr-mark ar-w">${w.qer.wordmark}</span>
            <span className="scr-k">${w.qer.screen}<i className="live"></i></span>
          </div>
        </${StoreCase}>
        <${JavaCase} d=${w.java} />
      </div>
    </section>`;
}

/* ---------- skills interface ---------- */
function Skills({ t }){
  const s = t.skills;
  return html`
    <section id="skills" className="sec" aria-labelledby="skills-h">
      <div className="wrap">
        <${Rv} className="sec-head">
          <h2 id="skills-h" className="h2">${s.title}</h2>
          <p className="lead">${s.lead}</p>
          <p className="legend2"><span><i className="dp"></i>${s.proven}</span><span><i className="dl"></i>${s.learning}</span></p>
        </${Rv}>
        <div className="mods">
          ${s.groups.map((g, gi) => {
            const pv = g.items.filter(x => x[1]).length;
            return html`
              <${Rv} key=${g.name} className=${"mod m" + gi} delay=${gi * .05}>
                <div className="mod-h">
                  <span className="mod-i"><${Icon} name=${g.icon} size=${19} /></span>
                  <h3>${g.name}</h3>
                </div>
                <div className="meter" aria-hidden="true">${g.items.map((x, i) => html`<i key=${i} className=${x[1] ? "p" : "l"}></i>`)}</div>
                <ul>
                  ${g.items.map(([n, ok]) => html`
                    <li key=${n} className=${ok ? "p" : "l"}>
                      <i aria-hidden="true"></i><span>${n}</span>
                      ${!ok && html`<em>${s.learning}</em>`}
                    </li>`)}
                </ul>
              </${Rv}>`;
          })}
        </div>
      </div>
    </section>`;
}

function Credentials({ t }){
  const c = t.cred;
  return html`
    <section id="credentials" className="sec" aria-labelledby="cred-h">
      <div className="wrap cred">
        <${Rv} className="edu">
          <p className="kicker">${c.degreeLabel}</p>
          <p className="edu-deg">${c.degree}</p>
          <p className="edu-uni">${c.uni}</p>
          <p className="edu-y tnum">${c.grad}</p>
        </${Rv}>
        <div className="certs">
          <${Rv} as="h2" className="h2" id="cred-h">${c.title}</${Rv}>
          <ul>
            ${c.certs.map(([n, by], i) => html`
              <${Rv} as="li" key=${n} delay=${i * .04}>
                <span className="c-n">${n}</span><span className="c-by">${by}</span>
              </${Rv}>`)}
          </ul>
        </div>
      </div>
    </section>`;
}

function ContactRow({ icon, label, value, href, ext, copy, t, toast }){
  const vRef = useRef(null);
  return html`
    <li className="c-row">
      <span className="c-i"><${Icon} name=${icon} fallback="link" size=${18} /></span>
      <div className="c-txt">
        <p className="c-l">${label}</p>
        ${href
          ? html`<a ref=${vRef} className="c-v" href=${href} target=${ext ? "_blank" : undefined} rel=${ext ? "noopener noreferrer" : undefined}><span className=${copy || ext ? "ltr" : ""}>${value}</span></a>`
          : html`<p ref=${vRef} className="c-v">${value}</p>`}
      </div>
      ${copy ? html`<button type="button" className="mini" onClick=${async () => { if (await copyText(copy, vRef.current)) toast(t.ui.copied); }}><${Icon} name="copy" size=${13} />${t.ui.copy}</button>`
        : ext ? html`<a className="mini" href=${href} target="_blank" rel="noopener noreferrer">${t.ui.openProfile}<${Icon} name="arrow-up-right" size=${13} className="flip" /></a>` : html`<span></span>`}
    </li>`;
}

function Contact({ t, dl, toast }){
  const c = t.contact;
  return html`
    <section id="contact" className="sec contact" aria-labelledby="contact-h">
      <div className="wrap c-grid">
        <${Rv} className="c-head">
          <h2 id="contact-h" className="finale">${c.title}</h2>
          <p className="lead">${c.lead}</p>
          <div className="cta"><${CVButton} t=${t} dl=${dl} toast=${toast} className="btn btn-primary" /><span className="dim">${c.cvNote}</span></div>
        </${Rv}>
        <${Rv} as="ul" className="c-list" delay=${.08}>
          <${ContactRow} icon="mail" label=${c.email} value=${CONTACT.email} href=${"mailto:" + CONTACT.email} copy=${CONTACT.email} t=${t} toast=${toast} />
          <${ContactRow} icon="phone" label=${c.phone} value=${CONTACT.phoneDisplay} href=${"tel:" + CONTACT.phone} copy=${CONTACT.phone} t=${t} toast=${toast} />
          <${ContactRow} icon="linkedin" label=${c.linkedin} value="linkedin.com/in/moathalnajem" href=${CONTACT.linkedin} ext=${true} t=${t} toast=${toast} />
          <${ContactRow} icon="map-pin" label=${c.location} value=${c.loc} t=${t} toast=${toast} />
        </${Rv}>
      </div>
    </section>`;
}

/* ---------- app ---------- */
function App(){
  const [lang, setLang] = useState(() => store.get("lang") === "ar" ? "ar" : "en");
  const [active, setActive] = useState(null);
  const [toastMsg, toast] = useToast();
  const dl = useDownloads();
  const t = T[lang], rtl = lang === "ar";
  const first = useRef(true);
  useLayoutEffect(() => {
    const r = document.documentElement; r.lang = lang; r.dir = t.dir; document.title = t.name;
    store.set("lang", lang);
    if (first.current){ first.current = false; return; }
    r.classList.remove("swap"); void r.offsetWidth; r.classList.add("swap");
  }, [lang]);
  useScrollFrame((y, vh) => {
    let cur = null;
    NAV.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < vh * .45) cur = id; });
    setActive(cur);
  });
  useEffect(() => { document.documentElement.classList.add("ready"); }, []);
  return html`
    <${MotionConfig} reducedMotion="user">
      <a href="#main" className="skip">${t.skip}</a>
      <${Backdrop} lang=${lang} />
      <${Header} t=${t} lang=${lang} setLang=${setLang} active=${active} />
      <main id="main">
        <${Hero} t=${t} lang=${lang} dl=${dl} toast=${toast} />
        <${About} t=${t} />
        <${Journey} t=${t} />
        <${Work} t=${t} rtl=${rtl} lang=${lang} />
        <${Skills} t=${t} />
        <${Credentials} t=${t} />
        <${Contact} t=${t} dl=${dl} toast=${toast} />
      </main>
      <footer className="foot"><div className="wrap foot-in"><p>${t.footer}</p><p className="dim">${t.footer2}</p></div></footer>
      <${AnimatePresence}>
        ${toastMsg && html`<${motion.div} key="toast" className="toast" role="status" initial=${{ opacity:0, y:10 }} animate=${{ opacity:1, y:0 }} exit=${{ opacity:0, y:10 }}><span>${toastMsg}</span></${motion.div}>`}
      </${AnimatePresence}>
    </${MotionConfig}>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
})();
