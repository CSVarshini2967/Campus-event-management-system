USE campus_event_db;

-- Clear previous data in reverse foreign key order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE feedback;
TRUNCATE TABLE attendance;
TRUNCATE TABLE registrations;
TRUNCATE TABLE events;
TRUNCATE TABLE venues;
TRUNCATE TABLE clubs;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. SEED USERS
-- Default password for all seed users is 'password123'
-- Bcrypt hash generated with 10 rounds for 'password123'.
INSERT INTO users (id, name, email, password, role, roll_no, department, year) VALUES
(1, 'System Administrator', 'admin@campusevents.com', '$2a$10$gKh4i.gSbWhOU0f1LDE0g.WjtBZ4ib2TyAnqXEupmHTSDravJRWQ2', 'admin', 'ADM001', 'Faculty', NULL),
(2, 'Prof. Sharma (Coordinator)', 'organiser@campusevents.com', '$2a$10$gKh4i.gSbWhOU0f1LDE0g.WjtBZ4ib2TyAnqXEupmHTSDravJRWQ2', 'organiser', 'ORG002', 'CSE', NULL),
(3, 'Sreevarshini R', 'sreevarshini@college.edu', '$2a$10$gKh4i.gSbWhOU0f1LDE0g.WjtBZ4ib2TyAnqXEupmHTSDravJRWQ2', 'student', '23CSE041', 'CSE', 3),
(4, 'Rahul Kumar', 'rahul.kumar@college.edu', '$2a$10$gKh4i.gSbWhOU0f1LDE0g.WjtBZ4ib2TyAnqXEupmHTSDravJRWQ2', 'student', '23CSE012', 'CSE', 3);

-- 2. SEED CLUBS
INSERT INTO clubs (id, name, description, coordinator_id) VALUES
(1, 'CSE Department', 'Department of Computer Science & Engineering technical events and hackathons.', 2),
(2, 'Arts & Cultural Club', 'Promoting cultural diversity, dance, music, and performing arts on campus.', 2),
(3, 'Sports Committee', 'Organizing intra and inter-college sporting tournaments and fitness initiatives.', 1),
(4, 'Coding Club', 'Competitive programming workshops, web development bootcamps, and tech talks.', 2);

-- 3. SEED VENUES
INSERT INTO venues (id, name, location, capacity) VALUES
(1, 'Seminar Hall', 'Academic Block - 2nd Floor', 250),
(2, 'Main Auditorium', 'Central Block - Ground Floor', 800),
(3, 'College Ground', 'North Campus Sports Arena', 1500),
(4, 'Lab Block A', 'CSE Block - Room 304', 120);

-- 4. SEED EVENTS
INSERT INTO events (id, title, description, category, event_date, start_time, end_time, registration_deadline, capacity, club_id, venue_id, created_by, status) VALUES
(1, 'CSE Tech Fest 2026', 'Annual technical extravaganza featuring coding sprints, robotics, and project presentations.', 'Technical', '2026-11-15', '10:00:00', '16:00:00', '2026-11-14', 150, 1, 1, 2, 'upcoming'),
(2, 'Campus Cultural Night', 'An evening of live acoustic music, drama performances, and classical dance showcase.', 'Cultural', '2026-11-18', '17:00:00', '22:00:00', '2026-11-17', 500, 2, 2, 2, 'upcoming'),
(3, 'Inter-Dept Football League', 'Annual football championship between engineering departments.', 'Sports', '2026-11-22', '09:00:00', '17:00:00', '2026-11-20', 200, 3, 3, 1, 'upcoming'),
(4, 'Full-Stack Web Dev Bootcamp', 'Hands-on practical session covering React, Node.js, Express, and MySQL application architecture.', 'Technical', '2026-11-25', '14:00:00', '17:00:00', '2026-11-24', 80, 4, 4, 2, 'upcoming'),
(5, 'AI & Robotics Symposium', 'Seminar on recent advances in generative AI, reinforcement learning, and autonomous systems.', 'Technical', '2026-10-01', '10:00:00', '13:00:00', '2026-09-30', 100, 1, 1, 2, 'completed');

-- 5. SEED REGISTRATIONS
INSERT INTO registrations (id, student_id, event_id, status, registered_at) VALUES
(1, 3, 1, 'registered', '2026-10-02 10:30:00'),
(2, 4, 1, 'registered', '2026-10-02 11:15:00'),
(3, 3, 2, 'registered', '2026-10-03 09:20:00'),
(4, 3, 5, 'registered', '2026-09-25 14:00:00'),
(5, 4, 5, 'registered', '2026-09-26 15:30:00');

-- 6. SEED ATTENDANCE
INSERT INTO attendance (id, registration_id, status, marked_at) VALUES
(1, 4, 'present', '2026-10-01 10:15:00'),
(2, 5, 'present', '2026-10-01 10:18:00');

-- 7. SEED FEEDBACK
INSERT INTO feedback (id, student_id, event_id, rating, comment, submitted_at) VALUES
(1, 3, 5, 5, 'Outstanding symposium! The hands-on AI demonstrations were very insightful.', '2026-10-01 14:30:00'),
(2, 4, 5, 4, 'Great event and guest speakers. Would love more time for Q&A in future editions.', '2026-10-01 15:00:00');
