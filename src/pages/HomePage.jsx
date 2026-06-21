import Hero from "../components/hero/Hero";
import Main from "../components/main/main";
import usePageTitle from "../hooks/usePageTitle";

const HomePage = () => {
  usePageTitle("Shop — New Arrivals & Deals");
  return (
    <>
      <Hero />
      <Main />
    </>
  );
};

export default HomePage;
