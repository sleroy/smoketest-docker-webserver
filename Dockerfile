# Dockerfile
ARG IMAGE=node:20-alpine
FROM $IMAGE as build
RUN apk add --no-cache bash curl git make

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .


ENV NODE_ENV production
ENV DB_TYPE  ""
ENV DB_HOST  ""
ENV DB_USER  ""
ENV DB_PASSWORD ""
ENV DB_DEBUG "false"
ENV DB_TIMEOUT 600
ENV HEALTHCHECK_1 ""
ENV HEALTHCHECK_2 ""
ENV HEALTHCHECK_3 ""
ENV CONFIG ""

RUN npm i
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "pm2"]


