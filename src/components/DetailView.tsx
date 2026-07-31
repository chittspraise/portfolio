import React, { useState, useEffect, useCallback } from 'react';
import eshopSS1 from '../assets/WhatsApp Image 2026-07-31 at 10.19.34.jpeg';
import eshopSS2 from '../assets/WhatsApp Image 2026-07-31 at 10.19.35.jpeg';
import eshopSS3 from '../assets/WhatsApp Image 2026-07-31 at 10.19.35 (1).jpeg';
import eshopSS4 from '../assets/WhatsApp Image 2026-07-31 at 10.19.35 (2).jpeg';
import eshopSS5 from '../assets/WhatsApp Image 2026-07-31 at 10.19.35 (3).jpeg';
import eshopSS6 from '../assets/WhatsApp Image 2026-07-31 at 10.19.36.jpeg';
import adminSS1 from '../assets/Screenshot 2026-07-31 112057.png';
import adminSS2 from '../assets/Screenshot 2026-07-31 112305.png';
import briingSS1 from '../assets/WhatsApp Image 2026-07-31 at 11.48.46.jpeg';
import briingSS2 from '../assets/WhatsApp Image 2026-07-31 at 11.48.46 (1).jpeg';
import briingSS3 from '../assets/WhatsApp Image 2026-07-31 at 11.48.47.jpeg';
import briingSS4 from '../assets/WhatsApp Image 2026-07-31 at 11.48.47 (1).jpeg';
import briingSS5 from '../assets/WhatsApp Image 2026-07-31 at 11.48.48.jpeg';
import briingSS6 from '../assets/WhatsApp Image 2026-07-31 at 11.48.48 (2).jpeg';
import cvPDF from '../assets/PraiseChitumbaCV.pdf';

export interface DetailItem {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  releaseDate: string;
  rating: string;
  bgGradient: string;
  shortDesc: string;
  iconText: string;
}

