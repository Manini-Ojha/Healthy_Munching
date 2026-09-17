// Vercel serverless entry point: Express apps are directly usable as a
// request handler, so this just re-exports the app defined in server/index.js.
module.exports = require("../server/index.js");
