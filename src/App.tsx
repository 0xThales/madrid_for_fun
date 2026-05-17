import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { EventDetailsPage } from "./pages/EventDetailsPage/EventDetailsPage";
import { EventsPage } from "./pages/EventsPage/EventsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
