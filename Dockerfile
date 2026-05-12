# Build stage
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist /app/dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]