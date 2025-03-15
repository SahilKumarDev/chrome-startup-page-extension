import BankBalance from "./bank-balance";
import QuickLinks from "./quick-links";
import Quote from "./quote";
import TodayGoal from "./today-goal";

const LeftSection = () => {
  return (
    <div className="left-section">
      <div className="greeting-section">
        <h1 id="greeting">Good morning</h1>
        <div className="date" id="current-date">
          Monday, March 6
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-engine-select">
            <button id="search-engine-btn" className="search-engine-btn">
              <img
                id="search-engine-icon"
                src="https://www.google.com/favicon.ico"
                alt="Search Engine"
                width="24"
                height="24"
              />
              <span className="arrow-down">▼</span>
            </button>
            <div className="search-engine-dropdown">
              <div
                className="search-engine-option"
                data-engine="google"
                data-icon="https://www.google.com/favicon.ico"
                data-url="https://www.google.com/search?q="
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width="24"
                  height="24"
                />
                <span>Google</span>
              </div>
              <div
                className="search-engine-option"
                data-engine="bing"
                data-icon="https://www.bing.com/favicon.ico"
                data-url="https://www.bing.com/search?q="
              >
                <img
                  src="https://www.bing.com/favicon.ico"
                  alt="Bing"
                  width="24"
                  height="24"
                />
                <span>Bing</span>
              </div>
              <div
                className="search-engine-option"
                data-engine="duckduckgo"
                data-icon="https://duckduckgo.com/favicon.ico"
                data-url="https://duckduckgo.com/?q="
              >
                <img
                  src="https://duckduckgo.com/favicon.ico"
                  alt="DuckDuckGo"
                  width="24"
                  height="24"
                />
                <span>DuckDuckGo</span>
              </div>
              <div
                className="search-engine-option"
                data-engine="chatgpt"
                data-icon="https://chat.openai.com/favicon.ico"
                data-url="https://chat.openai.com/?q="
              >
                <img
                  src="https://chat.openai.com/favicon.ico"
                  alt="ChatGPT"
                  width="24"
                  height="24"
                />
                <span>ChatGPT</span>
              </div>
            </div>
          </div>
          <input
            type="text"
            id="search-input"
            placeholder="Type anything and press Enter to search..."
          />
          <button id="search-button">
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <QuickLinks />
      
      <Quote />

      <TodayGoal />

      <BankBalance />
    </div>
  );
};

export default LeftSection;
