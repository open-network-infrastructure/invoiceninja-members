const fetch = require('node-fetch')
const membershipTypeField = process.env.INVOICE_NINJA_MEMBERSHIP_TYPE_FIELD

const getMembersPage = async (url) => {
  const options = { headers: { 'X-Ninja-Token': process.env.INVOICE_NINJA_TOKEN } }
  const response = await fetch(url, options)
  return response.json()
}

const getActiveMembers = async () => {
  let members = []
  let nextPage = 'http://app.invoiceninja.com/api/v1/clients'

  while (nextPage) {
    const json = await getMembersPage(nextPage)
    nextPage = json['meta']['pagination']['links']['next']
    // nextPage = null

    for (let data of json['data']) {
      // Skip deleted and archived members
      if (data['archived_at'] || data['is_deleted']) continue

      // Skip non-members (i.e. other client types)
      if (!data[membershipTypeField]) continue

      const member = {
        'membership_type': data[membershipTypeField]
      }

      // Add names
      let memberName = null
      if (data['name']) {
        memberName = data['name']
      }

      if (data['contacts'].length > 0) {
        const mainContact = data['contacts'][0]
        const mainContactName = `${mainContact['first_name']} ${mainContact['last_name']}`

        if (memberName) {
          memberName = `${memberName} (${mainContactName})`
        } else {
          memberName = mainContactName
        }
        member['email'] = mainContact['email']
      }
      member['name'] = memberName

      // Add address details
      const fullAddress = [`${data['address1']} ${data['address2']}`.trim(), `${data['postal_code']} ${data['city']}`, data['state']]
      member['address'] = fullAddress.filter(i => i).join(', ')

      // Add billing details
      member['balance'] = data['balance']
      member['paid_to_date'] = data['paid_to_date']
      member['invoice_number_counter'] = data['invoice_number_counter']

      members.push(member)
    }
  }

  return members
}

module.exports = {
  getActiveMembers
}
