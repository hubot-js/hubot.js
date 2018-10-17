FROM node:8.7.0-alpine

RUN apk add --update bash curl && rm -rf /var/cache/apk/*

ARG version

RUN chown -R node /usr/local

USER node

WORKDIR /home/node/app

RUN npm install -g hubot.js@$version

CMD hubot start --t $BOT_API_TOKEN --n $BOT_NAME && tail -F -n0 /etc/hosts
