exports.registerForEvent = async (req, res) => {
  // TODO: INSERT registration
  res.json({ message: "Register for event - implement here" });
};

exports.cancelRegistration = async (req, res) => {
  // TODO: DELETE registration
  res.json({ message: "Cancel registration - implement here" });
};

exports.getMyEvents = async (req, res) => {
  // TODO: JOIN registrations + events for logged-in student
  res.json({ message: "My events - implement here" });
};

exports.getRegisteredStudents = async (req, res) => {
  // TODO: JOIN registrations + users for a selected event
  res.json({ message: "Registered students - implement here" });
};
