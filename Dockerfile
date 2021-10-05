FROM node:lts-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY --from=development /app/dist ./dist
RUN npm install --only=production
CMD ["node", "dist/main"]
