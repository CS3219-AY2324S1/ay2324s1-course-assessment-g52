FROM node:17-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80 443 3001

CMD [ "npm", "start" ]
