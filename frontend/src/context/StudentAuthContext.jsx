import { createContext, useContext, useEffect, useState } from "react";

const StudentAuthContext = createContext(null);

const STUDENT_SESSION_KEY = "campus_event_student_session";
const USERS_KEY = "campus_event_users";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function StudentAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STUDENT_SESSION_KEY) || "null"
      );
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        STUDENT_SESSION_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(STUDENT_SESSION_KEY);
    }
  }, [user]);

  function login(email, password) {
    const account = readUsers().find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password &&
        u.role === "STUDENT"
    );


    if (!account) {
      throw new Error("Invalid student email or password");
    }

    const studentUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      department: account.department,
    };

    setUser(studentUser);
    return studentUser;
  }
  function register(data) {
  const users = readUsers();

  const emailExists = users.some(
    (u) =>
      u.email.toLowerCase() ===
      data.email.trim().toLowerCase()
  );

  if (emailExists) {
    throw new Error("An account with this email already exists");
  }

  const account = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,
    role: "STUDENT",
    department: data.department || "CSE",
  };

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, account])
  );

  // Automatically log the student in
  const studentUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    department: account.department,
  };

  setUser(studentUser);

  return studentUser;
}

  function logout() {
    setUser(null);
    localStorage.removeItem(STUDENT_SESSION_KEY);
  }

  return (
    <StudentAuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const value = useContext(StudentAuthContext);

  if (!value) {
    throw new Error(
      "useStudentAuth must be used inside StudentAuthProvider"
    );
  }

  return value;
}