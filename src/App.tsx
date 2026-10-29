import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { deviceId, supabase, hasSupabaseConfig } from '@/lib/supabase';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Filter,
  HeartHandshake,
  HeartPulse,
  Home,
  IndianRupee,
  ExternalLink,
  Languages,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircleHeart,
  NotebookTabs,
  Landmark,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

type Section = 'home' | 'opportunities' | 'learn' | 'schemes' | 'health' | 'safety' | 'profile';
type Language = 'hi' | 'en';

type ProfileValues = {
  preferredName: string;
  districtState: string;
  interest: string;
};

type Scheme = {
  id: string;
  name: string;
  officialName: string;
  benefit: string;
  eligibility: string;
  documents: string;
  sourceUrl: string;
  status: 'demo' | 'verified';
};

type HealthResource = {
  id: string;
  title: string;
  summary: string;
  category: string;
  sourceUrl: string;
  status: 'demo' | 'verified';
};

type Opportunity = {
  id: string;
  title: string;
  provider: string;
  category: string;
  location: string;
  mode: string;
  pay: string;
  skills: string;
  status: 'verified' | 'demo';
  updated: string;
  accent: string;
};

const opportunities: Opportunity[] = [
  { id: '11111111-1111-4111-8111-111111111111', title: 'घर से सिलाई सीखें और कमाएँ', provider: 'KaushalSetu demo partner', category: 'सिलाई', location: 'अमेठी, उत्तर प्रदेश', mode: 'घर से', pay: 'मानदेय की जानकारी बाद में', skills: 'बुनियादी सिलाई', status: 'demo', updated: 'आज अपडेट', accent: 'coral' },
  { id: '22222222-2222-4222-8222-222222222222', title: 'स्थानीय मसाला पैकिंग समूह', provider: 'उदाहरण SHG नेटवर्क', category: 'खाद्य प्रसंस्करण', location: 'गौरीगंज, उत्तर प्रदेश', mode: 'स्थानीय समूह', pay: 'भुगतान प्रदाता से सत्यापित करें', skills: 'सफाई और पैकिंग', status: 'demo', updated: '2 दिन पहले', accent: 'sage' },
  { id: '33333333-3333-4333-8333-333333333333', title: 'डिजिटल साथी प्रशिक्षण', provider: 'KaushalSetu demo partner', category: 'डिजिटल काम', location: 'ऑनलाइन / आपके गाँव से', mode: 'लचीला समय', pay: 'यह एक सीखने का अवसर है', skills: 'स्मार्टफोन का उपयोग', status: 'demo', updated: '5 दिन पहले', accent: 'blue' },
];

const schemes: Scheme[] = [
  { id: '44444444-4444-4444-8444-444444444444', name: 'छोटे कारोबार की जानकारी', officialName: 'Illustrative public scheme record', benefit: 'व्यवसाय शुरू करने की संभावित सहायता की जानकारी', eligibility: 'पात्रता राज्य और योजना के नियमों पर निर्भर है।', documents: 'आधिकारिक स्रोत पर वर्तमान सूची देखें।', sourceUrl: 'https://www.india.gov.in/', status: 'demo' },
  { id: '55555555-5555-4555-8555-555555555555', name: 'महिला समूह सहायता', officialName: 'Illustrative SHG information record', benefit: 'स्वयं सहायता समूहों के लिए जानकारी और मार्गदर्शन', eligibility: 'स्थानीय विभाग से पात्रता की पुष्टि करें।', documents: 'स्थानीय कार्यालय से पूछें; यहाँ कोई आवेदन नहीं होता।', sourceUrl: 'https://www.india.gov.in/', status: 'demo' },
];

const healthResources: HealthResource[] = [
  { id: '66666666-6666-4666-8666-666666666666', title: 'पोषण की रोज़मर्रा की बातें', summary: 'संतुलित भोजन, साफ पानी और समय पर स्वास्थ्य सलाह के बारे में सामान्य जानकारी।', category: 'पोषण', sourceUrl: 'https://www.mohfw.gov.in/', status: 'demo' },
  { id: '77777777-7777-4777-8777-777777777777', title: 'मन का ख्याल और तनाव', summary: 'तनाव महसूस होने पर भरोसेमंद व्यक्ति से बात करने और स्थानीय स्वास्थ्य सेवा लेने की याद।', category: 'मानसिक स्वास्थ्य', sourceUrl: 'https://www.mohfw.gov.in/', status: 'demo' },
];

