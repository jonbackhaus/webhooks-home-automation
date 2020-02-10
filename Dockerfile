FROM debian:buster-slim as builder

WORKDIR /repo

RUN apt-get update && apt-get install -y git

RUN git clone --depth 1 https://github.com/jonbackhaus/webhooks-home-automation.git /repo

FROM node:alpine as runner

WORKDIR /repo

COPY --from=builder /repo /repo

RUN npm install

ENV IFTTT_KEY IFTTT_KEY
ENV IFTTT_JOB IFTTT_JOB
ENV TRIGGER_PORT TRIGGER_PORT

ENTRYPOINT ["node"]

CMD ["index.js"]
