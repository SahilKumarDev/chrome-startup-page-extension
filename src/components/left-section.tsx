import SearchEngine from "./search-engine";
import BankBalance from "./bank-balance";
import QuickLinks from "./quick-links";
import TodayGoal from "./today-goal";
import Greetings from "./greetings";
import Quote from "./quote";

const LeftSection = () => {
  return (
    <div className="left-section">
      <Greetings />
      <SearchEngine />
      <QuickLinks />
      <Quote />
      <TodayGoal />
      <BankBalance />
    </div>
  );
};

export default LeftSection;
