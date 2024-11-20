import { useState } from "react";

import "./App.css";
import { AlertDialogDemo } from "./components/AlertDialogDemo";
import { Button } from "@/components/ui/button"


function App() {
  return (
    <>
      <p>Hola</p>
      <AlertDialogDemo />
      <Button >Button</Button>
      <Button variant="secondary">Button</Button>
      <Button variant="outline">Button</Button>

    </>
  );
}

export default App;
