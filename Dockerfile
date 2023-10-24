FROM node:18

WORKDIR /app

COPY package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm install

COPY client client
RUN npm run build

COPY server server

CMD ["npm", "start"]