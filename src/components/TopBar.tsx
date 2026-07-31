import React, { useState, useEffect } from 'react';
import profileHeadshot from '../assets/Screenshot 2026-05-12 225055.png';

interface TopBarProps {
  isMuted: boolean;
  toggleMute: () => void;
  playSelect: () => void;
  playClose: () => void;
  activeTab: 'profile' | 'projects';
  setActiveTab: (tab: 'profile' | 'projects') => void;
  isLightTheme: boolean;
  toggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isMuted,
  toggleMute,
  playSelect,
  playClose,
  activeTab,
  setActiveTab,
  isLightTheme,
  toggleTheme,
}) => {
  const [time, setTime] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem('ps5_username');
    if (!saved || saved === 'AstroCoder_99' || saved === 'chittspraise_99') {
      localStorage.setItem('ps5_username', 'Praise Chitumba');
      return 'Praise Chitumba';
    }
    return saved;
  });
  const [userTitle, setUserTitle] = useState(() => {
    const saved = localStorage.getItem('ps5_usertitle');
    if (!saved || saved === 'Level 99 Full Stack Mage') {
      localStorage.setItem('ps5_usertitle', 'Full Stack Software Engineer');
      return 'Full Stack Software Engineer';
    }
    return saved;
  });
  const [avatarIndex, setAvatarIndex] = useState(() => {
    return Number(localStorage.getItem('ps5_avatarindex') || '0');
  });

  const [editMode, setEditMode] = useState(false);
  const [inputName, setInputName] = useState(username);
  const [inputTitle, setInputTitle] = useState(userTitle);

  // Pre-made SVG avatar designs
  const avatars = [
    // Praise's Real Headshot Avatar (Index 0)
    <img
      src={profileHeadshot}
      alt="Praise Chitumba"
      className="avatar-svg"
      key="0"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block'
      }}
    />,
    // Cyberpunk Dev
    <svg viewBox="0 0 100 100" className="avatar-svg" key="1">
      <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#d946ef" strokeWidth="3" />
      <path d="M30 80 Q50 65 70 80" fill="#a21caf" />
      <circle cx="50" cy="45" r="18" fill="#fbcfe8" />
      <rect x="35" y="38" width="30" height="10" fill="#1e1b4b" rx="2" />
      <line x1="35" y1="43" x2="65" y2="43" stroke="#06b6d4" strokeWidth="2" />
      <path d="M42 22 L58 22 L65 30 L35 30 Z" fill="#ec4899" />
    </svg>,
    // Kratos Dev
    <svg viewBox="0 0 100 100" className="avatar-svg" key="2">
      <circle cx="50" cy="50" r="48" fill="#450a0a" stroke="#dc2626" strokeWidth="3" />
      <path d="M30 80 Q50 68 70 80" fill="#7f1d1d" />
      <circle cx="50" cy="45" r="18" fill="#e2e8f0" />
      {/* Red tattoo stripe */}
      <path d="M44 27 C44 27 48 35 48 45 C48 55 45 60 45 60" stroke="#dc2626" strokeWidth="5" fill="none" />
      <path d="M45 52 Q50 56 55 52" stroke="#450a0a" strokeWidth="2" fill="none" />
      {/* Dark beard */}
      <path d="M35 50 Q50 65 65 50 Q50 62 35 50" fill="#111827" />
    </svg>,
    // Spider Code Avatar
    <svg viewBox="0 0 100 100" className="avatar-svg" key="3">
      <circle cx="50" cy="50" r="48" fill="#7f1d1d" stroke="#1d4ed8" strokeWidth="3" />
      <path d="M30 80 Q50 65 70 80" fill="#1e3a8a" />
      <circle cx="50" cy="45" r="18" fill="#b91c1c" />
      {/* Web Lines */}
      <line x1="50" y1="27" x2="50" y2="63" stroke="#111" strokeWidth="1" />
      <line x1="32" y1="45" x2="68" y2="45" stroke="#111" strokeWidth="1" />
      {/* Spider Eyes */}
      <path d="M38 42 Q44 48 46 41 Q43 36 38 42 Z" fill="#ffffff" stroke="#111" strokeWidth="1.5" />
      <path d="M62 42 Q56 48 54 41 Q57 36 62 42 Z" fill="#ffffff" stroke="#111" strokeWidth="1.5" />
    </svg>
  ];

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveProfile = () => {
    playSelect();
    setUsername(inputName);
    setUserTitle(inputTitle);
    localStorage.setItem('ps5_username', inputName);
    localStorage.setItem('ps5_usertitle', inputTitle);
    setEditMode(false);
  };

  const cycleAvatar = () => {
    playSelect();
    const nextIndex = (avatarIndex + 1) % avatars.length;
    setAvatarIndex(nextIndex);
    localStorage.setItem('ps5_avatarindex', String(nextIndex));
  };

  return (
    <>
      <header className="ps5-topbar">
        {/* Left Side: Profile vs Projects Tabs */}
        <div className="topbar-left">
          <nav className="os-tabs">
            <button
              className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => {
                playSelect();
                setActiveTab('profile');
              }}
            >
              Profile
            </button>
            <button
              className={`tab-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => {
                playSelect();
                setActiveTab('projects');
              }}
            >
              Projects
            </button>
          </nav>
        </div>

        {/* Right Side: Status Widgets */}
        <div className="topbar-right">
          {/* Ambient Audio Toggle */}
          <button
            className={`icon-btn audio-toggle-btn ${!isMuted ? 'playing' : ''}`}
            onClick={toggleMute}
            aria-label="Toggle Background Music"
            title="Ambient Music Toggle"
          >
            {isMuted ? (
              // Muted Icon
              <svg viewBox="0 0 24 24" className="topbar-icon" fill="currentColor">
                <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.04.66-1.64.84-.4.12-.64.51-.59.93.06.47.49.81.96.72.84-.25 1.62-.67 2.29-1.22l2.18 2.18c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63a.996.996 0 0 0-1.42 0zM11 5.41v3.17l2.25 2.25 1.34-1.34c.14-.14.28-.31.36-.5.42-.99.27-2.15-.49-2.91L12.7 4.7c-.63-.62-1.7-.18-1.7.71z" />
              </svg>
            ) : (
              // Sound Wave / Playing Icon
              <svg viewBox="0 0 24 24" className="topbar-icon" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1z" />
              </svg>
            )}
            <span className="audio-status-glow"></span>
          </button>

          {/* System Clock */}
          <span className="system-time">{time}</span>

          {/* Settings Gear Button (Theme Toggle) */}
          <button
            className={`icon-btn theme-toggle-btn ${isLightTheme ? 'light' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title="Toggle Light/Dark Theme"
          >
            <svg viewBox="0 0 24 24" className="topbar-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          {/* Clickable Profile Avatar */}
          <button
            className="topbar-profile-btn"
            onClick={() => {
              playSelect();
              setShowProfileModal(true);
            }}
            aria-label="View Profile"
          >
            <div className="topbar-avatar-container">
              {avatars[avatarIndex]}
            </div>
          </button>
        </div>
      </header>

      {/* Profile & Avatar Customization Modal */}
      {showProfileModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal ps5-card animate-fade-in">
            <div className="profile-modal-header">
              <h3>SYSTEM PROFILE</h3>
              <button
                className="ps5-close-btn"
                onClick={() => {
                  playClose();
                  setShowProfileModal(false);
                  setEditMode(false);
                }}
              >
                ✕ Close
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="avatar-edit-section">
                <div className="avatar-large" onClick={cycleAvatar} title="Click to Change Avatar">
                  {avatars[avatarIndex]}
                  <div className="avatar-hover-overlay">
                    <span>CHANGE</span>
                  </div>
                </div>
                <p className="avatar-hint">Click avatar to cycle design</p>
              </div>

              <div className="profile-details-section">
                {!editMode ? (
                  <>
                    <h2 className="profile-username">{username}</h2>
                    <p className="profile-title">{userTitle}</p>
                    <button
                      className="ps5-primary-btn edit-btn active"
                      onClick={() => {
                        playSelect();
                        setEditMode(true);
                        setInputName(username);
                        setInputTitle(userTitle);
                      }}
                    >
                      EDIT PROFILE
                    </button>
                  </>
                ) : (
                  <div className="profile-edit-inputs">
                    <div className="input-group">
                      <label>ONLINE ID</label>
                      <input
                        type="text"
                        maxLength={25}
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Online ID"
                      />
                    </div>
                    <div className="input-group">
                      <label>TITLE / CLASS</label>
                      <input
                        type="text"
                        maxLength={40}
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        placeholder="Level 99 Coder"
                      />
                    </div>
                    <div className="edit-actions">
                      <button className="ps5-primary-btn active" onClick={handleSaveProfile}>
                        SAVE
                      </button>
                      <button
                        className="ps5-secondary-btn"
                        onClick={() => {
                          playClose();
                          setEditMode(false);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