interface DetailViewProps {
  activeItem: DetailItem;
  playSelect: () => void;
  playTrophy: () => void;
  onUnlockTrophy: (type: 'gold' | 'silver' | 'bronze') => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  activeItem,
  playSelect,
  playTrophy,
  onUnlockTrophy,
}) => {
  // Modal states for launching applications
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ cpu: 12, memory: 45, requests: 120 });
  const [quantumState, setQuantumState] = useState({
    blockHeight: 142, // Couriers Active
    lastHash: 'transit_00x8a92f81bc', // Active Transit ID
    balance: 1425.5, // Total Deliveries
    mining: false, // Dispatching
  });

  // Trophy Notification Popups
  const [notification, setNotification] = useState<{ title: string; desc: string; type: string } | null>(null);
  
  const triggerTrophyNotification = useCallback((title: string, desc: string, type: 'gold' | 'silver' | 'bronze') => {
    playTrophy();
    setNotification({ title, desc, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, [playTrophy]);

  // Track visited ids to unlock trophies
  useEffect(() => {
    const visited = JSON.parse(localStorage.getItem('ps5_visited_ids') || '[]');
    if (!visited.includes(activeItem.id)) {
      visited.push(activeItem.id);
      localStorage.setItem('ps5_visited_ids', JSON.stringify(visited));
      
      // Award trophy based on active item
      setTimeout(() => {
        if (activeItem.id === 'home') {
          onUnlockTrophy('bronze');
          triggerTrophyNotification('FOUNDING ENGINEER', 'Initiated Praise\'s Software Hub.', 'bronze');
        } else if (activeItem.id === 'eshop') {
          onUnlockTrophy('silver');
          triggerTrophyNotification('ESHOP EXPLORER', 'Inspected the eshop database metrics.', 'silver');
        } else if (activeItem.id === 'eshop-admin') {
          onUnlockTrophy('silver');
          triggerTrophyNotification('ADMIN CONTROL MASTER', 'Launched eshop-admin real-time telemetry.', 'silver');
        } else if (activeItem.id === 'briing') {
          onUnlockTrophy('silver');
          triggerTrophyNotification('DISPATCH DISPATCHER', 'Pinger established briing dispatcher sockets.', 'silver');
        } else if (activeItem.id === 'resume') {
          onUnlockTrophy('gold');
          triggerTrophyNotification('HISTORIAN ELITE', 'Entered the gamified Trophy Room archives.', 'gold');
        }
      }, 1500);
    }
  }, [activeItem.id, onUnlockTrophy, triggerTrophyNotification]);

  // Simulated metrics & log stream for eshop-admin
  useEffect(() => {
    if (activeItem.id === 'eshop-admin' && isDetailOpen) {
      const interval = setInterval(() => {
        // Randomize CPU & Memory slightly
        setMetrics((prev) => ({
          cpu: Math.max(5, Math.min(95, prev.cpu + Math.floor(Math.random() * 11) - 5)),
          memory: Math.max(20, Math.min(90, prev.memory + Math.floor(Math.random() * 5) - 2)),
          requests: prev.requests + Math.floor(Math.random() * 4),
        }));

        // Append random log
        const actions = [
          'Catalog Cache flushed',
          'Order #4210 completed - $89.50',
          'Low Stock Warning: Product ID #314',
          'Coupon code WELCOME50 claimed',
          'Refund Request #102 processed',
          'Product #128 catalog item created',
          'Stripe webhook checkout.session.completed received'
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        const log = `[${timestamp}] ADMIN: ${randomAction} - Success - ${Math.floor(Math.random() * 40) + 10}ms`;

        setSimulatedLogs((prev) => [...prev.slice(-14), log]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeItem.id, isDetailOpen]);

  // Handle briing courier dispatch
  const startMining = () => {
    if (quantumState.mining) return;
    playSelect();
    setQuantumState((prev) => ({ ...prev, mining: true }));
    
    setTimeout(() => {
      setQuantumState((prev) => {
        const courierReward = 1;
        const newDeliveries = prev.balance + courierReward;
        const activeCouriers = prev.blockHeight + 1;
        const transitID = 'transit_00x' + Math.random().toString(16).substring(2, 11);
        
        // Award trophy on first dispatch success
        const minedCount = Number(localStorage.getItem('ps5_mined_count') || '0') + 1;
        localStorage.setItem('ps5_mined_count', String(minedCount));
        if (minedCount === 1) {
          onUnlockTrophy('silver');
          triggerTrophyNotification('LOGISTICS MASTER', 'Successfully dispatched your first simulated briing courier route!', 'silver');
        }

        return {
          blockHeight: activeCouriers,
          lastHash: transitID,
          balance: newDeliveries,
          mining: false,
        };
      });
    }, 2000);
  };

  const handleLaunch = () => {
    playSelect();
    setIsDetailOpen(true);
  };

  return (
    <>
      {/* Trophy Notification Banner (top right, classic sliding popup) */}
      {notification && (
        <div className={`trophy-notification-popup ${notification.type}`}>
          <div className="tn-badge">
            {notification.type === 'gold' && '🏆'}
            {notification.type === 'silver' && '🥈'}
            {notification.type === 'bronze' && '🥉'}
          </div>
          <div className="tn-details">
            <span className="tn-label">TROPHY UNLOCKED!</span>
            <span className="tn-title">{notification.title}</span>
            <span className="tn-desc">{notification.desc}</span>
          </div>
        </div>
      )}

      {/* Under Carousel Game Details section */}
      <div className="ps5-selected-game-details">
        <p className="game-publisher">{activeItem.publisher}</p>
        <h1 className="game-title">{activeItem.title}</h1>
        <p className="game-release-rating">
          <span className="rating-tag">{activeItem.rating}</span>
          <span className="meta-bullet">•</span>
          <span>{activeItem.subtitle}</span>
          <span className="meta-bullet">•</span>
          <span>Release: {activeItem.releaseDate}</span>
        </p>
        <p className="game-short-description">{activeItem.shortDesc}</p>

        {activeItem.id === 'home' && (
          <div className="home-contact-row">
            <a href="mailto:praizechitts@gmail.com" className="contact-meta-tag" onClick={playSelect}>
              <svg viewBox="0 0 24 24" className="contact-icon-svg" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              praizechitts@gmail.com
            </a>
            <a href="tel:+27789857143" className="contact-meta-tag" onClick={playSelect}>
              <svg viewBox="0 0 24 24" className="contact-icon-svg" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.57 3.51 4.71 6.07 6.16l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.59.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.59.12.35.03.74-.24 1.02l-2.2 2.2z" />
              </svg>
              +27 78 985 7143
            </a>
            <span className="contact-meta-tag">
              <svg viewBox="0 0 24 24" className="contact-icon-svg" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Midrand & Cape Town
            </span>
            <a href="https://github.com/chittspraise" target="_blank" rel="noopener noreferrer" className="contact-meta-tag" onClick={playSelect}>
              <svg viewBox="0 0 24 24" className="contact-icon-svg" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
            <a href="https://linkedin.com/in/praise-chitumba-097a23409" target="_blank" rel="noopener noreferrer" className="contact-meta-tag" onClick={playSelect}>
              <svg viewBox="0 0 24 24" className="contact-icon-svg" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
          </div>
        )}

        <button className="ps5-primary-btn active launch-game-btn" onClick={handleLaunch}>
          <svg viewBox="0 0 24 24" className="play-arrow-icon" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {activeItem.id === 'snake' ? 'PLAY GAME' : activeItem.id === 'home' ? 'EXPLORE PROFILE' : 'VIEW PROJECT'}
        </button>
      </div>

      {/* Expanded Modal Overlay for Project details */}
      {isDetailOpen && (
        <div className="project-detail-overlay animate-fade-in">
          <div className="project-detail-window ps5-card">
            <div className="project-detail-header">
              <span className="project-category">{activeItem.publisher.toUpperCase()}</span>
              <h2>{activeItem.title}</h2>
              <button className="ps5-back-btn" onClick={() => { playSelect(); setIsDetailOpen(false); }}>
                <svg viewBox="0 0 24 24" className="back-arrow-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back to OS</span>
              </button>
            </div>

            <div className="project-detail-scroll-area">
              {/* Card 0: Welcome Hub / Portfolio Bio */}
              {activeItem.id === 'home' && (
                <div className="custom-detail-content bio-hub">
                  <div className="welcome-banner">
                    <div className="banner-logo">💻</div>
                    <div className="banner-text">
                      <h3>Welcome to Praise's Software Hub</h3>
                      <p>High-performance full stack software engineered for mobile & web.</p>
                    </div>
                  </div>

                  <div className="profile-grid">
                    <div className="grid-card">
                      <h4>🚀 PROFILE SUMMATION</h4>
                      <p>Results-driven Full Stack Software Engineer expert at building intuitive web and cross-platform mobile apps. Specializes in robust database design, serverless architectures, performance optimization, and seamless AI integrations.</p>
                    </div>
                    <div className="grid-card">
                      <h4>⚔️ TECH ARSENAL</h4>
                      <div className="pill-container">
                        <span className="pill react">React Native</span>
                        <span className="pill ts">Expo</span>
                        <span className="pill node">React / Next.js</span>
                        <span className="pill express">Node.js</span>
                        <span className="pill py">Python</span>
                        <span className="pill psql">PostgreSQL</span>
                        <span className="pill docker">Supabase</span>
                        <span className="pill redis">REST / GraphQL</span>
                        <span className="pill aws">Stripe SDK</span>
                        <span className="pill express">Twilio SDK</span>
                        <span className="pill ts">Deno Edge</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-cv-shelf">
                    <div className="cv-banner">
                      <div className="cv-icon">📄</div>
                      <div className="cv-text">
                        <h4>CURRICULUM VITAE (TECHNICAL DOSSIER)</h4>
                        <p>View or download Praise's complete engineering resume for offline archiving.</p>
                      </div>
                    </div>
                    <div className="cv-actions-row">
                      <a href={cvPDF} target="_blank" rel="noopener noreferrer" className="ps5-primary-btn active cv-btn" onClick={playSelect}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>VIEW CV</span>
                      </a>
                      <a href={cvPDF} download="PraiseChitumbaCV.pdf" className="ps5-secondary-btn cv-btn" onClick={playSelect}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>DOWNLOAD CV (PDF)</span>
                      </a>
                    </div>
                  </div>

                  <div className="profile-experience-timeline">
                    <h4>⏳ PROFESSIONAL CHRONOLOGY</h4>
                    <div className="timeline-items">
                      <div className="timeline-item">
                        <div className="timeline-meta">
                          <span className="timeline-date">2022 – 2024</span>
                          <span className="timeline-dot"></span>
                        </div>
                        <div className="timeline-content">
                          <h5>Full Stack Software Engineer</h5>
                          <p className="timeline-company">Drive to Own (Cape Town)</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-meta">
                          <span className="timeline-date">2021 – 2022</span>
                          <span className="timeline-dot"></span>
                        </div>
                        <div className="timeline-content">
                          <h5>Full Stack AI Solutions Developer</h5>
                          <p className="timeline-company">Qflit AI (Remote)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-contact-shelf">
                    <h4>📬 SYSTEM COMMUNICATIONS (CONTACT)</h4>
                    <div className="contact-grid">
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <div className="contact-details">
                          <label>EMAIL TRANSMISSION</label>
                          <a href="mailto:praizechitts@gmail.com" onClick={playSelect}>praizechitts@gmail.com</a>
                        </div>
                      </div>
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        <div className="contact-details">
                          <label>DEVELOPMENT TERMINAL (GITHUB)</label>
                          <a href="https://github.com/chittspraise" target="_blank" rel="noopener noreferrer" onClick={playSelect}>github.com/chittspraise</a>
                        </div>
                      </div>
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <div className="contact-details">
                          <label>PROFESSIONAL NEXUS (LINKEDIN)</label>
                          <a href="https://linkedin.com/in/praise-chitumba-097a23409" target="_blank" rel="noopener noreferrer" onClick={playSelect}>linkedin.com/in/praise-chitumba-097a23409</a>
                        </div>
                      </div>
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon" fill="currentColor">
                          <path d="M6.62 10.79c1.44 2.57 3.51 4.71 6.07 6.16l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.59.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.59.12.35.03.74-.24 1.02l-2.2 2.2z" />
                        </svg>
                        <div className="contact-details">
                          <label>VOICE COMMS LINK</label>
                          <a href="tel:+27789857143" onClick={playSelect}>+27 78 985 7143</a>
                        </div>
                      </div>
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div className="contact-details">
                          <label>OPERATIONAL SECTOR</label>
                          <span>Midrand & Cape Town, SA</span>
                        </div>
                      </div>
                      <div className="contact-item-card">
                        <svg viewBox="0 0 24 24" className="contact-card-icon animate-pulse" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <div className="contact-details">
                          <label>MISSION STATUS</label>
                          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Active & Available for Hire</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="interactive-facts-shelf">
                    <h4>CORE EXPERTISE METRICS</h4>
                    <div className="sys-metrics">
                      <div className="sys-bar">
                        <span>Mobile Development</span>
                        <div className="progress-track"><div className="progress-fill" style={{ width: '95%' }}></div></div>
                      </div>
                      <div className="sys-bar">
                        <span>Web Development</span>
                        <div className="progress-track"><div className="progress-fill" style={{ width: '95%' }}></div></div>
                      </div>
                      <div className="sys-bar">
                        <span>System Architecture</span>
                        <div className="progress-track"><div className="progress-fill" style={{ width: '90%' }}></div></div>
                      </div>
                      <div className="sys-bar">
                        <span>AI Integration</span>
                        <div className="progress-track"><div className="progress-fill" style={{ width: '90%' }}></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 1: eshop */}
              {activeItem.id === 'eshop' && (
                <div className="custom-detail-content byteforge-hub">
                  <div className="single-column-showcase">
                    <div className="full-width-gallery" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <h4 className="gallery-header">📲 MOBILE SCREENSHOTS GALLERY</h4>
                      <div className="eshop-screenshots-grid flex-row-grid">
                        <div className="phone-mockup">
                          <img src={eshopSS1} alt="eshop Screen 1" />
                        </div>
                        <div className="phone-mockup">
                          <img src={eshopSS2} alt="eshop Screen 2" />
                        </div>
                        <div className="phone-mockup">
                          <img src={eshopSS3} alt="eshop Screen 3" />
                        </div>
                        <div className="phone-mockup">
                          <img src={eshopSS4} alt="eshop Screen 4" />
                        </div>
                        <div className="phone-mockup">
                          <img src={eshopSS5} alt="eshop Screen 5" />
                        </div>
                        <div className="phone-mockup">
                          <img src={eshopSS6} alt="eshop Screen 6" />
                        </div>
                      </div>
                    </div>

                    <div className="showcase-info full-width-info">
                      <h3>🛒 eshop</h3>
                      <p className="spacious-desc">A complete full-stack e-commerce marketplace featuring an automated WhatsApp-dispatch system. When an order is placed on the client application, the system automatically geolocates and notifies nearby registered partner shops via WhatsApp webhooks. Once a shop owner accepts the order directly on WhatsApp, the recipient is instantly notified to go and collect their package.</p>
                      
                      <h4>🛠️ SYSTEM SPECS</h4>
                      <div className="pill-container spacious-pills">
                        <span className="pill">React / Vite</span>
                        <span className="pill">Node.js / Express</span>
                        <span className="pill">PostgreSQL</span>
                        <span className="pill">REST API</span>
                        <span className="pill">Redis Cache</span>
                        <span className="pill">Stripe API</span>
                      </div>

                      <h4>🔥 CORE SYSTEMS INTEGRATED</h4>
                      <ul className="spacious-list">
                        <li><strong>WhatsApp Dispatch Flow:</strong> Deployed secure Twilio WhatsApp webhooks to route orders to nearby registered shops based on geofenced radius matches, enabling local in-store collection once accepted on WhatsApp.</li>
                        <li><strong>Distributed Cache:</strong> Boosted catalog lookup speeds by 45% using Redis caching layers.</li>
                        <li><strong>Relational Database:</strong> Optimized transaction ledger designed with Postgres composite indexes.</li>
                        <li><strong>Stripe Terminal:</strong> Secure multi-currency checkout pipeline with webhook callbacks.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2: eshop-admin Portal with Telemetry Dashboard */}
              {activeItem.id === 'eshop-admin' && (
                <div className="custom-detail-content devnexus-hub">
                  <div className="single-column-showcase">
                    <div className="full-width-gallery" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <h4 className="gallery-header">💻 ADMIN PORTAL SCREENSHOTS</h4>
                      <div className="eshop-screenshots-grid">
                        <div className="browser-mockup">
                          <div className="browser-header">
                            <span className="dot dot-red"></span>
                            <span className="dot dot-yellow"></span>
                            <span className="dot dot-green"></span>
                          </div>
                          <img src={adminSS1} alt="eshop Admin Overview" />
                        </div>
                        <div className="browser-mockup">
                          <div className="browser-header">
                            <span className="dot dot-red"></span>
                            <span className="dot dot-yellow"></span>
                            <span className="dot dot-green"></span>
                          </div>
                          <img src={adminSS2} alt="eshop Admin Details" />
                        </div>
                      </div>
                    </div>

                    <div className="showcase-info full-width-info">
                      <h3>📈 eshop-admin Control Center</h3>
                      <p className="spacious-desc">The administrative console managing stock thresholds, products cataloguing, and processing analytical telemetry for the eshop platform.</p>
                      
                      <h4>🛠️ SYSTEM SPECS</h4>
                      <div className="pill-container spacious-pills">
                        <span className="pill">Next.js</span>
                        <span className="pill">FastAPI</span>
                        <span className="pill">WebSockets</span>
                        <span className="pill">MongoDB</span>
                        <span className="pill">Docker</span>
                      </div>

                      <h4>🔥 SYSTEM ADVANTAGES</h4>
                      <ul className="spacious-list">
                        <li><strong>Instant Syncing:</strong> Live Socket channels feed order progress directly into admin cards.</li>
                        <li><strong>Analytical Graphing:</strong> Highly responsive data monitoring grids tracking daily turnover metrics.</li>
                      </ul>
                    </div>

                    <div className="monitor-dashboard">
                      <span className="dashboard-title">LIVE SYSTEM METRICS</span>
                      <div className="metrics-bars-grid">
                        <div className="m-card">
                          <span className="m-label">CPU LOAD</span>
                          <span className="m-val green">{metrics.cpu}%</span>
                          <div className="m-bar"><div className="m-fill bg-green" style={{ width: `${metrics.cpu}%` }}></div></div>
                        </div>
                        <div className="m-card">
                          <span className="m-label">MEM UTIL</span>
                          <span className="m-val purple">{metrics.memory}%</span>
                          <div className="m-bar"><div className="m-fill bg-purple" style={{ width: `${metrics.memory}%` }}></div></div>
                        </div>
                        <div className="m-card">
                          <span className="m-label">REQS / SEC</span>
                          <span className="m-val blue">{metrics.requests}</span>
                        </div>
                      </div>

                      <div className="console-log-box">
                        <span className="console-title">LIVE ADMIN STREAM LOGS</span>
                        <div className="console-logs">
                          {simulatedLogs.length === 0 ? (
                            <span className="dim">System initializing...</span>
                          ) : (
                            simulatedLogs.map((log, i) => <div className="log-line" key={i}>{log}</div>)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: briing Realtime Dispatch Node */}
              {activeItem.id === 'briing' && (
                <div className="custom-detail-content quantum-hub">
                  <div className="single-column-showcase">
                    <div className="full-width-gallery" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <h4 className="gallery-header">📲 MOBILE SCREENSHOTS GALLERY</h4>
                      <div className="eshop-screenshots-grid">
                        <div className="phone-mockup">
                          <img src={briingSS1} alt="Briing Screen 1" />
                        </div>
                        <div className="phone-mockup">
                          <img src={briingSS2} alt="Briing Screen 2" />
                        </div>
                        <div className="phone-mockup">
                          <img src={briingSS3} alt="Briing Screen 3" />
                        </div>
                        <div className="phone-mockup">
                          <img src={briingSS4} alt="Briing Screen 4" />
                        </div>
                        <div className="phone-mockup">
                          <img src={briingSS5} alt="Briing Screen 5" />
                        </div>
                        <div className="phone-mockup">
                          <img src={briingSS6} alt="Briing Screen 6" />
                        </div>
                      </div>
                    </div>

                    <div className="showcase-info full-width-info">
                      <h3>🌐 Briing Peer-to-Peer Shopping</h3>
                      <p className="spacious-desc">Briing is the smart and convenient way to shop for products that are unavailable in your country or cost significantly more when bought locally. With Briing, you can request almost anything—from baby clothes and children's toys to the latest tech gadgets, fashion, beauty products, home essentials, and nutritional supplements. Our platform connects you with trusted travelers who can bring your items to you, making international shopping easier, faster, and more affordable.</p>
                      
                      <h4>🛠️ SYSTEM SPECS</h4>
                      <div className="pill-container spacious-pills">
                        <span className="pill">Go</span>
                        <span className="pill">TypeScript</span>
                        <span className="pill">WebSockets</span>
                        <span className="pill">gRPC</span>
                        <span className="pill">PostgreSQL</span>
                      </div>

                      <h4>🔥 CORE SYSTEM PROTOCOLS</h4>
                      <ul className="spacious-list">
                        <li><strong>Real-Time Map Sockets:</strong> High-speed active WebSockets streaming live traveler coordinates.</li>
                        <li><strong>Peer matching algorithms:</strong> Radius reverse-geocoding pathfinding sorting sequence dispatches.</li>
                      </ul>
                    </div>

                    <div className="showcase-visual transaction-node-builder">
                      <span className="dashboard-title">BRIING COURIER DISPATCH HUB</span>
                      <div className="quantum-stats-row">
                        <div className="q-item">
                          <span className="q-label">ACTIVE RIDERS ON ROUTE</span>
                          <span className="q-val">{quantumState.blockHeight}</span>
                        </div>
                        <div className="q-item">
                          <span className="q-label">DELIVERIES DISPATCHED</span>
                          <span className="q-val yellow">{quantumState.balance}</span>
                        </div>
                      </div>

                      <div className="block-details-box">
                        <span className="bd-label">LAST REASSIGNED TRANSIT ID</span>
                        <code className="bd-code">{quantumState.lastHash}</code>
                      </div>

                      <button
                        className={`ps5-primary-btn active mine-block-btn ${quantumState.mining ? 'loading' : ''}`}
                        onClick={startMining}
                        disabled={quantumState.mining}
                      >
                        {quantumState.mining ? 'CALCULATING OPTIMAL ROUTE...' : 'DISPATCH NEW COURIER'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 4: Resume / Experience Trophy Room */}
              {activeItem.id === 'resume' && (
                <div className="custom-detail-content resume-hub">
                  <h3 className="room-title">🏆 ARCHIVE MILESTONE ROOM</h3>
                  <p className="room-subtitle">Software engineering highlights and major professional awards. Hover or click on each milestone badge to view detailed work history archives.</p>
                  
                  <div className="trophy-shelf-grid">
                    {/* Role 1 */}
                    <div className="trophy-room-card platinum" onClick={() => playTrophy()}>
                      <div className="trophy-display">
                        <span className="trophy-img animate-bounce">🏆</span>
                        <span className="trophy-metal">PLATINUM</span>
                      </div>
                      <div className="trophy-desc-box">
                        <h4>FULL STACK SOFTWARE ENGINEER</h4>
                        <p className="company">Drive to Own (Cape Town) (2022 – 2024)</p>
                        <p className="trophy-objective"><strong>Engineering Focus:</strong> Design, build, and optimize performant vehicle rental and e-hailing mobile core systems.</p>
                        <ul className="accomplishments">
                          <li>Engineered and deployed a cross-platform mobile app using **React Native (Expo)**, optimizing start-up speeds.</li>
                          <li>Architected a fault-tolerant geocoding AsyncStorage fallback subsystem to preserve core location orders during billing locks.</li>
                          <li>Developed map tracking with reverse-geocoding autocomplete pins to determine shop eligibility radius.</li>
                          <li>Integrated Stripe payment sheets and a database-backed custom Wallet ledger system for in-app balances.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Role 2 */}
                    <div className="trophy-room-card gold" onClick={() => playTrophy()}>
                      <div className="trophy-display">
                        <span className="trophy-img">🥇</span>
                        <span className="trophy-metal">GOLD</span>
                      </div>
                      <div className="trophy-desc-box">
                        <h4>FULL STACK AI SOLUTIONS DEVELOPER</h4>
                        <p className="company">Qflit AI (2021 – 2022)</p>
                        <p className="trophy-objective"><strong>Engineering Focus:</strong> Architect full-stack AI SaaS systems and Server-Sent Event streaming interfaces.</p>
                        <ul className="accomplishments">
                          <li>Architected Next.js, Node.js, and Python AI-driven chatbot apps enabling custom prompt agent layouts.</li>
                          <li>Engineered serverless Twilio WhatsApp and SMS webhooks using Deno Edge Functions, automating vendor dispatches.</li>
                          <li>Implemented SSE (Server-Sent Events) streams in React, reducing perceived latency during LLM output generation.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Role 3 */}
                    <div className="trophy-room-card silver" onClick={() => playTrophy()}>
                      <div className="trophy-display">
                        <span className="trophy-img">🥈</span>
                        <span className="trophy-metal">SILVER</span>
                      </div>
                      <div className="trophy-desc-box">
                        <h4>FNB APP ACADEMY AWARDS & EDUCATION</h4>
                        <p className="company">University of Cape Town & FNB Academy</p>
                        <p className="trophy-objective"><strong>Major Accolade:</strong> Nominated for FNB Academy 2025 Awards – Reached Top 50 App of the Year!</p>
                        <ul className="accomplishments">
                          <li><strong>Top 50 App of the Year Nominee:</strong> Successfully selected amongst top competitive projects at FNB App Academy 2025.</li>
                          <li>Completed Full Stack Developer Certificate program at **FNB App Academy**.</li>
                          <li>Studied BSc Engineering (Incomplete) at the **University of Cape Town** (2016–2019).</li>
                          <li>Expertise: System Architecture, API Design, Mobile Apps, Real-time Sockets, and Stripe/Twilio SDKs.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
