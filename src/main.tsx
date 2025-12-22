import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Trait Treks - AI Career Counselor
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
