import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import Events from "./Events";
import MyEvents from "./MyEvents";
import EventDetails from "./EventDetails";
import Feedback from "./Feedback";

export default function StudentPortal() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleNavigate = (page, eventId = null) => {
    setCurrentPage(page);
    if (eventId) setSelectedEventId(eventId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  switch (currentPage) {
    case "events":
      return <Events onNavigate={handleNavigate} />;
    case "my-events":
      return <MyEvents onNavigate={handleNavigate} />;
    case "event-details":
      return <EventDetails eventId={selectedEventId} onNavigate={handleNavigate} />;
    case "feedback":
      return <Feedback initialEventId={selectedEventId} onNavigate={handleNavigate} />;
    case "dashboard":
    default:
      return <StudentDashboard onNavigate={handleNavigate} />;
  }
}
