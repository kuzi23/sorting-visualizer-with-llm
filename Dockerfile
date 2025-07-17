# Use an official Node.js image
FROM node:18

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the working directory
WORKDIR /app

# Copy all files
COPY . .

# Install client dependencies
WORKDIR /app/client
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
