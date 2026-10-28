import { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Carousel } from './components/Carousel';
import { DetailView } from './components/DetailView';
import type { DetailItem } from './components/DetailView';
import { useAudio, audioSynth } from './components/AudioPlayer';
import './App.css';

const PORTFOLIO_ITEMS: DetailItem[] = [
  {
    id: 'home',
    title: "Praise's Coder Studio",
    subtitle: "System Dashboard Hub",
    publisher: "Praise Labs",
    releaseDate: "07/30/2026",
    rating: "",
    bgGradient: "radial-gradient(circle at center, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)",
    shortDesc: "Full Stack Software Engineer who takes products from idea to production across mobile, web and AI. I build cross-platform apps in React Native and Next.js, back them with PostgreSQL, Supabase and serverless edge functions, wire in payments and WhatsApp automation, and ship private, local AI systems powered by RAG and MCP.",
    iconText: "Welcome",
  },
  {
    id: 'eshop',
    title: "eshop",
    subtitle: "High-Throughput Commerce Suite",
    publisher: "Praise Marketplace",
    releaseDate: "11/15/2025",
    rating: "PG-13 (Perf)",
    bgGradient: "radial-gradient(circle at center, rgba(46, 16, 101, 0.7) 0%, rgba(9, 5, 20, 0.95) 100%)",
    shortDesc: "A complete full-stack e-commerce marketplace featuring an automated WhatsApp-dispatch system. When an order is placed, it is automatically routed to nearby registered partner shops via WhatsApp, who accept the request directly on the app, enabling instant local customer collections.",
    iconText: "eshop",
  },
  {
    id: 'eshop-admin',
    title: "eshop-admin Portal",
    subtitle: "Live eCommerce Monitoring Console",
    publisher: "Praise Analytics",
    releaseDate: "04/01/2026",
    rating: "M (Metrics)",
    bgGradient: "radial-gradient(circle at center, rgba(2, 44, 34, 0.7) 0%, rgba(2, 6, 23, 0.95) 100%)",
    shortDesc: "Real-time system telemetry and administration board for eshop. Features simulated live order streams, stock triggers, and API gateway telemetry.",
    iconText: "eshop-admin",
  },
  {
    id: 'briing',
    title: "Briing",
    subtitle: "International Peer-to-Peer Shopping",
    publisher: "Praise Logistics",
    releaseDate: "02/10/2026",
    rating: "G (Go)",
    bgGradient: "radial-gradient(circle at center, rgba(22, 78, 99, 0.7) 0%, rgba(8, 47, 73, 0.95) 100%)",
    shortDesc: "Briing is the smart and convenient way to shop for products that are unavailable in your country or cost significantly more when bought locally. Request almost anything and connect with trusted travelers who can bring your items to you.",
    iconText: "Briing",
  },
  {
    id: 'briing-website',
    title: "briing-website",
    subtitle: "briing Landing Page",
    publisher: "Praise Logistics",
    releaseDate: "03/05/2026",
    rating: "G (Web)",
    bgGradient: "radial-gradient(circle at center, rgba(8, 47, 73, 0.7) 0%, rgba(2, 6, 23, 0.95) 100%)",
    shortDesc: "Bring is an innovative international shopping and delivery platform that connects shoppers with travelers. Users can purchase products from anywhere in the world, and instead of relying on traditional courier services, they have their orders delivered by verified travelers already heading to the destination. Travelers earn rewards for delivering items along their planned journeys, making international shipping faster, more affordable, and more sustainable. By matching buyers with people who are already traveling, Bring transforms everyday trips into delivery opportunities, creating a trusted marketplace that benefits both shoppers and travelers.",
    iconText: "briing-web",
  },
  {
    id: 'offlineai',
    title: "OfflineAI",
    subtitle: "Local AI Assistant with MCP Mode",
    publisher: "Praise Labs",
    releaseDate: "10/28/2026",
    rating: "E (AI)",
    bgGradient: "radial-gradient(circle at center, rgba(124, 45, 18, 0.7) 0%, rgba(12, 10, 9, 0.95) 100%)",
    shortDesc: "A fully offline AI assistant built on Next.js, running DeepSeek, Llama and nomic-embed locally through Ollama. It uses RAG to answer from your own data and MCP to query and update a database from plain-language requests.",
    iconText: "OfflineAI",
  },
  {
    id: 'resume',
    title: "Milestone Archives",
    subtitle: "FNB App Academy Awards Winner",
    publisher: "Praise Career",
    releaseDate: "06/01/2020",
    rating: "Platinum Lvl",
    bgGradient: "radial-gradient(circle at center, rgba(113, 63, 18, 0.7) 0%, rgba(28, 13, 2, 0.95) 100%)",
    shortDesc: "Explore Praise's professional engineering timeline, certifications, and major software awards—including reaching the Top 50 App of the Year at the 2025 FNB Awards.",
    iconText: "Achievements",
  },
];

