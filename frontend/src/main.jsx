import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import {
  Bell, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  ClipboardList, Clock3, Edit3, Eye, Home, LayoutDashboard, LogOut,
  MapPin, Menu, Plus, Search, Settings, ShieldCheck, Trash2, Users,
  UserRound, Building2, X, CheckCircle2, AlertCircle, MoreHorizontal
} from "lucide-react";
import "./styles.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const seedEvents = [
  { id: 1, title: "CSE Tech Fest", club: "CSE Department", category: "Technical", date: "2026-11-15", time: "10:00 AM - 4:00 PM", venue: "Seminar Hall", status: "Published", registrations: 96 },
  { id: 2, title: "Cultural Night", club: "Arts & Cultural Club", category: "Cultural", date: "2026-11-18", time: "5:00 PM - 10:00 PM", venue: "Main Auditorium", status: "Published", registrations: 72 },
  { id: 3, title: "Sports Meet", club: "Sports Committee", category: "Sports", date: "2026-11-22", time: "9:00 AM - 5:00 PM", venue: "College Ground", status: "Published", registrations: 54 },
  { id: 4, title: "Workshop on Web Development", club: "Coding Club", category: "Technical", date: "2026-11-25", time: "2:00 PM - 5:00 PM", venue: "Lab Block A", status: "Draft", registrations: 26 },
  { id: 5, title: "Guest Lecture", club: "ECE Department", category: "Academic", date: "2026-11-28", time: "11:00 AM - 1:00 PM", venue: "Seminar Hall", status: "Published", registrations: 48 }
];

const seedRegistrations = [
  { event: "CSE Tech Fest", name: "Sreevarshini", roll: "23CSE041", department: "CSE", email: "sreevarshini@college.edu", phone: "9876543210", year: "3rd Year", status: "Registered" },
  { event: "CSE Tech Fest", name: "Rahul Kumar", roll: "23CSE012", department: "CSE", email: "rahul.kumar@college.edu", phone: "9876543211", year: "3rd Year", status: "Registered" },
  { event: "Cultural Night", name: "Ananya Reddy", roll: "23ECE018", department: "ECE", email: "ananya.reddy@college.edu", phone: "9876543212", year: "3rd Year", status: "Registered" },
  { event: "Sports Meet", name: "Vamsi Krishna", roll: "23ME031", department: "ME", email: "vamsi.krishna@college.edu", phone: "9876543213", year: "3rd Year", status: "Registered" },
  { event: "Workshop on Web Development", name: "Harini", roll: "24CSE026", department: "CSE", email: "harini@college.edu", phone: "9876543214", year: "2nd Year", status: "Registered" },
];

const seedClubs = [
  ["CSE Department", "Technical", "Dr. Kiran", 96],
  ["Arts & Cultural Club", "Cultural", "Ms. Priya", 72],
  ["Sports Committee", "Sports", "Mr. Ramesh", 54],
  ["Coding Club", "Technical", "Mr. Arun", 26],
  ["Literary Club", "Academic", "Ms. Kavya", 18]
];

const seedVenues = [
  ["Seminar Hall", "Academic Block", 250, "Available"],
  ["Main Auditorium", "Central Block", 800, "Available"],
  ["College Ground", "North Campus", 1500, "Booked"],
  ["Lab Block A", "CSE Block", 120, "Available"],
];

