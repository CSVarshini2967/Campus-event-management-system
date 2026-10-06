const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

export const eventApi = {
  getAll: () => request("/events"),
  getById: (id) => request(`/events/${id}`),
  create: (data) => request("/events", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/events/${id}`, { method: "DELETE" })
};

export const registrationApi = {
  getRegisteredStudents: (eventId) => request(`/registrations/event/${eventId}/students`)
};

export { API_BASE };