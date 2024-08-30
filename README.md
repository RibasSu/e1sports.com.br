# E1Sports Application

## Overview

The E1Sports application is a Node.js-based web service that scans network ports for a given domain or IP address. It provides an API endpoint to perform the scan and returns the status of various well-known ports, indicating whether they are open or closed.

## Features

- **Port Scanning**: Scans a predefined list of ports to check their status (open or closed) for a given domain or IP address.
- **Static File Serving**: Serves static files from a `public` directory.
- **API Endpoint**: Provides a `/scan` endpoint for initiating port scans.

## Files

- **`server.js`**: Main server file that sets up an Express application, serves static files, and handles the port scanning logic.
- **`ports.json`**: JSON file containing a list of ports and associated services to scan.
- **`Dockerfile`**: Docker configuration file to build and run the application in a container.
- **`run.sh`**: Shell script for building the Docker image, checking for existing images/containers, and running the container.

## Installation

### Docker Setup

1. **Build Docker Image**

   Build the Docker image using the provided `Dockerfile`:

   ```bash
   docker build -t e1sports .
   ```

2. **Run Docker Container**

   Use the `run.sh` script to manage the container lifecycle:

   ```bash
   ./run.sh
   ```

   The script will:
   - Ask for a host port to map to the container.
   - Check if the port is available.
   - Check if an existing Docker image or container named `e1sports` exists and prompt for updates.
   - Build and run the Docker container.

### Manual Setup

If you prefer to run the application locally without Docker:

1. **Install Dependencies**

   Make sure you have Node.js installed. Then, install the necessary dependencies:

   ```bash
   npm install
   ```

2. **Run the Application**

   Start the server:

   ```bash
   node server.js
   ```

   The application will be available at `http://localhost:3000`.

## API Usage

### Endpoint: `/scan`

- **Method**: POST
- **Request Body**: JSON object with a `target` field.

  Example:
  ```json
  {
    "target": "example.com"
  }
  ```

- **Response**: JSON object containing the scan results.

  Example:
  ```json
  {
    "target": "example.com",
    "results": [
      { "port": 21, "service": "FTP", "status": "open" },
      { "port": 22, "service": "SSH", "status": "closed" }
      // more results
    ],
    "message": "Scanning completed."
  }
  ```

## Files Description

- **`server.js`**: Contains the server logic, including the port scanning function and API endpoint.
- **`ports.json`**: Lists the ports and services to scan.
- **`Dockerfile`**: Defines the Docker image configuration.
- **`run.sh`**: Provides automation for managing the Docker container and image.

## Contribution

Feel free to contribute to the project by submitting issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