const lessons = [
  { id: 'smartphone', title: 'स्मार्टफोन की बुनियाद', subtitle: 'कॉल, कैमरा और इंटरनेट को सुरक्षित तरीके से समझें', duration: '8 मिनट', icon: Zap, tone: 'sun' },
  { id: 'upi', title: 'UPI और पैसे की सुरक्षा', subtitle: 'OTP और UPI PIN को सुरक्षित रखने के 5 आसान नियम', duration: '6 मिनट', icon: WalletCards, tone: 'mint' },
  { id: 'budget', title: 'घर का आसान बजट', subtitle: 'कमाई और खर्च को लिखकर अगला कदम तय करें', duration: '10 मिनट', icon: NotebookTabs, tone: 'blue' },
];

const translations = {
  hi: {
    home: 'होम', opportunities: 'काम', learn: 'सीखें', schemes: 'योजनाएं', health: 'सेहत', safety: 'सुरक्षा', profile: 'प्रोफ़ाइल',
    greeting: 'नमस्ते, KaushalSetu', intro: 'सीखें, जुड़ें और अपने अगले कदम को मजबूत बनाएं।', search: 'काम, सीख या योजना खोजें',
    demo: 'DEMO MODE', demoText: 'यह अनुभव नमूना जानकारी के साथ चल रहा है। असली अवसरों को प्रकाशित करने से पहले सत्यापन जरूरी है।',
  },
  en: {
    home: 'Home', opportunities: 'Work', learn: 'Learn', schemes: 'Schemes', health: 'Health', safety: 'Safety', profile: 'Profile',
    greeting: 'Welcome to KaushalSetu', intro: 'Learn, connect, and make your next step stronger.', search: 'Search work, learning or schemes',
    demo: 'DEMO MODE', demoText: 'This experience uses sample information. Real opportunities must be verified before publishing.',
  },
};

