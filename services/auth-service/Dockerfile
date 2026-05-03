# Use a tiny version of Node.js
FROM node:20-alpine

# Set the home base inside the container
WORKDIR /usr/src/app

# Copy the package list from the ROOT (since that's where yours is)
# We will handle the path in the build command
COPY package*.json ./

# Install only the necessary tools
RUN npm install --omit=dev

# Copy the actual auth-service code
COPY . .

# The port your app listens on
EXPOSE 4001

# How to start the app
CMD ["node", "server.js"]

