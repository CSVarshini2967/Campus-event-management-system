import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import {
  StudentAuthProvider,
  useStudentAuth,
} from "./context/StudentAuthContext";

import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import Events from "./pages/student/Events";
import MyEvents from "./pages/student/MyEvents";
import EventDetails from "./pages/student/EventDetails";
import Feedback from "./pages/student/Feedback";

import "./styles.css";

function StudentApp() {
  const { user, isAuthenticated } = useStudentAuth();

  const [authPage, setAuthPage] = useState("login");

  const [page, setPage] = useState(
    () => sessionStorage.getItem("student_current_page") || "dashboard"
  );

  function navigateTo(nextPage) {
    setPage(nextPage);
    sessionStorage.setItem("student_current_page", nextPage);
  }

  if (!isAuthenticated) {
    sessionStorage.removeItem("student_current_page");

    if (authPage === "register") {
      return (
        <StudentRegister
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <StudentLogin
        onRegister={() => setAuthPage("register")}
      />
    );
  }

  function renderPage() {
    switch (page) {
      case "events":
        return (
          <Events
            user={user}
            onNavigate={navigateTo}
          />
        );

      case "my-events":
        return (
          <MyEvents
            user={user}
            onNavigate={navigateTo}
          />
        );

      case "event-details":
        return (
          <EventDetails
            user={user}
            onNavigate={navigateTo}
          />
        );

      case "feedback":
        return (
          <Feedback
            user={user}
            onNavigate={navigateTo}
          />
        );

      case "dashboard":
      default:
        return (
          <StudentDashboard
            user={user}
            onNavigate={navigateTo}
          />
        );
    }
  }

  return <>{renderPage()}</>;
}

createRoot(document.getElementById("student-root")).render(
  <StudentAuthProvider>
    <StudentApp />
  </StudentAuthProvider>
);