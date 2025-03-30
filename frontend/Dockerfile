# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock file (assuming npm, yarn, or pnpm)
# Adjust if using a different package manager or lock file name
COPY package*.json ./
# If using yarn.lock or pnpm-lock.yaml, uncomment the relevant line
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
# Use 'npm ci' for faster, more reliable builds if package-lock.json exists
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (assuming the build script is 'build')
# Adjust the script name if necessary (e.g., 'vite build', 'rspack build')
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the builder stage
# Adjust the source directory ('build' or 'dist') if your build tool outputs elsewhere
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