function App() {
  const [authPage, setAuthPage] = useState(window.location.pathname === "/register" ? "register" : "login");
  const { user, isAuthenticated, logout } = useAuth();

  // Keep every hook above the authentication early-return. React requires
  // hooks to run in the same order on every render.
  const [active, setActive] = useState("Dashboard");
  const [events, setEvents] = useState(seedEvents);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events.filter(e =>
      e.status === "Published" && new Date(`${e.date}T00:00:00`) >= today
    ).length;

    const published = events.filter(e => e.status === "Published").length;
    const draft = events.filter(e => e.status === "Draft").length;

    return {
      events: events.length,
      upcoming,
      upcomingPublished: upcoming,
      published,
      draft,
      registrations: events.reduce((sum, e) => sum + Number(e.registrations || 0), 0),
      clubs: 5
    };
  }, [events]);

  if (!isAuthenticated) {
    return authPage === "register"
      ? <Register onLogin={() => { setAuthPage("login"); window.history.replaceState({}, "", "/login"); }} />
      : <Login onRegister={() => { setAuthPage("register"); window.history.replaceState({}, "", "/register"); }} />;
  }

  function notify(message, type="success") {
    setToast({message, type});
    window.setTimeout(() => setToast(null), 2600);
  }

  function createEvent(data) {
    const event = {
      id: Date.now(),
      title: data.title,
      club: data.club || "CSE Department",
      category: data.category,
      date: data.date,
      time: data.startTime && data.endTime ? `${formatTime(data.startTime)} - ${formatTime(data.endTime)}` : "TBA",
      venue: data.venue || "TBA",
      status: data.status || "Draft",
      registrations: 0
    };
    setEvents(prev => [event, ...prev]);
    setModal(null);
    setActive("Manage Events");
    notify("Event created successfully");
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
    notify("Event removed");
  }

  const filteredEvents = events.filter(e =>
    `${e.title} ${e.club} ${e.category} ${e.status}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mobile">
          <div className="brand-icon"><CalendarDays size={19}/></div>
          <strong>Campus Events</strong>
        </div>
        <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)}><Menu size={21}/></button>
        <div className="search-wrap">
          <Search size={17}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events..." />
          {query && <button onClick={() => setQuery("")}><X size={15}/></button>}
        </div>
        <div className="top-actions">
          <button className="icon-btn" aria-label="Notifications"><Bell size={19}/><span className="notification-dot"/></button>
          <div className="profile">
            <div className="avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div className="profile-copy"><b>{user?.name || "Admin"}</b><span>{user?.department || "Faculty"}</span></div>
            <ChevronDown size={15}/>
          </div>
        </div>
      </header>

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><CalendarDays size={19}/></div>
          <div><strong>Campus Events</strong><span>Management System</span></div>
        </div>
        <nav>
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={active==="Dashboard"} onClick={() => {setActive("Dashboard");setMobileOpen(false)}}/>
          <NavItem icon={<CalendarDays size={18}/>} label="Manage Events" active={active==="Manage Events"} onClick={() => {setActive("Manage Events");setMobileOpen(false)}}/>
          <NavItem icon={<ClipboardList size={18}/>} label="View Registrations" active={active==="View Registrations"} onClick={() => {setActive("View Registrations");setMobileOpen(false)}}/>
          <NavItem icon={<Users size={18}/>} label="Clubs" active={active==="Clubs"} onClick={() => {setActive("Clubs");setMobileOpen(false)}}/>
          <NavItem icon={<Building2 size={18}/>} label="Venues" active={active==="Venues"} onClick={() => {setActive("Venues");setMobileOpen(false)}}/>
        </nav>
        <div className="sidebar-bottom">
          <button className="side-link" onClick={() => notify("Settings panel coming next")}><Settings size={18}/>Settings</button>
          <button className="side-link logout" onClick={() => { logout(); setActive("Dashboard"); setMobileOpen(false); window.history.replaceState({}, "", "/login"); }}><LogOut size={18}/>Logout</button>
        </div>
      </aside>

      <main className="main">
        {active === "Dashboard" && (
          <Dashboard stats={stats} events={filteredEvents} allEvents={events} onNavigate={setActive} onAdd={() => setModal("add-event")} query={query}/>
        )}
        {active === "Manage Events" && (
          <ManageEvents events={filteredEvents} onAdd={() => setModal("add-event")} onDelete={deleteEvent} onEdit={(event) => setModal({type:"edit-event", event})} onView={(event)=>setModal({type:"view-event", event})}/>
        )}
        {active === "View Registrations" && <Registrations query={query}/>}
        {active === "Clubs" && <Clubs events={events} onSelect={setSelectedClub}/>}
        {active === "Venues" && <Venues/>}
      </main>

      {modal === "add-event" && <EventModal onClose={() => setModal(null)} onSave={createEvent}/>}
      {modal?.type === "edit-event" && <EventModal initial={modal.event} onClose={() => setModal(null)} onSave={(data) => {
        setEvents(prev => prev.map(e => e.id === modal.event.id ? {
          ...e,
          title: data.title, category: data.category, date: data.date,
          venue: data.venue, club: data.club, status: data.status,
          time: data.startTime && data.endTime
            ? `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`
            : e.time
        } : e));
        setModal(null); notify("Event updated successfully");
      }}/>}
      {modal?.type === "view-event" && <ViewModal event={modal.event} onClose={() => setModal(null)}/>}
      {selectedClub && <ClubDetailsModal club={selectedClub} events={events} onClose={() => setSelectedClub(null)}/>}
      {toast && <div className={`toast ${toast.type}`}><CheckCircle2 size={17}/>{toast.message}</div>}
    </div>
  );
}

function NavItem({icon,label,active,onClick}) {
  return <button className={`side-link ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function Dashboard({stats,events,allEvents,onNavigate,onAdd,query}) {
  const recent = events.slice(0,5);
  return (
    <>
      <PageHeader title="Dashboard Overview" subtitle="Monitor campus events, registrations and activities at a glance."/>
      <section className="stat-grid">
        <StatCard label="Total Events" value={stats.events} detail={`${stats.published} published • ${stats.draft} draft`} icon={<CalendarDays/>} tone="blue"/>
        <StatCard label="Upcoming Events" value={stats.upcoming} detail={`${stats.upcomingPublished} published events scheduled`} icon={<Clock3/>} tone="green"/>
        <StatCard label="Total Registrations" value={stats.registrations} detail="Across all campus events" icon={<Users/>} tone="purple"/>
        <StatCard label="Total Clubs" value={stats.clubs} detail="Active campus clubs" icon={<Building2/>} tone="orange"/>
      </section>
      <section className="content-card">
        <div className="card-head"><div><h2>{query ? "Search Results" : "Recent Events"}</h2><p>{query ? `Showing events matching “${query}”` : "Latest events created across the campus"}</p></div><button className="text-btn" onClick={()=>onNavigate("Manage Events")}>View All <ChevronRight size={16}/></button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event Title</th><th>Club</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{recent.map(e=><tr key={e.id}><td><b>{e.title}</b><small>{e.category}</small></td><td>{e.club}</td><td>{prettyDate(e.date)}</td><td><Status status={e.status}/></td><td><button className="manage-btn" onClick={()=>onNavigate("Manage Events")}>Manage</button></td></tr>)}{!recent.length && <tr><td colSpan="5"><Empty title="No events found" text={`No events match “${query}”. Try another event name, club, category or status.`}/></td></tr>}</tbody>
          </table>
        </div>
      </section>
      <section className="quick-footer">
        <div className="quick-footer-title"><div><h2>Quick Actions</h2><p>Common administrator tasks</p></div></div>
        <div className="quick-grid">
          <button className="quick blue" onClick={onAdd}><CirclePlus/> <span><b>Add Event</b><small>Create a new campus event</small></span></button>
          <button className="quick purple" onClick={()=>onNavigate("Manage Events")}><CalendarDays/> <span><b>Manage Events</b><small>Edit or remove events</small></span></button>
          <button className="quick green" onClick={()=>onNavigate("View Registrations")}><Users/> <span><b>View Registrations</b><small>See registered students</small></span></button>
          <button className="quick cyan" onClick={()=>onNavigate("Clubs")}><Building2/> <span><b>Manage Clubs</b><small>View campus clubs</small></span></button>
        </div>
      </section>
    </>
  );
}

function StatCard({label,value,detail,icon,tone}) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small className="stat-detail">{detail}</small></div></div>;
}

