FROM node:18-alpine

WORKDIR /app

COPY package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm install

COPY client client
COPY server server
RUN npm run build

CMD ["npm", "start"]