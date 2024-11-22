import Header from '../components/Header';

const Dashboard = ({ isLightTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Header 
        isLightTheme={isLightTheme} 
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn} 
      />
      <div>
        <h1>Movie Page</h1>
        {/* Twoja zawartość strony */}
      </div>
    </>
  );
};

export default Dashboard;