FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env ./
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]
