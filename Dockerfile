# Step 1: Build the Node.js application
FROM node:23 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Blackbox for secret management
RUN apt-get update && \
    apt-get install -y gnupg git blackbox && \
    apt-get clean

# Check blackbox installation
RUN which blackbox || echo "Blackbox not found"
RUN blackbox --version || echo "Blackbox version not available"

# Initialize Blackbox (only if not initialized already)
RUN blackbox_initialize || echo "Blackbox already initialized"

# Decrypt secrets before building the app
RUN blackbox_decrypt_all || echo "Failed to decrypt secrets"

# Copy the entire project
COPY . .

# Build the application (output in the 'dist' folder)
RUN npm run build

# Step 2: Set up Nginx to serve the app
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA (Single Page Application)
COPY /src/config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
