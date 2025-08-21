# ---- Build stage ----
FROM node:24-alpine AS build-stage

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build NestJS
RUN npm run build

# ---- Production stage ----
FROM node:24-alpine AS production-stage

WORKDIR /app

# Copy only necessary files
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose API port
EXPOSE 3088

# Run compiled NestJS
CMD ["node", "dist/main.js"]