function PageHeader({title,subtitle,action}) {
  return <div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function ManageEvents({events,onAdd,onDelete,onEdit,onView}) {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return events;
    return events.filter(e => e.status.toLowerCase() === filter.toLowerCase());
  }, [events, filter]);

  const counts = useMemo(() => ({
    All: events.length,
    Published: events.filter(e => e.status === "Published").length,
    Draft: events.filter(e => e.status === "Draft").length,
    Completed: events.filter(e => e.status === "Completed").length
  }), [events]);

  return <>
    <PageHeader title="Manage Events" subtitle="Create, publish, edit and manage all campus events." action={<button className="primary-btn" onClick={onAdd}><Plus size={17}/> Add Event</button>}/>
    <div className="toolbar">
      <div className="filter-pills">
        {["All","Published","Draft","Completed"].map(item => (
          <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>
            {item} <span className="filter-count">{counts[item]}</span>
          </button>
        ))}
      </div>
      <span>{filtered.length} event{filtered.length === 1 ? "" : "s"} shown</span>
    </div>
    <div className="event-list">
      {filtered.map(e => <article className="event-row" key={e.id}>
        <div className={`event-date ${e.category.toLowerCase()}`}><b>{new Date(e.date + "T00:00:00").getDate()}</b><span>{new Date(e.date + "T00:00:00").toLocaleString("en-US",{month:"short"})}</span></div>
        <div className="event-main"><div className="event-title-line"><h3>{e.title}</h3><Status status={e.status}/></div><div className="meta-row"><span><Users size={14}/>{e.club}</span><span><Clock3 size={14}/>{e.time}</span><span><MapPin size={14}/>{e.venue}</span></div></div>
        <div className="event-reg"><b>{e.registrations}</b><span>Registrations</span></div>
        <div className="row-actions"><button title="View" onClick={()=>onView(e)}><Eye size={17}/></button><button title="Edit" onClick={()=>onEdit(e)}><Edit3 size={17}/></button><button className="danger" title="Delete" onClick={()=>onDelete(e.id)}><Trash2 size={17}/></button></div>
      </article>)}
      {!filtered.length && <Empty title={`No ${filter.toLowerCase()} events`} text={filter === "Completed" ? "No completed events yet. Edit an event and set its status to Completed." : `There are currently no ${filter.toLowerCase()} events.`}/>}
    </div>
  </>;
}

