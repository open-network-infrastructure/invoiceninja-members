const fetch = require('node-fetch')
const membershipTypeField = process.env.INVOICE_NINJA_MEMBERSHIP_TYPE_FIELD

const frequencies = {
  '1': 'Weekly',
  '2': 'Two weeks',
  '3': 'Four weeks',
  '4': 'Monthly',
  '5': 'Two months',
  '6': 'Three months',
  '7': 'Six months',
  '8': 'Annually'
}

const getMembersPage = async (url) => {
  const options = { headers: { 'X-Ninja-Token': process.env.INVOICE_NINJA_TOKEN } }
  const response = await fetch(url, options)
  return response.json()
}

const getActiveMembers = async () => {
  let members = []
  let nextPage = 'http://app.invoiceninja.com/api/v1/clients?include=invoices'

  while (nextPage) {
    const json = await getMembersPage(nextPage)
    nextPage = json['meta']['pagination']['links']['next']
    if (nextPage) nextPage += '&include=invoices'
    // nextPage = null

    for (let data of json['data']) {
      // Skip deleted and archived members
      if (data['archived_at'] || data['is_deleted']) continue

      // Skip non-members (i.e. other client types)
      if (!data[membershipTypeField]) continue

      const member = {}
      member.membership_type = data[membershipTypeField]
      member.name = data['name']

      // Add names
      if (data['contacts'].length > 0) {
        const mainContact = data['contacts'][0]
        const mainContactName = `${mainContact['first_name']} ${mainContact['last_name']}`

        if (member.name) {
          member.name = `${member.name} (${mainContactName})`
        } else {
          member.name = mainContactName
        }
        member.email = mainContact['email']
      }

      // Add address details
      const fullAddress = [`${data['address1']} ${data['address2']}`.trim(), `${data['postal_code']} ${data['city']}`, data['state']]
      member.address = fullAddress.filter(i => i).join(', ')

      // Add billing details
      member.balance = data['balance']
      member.paid_to_date = data['paid_to_date']
      member.invoice_number_counter = data['invoice_number_counter']

      const invoices = data['invoices'].filter(i => i['is_deleted'] === false).sort((a, b) => a['invoice_date'] > b['invoice_date'])

      if (invoices.length > 0) {
        const recurringInvoices = invoices.filter(i => i['is_recurring'] && (i['end_date'] === null || i['end_date'] > (new Date()).toISOString().substr(0, 10)))

        member.first_invoice_date = invoices[0]['invoice_date']
        member.has_recurring_invoice = recurringInvoices.length > 0
        member.recurring_invoice_amount = ''
        member.recurring_invoice_frequency = ''
        member.recurring_invoice_auto_bill = ''
        member.recurring_invoice_start = ''
        member.recurring_invoice_end = ''
        member.recurring_invoice_last_sent_date = ''

        if (recurringInvoices.length > 0) {
          const firstRecurringInvoice = recurringInvoices[0]
          member.recurring_invoice_amount = firstRecurringInvoice['amount']
          member.recurring_invoice_frequency = frequencies[firstRecurringInvoice['frequency_id']]
          member.recurring_invoice_auto_bill = firstRecurringInvoice['auto_bill']
          member.recurring_invoice_start = firstRecurringInvoice['start_date']
          member.recurring_invoice_end = firstRecurringInvoice['end_date'] || ''
          member.recurring_invoice_last_sent_date = firstRecurringInvoice['last_sent_date']
        }
      }
      members.push(member)
    }
  }

  return members
}

module.exports = {
  getActiveMembers
}
