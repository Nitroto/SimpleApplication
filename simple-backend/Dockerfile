FROM node:16-alpine as build

RUN apk add --no-cache bash git
WORKDIR /usr/app
COPY simple-backend /usr/app
RUN git clone https://github.com/vishnubob/wait-for-it.git
RUN npm install

EXPOSE 4000