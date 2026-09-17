// Cart rows are keyed by owner_id: the logged-in user's id, or the guest's
// session id before they log in. This lets a guest add items and keep them
// after registering/logging in (see the merge step in routes/auth.js).
function ownerId(req) {
  return req.session.userId ? String(req.session.userId) : req.sessionID;
}

module.exports = { ownerId };
