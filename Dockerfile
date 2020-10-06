FROM node:14-alpine

LABEL maintainer="Andrea Gueugnaut <agueugnaut@octo.com>"

ENV APP /code
ENV PORT 3000
WORKDIR $APP

COPY package.json yarn.lock $APP/
RUN yarn

COPY . $APP

VOLUME [ "$APP/src" ]

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
