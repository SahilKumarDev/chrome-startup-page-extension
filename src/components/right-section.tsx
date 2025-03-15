// RightSection.tsx
import React, { useEffect, useRef } from "react";

const RightSection: React.FC = () => {
  const clockContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drawClockFaces();
    rotateClockFaces();
  });

  function getLocale(): string {
    const languageFlags = getLanguageFlags();
    const defaultRegions = languageFlags.reduce(
      (map: Record<string, string>, lang) => {
        const baseLang = lang.code.split("-")[0];
        if (!map[baseLang]) {
          map[baseLang] = lang.code;
        }
        return map;
      },
      {}
    );

    let language =
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      "en-US";
    if (language.length === 2) {
      language =
        defaultRegions[language] || `${language}-${language.toUpperCase()}`;
    }
    return language;
  }

  function getLanguageFlags() {
    return [
      { code: "ar-SA", name: "Arabic (Saudi Arabia)", flag: "🇸🇦" },
      { code: "cs-CZ", name: "Czech (Czech Republic)", flag: "🇨🇿" },
      { code: "da-DK", name: "Danish (Denmark)", flag: "🇩🇰" },
      { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
      { code: "el-GR", name: "Greek (Greece)", flag: "🇬🇷" },
      { code: "en-US", name: "English (US)", flag: "🇺🇸" },
      { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
      { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
      { code: "es-MX", name: "Spanish (Mexico)", flag: "🇲🇽" },
      { code: "fi-FI", name: "Finnish (Finland)", flag: "🇫🇮" },
      { code: "fr-CA", name: "French (Canada)", flag: "🇨🇦" },
      { code: "fr-FR", name: "French (France)", flag: "🇫🇷" },
      { code: "he-IL", name: "Hebrew (Israel)", flag: "🇮🇱" },
      { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
      { code: "hu-HU", name: "Hungarian (Hungary)", flag: "🇭🇺" },
      { code: "it-IT", name: "Italian (Italy)", flag: "🇮🇹" },
      { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
      { code: "ko-KR", name: "Korean (South Korea)", flag: "🇰🇷" },
      { code: "nl-NL", name: "Dutch (Netherlands)", flag: "🇳🇱" },
      { code: "no-NO", name: "Norwegian (Norway)", flag: "🇳🇴" },
      { code: "pl-PL", name: "Polish (Poland)", flag: "🇵🇱" },
      { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
      { code: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
      { code: "ro-RO", name: "Romanian (Romania)", flag: "🇷🇴" },
      { code: "ru-RU", name: "Russian (Russia)", flag: "🇷🇺" },
      { code: "sv-SE", name: "Swedish (Sweden)", flag: "🇸🇪" },
      { code: "th-TH", name: "Thai (Thailand)", flag: "🇹🇭" },
      { code: "tr-TR", name: "Turkish (Turkey)", flag: "🇹🇷" },
      { code: "vi-VN", name: "Vietnamese (Vietnam)", flag: "🇻🇳" },
      { code: "zh-CN", name: "Chinese (Simplified, China)", flag: "🇨🇳" },
    ];
  }

  function drawClockFaces() {
    const clockFaces = document.querySelectorAll(".clock-face");
    const locale = getLocale();

    // Get the current date details
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentWeekday = currentDate.getDay();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    const totalDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    const weekdayNames = Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        new Date(2021, 0, i + 3)
      )
    );
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { month: "long" }).format(
        new Date(2021, i)
      )
    );

    const deathYear = localStorage.getItem("deathYear")
      ? parseInt(localStorage.getItem("deathYear")!)
      : null;

    clockFaces.forEach((clockFace) => {
      clockFace.innerHTML = "";

      const clockType = clockFace.getAttribute("data-clock");
      const numbers = parseInt(
        clockFace.getAttribute("data-numbers") || "0",
        10
      );
      const clockFaceWidth = clockFace.clientWidth;
      const RADIUS = clockFaceWidth / 2 - 20;
      const center = clockFaceWidth / 2;

      let valueSet: (string | number)[];
      let currentValue;

      switch (clockType) {
        case "seconds":
          valueSet = Array.from({ length: 60 }, (_, i) =>
            String(i).padStart(2, "0")
          );
          currentValue = String(currentSeconds).padStart(2, "0");
          break;
        case "minutes":
          valueSet = Array.from({ length: 60 }, (_, i) =>
            String(i).padStart(2, "0")
          );
          currentValue = String(currentMinutes).padStart(2, "0");
          break;
        case "hours":
          valueSet = Array.from({ length: 24 }, (_, i) =>
            String(i).padStart(2, "0")
          );
          currentValue = String(currentHours).padStart(2, "0");
          break;
        case "days":
          valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
          currentValue = currentDay;
          break;
        case "months":
          valueSet = monthNames;
          currentValue = monthNames[currentMonth];
          break;
        case "years":
          valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
          currentValue = currentYear;
          break;
        case "day-names":
          valueSet = weekdayNames;
          currentValue = weekdayNames[currentWeekday];
          break;
        default:
          return;
      }

      valueSet.forEach((value, i) => {
        const angle = i * (360 / numbers);
        const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
        const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

        const element = document.createElement("span");
        element.classList.add("number");

        if (
          clockType === "years" &&
          deathYear &&
          parseInt(String(value)) >= deathYear
        ) {
          element.classList.add("dead");
        }

        element.textContent = String(value);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        clockFace.appendChild(element);
      });

      let currentIndex;
      if (clockType === "months") {
        currentIndex = currentMonth;
      } else if (clockType === "day-names") {
        currentIndex = currentWeekday;
      } else {
        currentIndex = valueSet.indexOf(
          typeof valueSet[0] === "string"
            ? String(currentValue)
            : Number(currentValue)
        );
      }

      const rotationAngle = -((currentIndex / numbers) * 360);
      (
        clockFace as HTMLElement
      ).style.transform = `rotate(${rotationAngle}deg)`;
    });
  }

  function rotateClockFaces() {
    const clockFaces = document.querySelectorAll(".clock-face");
    const lastAngles: Record<string, number> = {};

    function updateRotations() {
      const now = new Date();
      const currentSecond = now.getSeconds();
      const currentMinute = now.getMinutes();
      const currentHour = now.getHours();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth(); // 0-indexed
      const currentYear = now.getFullYear();
      const currentWeekday = now.getDay(); // 0 = Sunday, 6 = Saturday

      clockFaces.forEach((clockFace) => {
        const clockType = clockFace.getAttribute("data-clock");
        const totalNumbers = parseInt(
          clockFace.getAttribute("data-numbers") || "0",
          10
        );

        let currentValue;
        switch (clockType) {
          case "seconds":
            currentValue = currentSecond;
            break;
          case "minutes":
            currentValue = currentMinute;
            break;
          case "hours":
            currentValue = currentHour;
            break;
          case "days":
            currentValue = currentDay - 1;
            break;
          case "months":
            currentValue = currentMonth;
            break;
          case "years":
            currentValue = currentYear - 2000;
            break;
          case "day-names":
            currentValue = currentWeekday; // 0 = Sunday
            break;
          default:
            return;
        }

        const targetAngle = (360 / totalNumbers) * currentValue;

        const clockId = clockFace.id || clockType || "";
        const lastAngle = lastAngles[clockId] || 0;

        const delta = targetAngle - lastAngle;
        const shortestDelta = ((delta + 540) % 360) - 180;

        const newAngle = lastAngle + shortestDelta;
        (clockFace as HTMLElement).style.transform = `rotate(${
          newAngle * -1
        }deg)`;

        lastAngles[clockId] = newAngle;

        const numbers = clockFace.querySelectorAll(".number");
        numbers.forEach((number, index) => {
          if (index === currentValue) {
            number.classList.add("active");
          } else {
            number.classList.remove("active");
          }
        });
      });
      requestAnimationFrame(updateRotations);
    }

    updateRotations();
  }

  return (
    <div className="right-section" ref={clockContainerRef}>
      <div className="clock-container">
        <div className="clock-title">
          <span className="title-text">Death Clock</span>
        </div>
        <div className="clock-overlay">
          <img src="https://iili.io/3qfPju2.png" alt="Clock Overlay" />
        </div>
        <div className="clock" data-date="2024-12-25">
          <div>
            <div
              data-clock="years"
              data-numbers="101"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="seconds"
              data-numbers="60"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="minutes"
              data-numbers="60"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="hours"
              data-numbers="24"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="days"
              data-numbers="31"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="months"
              data-numbers="12"
              className="clock-face"
            ></div>
          </div>
          <div>
            <div
              data-clock="day-names"
              data-numbers="7"
              className="clock-face"
            ></div>
          </div>
          <button
            type="button"
            id="current-lang"
            className="current-lang-display"
          >
            In
          </button>
        </div>
        <div className="countdown-timer"></div>
      </div>
    </div>
  );
};

export default RightSection;
