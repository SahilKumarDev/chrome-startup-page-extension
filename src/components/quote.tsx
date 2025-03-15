import React, { useEffect, useState } from "react";

interface QuoteData {
  content: string;
  author: string;
}

const Quote: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData>({
    content: "Loading quote...",
    author: "Author",
  });

  useEffect(() => {
    const fetchDailyQuote = async (): Promise<void> => {
      try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        setQuote({
          content: data.content,
          author: data.author,
        });
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote({
          content:
            "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt",
        });
      }
    };

    fetchDailyQuote();

    const dailyQuoteInterval = setInterval(
      fetchDailyQuote,
      24 * 60 * 60 * 1000
    );

    return () => clearInterval(dailyQuoteInterval);
  }, []);

  return (
    <div className="quote-section">
      <blockquote id="daily-quote">
        <p className="quote-text">{quote.content}</p>
        <footer className="quote-author">- {quote.author}</footer>
      </blockquote>
    </div>
  );
};

export default Quote;
