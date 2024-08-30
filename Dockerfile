# Use a Node.js base image
FROM node:20

# Sets the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Installs application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Exposes the port that the application will use
EXPOSE 3000

# Defines the command to run the application
CMD ["node", "server.js"]
