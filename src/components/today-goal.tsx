import React, { useEffect, useState } from "react";

const TodayGoal: React.FC = () => {
  const [goal, setGoal] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load saved goal from localStorage on component mount
  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) {
      setGoal(savedGoal);
    }
  }, []);

  // Save goal with debounce
  let saveTimeout: ReturnType<typeof setTimeout>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newGoal = e.target.value;
    setGoal(newGoal);
    setIsSaving(true);
    setIsSaved(false);

    // Clear previous timeout
    clearTimeout(saveTimeout);

    // Set new timeout to save after 500ms of no typing
    saveTimeout = setTimeout(() => {
      localStorage.setItem("dailyGoal", newGoal);
      setIsSaving(false);
      setIsSaved(true);

      // Remove saved class after animation
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 500);
  };

  // Save on blur (when user clicks away)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const newGoal = e.target.value;
    localStorage.setItem("dailyGoal", newGoal);
    setIsSaving(false);
    setIsSaved(true);

    // Remove saved class after animation
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="goal-section">
      <div className="goal-header">
        <h3 className="font-bold">Today's Goal :</h3>
      </div>
      <div className="goal-content">
        <input
          type="text"
          className={`goal-input ${isSaving ? "saving" : ""} ${
            isSaved ? "saved" : ""
          }`}
          placeholder="Write your goal here..."
          value={goal}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default TodayGoal;
