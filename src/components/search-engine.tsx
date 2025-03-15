import React, { useState, useEffect } from "react";

interface SearchEngineOption {
  engine: string;
  icon: string;
  url: string;
}

const SearchEngine: React.FC = () => {
  const [currentSearchEngine, setCurrentSearchEngine] =
    useState<SearchEngineOption>({
      engine: "google",
      icon: "https://www.google.com/favicon.ico",
      url: "https://www.google.com/search?q=",
    });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const savedEngine = localStorage.getItem("searchEngine");
    if (savedEngine) {
      setCurrentSearchEngine(JSON.parse(savedEngine));
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = currentSearchEngine.url + encodeURIComponent(searchQuery);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-engine-select">
          <img
            src={currentSearchEngine.icon}
            alt="Search Engine"
            width="20"
            height="20"
          />
        </div>

        <input
          type="text"
          id="search-input"
          placeholder="Search anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="search-button" onClick={handleSearch}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchEngine;