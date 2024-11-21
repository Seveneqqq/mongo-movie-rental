import Header from '../components/Header';
import { Button } from "@/components/ui/button";

const Home = ({ isLightTheme, toggleTheme, isLoggedIn }) => {
  return (
    <>
      <Header 
        isLightTheme={isLightTheme} 
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
      />
      
      <div className="py-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 md:col-span-6 lg:col-span-3 rounded-[10px] h-[300px] bg-slate-500">
            d
          </div>
        </div>
      </div>

      <p>Movie rental with best movies</p>
      
      <Button>Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="outline">Button</Button>
    </>
  );
};

export default Home;