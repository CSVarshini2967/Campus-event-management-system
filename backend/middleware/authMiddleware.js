// Reference only.
// Later, verify the JWT from the Authorization header here.

function authenticate(req, res, next) {
  // TODO: verify JWT and attach user information to req.user
  next();
}

module.exports = authenticate;
