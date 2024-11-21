import { useState } from "react";

import "./App.css";
import { AlertDialogDemo } from "./components/AlertDialogDemo";
import { Button } from "@/components/ui/button"

import { MdOutlineNightlight } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  
  const toogleTheme = () => {

    const newTheme = !isLightTheme;
    console.log(newTheme);
    setIsLightTheme(newTheme);

    if(newTheme){
      document.querySelector('html').classList.remove('dark');
    }
    else{
      document.querySelector('html').classList.add('dark');
    }
  }

  return (
    <>
      <header>
        <nav className="flex justify-between">
          <ul className="flex gap-10 text-xl text-textColor items-center">
            <li>
              <a href="/">Browse</a>
            </li>
            <li>
              <a href="/released">Released</a>
            </li>
            <li>
              <a href="/account">Account</a>
            </li>
          </ul>
          <ul className="flex gap-10 text-xl text-textColor items-center">
            <li>
              {isLightTheme ? <MdOutlineNightlight onClick={toogleTheme} /> : <MdOutlineLightMode onClick={toogleTheme} /> }
            </li>
            <li>
              {isLoggedIn ? <a href="/logout">Logout</a> : <a href="/login">Login</a>}
            </li>
          </ul>
        </nav>
      </header>

      <div class="grid grid-cols-12 gap-4">

        <div class="col-span-6 md:col-span-6 lg:col-span-3 rounded-[10px] h-[300px] bg-slate-500">d</div>

      </div>
  



    <br/>
    <br/>
      <p>Storebook with best programming books</p>


      <AlertDialogDemo />
      <Button >Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="outline">Button</Button>

    </>
  );
}

export default App;
