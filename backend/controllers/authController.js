exports.register = async (req, res) => {
  // TODO:
  // 1. Validate input
  // 2. Hash password with bcrypt
  // 3. INSERT user into MySQL
  // 4. Return success response
  res.json({ message: "Register controller - implement here" });
};

exports.login = async (req, res) => {
  // TODO:
  // 1. Find user by email
  // 2. Compare password
  // 3. Generate JWT
  // 4. Return token + user
  res.json({ message: "Login controller - implement here" });
};