function App() {
  const [section, setSection] = useState<Section>('home');
  const [language, setLanguage] = useState<Language>('hi');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem('sakhi-demo-saved');
      return stored ? JSON.parse(stored) as string[] : ['22222222-2222-4222-8222-222222222222'];
    } catch {
      return ['22222222-2222-4222-8222-222222222222'];
    }
  });
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem('sakhi-demo-completed');
      return stored ? JSON.parse(stored) as string[] : ['smartphone'];
    } catch {
      return ['smartphone'];
    }
  });
  const [interestId, setInterestId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('सभी');
  const [modeFilter, setModeFilter] = useState('सभी');
  const [profile, setProfile] = useState<ProfileValues>({ preferredName: '', districtState: '', interest: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    window.localStorage.setItem('sakhi-demo-saved', JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    window.localStorage.setItem('sakhi-demo-completed', JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUserEmail(session?.user.email ?? null);
      })();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.from('sakhi_saved_items').select('item_id').eq('item_type', 'opportunity').then(({ data }) => {
      if (data?.length) setSaved(data.map((row) => row.item_id));
    });
  }, []);

  useEffect(() => {
    if (!supabase || !userEmail) return;
    void supabase.from('sakhi_lesson_progress').select('lesson_key').then(({ data }) => {
      if (data) setCompleted(data.map((row) => row.lesson_key));
    });
    void supabase.from('sakhi_profiles').select('preferred_name, district_state, interest').maybeSingle().then(({ data }) => {
      if (data) setProfile({ preferredName: data.preferred_name ?? '', districtState: data.district_state ?? '', interest: data.interest ?? '' });
    });
  }, [userEmail]);

  const filteredOpportunities = useMemo(() => opportunities.filter((item) => {
    const matchesText = `${item.title} ${item.category} ${item.location} ${item.mode}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'सभी' || item.category === categoryFilter;
    const matchesMode = modeFilter === 'सभी' || item.mode === modeFilter;
    return matchesText && matchesCategory && matchesMode;
  }), [categoryFilter, modeFilter, query]);

  const toggleSave = (id: string) => {
    const isSaved = saved.includes(id);
    setSaved((items) => isSaved ? items.filter((item) => item !== id) : [...items, id]);
    if (!supabase) return;
    void (isSaved
      ? supabase.from('sakhi_saved_items').delete().eq('item_type', 'opportunity').eq('item_id', id)
      : supabase.from('sakhi_saved_items').insert({ item_type: 'opportunity', item_id: id }));
  };
  const toggleLesson = (id: string) => {
    const isCompleted = completed.includes(id);
    setCompleted((items) => isCompleted ? items.filter((item) => item !== id) : [...items, id]);
    if (!supabase || !userEmail) return;
    void (isCompleted
      ? supabase.from('sakhi_lesson_progress').delete().eq('lesson_key', id)
      : supabase.from('sakhi_lesson_progress').insert({ lesson_key: id }));
  };
  const saveProfile = async (values: ProfileValues) => {
    setProfile(values);
    setProfileOpen(false);
    if (!supabase || !userEmail) return;
    await supabase.from('sakhi_profiles').upsert({ preferred_name: values.preferredName || null, district_state: values.districtState || null, interest: values.interest || null });
  };

  return (
    <div className="app-shell">
      <div className="top-strip"><span><ShieldCheck size={14} /> सुरक्षित और सरल डिजिटल साथी</span><span className="top-strip-right">कम इंटरनेट में भी उपयोगी</span></div>
      <header className="site-header">
        <button className="brand" onClick={() => setSection('home')} aria-label="KaushalSetu home"><span className="brand-mark"><Leaf size={20} /></span><span><strong>KaushalSetu</strong><small>साथ • सीख • सशक्त</small></span></button>
        <div className="header-actions">
          <button className="language-toggle" onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')} aria-label="Change language"><Languages size={17} /><span>{language === 'hi' ? 'हिंदी' : 'English'}</span></button>
          <button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={21} /></button>
        </div>
        {menuOpen && <div className="menu-popover"><button onClick={() => { setSection('profile'); setMenuOpen(false); }}><UserRound size={17} /> मेरी जानकारी</button><button onClick={() => { setSection('safety'); setMenuOpen(false); }}><CircleHelp size={17} /> मदद और सुरक्षा</button></div>}
      </header>

      <main>
        {section === 'home' && <HomeView t={t} query={query} setQuery={setQuery} setSection={setSection} saved={saved.length} completed={completed.length} setProfileOpen={setProfileOpen} />}
        {section === 'opportunities' && <OpportunitiesView query={query} setQuery={setQuery} items={filteredOpportunities} saved={saved} toggleSave={toggleSave} setInterestId={setInterestId} categoryFilter={categoryFilter} modeFilter={modeFilter} setCategoryFilter={setCategoryFilter} setModeFilter={setModeFilter} />}
        {section === 'learn' && <LearnView completed={completed} toggleLesson={toggleLesson} />}
        {section === 'schemes' && <SchemesView query={query} setQuery={setQuery} />}
        {section === 'health' && <HealthView query={query} setQuery={setQuery} />}
        {section === 'safety' && <SafetyView />}
        {section === 'profile' && <ProfileView setProfileOpen={setProfileOpen} userEmail={userEmail} onAuth={() => setAuthOpen(true)} onSignOut={() => { if (supabase) void supabase.auth.signOut(); }} />}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        {([['home', Home, t.home], ['opportunities', BriefcaseBusiness, t.opportunities], ['learn', BookOpen, t.learn], ['schemes', Landmark, t.schemes], ['health', HeartHandshake, t.health], ['safety', ShieldCheck, t.safety]] as const).map(([id, Icon, label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}><Icon size={20} /><span>{label}</span></button>)}
      </nav>

      {profileOpen && <ProfileModal initial={profile} authenticated={Boolean(userEmail)} onSave={saveProfile} onClose={() => setProfileOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {interestId && <InterestModal opportunityId={interestId} opportunity={opportunities.find((item) => item.id === interestId)?.title ?? ''} onClose={() => setInterestId(null)} />}
    </div>
  );
}

function HomeView({ t, query, setQuery, setSection, saved, completed, setProfileOpen }: { t: typeof translations.hi; query: string; setQuery: (value: string) => void; setSection: (section: Section) => void; saved: number; completed: number; setProfileOpen: (open: boolean) => void }) {
  return <>
    <section className="hero-section">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> आपका डिजिटल साथी</div><h1>{t.greeting}</h1><p>{t.intro}</p><div className="hero-buttons"><button className="primary-button" onClick={() => setSection('opportunities')}>आज का अवसर देखें <ArrowRight size={17} /></button><button className="text-button" onClick={() => setProfileOpen(true)}>अपनी जानकारी जोड़ें <ChevronRight size={16} /></button></div></div>
      <div className="hero-illustration" aria-hidden="true"><div className="sun-disc" /><div className="woman-illustration"><div className="illustration-head" /><div className="illustration-dupatta" /><div className="illustration-body" /></div><span className="float-card card-one"><Star size={14} fill="currentColor" /> अपनी रफ़्तार से</span><span className="float-card card-two"><HeartPulse size={14} /> आपका ख्याल</span></div>
    </section>
    <div className="demo-banner"><div className="demo-label">{t.demo}</div><p>{t.demoText}</p><button aria-label="More about demo mode"><CircleHelp size={17} /></button></div>
    <section className="search-wrap"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} /><button className="filter-button"><Filter size={17} /><span>फ़िल्टर</span></button></section>
    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">आपके लिए</span><h2>आज क्या करना चाहेंगी?</h2></div><button className="small-link" onClick={() => setSection('opportunities')}>सब देखें <ArrowRight size={15} /></button></div><div className="category-grid"><CategoryCard icon={BriefcaseBusiness} title="काम और आमदनी" text="अपने हुनर से अवसर खोजें" tone="coral" onClick={() => setSection('opportunities')} /><CategoryCard icon={BookOpen} title="सीखें" text="छोटे पाठ, बड़ा आत्मविश्वास" tone="mint" onClick={() => setSection('learn')} /><CategoryCard icon={NotebookTabs} title="सरकारी योजनाएं" text="जानकारी को आसान बनाएं" tone="blue" onClick={() => setSection('schemes')} /><CategoryCard icon={MessageCircleHeart} title="सेहत और सुकून" text="अपने लिए थोड़ा समय" tone="sun" onClick={() => setSection('health')} /></div></section>
    <section className="section-block progress-strip"><div className="progress-person"><div className="avatar-placeholder"><UserRound size={22} /></div><div><span className="section-kicker">आपकी प्रगति</span><h3>छोटे कदम, बड़ा बदलाव</h3></div></div><div className="progress-stats"><div><strong>{saved}</strong><span>सहेजे अवसर</span></div><div><strong>{completed}/3</strong><span>पाठ पूरे</span></div><div><strong>1</strong><span>सुरक्षा टिप</span></div></div></section>
    <section className="trust-row"><LockKeyhole size={17} /><span>आपकी जानकारी आपकी अनुमति के बिना साझा नहीं की जाती। नाम और पता देना जरूरी नहीं है।</span></section>
  </>;
}

function CategoryCard({ icon: Icon, title, text, tone, onClick }: { icon: typeof BriefcaseBusiness; title: string; text: string; tone: string; onClick: () => void }) { return <button className={`category-card ${tone}`} onClick={onClick}><span className="category-icon"><Icon size={22} /></span><span className="category-title">{title}</span><span className="category-text">{text}</span><ChevronRight size={17} className="category-arrow" /></button>; }

function OpportunitiesView({ query, setQuery, items, saved, toggleSave, setInterestId, categoryFilter, modeFilter, setCategoryFilter, setModeFilter }: { query: string; setQuery: (value: string) => void; items: Opportunity[]; saved: string[]; toggleSave: (id: string) => void; setInterestId: (id: string) => void; categoryFilter: string; modeFilter: string; setCategoryFilter: (value: string) => void; setModeFilter: (value: string) => void }) {
  return <section className="page-section"><div className="page-heading"><div><span className="section-kicker">खोजें और चुनें</span><h1>काम और आमदनी</h1><p>आपके हुनर और समय के हिसाब से शुरुआत करें।</p></div><span className="result-count">{items.length} अवसर</span></div><div className="search-wrap compact"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="सिलाई, डिजिटल काम..." /><SlidersHorizontal size={17} /></div><div className="filter-row"><label>किस तरह का काम<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>सभी</option><option>सिलाई</option><option>खाद्य प्रसंस्करण</option><option>डिजिटल काम</option></select></label><label>काम का तरीका<select value={modeFilter} onChange={(event) => setModeFilter(event.target.value)}><option>सभी</option><option>घर से</option><option>स्थानीय समूह</option><option>लचीला समय</option></select></label></div><div className="opportunity-list">{items.length ? items.map((item) => <OpportunityCard key={item.id} item={item} saved={saved.includes(item.id)} onSave={() => toggleSave(item.id)} onInterest={() => setInterestId(item.id)} />) : <div className="empty-state"><Search size={28} /><h3>ऐसा अवसर नहीं मिला</h3><p>दूसरे शब्द या filter से खोजकर देखें।</p></div>}</div><p className="honesty-note"><ShieldCheck size={16} /> सभी कार्ड अभी DEMO DATA हैं। असली अवसर के लिए प्रदाता और शर्तों की पुष्टि जरूर करें।</p></section>;
}

function SchemesView({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  const items = schemes.filter((item) => `${item.name} ${item.officialName} ${item.benefit}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="page-section"><div className="page-heading"><div><span className="section-kicker">जानकारी पहले, आवेदन बाद में</span><h1>सरकारी योजनाएं</h1><p>पात्रता और लाभ की अंतिम पुष्टि आधिकारिक स्रोत से करें।</p></div><Landmark size={28} className="page-art-icon" /></div><div className="search-wrap compact"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="योजना या लाभ खोजें" /></div><div className="scheme-list">{items.map((item) => <article className="scheme-card" key={item.id}><div className="scheme-card-top"><span className="demo-pill">DEMO DATA</span><span className="source-status">स्रोत जांचें</span></div><h3>{item.name}</h3><p className="scheme-official">{item.officialName}</p><div className="scheme-detail"><strong>किसके लिए</strong><span>{item.eligibility}</span></div><div className="scheme-detail"><strong>संभावित लाभ</strong><span>{item.benefit}</span></div><div className="scheme-detail"><strong>दस्तावेज़</strong><span>{item.documents}</span></div><a className="outline-button source-button" href={item.sourceUrl} target="_blank" rel="noreferrer">आधिकारिक स्रोत खोलें <ExternalLink size={14} /></a></article>)}{!items.length && <div className="empty-state"><Search size={28} /><h3>योजना नहीं मिली</h3><p>दूसरे शब्द से खोजकर देखें।</p></div>}</div><p className="honesty-note"><ShieldCheck size={16} /> KaushalSetu पात्रता, मंज़ूरी या भुगतान की गारंटी नहीं देता।</p></section>;
}

function HealthView({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  const items = healthResources.filter((item) => `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="page-section"><div className="page-heading"><div><span className="section-kicker">सम्मान और भरोसा</span><h1>सेहत और सुकून</h1><p>सामान्य जानकारी, diagnosis या इलाज का विकल्प नहीं।</p></div><HeartHandshake size={30} className="page-art-icon" /></div><div className="search-wrap compact"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="पोषण, तनाव, स्वास्थ्य..." /></div><div className="health-list">{items.map((item) => <article className="health-card" key={item.id}><div className="health-icon"><HeartPulse size={22} /></div><div><span className="demo-pill">DEMO RESOURCE</span><h3>{item.title}</h3><p>{item.summary}</p><span className="health-category">{item.category}</span><a className="outline-button source-button" href={item.sourceUrl} target="_blank" rel="noreferrer">विश्वसनीय स्रोत देखें <ExternalLink size={14} /></a></div></article>)}{!items.length && <div className="empty-state"><Search size={28} /><h3>संसाधन नहीं मिला</h3><p>दूसरे शब्द से खोजकर देखें।</p></div>}</div><div className="health-discreet"><LockKeyhole size={18} /><span>यह पेज साझा फोन पर भी सामान्य और discreet भाषा में रखा गया है। जरूरी मदद के लिए स्थानीय qualified health worker या emergency service से संपर्क करें।</span></div></section>;
}

function OpportunityCard({ item, saved, onSave, onInterest }: { item: Opportunity; saved: boolean; onSave: () => void; onInterest: () => void }) { return <article className="opportunity-card"><div className={`opportunity-icon ${item.accent}`}><BriefcaseBusiness size={21} /></div><div className="opportunity-main"><div className="card-topline"><span className="demo-pill">DEMO DATA</span><button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? 'सहेजे से हटाएं' : 'सहेजें'}><Star size={19} fill={saved ? 'currentColor' : 'none'} /></button></div><h3>{item.title}</h3><p className="provider">{item.provider} <span className="pending-dot">• नमूना</span></p><div className="opportunity-meta"><span><Home size={14} /> {item.location}</span><span><Clock3 size={14} /> {item.mode}</span><span><IndianRupee size={14} /> {item.pay}</span></div><div className="skill-line"><span>हुनर: {item.skills}</span><span>{item.updated}</span></div><button className="outline-button" onClick={onInterest}>रुचि दर्ज करें <ArrowRight size={16} /></button></div></article>; }

function LearnView({ completed, toggleLesson }: { completed: string[]; toggleLesson: (id: string) => void }) { return <section className="page-section"><div className="page-heading learning-heading"><div><span className="section-kicker">अपने समय पर सीखें</span><h1>सीखें और आगे बढ़ें</h1><p>छोटे, आसान पाठ जो रोज़मर्रा के काम आते हैं।</p></div><div className="learning-score"><strong>{Math.round((completed.length / lessons.length) * 100)}%</strong><span>पूरा</span></div></div><div className="lesson-progress"><div style={{ width: `${(completed.length / lessons.length) * 100}%` }} /></div><div className="lesson-list">{lessons.map(({ id, title, subtitle, duration, icon: Icon, tone }) => { const done = completed.includes(id); return <article className={`lesson-card ${done ? 'done' : ''}`} key={id}><div className={`lesson-icon ${tone}`}><Icon size={22} /></div><div className="lesson-copy"><div className="lesson-title-row"><h3>{title}</h3>{done && <span className="done-mark"><Check size={13} /> पूरा</span>}</div><p>{subtitle}</p><span className="duration"><Clock3 size={14} /> {duration}</span></div><button className="lesson-action" onClick={() => toggleLesson(id)}>{done ? 'दोहराएं' : 'शुरू करें'} <ChevronRight size={16} /></button></article>; })}</div><div className="learning-tip"><Sparkles size={20} /><div><strong>आज की छोटी टिप</strong><p>किसी भी नए काम में पहले छोटी शुरुआत करें और भरोसेमंद व्यक्ति से पूछकर आगे बढ़ें।</p></div></div></section>; }

function SafetyView() { const tips = [{ icon: LockKeyhole, title: 'OTP और UPI PIN कभी साझा न करें', text: 'बैंक या कोई सच्चा अधिकारी फोन पर आपका PIN नहीं पूछता।' }, { icon: ShieldCheck, title: 'नौकरी के नाम पर पैसे न भेजें', text: 'पहले सत्यापन करें। जल्दी भुगतान मांगना खतरे का संकेत हो सकता है।' }, { icon: CircleHelp, title: 'लिंक खोलने से पहले रुकें', text: 'भेजने वाले का नाम और वेबसाइट ध्यान से देखें। संदेह हो तो न खोलें।' }]; return <section className="page-section"><div className="safety-hero"><div><span className="section-kicker">आपकी डिजिटल ढाल</span><h1>सुरक्षित रहें, निडर रहें</h1><p>आपकी जानकारी और पैसे की सुरक्षा के लिए आसान बातें।</p></div><div className="shield-art"><ShieldCheck size={55} /></div></div><div className="safety-alert"><strong>याद रखें</strong><span>संदेह हो तो बातचीत रोकें, किसी भरोसेमंद व्यक्ति को बताएं और आधिकारिक मदद लें।</span></div><div className="safety-list">{tips.map(({ icon: Icon, title, text }) => <article key={title} className="safety-card"><span className="safety-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight size={17} /></article>)}</div><div className="quiz-card"><div className="quiz-icon"><Zap size={21} /></div><div><span className="section-kicker">2 मिनट की सीख</span><h3>क्या यह नौकरी का संदेश सुरक्षित है?</h3><p>एक छोटे quiz से पहचानें खतरे के संकेत।</p></div><button className="outline-button">quiz शुरू करें <ArrowRight size={16} /></button></div><p className="medical-note">स्वास्थ्य और सुरक्षा की जानकारी सामान्य शिक्षा के लिए है, किसी विशेषज्ञ की सलाह का विकल्प नहीं।</p></section>; }

function ProfileView({ setProfileOpen, userEmail, onAuth, onSignOut }: { setProfileOpen: (open: boolean) => void; userEmail: string | null; onAuth: () => void; onSignOut: () => void }) {
  return <section className="page-section profile-page"><div className="profile-header"><div className="large-avatar"><UserRound size={30} /></div><div><span className="section-kicker">मेरी जानकारी</span><h1>अपनी राह चुनें</h1><p>{userEmail ? `आप सुरक्षित रूप से जुड़े हैं: ${userEmail}` : 'यह जानकारी वैकल्पिक है और केवल आपके अनुभव को बेहतर बनाने के लिए है।'}</p></div></div><button className="profile-cta" onClick={() => setProfileOpen(true)}><span><strong>अपनी पसंद बताएं</strong><small>नाम, जिला और हुनर — जो साझा करना चाहें</small></span><ChevronRight size={19} /></button>{userEmail ? <button className="profile-cta account-cta" onClick={onSignOut}><span><strong>खाते से बाहर निकलें</strong><small>आपका निजी progress सुरक्षित रहेगा</small></span><LockKeyhole size={19} /></button> : <button className="profile-cta account-cta" onClick={onAuth}><span><strong>खाता बनाएं या प्रवेश करें</strong><small>अपनी प्रगति अलग-अलग डिवाइस पर सुरक्षित रखें</small></span><ChevronRight size={19} /></button>}<div className="privacy-card"><LockKeyhole size={20} /><div><h3>आपका नियंत्रण</h3><p>आप कभी भी जानकारी बदल या मिटा सकती हैं। Aadhaar, OTP, PIN या घर का पूरा पता हम नहीं मांगते।</p></div></div><div className="saved-summary"><div className="section-heading"><div><span className="section-kicker">आपकी सूची</span><h2>सहेजे हुए अवसर</h2></div><Star size={20} /></div><p>आपके सहेजे हुए अवसर यहाँ दिखाई देंगे। guest mode में यह जानकारी इसी browser में रहती है।</p></div></section>;
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!supabase) {
      setError('इस demo में खाता सुविधा अभी जुड़ी नहीं है। guest mode जारी रखें।');
      return;
    }
    if (!email.trim() || password.length < 6) {
      setError('ईमेल भरें और कम से कम 6 अक्षर का password रखें।');
      return;
    }
    setLoading(true);
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
      : await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (result.error) {
      setError(mode === 'signin' ? 'ईमेल या password सही नहीं है।' : 'यह खाता अभी नहीं बन सका। कृपया ईमेल और password जांचकर फिर कोशिश करें।');
      return;
    }
    if (mode === 'signup' && !result.data.session) {
      setError('खाता बन गया। अगर email confirmation चालू है, तो अपने email में पुष्टि करें।');
      return;
    }
    onClose();
  };

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Account access"><div className="modal-card"><div className="modal-header"><div><span className="section-kicker">सुरक्षित खाता</span><h2>{mode === 'signin' ? 'वापस स्वागत है' : 'नया खाता बनाएं'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div><p className="modal-intro">खाता वैकल्पिक है। इससे आपकी lesson progress आपके login के साथ सुरक्षित रखी जा सकती है।</p><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="कम से कम 6 अक्षर" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required /></label>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-safe"><LockKeyhole size={16} /> KaushalSetu कभी OTP, UPI PIN या banking password नहीं मांगता।</div><button className="primary-button full" type="submit" disabled={loading}>{loading ? 'कृपया रुकें...' : mode === 'signin' ? 'प्रवेश करें' : 'खाता बनाएं'} <ArrowRight size={17} /></button></form><button className="auth-switch" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>{mode === 'signin' ? 'नया खाता बनाना है?' : 'पहले से खाता है?'} <strong>{mode === 'signin' ? 'Sign up' : 'Sign in'}</strong></button>{!hasSupabaseConfig && <p className="config-note">यह build अभी guest/demo mode में है क्योंकि browser के लिए Supabase public configuration उपलब्ध नहीं है।</p>}</div></div>;
}

function ProfileModal({ initial, authenticated, onSave, onClose }: { initial: ProfileValues; authenticated: boolean; onSave: (values: ProfileValues) => Promise<void>; onClose: () => void }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await onSave(values);
    setSaving(false);
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Profile information"><div className="modal-card"><div className="modal-header"><div><span className="section-kicker">वैकल्पिक जानकारी</span><h2>आपके बारे में</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div><p className="modal-intro">बेहतर सुझावों के लिए जितना सहज लगे उतना ही साझा करें।</p><form onSubmit={save}><label>पसंदीदा नाम<input value={values.preferredName} onChange={(event) => setValues({ ...values, preferredName: event.target.value })} placeholder="जैसे: रीना" /></label><label>जिला / राज्य<input value={values.districtState} onChange={(event) => setValues({ ...values, districtState: event.target.value })} placeholder="जैसे: अमेठी, उत्तर प्रदेश" /></label><label>आपको किसमें रुचि है?<select value={values.interest} onChange={(event) => setValues({ ...values, interest: event.target.value })}><option value="">एक विकल्प चुनें</option><option>सिलाई और हस्तकला</option><option>खाना और खेती</option><option>डिजिटल काम</option></select></label><div className="modal-safe"><LockKeyhole size={16} /> {authenticated ? 'आपकी पसंद आपके खाते में सुरक्षित होगी।' : 'guest mode में यह जानकारी इसी browser में रहती है।'}</div><button className="primary-button full" type="submit" disabled={saving}>{saving ? 'सहेजा जा रहा है...' : 'जानकारी सुरक्षित रखें'} <Check size={17} /></button></form></div></div>;
}

function InterestModal({ opportunityId, opportunity, onClose }: { opportunityId: string; opportunity: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [contactPreference, setContactPreference] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async () => {
    if (!contactPreference) {
      setError('कृपया संपर्क का एक विकल्प चुनें।');
      return;
    }
    if (supabase) {
      const { error: insertError } = await supabase.from('sakhi_interest_registrations').insert({ device_id: deviceId, opportunity_id: opportunityId, contact_preference: contactPreference, message: message.trim() || null, is_demo_record: true });
      if (insertError) {
        setError('रुचि अभी सुरक्षित नहीं हो सकी। कृपया फिर कोशिश करें।');
        return;
      }
    }
    setSent(true);
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Register interest"><div className="modal-card">{sent ? <div className="success-state"><div className="success-icon"><Check size={28} /></div><h2>रुचि दर्ज हो गई</h2><p>{supabase ? 'यह एक demo interest record के रूप में सुरक्षित हुआ है। किसी प्रदाता को आवेदन या संपर्क नहीं भेजा गया है।' : 'यह एक demo interest record है। किसी प्रदाता को आवेदन या संपर्क अभी नहीं भेजा गया है।'}</p><button className="primary-button full" onClick={onClose}>समझ गई</button></div> : <><div className="modal-header"><div><span className="section-kicker">अगला कदम</span><h2>रुचि दर्ज करें</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div><p className="modal-intro">आपने चुना: <strong>{opportunity}</strong></p><label>आपसे कैसे संपर्क करें?<select value={contactPreference} onChange={(event) => setContactPreference(event.target.value)}><option value="">एक विकल्प चुनें</option><option>फोन पर (डेमो)</option><option>मेरे संदेश में दिखाएं</option></select></label><label>एक छोटी बात लिखें <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="मैं इस अवसर के बारे में जानना चाहती हूं..." rows={3} /></label>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-safe"><ShieldCheck size={16} /> कोई भुगतान या आधिकारिक आवेदन नहीं होगा।</div><button className="primary-button full" onClick={() => void submit()}>Demo में रुचि दर्ज करें <ArrowRight size={17} /></button></>}</div></div>;
}

export default App;
