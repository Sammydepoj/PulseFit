import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { StudioProvider } from "./context/StudioContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <StudioProvider>
                <App />
            </StudioProvider>
        </AuthProvider>
    </StrictMode>,
);
