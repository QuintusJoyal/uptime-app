# Uptime-App

![Version](https://img.shields.io/badge/Version-1.0-brightgreen.svg)

The Uptime-App is a simple Node.js application that allows you to monitor the uptime of websites. It checks whether a site is online or offline every minute and maintains a history of status records for each site.

## Features

- Monitor the uptime of websites.
- Check status every minute.
- Maintain a history of status records as logs.
- Add or remove sites using a JSON file.

## Getting Started

These instructions will help you set up and run the Uptime Monitoring Application on your local machine.

### Prerequisites

- Node.js and npm installed.
- Docker (if you want to run the application in a container).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/uptime-app.git
   cd uptime-app
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

### Usage

1. Define your list of websites to monitor in the websites.json file.

2. Start the application:
   ```bash
   npm start
   ```
3. Access the application at http://localhost:3000 for logs.

### Adding or Removing Sites

To add or remove sites for monitoring, edit the websites.json file as follows:

```json
[
  {
    "name": "Website 1",
    "url": "http://example.com"
  },
  {
    "name": "Website 2",
    "url": "http://example.org"
  }
]
```
