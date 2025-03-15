import React, { useEffect, useRef, useState } from "react";
import sound from "../assets/sounds/clock.mp3";

const DeathClock: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(
    localStorage.getItem("isMuted") === "false" ? false : true
  );
  const tickSoundRef = useRef<HTMLAudioElement>(null);
  const languageDialogRef = useRef<HTMLDialogElement>(null);
  const deathYearDialogRef = useRef<HTMLDialogElement>(null);
  const languageOptionsContainerRef = useRef<HTMLDivElement>(null);
  const [deathYear, setDeathYear] = useState<number | null>(
    localStorage.getItem("deathYear")
      ? parseInt(localStorage.getItem("deathYear")!)
      : null
  );

  useEffect(() => {
    const handleInitialClick = () => {
      if (!isMuted && tickSoundRef.current) {
        tickSoundRef.current.volume = 0.2;
        tickSoundRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    };

    document.addEventListener("click", handleInitialClick, { once: true });

    const storedDeathYear = localStorage.getItem("deathYear");
    if (storedDeathYear) {
      setDeathYear(parseInt(storedDeathYear));
    } else {
      deathYearDialogRef.current?.showModal();
    }

    return () => {
      document.removeEventListener("click", handleInitialClick);
    };
  }, [setDeathYear, isMuted]);

  useEffect(() => {
    if (deathYear !== null) {
      const timer = setInterval(updateCountdownTimer, 1000);
      updateCountdownTimer();
      return () => clearInterval(timer);
    }
  });

  function toggleSound() {
    setIsMuted(!isMuted);
  }

  useEffect(() => {
    if (tickSoundRef.current) {
      if (isMuted) {
        tickSoundRef.current.pause();
      } else {
        // Ensure volume is set and play
        tickSoundRef.current.volume = 0.2;
        tickSoundRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
      localStorage.setItem("isMuted", String(isMuted));
    }
  });

  function closeDialog() {
    languageDialogRef.current?.close();
    removeLanguageOptions();
    removeDialogCloseListener();
  }

  function removeLanguageOptions() {
    if (languageOptionsContainerRef.current) {
      languageOptionsContainerRef.current.innerHTML = "";
    }
  }

  function removeDialogCloseListener() {
    languageDialogRef.current?.removeEventListener(
      "click",
      closeDialogOnClickOutside
    );
  }

  function closeDialogOnClickOutside(e: MouseEvent) {
    if (e.target === languageDialogRef.current) {
      closeDialog();
    }
  }

  function handleDeathYearSubmit() {
    const deathYearInput = document.getElementById(
      "death-year"
    ) as HTMLInputElement;
    const year = parseInt(deathYearInput.value);
    if (year >= 2024 && year <= 2100) {
      setDeathYear(year);
      localStorage.setItem("deathYear", year.toString());
      deathYearDialogRef.current?.close();
    } else {
      alert("Please enter a year between 2024 and 2100");
    }
  }

  function updateCountdownTimer() {
    if (!deathYear) return;

    const countdownTimerElement = document.getElementById("countdown-timer");
    if (!countdownTimerElement) return;

    const now = new Date();
    const deathDate = new Date(deathYear, 0, 1); // January 1st of death year
    const timeLeft = deathDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
      countdownTimerElement.textContent = "Time's up!";
      return;
    }

    const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownTimerElement.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <>
      <div>
        <dialog className="h-full" ref={deathYearDialogRef}>
          <div className="death-year-input-container backdrop-blur-xs w-screen h-full items-center justify-center">
            <h2 className="text-xl">Enter Your Deadline Year</h2>
            <div className="flex flex-row items-center justify-center gap-x-4">
              <input
                type="number"
                id="death-year"
                min="2025"
                max="2100"
                className="placeholder:text-white/50  focus:outline-none"
                placeholder="Enter Year (2025-2100)"
              />
              <button type="button" onClick={handleDeathYearSubmit}>
                Submit
              </button>
            </div>
          </div>
        </dialog>
      </div>

      <div className="sound-control">
        <audio ref={tickSoundRef} loop>
          <source src={sound} type="audio/mpeg" />
        </audio>
        <button
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
