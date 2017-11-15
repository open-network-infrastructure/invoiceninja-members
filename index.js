require('now-env').config()
const csv = require('json2csv')
const { send } = require('micro')
const membership = require('./membership')

// Start service
module.exports = async function (req, res) {
  let members = await membership.getActiveMembers()

  if (req.url.toLowerCase() === '/download') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=membership-list.csv')

    members = csv({ data: members })
  }

  send(res, 200, members)
}
