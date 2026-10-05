import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main>
      <h1>Campus Event Management</h1>
      <p>Use the previous UI reference as the design direction.</p>
      <p>Student and Admin dashboard components can be added here.</p>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
