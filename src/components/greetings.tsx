import { useState, useEffect } from "react";

const Greetings = () => {
  const [greeting, setGreeting] = useState<string>("Good morning");
  const [currentDate, setCurrentDate] = useState<string>("");

  const locale = "en-US";

  const updateGreeting = (): void => {
    const hour = new Date().getHours();
    let newGreeting = "Good morning";

    if (hour >= 12 && hour < 17) {
      newGreeting = "Good afternoon";
    } else if (hour >= 17) {
      newGreeting = "Good evening";
    }

    setGreeting(newGreeting);
  };

  const updateDate = (): void => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Date().toLocaleDateString(locale, options);
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    updateGreeting();
    updateDate();

    const intervalId = setInterval(() => {
      updateGreeting();
      updateDate();
    }, 60000);

    return () => clearInterval(intervalId);
  });

  return (
    <div className="greeting-section">
      <h1 id="greeting">{greeting}</h1>
      <div className="date" id="current-date">
        {currentDate}
      </div>
    </div>
  );
};

export default Greetings;
