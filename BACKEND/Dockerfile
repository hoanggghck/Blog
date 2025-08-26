# ---- Base stage ----
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Development stage ----
FROM base AS dev-stage
# Cài tất cả deps bao gồm devDependencies
RUN npm install

# Copy toàn bộ source
COPY . .

# Expose port
EXPOSE 3088

# Chạy dev (hot reload)
CMD ["npm", "run", "wdev"]

# ---- Build stage ----
FROM base AS build-stage
# Cài deps để build
RUN npm install
COPY . .
RUN npm run build

# ---- Production stage ----
FROM base AS production-stage
# Chỉ cài deps cần cho production
RUN npm ci --only=production

# Copy dist từ build-stage
COPY --from=build-stage /app/dist ./dist

EXPOSE 3088
CMD ["node", "dist/main.js"]
