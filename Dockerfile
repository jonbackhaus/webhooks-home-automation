FROM debian:buster-slim as builder

WORKDIR /repo

RUN apt-get update && apt-get install -y git

RUN git clone --depth 1 https://github.com/jonbackhaus/webhooks-home-automation.git /repo

FROM node:latest as runner

WORKDIR /repo

COPY --from=builder /repo /repo

RUN npm install

COPY ./index.js /repo/index.js

EXPOSE 12000

ENTRYPOINT ["node"]

CMD ["index.js"]
