# Step 1: Build the React (Vite) application
FROM node:23 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --frozen-lockfile  # Use npm ci if you have a package-lock.json

# Copy the entire project
COPY . .

# Build the application (output in the 'build' folder)
RUN npm run build

# Step 2: Set up Nginx to serve the app
FROM nginx:alpine

# Copy the build output from the builder stage (from 'build' directory)
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration for SPA (Single Page Application)
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
