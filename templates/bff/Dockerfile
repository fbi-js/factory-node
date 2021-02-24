FROM node:14.15.0

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN npm run build

EXPOSE 3001

ENTRYPOINT ["npm", "start"]
