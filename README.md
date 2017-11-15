# InvoiceNinja: Membership report

> Creates a list of active membership data based on InvoiceNinja's API

## Getting Started

### Prerequisites

Make sure you have [Node.js 8.x+](https://nodejs.org/en/) installed on your system.

### Installation

Open your terminal, go to the project's folder and run:

    npm install

Create a file named `now-secrets.json` at the top level of this project and enter the secrets  (values starting with the `@`) from the `now.json` file. Example:

    {
      "@invoice-ninja-token": "insert_your_invoice_ninja_token_here"
    }

That's it! You're now ready to start the service.

### Development

Start the service in development mode:

    npm run dev

Open your browser, and go to this URL: http://localhost:3000

For production usage, start the service with:

    npm start

### Usage

Using the service is trivial:

- To get the JSON output, go to this URL in your browser: http://localhost:3000
- To get the CSV export, go to the following: http://localhost:3000/download

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork it (<https://github.com/open-network-infrastructure/invoiceninja-members>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request :D
