# Build production server within Node image
FROM node:18-alpine AS builder

# Prepare the working directory
RUN mkdir -p /app
WORKDIR /app

# Install build dependencies
ENV NODE_ENV=development
COPY package*.json .
RUN npm ci

# Copy the build to image
COPY . .

# Generate the build
RUN npx prisma generate
RUN npx prisma db push
RUN node prisma/seed.js
RUN npm run build
RUN npm prune --production


# Run the server within Node image
FROM node:18-alpine

# Prepare the build directory
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Run the server
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
