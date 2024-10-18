
FROM node:20

RUN apt-get update

WORKDIR /app



COPY package.json package-lock.json* ./


RUN npm install


COPY . .


EXPOSE 3000

RUN npm run build


CMD ["npm", "run", "start"]
