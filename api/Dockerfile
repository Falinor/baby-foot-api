FROM kkarczmarczyk/node-yarn:latest

LABEL maintainer "Andrea Gueugnaut <agueugnaut@octo.com>"

ENV APP /code
WORKDIR $APP

COPY package.json yarn.lock $APP/
RUN yarn

COPY . $APP

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
