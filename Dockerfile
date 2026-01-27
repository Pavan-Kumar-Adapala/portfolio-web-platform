# Here is a multistage Dockerfile for your Vite + React + TypeScript application:
# Dockerfile
# Use the official Node.js image as the base image for the build stage
ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION} AS build
# Label to identify the maintainer of the Dockerfile
LABEL maintainer="Pavan Kumar Adapala"
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install the application dependencies
RUN npm install
# Copy the rest of the application source code to the working directory
COPY . .
# Build the application using Vite
RUN npm run build -- --base=/

# Use the official Nginx image as the base image for the production stage
FROM nginx:alpine
# Copy the built application from the build stage to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the custom Nginx configuration file to default Nginx configuration file 
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 for the Nginx server
EXPOSE 80
# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
