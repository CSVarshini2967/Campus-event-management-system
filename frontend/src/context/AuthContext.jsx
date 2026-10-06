import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "campus_event_admin_session";
const USERS_KEY = "campus_event_users";

const defaultAdmin = {
  id: "admin-1",
  name: "Admin",
  email: "admin@campusevents.com",
  password: "admin123",
  role: "ADMIN",
  department: "Faculty"
};

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return [defaultAdmin, ...saved.filter(u => u.email !== defaultAdmin.email)];
  } catch {
    return [defaultAdmin];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function login(email, password) {
    const account = readUsers().find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!account) throw new Error("Invalid email or password");
    const sessionUser = { id: account.id, name: account.name, email: account.email, role: account.role, department: account.department };
    setUser(sessionUser);
    return sessionUser;
  }

  function register(data) {
    const users = readUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const account = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email.trim(),
      password: data.password,
      role: "STUDENT",
      department: data.department || "CSE"
    };
    const customUsers = users.filter(u => u.email !== defaultAdmin.email);
    localStorage.setItem(USERS_KEY, JSON.stringify([...customUsers, account]));
    return login(account.email, account.password);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
