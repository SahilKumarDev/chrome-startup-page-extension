// import BankBalance from "./components/bank-balance";
import DeathClock from "./components/death-clock";
import Footer from "./components/footer";
import LeftSection from "./components/left-section";
import RightSection from "./components/right-section";

const App = () => {
  return (
    <>
      <div className="container">
        <LeftSection />
        <RightSection />
      </div>
      <DeathClock />
      <Footer />
    </>
  );
};

export default App;
