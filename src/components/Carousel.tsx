import React from 'react';
import type { DetailItem } from './DetailView';
import eshopIcon from '../assets/ChatGPT Image Jul 4, 2026, 12_19_18 AM.png';
import briingIcon from '../assets/Voyage avec sourire dans l’aéroport.png';
import profileHeadshot from '../assets/Screenshot 2026-05-12 225055.png';
import fnbIcon from '../assets/FNB-App-Academy-2025-image.jpg';
import briingWebIcon from '../assets/Screenshot 2026-08-07 140316.png';
import offlineAIIcon from '../assets/offlineai-1.png';

interface CarouselProps {
  items: DetailItem[];
  activeId: string;
  setActiveId: (id: string) => void;
  playNav: () => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  activeId,
  setActiveId,
  playNav,
}) => {
  const handleSelectCard = (id: string) => {
    if (id === activeId) return;
    playNav();
    setActiveId(id);
  };

  // Maps item IDs to their corresponding original render cover SVGs or images
  const getCoverIndex = (id: string) => {
    const originalOrder = ['home', 'eshop', 'eshop-admin', 'briing', 'resume', 'snake', 'briing-website', 'offlineai'];
    const idx = originalOrder.indexOf(id);
    return idx !== -1 ? idx : 0;
  };

  // Pre-made custom SVG covers or imported images for each game/card
  const renders = [
    // Welcome / Praise Studio Cover (Index 0) - Praise's Professional headshot
    <img
      src={profileHeadshot}
      alt="Praise Chitumba"
      key="0"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        display: 'block'
      }}
    />,

    // eshop Commerce Cover (Index 1) - Groceries Basket Image
    <img
      src={eshopIcon}
      alt="eshop"
      key="1"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        display: 'block'
      }}
    />,

    // eshop-admin Cover (Index 2) - Purple eCommerce Cart SVG
    <svg viewBox="0 0 120 120" className="card-cover-svg" key="2">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#grad1)" />
      <g transform="translate(10, 10)">
        {/* Shopping cart + Forge anvil concept */}
        <path d="M 20 25 L 35 25 L 45 60 L 75 60 L 85 35 L 30 35" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="48" cy="72" r="6" fill="#f0abfc" />
        <circle cx="72" cy="72" r="6" fill="#f0abfc" />
        {/* Glow anvil bottom */}
        <path d="M 35 55 L 65 55 L 60 48 L 40 48 Z" fill="#e879f9" />
      </g>
    </svg>,

    // briing Realtime Dispatch Cover (Index 3) - Travelling Suitcase Image
    <img
      src={briingIcon}
      alt="briing"
      key="3"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        display: 'block'
      }}
    />,

    // Resume / Achievements Cover (Index 4) - FNB App Academy Image
    <img
      src={fnbIcon}
      alt="FNB Achievements"
      key="4"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        display: 'block'
      }}
    />,

    // Retro Snake / Slither Game Cover (Index 5)
    <svg viewBox="0 0 120 120" className="card-cover-svg" key="5">
      <defs>
        <linearGradient id="grad5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#grad5)" />
      {/* Dynamic pixel art snake and apple */}
      <g transform="translate(10, 10)">
        {/* TV CRT Grid Frame */}
        <rect width="100" height="100" rx="12" fill="none" stroke="#334155" strokeWidth="3" />
        {/* Snake blocks */}
        <rect x="25" y="45" width="14" height="14" rx="3" fill="#22c55e" />
        <rect x="41" y="45" width="14" height="14" rx="3" fill="#22c55e" />
        <rect x="41" y="29" width="14" height="14" rx="3" fill="#15803d" />
        {/* Snake Eyes on head */}
        <circle cx="46" cy="34" r="2" fill="#fff" />
        <circle cx="50" cy="34" r="2" fill="#fff" />
        {/* Neon Apple */}
        <circle cx="75" cy="65" r="8" fill="#ef4444" />
        <path d="M 75 57 Q 77 53 79 55" stroke="#22c55e" strokeWidth="2" fill="none" />
      </g>
    </svg>,

    // briing-website Cover (Index 6)
    <img
      src={briingWebIcon}
      alt="briing website"
      key="6"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        display: 'block'
      }}
    />,

    // OfflineAI Cover (Index 7) - Neon "AI" home screen
    <img
      src={offlineAIIcon}
      alt="OfflineAI"
      key="7"
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '14px',
        objectFit: 'cover',
        objectPosition: '72% 50%',
        display: 'block'
      }}
    />,
  ];

  return (
    <div className="ps5-carousel-wrapper">
      <div className="ps5-carousel">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const coverIndex = getCoverIndex(item.id);
          return (
            <div
              key={item.id}
              className={`carousel-card-container ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectCard(item.id)}
              onMouseEnter={() => {
                if (!isActive) playNav();
              }}
            >
              <div className="card-box">
                {renders[coverIndex] || (
                  <div className="card-default-cover">
                    <span>{item.iconText}</span>
                  </div>
                )}
                <div className="card-os-glow"></div>
              </div>
              <p className="card-title-under">{item.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
