FROM mhart/alpine-node:0.10.38

WORKDIR /app
ADD package.json /app/
ENV NODE_ENV production
RUN apk-install make gcc g++ python && \
  npm install && \
  apk del make gcc g++ python && \
  rm -rf /tmp/* /root/.npm /root/.node-gyp
ADD . /app

ENV MONGO_URL $MONGO_URL
ENV REDIS_URL $REDIS_URL
ENV SESSION_SECRET $SESSION_SECRET

EXPOSE 3000
ENTRYPOINT ["/usr/bin/node", "server.js"]
