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
      "@invoice-ninja-token": "ieE32uA4Sfq32Diud3sDAuScdDSisfSi"
    }

That's it! You're now ready to start the service.

### Usage

Start the service:

    npm start

Open your browser, and go to this URL: http://localhost:3000

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork it (<https://github.com/open-network-infrastructure/invoiceninja-members>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request :D