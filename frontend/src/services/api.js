import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("campus_event_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem("campus_event_token");
      localStorage.removeItem("campus_event_user");
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  }
};

// Event services
export const eventService = {
  getAll: async (params = {}) => {
    const res = await api.get("/events", { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/events", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  }
};

// Registration services
export const registrationService = {
  register: async (eventId) => {
    const res = await api.post(`/events/${eventId}/register`);
    return res.data;
  },
  cancel: async (eventId) => {
    const res = await api.delete(`/events/${eventId}/register`);
    return res.data;
  },
  getMyRegistrations: async () => {
    const res = await api.get("/registrations/my");
    return res.data;
  },
  getEventRegistrations: async (eventId) => {
    const res = await api.get(`/events/${eventId}/registrations`);
    return res.data;
  }
};

// Attendance services
export const attendanceService = {
  mark: async (data) => {
    const res = await api.post("/attendance/mark", data);
    return res.data;
  },
  getMyAttendance: async () => {
    const res = await api.get("/attendance/my");
    return res.data;
  },
  getEventAttendance: async (eventId) => {
    const res = await api.get(`/attendance/event/${eventId}`);
    return res.data;
  }
};

// Feedback services
export const feedbackService = {
  submit: async (eventId, data) => {
    const res = await api.post(`/feedback/${eventId}`, data);
    return res.data;
  },
  getEventFeedback: async (eventId) => {
    const res = await api.get(`/feedback/event/${eventId}`);
    return res.data;
  }
};

// Club services
export const clubService = {
  getAll: async () => {
    const res = await api.get("/clubs");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/clubs/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/clubs", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/clubs/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/clubs/${id}`);
    return res.data;
  }
};

// Venue services
export const venueService = {
  getAll: async () => {
    const res = await api.get("/venues");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/venues/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/venues", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/venues/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/venues/${id}`);
    return res.data;
  }
};

// Stats service
export const statsService = {
  getDashboard: async () => {
    const res = await api.get("/stats/dashboard");
    return res.data;
  }
};

export default api;