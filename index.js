require('now-env').config()
const membership = require('./membership')

// Start service
module.exports = async function (req, res) {
  const members = await membership.getActiveMembers()

  return members
}
