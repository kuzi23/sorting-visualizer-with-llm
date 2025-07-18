# Use an official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install client dependencies and build React app
WORKDIR /app/client
RUN npm install
RUN npm run build

# Install a lightweight static server to serve the React build
RUN npm install -g serve

# Set working directory to the build folder
WORKDIR /app/client/build

# Azure expects the app to listen on port 80
EXPOSE 80

# Start the app using serve
CMD ["serve", "-s", ".", "-l", "80"]
