FROM node:10

ENV NPM_CONFIG_LOGLEVEL info

EXPOSE 80

WORKDIR /home/app

RUN npm install pm2 -g

CMD ["npm", "start"]