function Registrations({query}) {
  const [selectedEvent, setSelectedEvent] = useState("All Events");

  const filtered = seedRegistrations.filter(r => {
    const matchesEvent = selectedEvent === "All Events" || r.event === selectedEvent;
    const haystack = `${r.event} ${r.name} ${r.roll} ${r.department} ${r.email} ${r.phone}`.toLowerCase();
    return matchesEvent && haystack.includes(query.toLowerCase());
  });

  const eventNames = ["All Events", ...seedEvents.map(e => e.title)];
  const selectedCount = selectedEvent === "All Events"
    ? seedRegistrations.length
    : seedRegistrations.filter(r => r.event === selectedEvent).length;

  return <>
    <PageHeader title="View Registrations" subtitle="Select an event to view the students registered for that event."/>
    <div className="registration-toolbar">
      <div>
        <label>Event</label>
        <select value={selectedEvent} onChange={e=>setSelectedEvent(e.target.value)}>
          {eventNames.map(name => <option key={name}>{name}</option>)}
        </select>
      </div>
      <div className="registration-summary"><b>{selectedCount}</b><span>registered student{selectedCount === 1 ? "" : "s"}</span></div>
    </div>

    <div className="content-card">
      <div className="card-head"><div><h2>{selectedEvent === "All Events" ? "Registered Students" : selectedEvent}</h2><p>{filtered.length} student record{filtered.length === 1 ? "" : "s"} found</p></div><button className="outline-btn" onClick={()=>exportRegistrations(filtered)}>Export CSV</button></div>
      <div className="table-wrap"><table className="registration-table"><thead><tr><th>Student</th><th>Roll No.</th><th>Department</th><th>Year</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead><tbody>
        {filtered.map((r,i)=><tr key={i}><td><b>{r.name}</b></td><td>{r.roll}</td><td>{r.department}</td><td>{r.year}</td><td>{r.email}</td><td>{r.phone}</td><td><Status status={r.status}/></td></tr>)}
        {!filtered.length && <tr><td colSpan="7"><Empty title="No students found" text="There are no registrations matching this event or search."/></td></tr>}
      </tbody></table></div>
    </div>
  </>;
}

function exportRegistrations(rows) {
  const header = ["Event","Student","Roll No","Department","Year","Email","Phone","Status"];
  const body = rows.map(r => [r.event,r.name,r.roll,r.department,r.year,r.email,r.phone,r.status]);
  const csv = [header, ...body].map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='registrations.csv'; a.click(); URL.revokeObjectURL(url);
}

function Clubs({events,onSelect}) {
  return <>
    <PageHeader title="Clubs" subtitle="Click a club to see its events and registered students." action={<button className="primary-btn"><Plus size={17}/> Add Club</button>}/>
    <div className="club-grid">
      {seedClubs.map((c,i)=>{
        const clubEvents = events.filter(e => e.club === c[0]);
        const registrations = clubEvents.reduce((sum,e)=>sum+Number(e.registrations||0),0);
        return <button className="club-card club-card-button" key={i} onClick={()=>onSelect({name:c[0], category:c[1], coordinator:c[2], registrations, events:clubEvents})}>
          <div className="club-icon"><Users/></div>
          <div className="club-card-content"><h3>{c[0]}</h3><span className="tag">{c[1]}</span><p>Coordinator: {c[2]}</p><div className="club-footer"><b>{registrations}</b><span>registered students</span></div></div>
          <span className="more"><MoreHorizontal/></span>
        </button>
      })}
    </div>
  </>;
}

function ClubDetailsModal({club,onClose}) {
  return <div className="modal-backdrop"><div className="modal club-detail-modal"><div className="modal-head"><div><h2>{club.name}</h2><p>{club.category} • Coordinator: {club.coordinator}</p></div><button onClick={onClose}><X/></button></div>
    <div className="club-summary"><div><b>{club.events.length}</b><span>Events</span></div><div><b>{club.registrations}</b><span>Registered Students</span></div></div>
    <div className="club-event-list">
      {club.events.length ? club.events.map(e=><div className="club-event-item" key={e.id}><div className={`event-date ${e.category.toLowerCase()}`}><b>{new Date(e.date+"T00:00:00").getDate()}</b><span>{new Date(e.date+"T00:00:00").toLocaleString("en-US",{month:"short"})}</span></div><div><h3>{e.title}</h3><p><CalendarDays size={13}/>{prettyDate(e.date)} &nbsp; • &nbsp; <Clock3 size={13}/>{e.time}</p><p><MapPin size={13}/>{e.venue}</p></div><div className="club-event-reg"><b>{e.registrations}</b><span>registered</span></div></div>) : <Empty title="No events yet" text="This club does not have any events currently."/>}
    </div>
    <div className="modal-actions"><button className="primary-btn" onClick={onClose}>Close</button></div>
  </div></div>;
}

