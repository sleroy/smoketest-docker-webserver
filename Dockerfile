# Dockerfile

FROM node:slim
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY src/package.json src/package-lock.json .
RUN npm install
COPY src/ .
EXPOSE 80
CMD [ "npm", "start"]