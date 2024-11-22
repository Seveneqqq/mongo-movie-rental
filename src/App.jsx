import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/home";
import Movie from "./pages/movie";
import Released from "./pages/released";
import Dashboard from "./pages/dashboard";
import Admin from "./pages/admin";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if(sessionStorage.getItem("isLoggedIn") == "true"){
        setIsLoggedIn(true);
      }
    if(sessionStorage.getItem("role")){
      setRole(sessionStorage.getItem("role"));
    }
  },[]);

  const toggleTheme = () => {
    setIsLightTheme(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.querySelector('html').classList.remove('dark');
      } else {
        document.querySelector('html').classList.add('dark');
      }
      return newTheme;
    });
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              isLightTheme={isLightTheme} 
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          } 
        />
        <Route 
          path="/movie" 
          element={
            <Movie 
              isLightTheme={isLightTheme} 
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          } 
        />
        <Route 
          path="/released" 
          element={
            <Released 
              isLightTheme={isLightTheme} 
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <Admin 
              isLightTheme={isLightTheme} 
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              isLightTheme={isLightTheme} 
              toggleTheme={toggleTheme}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;