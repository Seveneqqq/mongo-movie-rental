import Header from '../components/Header';

const Admin = ({ isLightTheme, toggleTheme, isLoggedIn }) => {
  return (
    <>
      <Header 
        isLightTheme={isLightTheme} 
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
      />
      <div>
        <h1>Movie Page</h1>
        {/* Twoja zawartość strony */}
      </div>
    </>
  );
};

export default Admin;