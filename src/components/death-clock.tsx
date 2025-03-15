// DeathClock.tsx
import React, { useEffect, useRef, useState } from 'react';

interface LanguageFlag {
  code: string;
  name: string;
  flag: string;
}

const DeathClock: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(
    localStorage.getItem('isMuted') === 'false' ? false : true
  );
  const tickSoundRef = useRef<HTMLAudioElement>(null);
  const languageDialogRef = useRef<HTMLDialogElement>(null);
  const deathYearDialogRef = useRef<HTMLDialogElement>(null);
  const languageOptionsContainerRef = useRef<HTMLDivElement>(null);
  const [titleDisplay, setTitleDisplay] = useState<HTMLDivElement | null>(null);
  const [locale, setLocale] = useState<string>(getLocale());
  const [deathYear, setDeathYear] = useState<number | null>(
    localStorage.getItem('deathYear') ? parseInt(localStorage.getItem('deathYear')!) : null
  );

  // array of JavaScript supported languages for local dates (not definitive)
  const languageFlags: LanguageFlag[] = [
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
    { code: 'cs-CZ', name: 'Czech (Czech Republic)', flag: '🇨🇿' },
    { code: 'da-DK', name: 'Danish (Denmark)', flag: '🇩🇰' },
    { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
    { code: 'el-GR', name: 'Greek (Greece)', flag: '🇬🇷' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
    { code: 'fi-FI', name: 'Finnish (Finland)', flag: '🇫🇮' },
    { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
    { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
    { code: 'he-IL', name: 'Hebrew (Israel)', flag: '🇮🇱' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'hu-HU', name: 'Hungarian (Hungary)', flag: '🇭🇺' },
    { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
    { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
    { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱' },
    { code: 'no-NO', name: 'Norwegian (Norway)', flag: '🇳🇴' },
    { code: 'pl-PL', name: 'Polish (Poland)', flag: '🇵🇱' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
    { code: 'ro-RO', name: 'Romanian (Romania)', flag: '🇷🇴' },
    { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
    { code: 'sv-SE', name: 'Swedish (Sweden)', flag: '🇸🇪' },
    { code: 'th-TH', name: 'Thai (Thailand)', flag: '🇹🇭' },
    { code: 'tr-TR', name: 'Turkish (Turkey)', flag: '🇹🇷' },
    { code: 'vi-VN', name: 'Vietnamese (Vietnam)', flag: '🇻🇳' },
    { code: 'zh-CN', name: 'Chinese (Simplified, China)', flag: '🇨🇳' },
  ];

  const RADIUS = 140; // Radius of the circle for flag buttons

  // map for default regions based on languageFlags
  const defaultRegions = languageFlags.reduce((map: Record<string, string>, lang) => {
    const baseLang = lang.code.split('-')[0]; // Extract the base language (e.g., 'en' from 'en-US')
    if (!map[baseLang]) {
      map[baseLang] = lang.code;
    }
    return map;
  }, {});

  function getLocale(): string {
    // Get the primary language from navigator.languages or fallback to navigator.language
    let language = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';

    // Not all browsers return the complete lang code so we have to add it from the mapped values
    if (language.length === 2) {
      language = defaultRegions[language] || `${language}-${language.toUpperCase()}`;
    }
    return language;
  }

  useEffect(() => {
    updateSoundState();

    // Ensure sound starts playing when user interacts with the page
    const handleInitialClick = () => {
      if (!isMuted && tickSoundRef.current) {
        tickSoundRef.current.volume = 0.2;
        tickSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    };

    document.addEventListener('click', handleInitialClick, { once: true });

    // Check if death year is already stored
    const storedDeathYear = localStorage.getItem('deathYear');
    if (storedDeathYear) {
      setDeathYear(parseInt(storedDeathYear));
    } else {
      deathYearDialogRef.current?.showModal();
    }

    return () => {
      document.removeEventListener('click', handleInitialClick);
    };
  }, []);

  useEffect(() => {
    if (deathYear !== null) {
      const timer = setInterval(updateCountdownTimer, 1000);
      updateCountdownTimer();
      return () => clearInterval(timer);
    }
  }, [deathYear]);

  function updateSoundState() {
    if (tickSoundRef.current) {
      if (isMuted) {
        tickSoundRef.current.pause();
      } else {
        // Ensure volume is set and play
        tickSoundRef.current.volume = 0.2;
        tickSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      localStorage.setItem('isMuted', String(isMuted));
    }
  }

  function toggleSound() {
    setIsMuted(!isMuted);
  }

  useEffect(() => {
    updateSoundState();
  }, [isMuted]);

  function openDialog() {
    languageDialogRef.current?.showModal();
    createLanguageOptions();
    addDialogCloseListener();
  }

  function closeDialog() {
    languageDialogRef.current?.close();
    removeLanguageOptions();
    removeDialogCloseListener();
  }

  function createLanguageOptions() {
    if (!languageOptionsContainerRef.current) return;
    
    const containerWidth = languageOptionsContainerRef.current.offsetWidth;
    const containerHeight = languageOptionsContainerRef.current.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    languageFlags.forEach((lang, index, arr) => {
      const angle = (index / arr.length) * 2 * Math.PI;
      const x = centerX + RADIUS * Math.cos(angle);
      const y = centerY + RADIUS * Math.sin(angle);

      const radioWrapper = document.createElement('label');
      radioWrapper.title = lang.name;
      radioWrapper.style.left = `${x}px`;
      radioWrapper.style.top = `${y}px`;

      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = 'language';
      radioInput.value = lang.code;

      if (lang.code === locale) {
        radioInput.checked = true;
        radioWrapper.classList.add('active');
      }

      const flag = document.createElement('span');
      flag.classList.add('flag-icon');
      flag.innerText = lang.flag;

      radioWrapper.appendChild(radioInput);
      radioWrapper.appendChild(flag);
      languageOptionsContainerRef.current.appendChild(radioWrapper);

      // Handle hover: display language name in the center of the parent container
      radioWrapper.addEventListener('mouseover', () => showTitle(lang.name));
      radioWrapper.addEventListener('mouseleave', () => hideTitle());

      radioInput.addEventListener('change', () => {
        setLocale(radioInput.value);
        setCurrentLangDisplay(lang);
        document.querySelector('label.active')?.classList.remove('active');
        radioWrapper.classList.add('active');
        closeDialog();
      });
    });
  }

  function showTitle(languageName: string) {
    if (titleDisplay) {
      titleDisplay.remove();
    }
    
    if (languageOptionsContainerRef.current) {
      const newTitleDisplay = document.createElement('div');
      newTitleDisplay.classList.add('language-title');
      newTitleDisplay.textContent = languageName;
      languageOptionsContainerRef.current.appendChild(newTitleDisplay);
      setTitleDisplay(newTitleDisplay);
    }
  }

  function hideTitle() {
    if (titleDisplay) {
      titleDisplay.textContent = '';
    }
  }

  function setCurrentLangDisplay(lang: LanguageFlag) {
    const currentLangDisplay = document.getElementById('current-lang');
    if (currentLangDisplay) {
      currentLangDisplay.textContent = lang.flag;
      currentLangDisplay.title = lang.name;
    }
    showTitle(lang.name);
  }

  function removeLanguageOptions() {
    if (languageOptionsContainerRef.current) {
      languageOptionsContainerRef.current.innerHTML = '';
    }
  }

  function addDialogCloseListener() {
    languageDialogRef.current?.addEventListener('click', closeDialogOnClickOutside);
  }

  function removeDialogCloseListener() {
    languageDialogRef.current?.removeEventListener('click', closeDialogOnClickOutside);
  }

  function closeDialogOnClickOutside(e: MouseEvent) {
    if (e.target === languageDialogRef.current) {
      closeDialog();
    }
  }

  function handleDeathYearSubmit() {
    const deathYearInput = document.getElementById('death-year') as HTMLInputElement;
    const year = parseInt(deathYearInput.value);
    if (year >= 2024 && year <= 2100) {
      setDeathYear(year);
      localStorage.setItem('deathYear', year.toString());
      deathYearDialogRef.current?.close();
    } else {
      alert('Please enter a year between 2024 and 2100');
    }
  }

  function updateCountdownTimer() {
    if (!deathYear) return;
    
    const countdownTimerElement = document.getElementById('countdown-timer');
    if (!countdownTimerElement) return;

    const now = new Date();
    const deathDate = new Date(deathYear, 0, 1); // January 1st of death year
    const timeLeft = deathDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
      countdownTimerElement.textContent = 'Time\'s up!';
      return;
    }

    const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownTimerElement.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <>
      <dialog id="language-dialog" ref={languageDialogRef}>
        <button
          type="button"
          id="btn-dialog-close"
          className="btn-dialog-close"
          autoFocus
          onClick={closeDialog}
        >
          &#10005;
        </button>
        <div id="language-options" className="language-options" ref={languageOptionsContainerRef}></div>
      </dialog>

      <dialog id="death-year-dialog" ref={deathYearDialogRef}>
        <button
          type="button"
          id="btn-death-dialog-close"
          className="btn-dialog-close"
          autoFocus
          onClick={() => deathYearDialogRef.current?.close()}
        >
          &#10005;
        </button>
        <div className="death-year-input-container">
          <h2>Enter Your Expected Death Year</h2>
          <input
            type="number"
            id="death-year"
            min="2024"
            max="2100"
            placeholder="Enter year (2024-2100)"
          />
          <button type="button" id="submit-death-year" onClick={handleDeathYearSubmit}>
            Submit
          </button>
        </div>
      </dialog>

      <div className="sound-control">
        <audio id="tick-sound" ref={tickSoundRef} loop>
          <source src="./sounds/ticking.mp3" type="audio/mpeg" />
        </audio>
        <button 
          id="sound-toggle" 
          className="sound-toggle" 
          data-muted={isMuted}
          onClick={toggleSound}
        >
          <svg
            className="sound-on"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="sound-off"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 9L17 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 9L23 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default DeathClock;