function App() {
  const [booted, setBooted] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    return localStorage.getItem('ps5_theme') === 'light';
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  const [activeId, setActiveId] = useState<string>('home');

  // Audio system hook
  const { isMuted, toggleMute, playNav, playSelect, playClose, playTrophy, interact } = useAudio();

  // Trophy count system (tracked in state to persist achievements in background)
  const [, setTrophyCount] = useState(() => {
    const gold = Number(localStorage.getItem('ps5_trophy_gold') || '0');
    const silver = Number(localStorage.getItem('ps5_trophy_silver') || '0');
    const bronze = Number(localStorage.getItem('ps5_trophy_bronze') || '0');
    return { gold, silver, bronze };
  });

  const handleUnlockTrophy = (type: 'gold' | 'silver' | 'bronze') => {
    setTrophyCount((prev) => {
      const newVal = prev[type] + 1;
      localStorage.setItem(`ps5_trophy_${type}`, String(newVal));
      return { ...prev, [type]: newVal };
    });
  };

  const handleSetActiveTab = (tab: 'profile' | 'projects') => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setActiveId('home');
    } else {
      setActiveId('eshop');
    }
  };

  const handleBootSystem = useCallback(() => {
    interact();
    setBooted(true);
    // Auto unmute on boot to play music & chime
    toggleMute();
    setTimeout(() => {
      audioSynth.playSelect();
    }, 150);
  }, [interact, toggleMute]);

  const handleToggleTheme = () => {
    playSelect();
    const nextTheme = !isLightTheme;
    setIsLightTheme(nextTheme);
    localStorage.setItem('ps5_theme', nextTheme ? 'light' : 'dark');
  };

  // Keyboard boot trigger
  useEffect(() => {
    if (booted) return;
    const handleGlobalKeyDown = () => {
      handleBootSystem();
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [booted, handleBootSystem]);

  // Filter items in horizontal list based on active tab
  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (activeTab === 'profile') {
      return item.id === 'home' || item.id === 'resume';
    } else {
      return item.id === 'eshop' || item.id === 'eshop-admin' || item.id === 'briing' || item.id === 'briing-website' || item.id === 'offlineai';
    }
  });

  const activeItem = PORTFOLIO_ITEMS.find((item) => item.id === activeId) || PORTFOLIO_ITEMS[0];

  const getActiveBgGradient = () => {
    if (!isLightTheme) return activeItem.bgGradient;
    
    // Premium custom Light Theme Gradients for each view
    switch (activeItem.id) {
      case 'home':
        return "radial-gradient(circle at center, rgba(235, 243, 255, 0.95) 0%, rgba(195, 210, 230, 1) 100%)";
      case 'eshop':
        return "radial-gradient(circle at center, rgba(250, 240, 255, 0.95) 0%, rgba(220, 200, 250, 1) 100%)";
      case 'eshop-admin':
        return "radial-gradient(circle at center, rgba(240, 255, 250, 0.95) 0%, rgba(190, 240, 220, 1) 100%)";
      case 'briing':
        return "radial-gradient(circle at center, rgba(240, 253, 255, 0.95) 0%, rgba(190, 235, 250, 1) 100%)";
      case 'briing-website':
        return "radial-gradient(circle at center, rgba(240, 253, 255, 0.95) 0%, rgba(190, 235, 250, 1) 100%)";
      case 'offlineai':
        return "radial-gradient(circle at center, rgba(255, 245, 237, 0.95) 0%, rgba(250, 210, 180, 1) 100%)";
      case 'resume':
        return "radial-gradient(circle at center, rgba(255, 253, 240, 0.95) 0%, rgba(245, 225, 180, 1) 100%)";
      default:
        return "radial-gradient(circle at center, rgba(235, 243, 255, 0.95) 0%, rgba(195, 210, 230, 1) 100%)";
    }
  };

  return (
    <main className={`ps5-os-root ${isLightTheme ? 'light-theme' : ''}`} style={{ background: getActiveBgGradient() }}>
      {/* Golden/White floating particles background (PS5 Theme feel) */}
      <div className="ps5-dynamic-particles">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
      </div>

      {!booted ? (
        // Immersive Software Development Welcome Boot Screen
        <div className="ps5-boot-screen animate-fade-in" onClick={handleBootSystem}>
          <div className="boot-branding">
            <div className="ps-icon-logo">
              {/* Custom Vector PS Shape Logo */}
              <svg viewBox="0 0 100 100" className="ps-vector-logo">
                <path d="M45,15 C55,15 65,22 65,35 C65,48 55,55 45,55 L45,85 L35,85 L35,15 Z" fill="#ffffff" />
                <path d="M30,55 C45,55 55,62 55,75 C55,88 45,95 30,95 L5,95 L5,85 L30,85 Z" fill="#ffffff" opacity="0.8" />
                <path d="M45,55 Q60,55 75,65 Q90,75 95,85 L75,85 Q65,75 45,55" fill="#ffffff" opacity="0.6" />
              </svg>
            </div>
            <h1>PRAISE'S SOFTWARE DEVELOPMENT PORTFOLIO</h1>
            <p className="boot-subtitle">System Software Version 5.0.0.CODER</p>
          </div>

          <div className="boot-prompt">
            <span className="prompt-text">Click or Press any key to Continue</span>
          </div>

          <div className="boot-footer">
            <span>© 2026 Praise Chitumba. Engineered with Passion.</span>
          </div>
        </div>
      ) : (
        // Complete PS5 Dashboard Panel
        <div className="ps5-dashboard animate-fade-in">
          <TopBar
            isMuted={isMuted}
            toggleMute={toggleMute}
            playSelect={playSelect}
            playClose={playClose}
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            isLightTheme={isLightTheme}
            toggleTheme={handleToggleTheme}
          />

          <section className="ps5-main-content">
            <Carousel
              items={filteredItems}
              activeId={activeId}
              setActiveId={setActiveId}
              playNav={playNav}
            />

            <DetailView
              activeItem={activeItem}
              playSelect={playSelect}
              playTrophy={playTrophy}
              onUnlockTrophy={handleUnlockTrophy}
            />
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
