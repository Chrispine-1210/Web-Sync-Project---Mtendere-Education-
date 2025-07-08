# Stage 1: Build Frontend (Vite + React)
FROM node:18 AS frontend
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# Stage 2: Build Backend (TypeScript)
FROM node:18 AS backend
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 3: Production Image
FROM node:18
WORKDIR /app

# Copy backend build
COPY --from=backend /app /app

# Copy frontend static files into public directory
COPY --from=frontend /app/client/dist /app/public

# Install only production dependencies
RUN npm install --omit=dev

# Set production environment
ENV NODE_ENV=production

# Expose application port (match .env PORT)
EXPOSE 3000

# Start the server
CMD ["node", "dist/server/index.js"]
