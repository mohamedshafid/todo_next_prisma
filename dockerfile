# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package.json package-lock.json /app/

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Build the Next.js app
RUN npm run build

# Stage 2: Runner Stage (for production)
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the package.json and package-lock.json to install only production dependencies
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/package-lock.json ./ 

# Install production dependencies
RUN npm install --production

# Copy only the necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Optionally, copy the .env file if you need environment variables for production
COPY .env .env

# Expose the port for the Next.js app
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "run", "start"]