function Venues() {
  return <>
    <PageHeader title="Venues" subtitle="Manage campus locations and their availability." action={<button className="primary-btn"><Plus size={17}/> Add Venue</button>}/>
    <div className="venue-grid">{seedVenues.map((v,i)=><div className="venue-card" key={i}><div className="venue-top"><div className="venue-icon"><Building2/></div><Status status={v[3]}/></div><h3>{v[0]}</h3><p><MapPin size={14}/>{v[1]}</p><div className="capacity"><span>Capacity</span><b>{v[2]} people</b></div></div>)}</div>
  </>;
}

function EventModal({initial,onClose,onSave}) {
  const [form,setForm]=useState({
    title: initial?.title || "", club:initial?.club || "CSE Department", category:initial?.category || "Technical",
    date:initial?.date || "", startTime:"10:00", endTime:"16:00", venue:initial?.venue || "Seminar Hall", status:initial?.status || "Draft"
  });
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>{initial?"Edit Event":"Add New Event"}</h2><p>Enter the event details below.</p></div><button onClick={onClose}><X/></button></div>
    <form onSubmit={e=>{e.preventDefault();if(!form.title||!form.date)return;onSave(form)}}><div className="form-grid">
      <label className="full">Event title<input name="title" value={form.title} onChange={change} placeholder="e.g. CSE Tech Fest" required/></label>
      <label>Club / Department<select name="club" value={form.club} onChange={change}>{seedClubs.map(c=><option key={c[0]}>{c[0]}</option>)}</select></label>
      <label>Category<select name="category" value={form.category} onChange={change}><option>Technical</option><option>Cultural</option><option>Sports</option><option>Academic</option></select></label>
      <label>Date<input type="date" name="date" value={form.date} onChange={change} required/></label>
      <label>Venue<select name="venue" value={form.venue} onChange={change}>{seedVenues.map(v=><option key={v[0]}>{v[0]}</option>)}</select></label>
      <label>Start time<input type="time" name="startTime" value={form.startTime} onChange={change}/></label>
      <label>End time<input type="time" name="endTime" value={form.endTime} onChange={change}/></label>
      <label>Status<select name="status" value={form.status} onChange={change}><option>Draft</option><option>Published</option><option>Completed</option><option>Cancelled</option></select></label>
    </div><div className="modal-actions"><button type="button" className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit">{initial?"Save Changes":"Create Event"}</button></div></form>
  </div></div>;
}

function ViewModal({event,onClose}) {
  return <div className="modal-backdrop"><div className="modal small-modal"><div className="modal-head"><div><h2>{event.title}</h2><p>Event overview</p></div><button onClick={onClose}><X/></button></div>
    <div className="detail-list"><Detail icon={<CalendarDays/>} label="Date" value={prettyDate(event.date)}/><Detail icon={<Clock3/>} label="Time" value={event.time}/><Detail icon={<MapPin/>} label="Venue" value={event.venue}/><Detail icon={<Users/>} label="Registrations" value={`${event.registrations} students`}/><Detail icon={<ShieldCheck/>} label="Status" value={event.status}/></div>
    <div className="modal-actions"><button className="primary-btn" onClick={onClose}>Close</button></div>
  </div></div>
}

function Detail({icon,label,value}) { return <div className="detail"><div className="detail-icon">{icon}</div><div><span>{label}</span><b>{value}</b></div></div> }
function Status({status}) { const cls=status.toLowerCase().replaceAll(" ","-"); return <span className={`status ${cls}`}><i/>{status}</span> }
function Empty({title,text}) { return <div className="empty"><AlertCircle/><h3>{title}</h3><p>{text}</p></div> }
function prettyDate(value) { return new Date(value+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }
function formatTime(v) { const [h,m]=v.split(":"); const hour=Number(h); return `${hour%12||12}:${m} ${hour>=12?"PM":"AM"}`; }

createRoot(document.getElementById("root")).render(<AuthProvider><App /></AuthProvider>);
