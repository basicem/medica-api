FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY .env .env
EXPOSE 3001
CMD ["npm", "start"]
