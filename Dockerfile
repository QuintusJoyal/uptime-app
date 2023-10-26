FROM node

WORKDIR /app

COPY . .

RUN npm i

RUN npm i -g nodemon

CMD ["nodemon", "index.js"]
